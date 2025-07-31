import { PrismaService } from '@/common/services';
import { Injectable } from '@nestjs/common';
import { IntegrationType } from '@prisma/client';
import { ConnectionResponseDto } from '../dto';
import { IntegrationsCoreService } from './integrations-core.service';

/**
 * Service responsible for connection status and health management
 */
@Injectable()
export class ConnectionStatusService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly coreService: IntegrationsCoreService
  ) {}

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
      const currentIntegration = await this.prisma.integration.findUnique({
        where: { id: connectionId },
      });

      if (!currentIntegration) {
        throw new Error(`Connection with ID ${connectionId} not found`);
      }

      const validStatus = this.mapToValidStatus(status);

      const integration = await this.prisma.integration.update({
        where: { id: connectionId },
        data: {
          status: validStatus,
          updatedAt: new Date(),
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

  // Private helper methods
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
    const syncFrequency = (config.syncFrequency as number) || 15;
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
