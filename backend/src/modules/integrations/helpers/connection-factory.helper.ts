import type { ConnectionResponse } from '@/types/api';
import { IntegrationType } from '@prisma/client';

interface Connection {
  connectionId: string;
  toolType: IntegrationType;
  status: 'connected' | 'disconnected' | 'error' | 'syncing';
  config: Record<string, unknown>;
  lastSync: Date;
  syncFrequency: number;
  dataMapping: unknown[];
  createdAt: Date;
  updatedAt: Date;
}

interface IntegrationRecord {
  id: string;
  type: IntegrationType;
  config: unknown;
  lastSyncAt?: Date | null;
  syncInterval?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export class ConnectionFactoryHelper {
  createConnection(
    connectionId: string,
    toolType: IntegrationType,
    config: Record<string, unknown>
  ): Connection {
    return {
      connectionId,
      toolType,
      status: 'connected' as const,
      config,
      lastSync: new Date(),
      syncFrequency: 15,
      dataMapping: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  createConnectionFromIntegration(integration: IntegrationRecord): Connection {
    return {
      connectionId: integration.id,
      toolType: integration.type,
      status: 'connected' as const,
      config: integration.config as Record<string, unknown>,
      lastSync: integration.lastSyncAt || new Date(),
      syncFrequency: integration.syncInterval || 15,
      dataMapping: [],
      createdAt: integration.createdAt,
      updatedAt: integration.updatedAt,
    };
  }

  createFailedConnectionResponse(toolType: string): ConnectionResponse {
    return {
      connectionId: '',
      status: 'failed',
      toolType,
      name: toolType,
      syncStatus: 'error',
      recordsCount: 0,
      configuration: { syncFrequency: 15, dataMapping: [], filters: {} },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  createSuccessConnectionResponse(connection: Connection): ConnectionResponse {
    return {
      connectionId: connection.connectionId,
      status: 'connected',
      toolType: connection.toolType,
      name: connection.toolType,
      lastSync: connection.lastSync,
      nextSync: new Date(Date.now() + connection.syncFrequency * 60 * 1000),
      syncStatus: 'idle',
      recordsCount: 0,
      configuration: {
        syncFrequency: connection.syncFrequency,
        dataMapping: [],
        filters: {},
      },
      createdAt: connection.createdAt,
      updatedAt: connection.updatedAt,
    };
  }
}
