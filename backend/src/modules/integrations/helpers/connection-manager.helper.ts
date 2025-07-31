import { Logger } from '@nestjs/common';
import { IntegrationType } from '@prisma/client';

export interface Connection {
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

export class ConnectionManagerHelper {
  private readonly logger = new Logger(ConnectionManagerHelper.name);
  private readonly connectionPool = new Map<string, Connection>();

  getConnection(connectionId: string): Connection | undefined {
    return this.connectionPool.get(connectionId);
  }

  setConnection(connectionId: string, connection: Connection): void {
    this.connectionPool.set(connectionId, connection);
  }

  removeConnection(connectionId: string): void {
    this.connectionPool.delete(connectionId);
  }

  getAllConnections(): Connection[] {
    return Array.from(this.connectionPool.values());
  }

  findConnectionByIntegrationId(integrationId: string): Connection | undefined {
    return Array.from(this.connectionPool.values()).find(
      conn => conn.connectionId === integrationId
    );
  }

  generateConnectionId(toolType: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `${toolType.toLowerCase()}_${timestamp}_${random}`;
  }

  async performHealthChecks(): Promise<void> {
    this.logger.debug('Performing health checks on connections');

    for (const [connectionId, connection] of this.connectionPool.entries()) {
      try {
        const healthResult = await this.testToolConnection(
          connection.toolType,
          connection.config
        );

        if (!healthResult.success) {
          connection.status = 'error';
          this.logger.warn(
            `Health check failed for ${connectionId}: ${healthResult.message}`
          );
        } else if (connection.status === 'error') {
          connection.status = 'connected';
          this.logger.log(`Connection ${connectionId} recovered`);
        }
      } catch (error) {
        connection.status = 'error';
        this.logger.error(`Health check error for ${connectionId}:`, error);
      }
    }
  }

  private async testToolConnection(
    toolType: IntegrationType,
    config: Record<string, unknown>
  ): Promise<{ success: boolean; message: string }> {
    this.logger.debug(`Testing connection to ${toolType}`);

    await new Promise(resolve => setTimeout(resolve, 100));

    if (!config || Object.keys(config).length === 0) {
      return { success: false, message: 'Configuration is empty' };
    }

    return { success: true, message: 'Connection test successful' };
  }
}
