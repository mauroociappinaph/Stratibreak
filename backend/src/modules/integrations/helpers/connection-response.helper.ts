import { ConnectionResponseDto } from '../dto';

/**
 * Helper class for connection response mapping and status handling
 */
export class ConnectionResponseHelper {
  static mapToConnectionResponse(
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

  static mapStatusToConnectionStatus(
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

  static determineSyncStatus(status: string): 'idle' | 'syncing' | 'error' {
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

  static calculateNextSync(config: Record<string, unknown>): Date {
    const syncFrequency = (config.syncFrequency as number) || 15;
    const lastSync = (config.lastSync as Date) || new Date();
    return new Date(lastSync.getTime() + syncFrequency * 60 * 1000);
  }

  static mapToValidStatus(
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
