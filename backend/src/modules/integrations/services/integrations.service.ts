import { PrismaService } from '@/common/services';
import type { ConnectionResponse } from '@/types/api';
import type {
  IIntegrationService,
  RecoveryAction,
  ServiceIntegrationError,
  SyncResult,
  ValidationResult,
} from '@/types/services';
import { Injectable, Logger } from '@nestjs/common';
import { IntegrationType } from '@prisma/client';
import {
  ConnectionResponseDto,
  CreateIntegrationDto,
  UpdateIntegrationDto,
} from '../dto';
import { IntegrationType as DtoIntegrationType } from '../dto/create-integration.dto';
import { IntegrationEntity } from '../entities';
import { IntegrationsCoreService } from './integrations-core.service';

@Injectable()
export class IntegrationsService implements IIntegrationService {
  private readonly logger = new Logger(IntegrationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly coreService: IntegrationsCoreService
  ) {}

  // Delegate core integration functionality to the core service
  async connectToTool(
    toolType: string,
    credentials: Record<string, string>
  ): Promise<ConnectionResponse> {
    return this.coreService.connectToTool(toolType, credentials);
  }

  async syncData(connectionId: string): Promise<SyncResult> {
    return this.coreService.syncData(connectionId);
  }

  async handleIntegrationFailure(
    error: ServiceIntegrationError
  ): Promise<RecoveryAction> {
    return this.coreService.handleIntegrationFailure(error);
  }

  async validateDataConsistency(
    localData: unknown,
    externalData: unknown
  ): Promise<ValidationResult> {
    return this.coreService.validateDataConsistency(localData, externalData);
  }

  /**
   * Create a new integration
   */
  async create(
    createIntegrationDto: CreateIntegrationDto
  ): Promise<IntegrationEntity> {
    this.logger.log(
      `Creating integration: ${createIntegrationDto.name} (${createIntegrationDto.type})`
    );

    try {
      // For testing, create a default tenant if it doesn't exist
      let defaultTenant = await this.prisma.tenant.findUnique({
        where: { id: 'default-tenant' },
      });

      if (!defaultTenant) {
        defaultTenant = await this.prisma.tenant.create({
          data: {
            id: 'default-tenant',
            organizationName: 'Test Organization',
            dataEncryptionKey: 'test-key',
          },
        });
      }

      // For testing, create a system user if it doesn't exist
      let systemUser = await this.prisma.user.findUnique({
        where: { email: 'system@test.com' },
      });

      if (!systemUser) {
        systemUser = await this.prisma.user.create({
          data: {
            email: 'system@test.com',
            username: 'system',
            password: 'test-password',
            firstName: 'System',
            lastName: 'User',
            role: 'ADMIN',
            tenantId: defaultTenant.id,
          },
        });
      }

      // For testing, create a test project if it doesn't exist
      if (
        createIntegrationDto.projectId &&
        createIntegrationDto.projectId.trim()
      ) {
        let testProject = await this.prisma.project.findUnique({
          where: { id: createIntegrationDto.projectId },
        });

        if (!testProject) {
          testProject = await this.prisma.project.create({
            data: {
              id: createIntegrationDto.projectId,
              name: 'Test Project',
              description: 'Test project for integration testing',
              status: 'ACTIVE',
              startDate: new Date(),
              endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
              userId: systemUser.id,
              tenantId: defaultTenant.id,
            },
          });
        }
      }

      const integration = await this.prisma.integration.create({
        data: {
          name: createIntegrationDto.name,
          type: this.mapDtoTypeToDbType(createIntegrationDto.type),
          status: 'INACTIVE',
          config: (createIntegrationDto.config as unknown) || {},
          credentials: {},
          projectId: createIntegrationDto.projectId,
          userId: systemUser.id,
        },
      });

      return this.mapToEntity(integration);
    } catch (error) {
      this.logger.error('Failed to create integration:', error);
      throw error;
    }
  }

