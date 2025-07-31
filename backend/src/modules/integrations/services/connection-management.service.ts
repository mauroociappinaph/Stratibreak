import { PrismaService } from '@/common/services';
import { Injectable, Logger } from '@nestjs/common';
import { ConnectionResponseDto } from '../dto';
import { ConnectionStatusService } from './connection-status.service';
import { IntegrationsCoreService } from './integrations-core.service';

/**
 * Service responsible for connection management operations
 */
@Injectable()
export class ConnectionManagementService {
  private readonly logger = new Logger(ConnectionManagementService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly coreService: IntegrationsCoreService,
    private readonly statusService: ConnectionStatusService
  ) {}

  // Delegate status operations to specialized service
  async getAllConnections(filters: {
    status?: string;
    toolType?: string;
    projectId?: string;
  }): Promise<ConnectionResponseDto[]> {
    return this.statusService.getAllConnections(filters);
  }

  async getConnection(connectionId: string): Promise<ConnectionResponseDto> {
    return this.statusService.getConnection(connectionId);
  }

  async updateConnectionStatus(
    connectionId: string,
    status: string,
    reason?: string
  ): Promise<ConnectionResponseDto> {
    return this.statusService.updateConnectionStatus(
      connectionId,
      status,
      reason
    );
  }

  async getConnectionHealth(connectionId: string): Promise<{
    connectionId: string;
    status: string;
    lastChecked: Date;
    responseTime: number;
    message: string;
    details?: Record<string, unknown>;
  }> {
    return this.statusService.getConnectionHealth(connectionId);
  }

  /**
   * Disconnect a tool connection
   */
  async disconnectTool(connectionId: string): Promise<void> {
    try {
      await this.coreService.disconnectTool(connectionId);

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
      const reconnectResult = await this.coreService.reconnectTool(
        connectionId,
        integration.credentials as Record<string, string>
      );

      await this.prisma.integration.update({
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

      return this.statusService.getConnection(connectionId);
    } catch (error) {
      this.logger.error(`Failed to reconnect tool ${connectionId}:`, error);
      throw new Error(
        `Failed to reconnect: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
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
    const integration = await this.findIntegrationById(connectionId);
    const updatedConfig = this.buildUpdatedConfig(
      integration.config,
      configUpdate
    );

    return this.updateIntegrationConfig(connectionId, updatedConfig);
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
  private async findIntegrationById(
    connectionId: string
  ): Promise<Record<string, unknown>> {
    const integration = await this.prisma.integration.findUnique({
      where: { id: connectionId },
    });

    if (!integration) {
      throw new Error(`Connection with ID ${connectionId} not found`);
    }

    return integration;
  }

  private buildUpdatedConfig(
    currentConfig: unknown,
    configUpdate: {
      syncFrequency?: number;
      dataMapping?: unknown[];
      filters?: Record<string, unknown>;
    }
  ): Record<string, unknown> {
    const baseConfig = typeof currentConfig === 'object' ? currentConfig : {};
    const updatedConfig: Record<string, unknown> = { ...baseConfig };

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

    return updatedConfig;
  }

  private async updateIntegrationConfig(
    connectionId: string,
    updatedConfig: Record<string, unknown>
  ): Promise<ConnectionResponseDto> {
    try {
      await this.prisma.integration.update({
        where: { id: connectionId },
        data: {
          config: JSON.parse(JSON.stringify(updatedConfig)),
          updatedAt: new Date(),
        },
      });

      return this.statusService.getConnection(connectionId);
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
}