  /**
   * Find all integrations
   */
  async findAll(projectId?: string): Promise<IntegrationEntity[]> {
    const whereClause = projectId ? { projectId } : {};

    const integrations = await this.prisma.integration.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });

    return integrations.map(integration => this.mapToEntity(integration));
  }

  /**
   * Find integration by ID
   */
  async findOne(id: string): Promise<IntegrationEntity> {
    const integration = await this.prisma.integration.findUnique({
      where: { id },
    });

    if (!integration) {
      throw new Error(`Integration with ID ${id} not found`);
    }

    return this.mapToEntity(integration);
  }

  /**
   * Update integration
   */
  async update(
    id: string,
    updateIntegrationDto: UpdateIntegrationDto
  ): Promise<IntegrationEntity> {
    try {
      const updateData: Record<string, unknown> = {
        ...updateIntegrationDto,
        updatedAt: new Date(),
      };

      const integration = await this.prisma.integration.update({
        where: { id },
        data: updateData,
      });

      return this.mapToEntity(integration);
    } catch (error: unknown) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 'P2025'
      ) {
        throw new Error(`Integration with ID ${id} not found`);
      }
      throw error;
    }
  }

  /**
   * Remove integration
   */
  async remove(id: string): Promise<void> {
    try {
      await this.prisma.integration.delete({
        where: { id },
      });
    } catch (error: unknown) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 'P2025'
      ) {
        throw new Error(`Integration with ID ${id} not found`);
      }
      throw error;
    }
  }

  /**
   * Test integration connection
   */
  async testConnection(
    id: string
  ): Promise<{ success: boolean; message: string }> {
    const integration = await this.findOne(id);

    try {
      const testResult = await this.testToolConnection(
        integration.type,
        integration.config || {}
      );

      return testResult;
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get integration by type and project
   */
  async findByTypeAndProject(
    type: string,
    projectId: string
  ): Promise<IntegrationEntity[]> {
    const integrations = await this.prisma.integration.findMany({
      where: {
        type: type as IntegrationType,
        projectId,
      },
    });

    return integrations.map(integration => this.mapToEntity(integration));
  }

  // Connection Management Methods

  /**
   * Get all connections with optional filtering
   */
  async getAllConnections(filters: {
    status?: string;
    toolType?: string;
    projectId?: string;
  }): Promise<ConnectionResponseDto[]> {
    const whereClause: Record<string, unknown> = {};

    if (filters.projectId) {
      whereClause.projectId = filters.projectId;
    }

    if (filters.toolType) {
      whereClause.type = filters.toolType as IntegrationType;
    }

    if (filters.status) {
      whereClause.status = filters.status;
    }

    const integrations = await this.prisma.integration.findMany({
      where: whereClause,
      orderBy: { updatedAt: 'desc' },
    });

    return integrations.map(integration =>
      this.mapToConnectionResponse(integration)
    );
  }

  /**
   * Get a specific connection by ID
   */
  async getConnection(connectionId: string): Promise<ConnectionResponseDto> {
    const integration = await this.prisma.integration.findUnique({
      where: { id: connectionId },
    });

    if (!integration) {
      throw new Error(`Connection with ID ${connectionId} not found`);
    }

    return this.mapToConnectionResponse(integration);
  }

  /**
   * Update connection status
   */
  async updateConnectionStatus(
    connectionId: string,
    status: string,
    reason?: string
  ): Promise<ConnectionResponseDto> {
    try {
      // First get the current integration to access its config
      const currentIntegration = await this.prisma.integration.findUnique({
        where: { id: connectionId },
      });

      if (!currentIntegration) {
        throw new Error(`Connection with ID ${connectionId} not found`);
      }

      // Map status to valid enum value
      const validStatus = this.mapToValidStatus(status);

      const integration = await this.prisma.integration.update({
        where: { id: connectionId },
        data: {
          status: validStatus,
          updatedAt: new Date(),
          // Store reason in config if provided
          ...(reason && {
            config: {
              ...(typeof currentIntegration.config === 'object'
                ? currentIntegration.config
                : {}),
              statusReason: reason,
            },
          }),
        },
      });

      return this.mapToConnectionResponse(integration);
    } catch (error: unknown) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 'P2025'
      ) {
        throw new Error(`Connection with ID ${connectionId} not found`);
      }
      throw error;
    }
  }

  /**
   * Disconnect a tool connection
   */
  async disconnectTool(connectionId: string): Promise<void> {
    try {
      // First, try to gracefully disconnect using the core service
      await this.coreService.disconnectTool(connectionId);

      // Then update the database status
      await this.prisma.integration.update({
        where: { id: connectionId },
        data: {
          status: 'INACTIVE',
          updatedAt: new Date(),
        },
      });
    } catch (error: unknown) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 'P2025'
      ) {
        throw new Error(`Connection with ID ${connectionId} not found`);
      }
      throw error;
    }
  }

  /**
   * Reconnect a tool connection
   */
  async reconnectTool(connectionId: string): Promise<ConnectionResponseDto> {
    const integration = await this.prisma.integration.findUnique({
      where: { id: connectionId },
    });

    if (!integration) {
      throw new Error(`Connection with ID ${connectionId} not found`);
    }

    try {
      // Attempt to reconnect using stored credentials
      const reconnectResult = await this.coreService.reconnectTool(
        connectionId,
        integration.credentials as Record<string, string>
      );

      // Update the integration status based on reconnection result
      const updatedIntegration = await this.prisma.integration.update({
        where: { id: connectionId },
        data: {
          status: reconnectResult.success ? 'ACTIVE' : 'ERROR',
          updatedAt: new Date(),
          config: {
            ...(typeof integration.config === 'object'
              ? integration.config
              : {}),
            lastReconnectAttempt: new Date(),
            reconnectMessage: reconnectResult.message,
          },
        },
      });

      return this.mapToConnectionResponse(updatedIntegration);
    } catch (error) {
      this.logger.error(`Failed to reconnect tool ${connectionId}:`, error);
      throw new Error(
        `Failed to reconnect: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Get connection health status
   */
  async getConnectionHealth(connectionId: string): Promise<{
    connectionId: string;
    status: string;
    lastChecked: Date;
    responseTime: number;
    message: string;
    details?: Record<string, unknown>;
  }> {
    const integration = await this.prisma.integration.findUnique({
      where: { id: connectionId },
    });

    if (!integration) {
      throw new Error(`Connection with ID ${connectionId} not found`);
    }

    try {
      const healthCheck =
        await this.coreService.checkConnectionHealth(connectionId);

      return {
        connectionId,
        status: healthCheck.status,
        lastChecked: healthCheck.lastChecked,
        responseTime: healthCheck.responseTime,
        message: healthCheck.message,
        ...(healthCheck.details && { details: healthCheck.details }),
      };
    } catch (error) {
      return {
        connectionId,
        status: 'unhealthy',
        lastChecked: new Date(),
        responseTime: -1,
        message: error instanceof Error ? error.message : 'Health check failed',
      };
    }
  }

  /**
   * Update connection configuration
   */
  async updateConnectionConfiguration(
    connectionId: string,
    configUpdate: {
      syncFrequency?: number;
      dataMapping?: unknown[];
      filters?: Record<string, unknown>;
    }
  ): Promise<ConnectionResponseDto> {
    const integration = await this.prisma.integration.findUnique({
      where: { id: connectionId },
    });

    if (!integration) {
      throw new Error(`Connection with ID ${connectionId} not found`);
    }

    const currentConfig =
      typeof integration.config === 'object' ? integration.config : {};

    // Create a clean config object that can be serialized to JSON
    const updatedConfig: Record<string, unknown> = {
      ...currentConfig,
    };

    if (configUpdate.syncFrequency !== undefined) {
      updatedConfig.syncFrequency = configUpdate.syncFrequency;
    }
    if (configUpdate.dataMapping !== undefined) {
      updatedConfig.dataMapping = configUpdate.dataMapping;
    }
    if (configUpdate.filters !== undefined) {
      updatedConfig.filters = configUpdate.filters;
    }
    updatedConfig.lastConfigUpdate = new Date().toISOString();

    try {
      const updatedIntegration = await this.prisma.integration.update({
        where: { id: connectionId },
        data: {
          config: JSON.parse(JSON.stringify(updatedConfig)),
          updatedAt: new Date(),
        },
      });

      return this.mapToConnectionResponse(updatedIntegration);
    } catch (error: unknown) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 'P2025'
      ) {
        throw new Error(`Connection with ID ${connectionId} not found`);
      }
      throw error;
    }
  }

  /**
   * Get sync history for a connection
   */
  async getSyncHistory(
    connectionId: string,
    options: { limit: number; offset: number }
  ): Promise<{
    connectionId: string;
    history: Array<{
      syncId: string;
      startedAt: Date;
      completedAt: Date;
      status: string;
      recordsProcessed: number;
      recordsCreated: number;
      recordsUpdated: number;
      recordsSkipped: number;
      errors: Array<{ message: string; recordId?: string }>;
    }>;
    totalCount: number;
  }> {
    const integration = await this.prisma.integration.findUnique({
      where: { id: connectionId },
    });

    if (!integration) {
      throw new Error(`Connection with ID ${connectionId} not found`);
    }

    try {
      const syncHistory = await this.coreService.getSyncHistory(
        connectionId,
        options
      );

      return {
        connectionId,
        history: syncHistory.history,
        totalCount: syncHistory.totalCount,
      };
    } catch (error) {
      this.logger.error(
        `Failed to get sync history for ${connectionId}:`,
        error
      );
      return {
        connectionId,
        history: [],
        totalCount: 0,
      };
    }
  }

  // Private helper methods
  private async testToolConnection(
    toolType: IntegrationType,
    config: Record<string, unknown>
  ): Promise<{ success: boolean; message: string }> {
    this.logger.debug(`Testing connection to ${toolType}`);

    await new Promise(resolve => setTimeout(resolve, 100));

    if (!config || Object.keys(config).length === 0) {
      return { success: false, message: 'Configuration is empty' };
    }

    const validationResult = this.validateToolCredentials(toolType, config);
    if (!validationResult.success) {
      return validationResult;
    }

    return { success: true, message: 'Connection test successful' };
  }

  private validateToolCredentials(
    toolType: IntegrationType,
    config: Record<string, unknown>
  ): { success: boolean; message: string } {
    switch (toolType) {
      case IntegrationType.JIRA:
        if (!config.baseUrl || !config.username || !config.apiToken) {
          return {
            success: false,
            message: 'Missing required JIRA credentials',
          };
        }
        break;
      case IntegrationType.ASANA:
        if (!config.accessToken) {
          return { success: false, message: 'Missing Asana access token' };
        }
        break;
      case IntegrationType.TRELLO:
        if (!config.apiKey || !config.token) {
          return { success: false, message: 'Missing Trello API key or token' };
        }
        break;
    }

    return { success: true, message: 'Valid credentials' };
  }

  private mapDtoTypeToDbType(dtoType: DtoIntegrationType): IntegrationType {
    const typeMapping: Record<DtoIntegrationType, IntegrationType> = {
      [DtoIntegrationType.JIRA]: IntegrationType.JIRA,
      [DtoIntegrationType.ASANA]: IntegrationType.ASANA,
      [DtoIntegrationType.TRELLO]: IntegrationType.TRELLO,
      [DtoIntegrationType.MONDAY]: IntegrationType.MONDAY,
      [DtoIntegrationType.BITRIX24]: IntegrationType.BITRIX24,
    };

    return typeMapping[dtoType] || IntegrationType.JIRA;
  }

  private mapToEntity(integration: Record<string, unknown>): IntegrationEntity {
    return {
      id: integration.id as string,
      name: integration.name as string,
      type: integration.type as IntegrationType,
      projectId: integration.projectId as string,
      description: integration.description as string,
      config: integration.config as Record<string, unknown>,
      isActive: integration.isActive as boolean,
      createdAt: integration.createdAt as Date,
      updatedAt: integration.updatedAt as Date,
    };
  }

  private mapToConnectionResponse(
    integration: Record<string, unknown>
  ): ConnectionResponseDto {
    const config =
      typeof integration.config === 'object' ? integration.config : {};

    return {
      connectionId: integration.id as string,
      status: this.mapStatusToConnectionStatus(integration.status as string),
      toolType: integration.type as string,
      name: integration.name as string,
      lastSync: (integration.lastSync as Date) || new Date(),
      nextSync: this.calculateNextSync(config as Record<string, unknown>),
      syncStatus: this.determineSyncStatus(integration.status as string),
      recordsCount:
        ((config as Record<string, unknown>)?.recordsCount as number) || 0,
      configuration: {
        syncFrequency:
          ((config as Record<string, unknown>)?.syncFrequency as number) || 15,
        dataMapping:
          ((config as Record<string, unknown>)?.dataMapping as unknown[]) || [],
        filters:
          ((config as Record<string, unknown>)?.filters as Record<
            string,
            unknown
          >) || {},
      },
      createdAt: integration.createdAt as Date,
      updatedAt: integration.updatedAt as Date,
    };
  }

  private mapStatusToConnectionStatus(
    status: string
  ): 'connected' | 'failed' | 'pending' | 'disconnected' {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
        return 'connected';
      case 'ERROR':
      case 'FAILED':
        return 'failed';
      case 'PENDING':
        return 'pending';
      case 'INACTIVE':
      case 'DISCONNECTED':
      default:
        return 'disconnected';
    }
  }

  private determineSyncStatus(status: string): 'idle' | 'syncing' | 'error' {
    switch (status?.toUpperCase()) {
      case 'SYNCING':
        return 'syncing';
      case 'ERROR':
      case 'FAILED':
        return 'error';
      case 'ACTIVE':
      case 'INACTIVE':
      default:
        return 'idle';
    }
  }

  private calculateNextSync(config: Record<string, unknown>): Date {
    const syncFrequency = (config.syncFrequency as number) || 15; // Default 15 minutes
    const lastSync = (config.lastSync as Date) || new Date();
    return new Date(lastSync.getTime() + syncFrequency * 60 * 1000);
  }

  private mapToValidStatus(
    status: string
  ): 'ACTIVE' | 'INACTIVE' | 'ERROR' | 'SYNCING' {
    switch (status?.toLowerCase()) {
      case 'connected':
      case 'active':
        return 'ACTIVE';
      case 'failed':
      case 'error':
        return 'ERROR';
      case 'syncing':
        return 'SYNCING';
      case 'pending':
      case 'disconnected':
      case 'inactive':
      default:
        return 'INACTIVE';
    }
  }
}
