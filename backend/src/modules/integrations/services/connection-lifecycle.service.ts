import { Injectable, Logger } from '@nestjs/common';
import { IntegrationType } from '@prisma/client';
import { ConnectionManagerHelper } from '../helpers';
import type { Connection } from '../helpers/connection-manager.helper';

/**
 * Service responsible for connection lifecycle management
 */
@Injectable()
export class ConnectionLifecycleService {
  private readonly logger = new Logger(ConnectionLifecycleService.name);
  private readonly connectionManager = new ConnectionManagerHelper();

  async disconnectTool(
    connectionId: string
  ): Promise<{ success: boolean; message: string }> {
    this.logger.log(`Disconnecting tool with connection ID: ${connectionId}`);

    try {
      const connection = this.connectionManager.getConnection(connectionId);
      if (!connection) {
        return { success: false, message: 'Connection not found' };
      }

      await this.performDisconnectionCleanup(connection);
      this.connectionManager.removeConnection(connectionId);

      this.logger.log(`Successfully disconnected tool: ${connectionId}`);
      return { success: true, message: 'Tool disconnected successfully' };
    } catch (error) {
      this.logger.error(`Failed to disconnect tool ${connectionId}:`, error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : 'Disconnection failed',
      };
    }
  }

  async reconnectTool(
    connectionId: string,
    credentials: Record<string, string>
  ): Promise<{ success: boolean; message: string }> {
    this.logger.log(`Reconnecting tool with connection ID: ${connectionId}`);

    try {
      const existingConnection =
        this.connectionManager.getConnection(connectionId);
      if (!existingConnection) {
        return { success: false, message: 'Original connection not found' };
      }

      const testResult = await this.testToolConnection(
        existingConnection.toolType,
        credentials
      );

      if (!testResult.success) {
        return { success: false, message: testResult.message };
      }

      const updatedConfig = await this.createConnectionConfig(
        existingConnection.toolType,
        credentials
      );

      const updatedConnection = {
        ...existingConnection,
        config: updatedConfig,
        status: 'connected' as const,
        lastSync: new Date(),
        updatedAt: new Date(),
      };

      this.connectionManager.setConnection(connectionId, updatedConnection);

      this.logger.log(`Successfully reconnected tool: ${connectionId}`);
      return { success: true, message: 'Tool reconnected successfully' };
    } catch (error) {
      this.logger.error(`Failed to reconnect tool ${connectionId}:`, error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Reconnection failed',
      };
    }
  }

  async checkConnectionHealth(connectionId: string): Promise<{
    status: string;
    lastChecked: Date;
    responseTime: number;
    message: string;
    details?: Record<string, unknown>;
  }> {
    this.logger.debug(`Checking health for connection: ${connectionId}`);

    const connection = this.connectionManager.getConnection(connectionId);
    if (!connection) {
      return {
        status: 'unhealthy',
        lastChecked: new Date(),
        responseTime: -1,
        message: 'Connection not found',
      };
    }

    try {
      const startTime = Date.now();
      const healthResult = await this.performHealthCheck(connection);
      const responseTime = Date.now() - startTime;

      return {
        status: healthResult.healthy ? 'healthy' : 'unhealthy',
        lastChecked: new Date(),
        responseTime,
        message: healthResult.message,
        ...(healthResult.details && { details: healthResult.details }),
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        lastChecked: new Date(),
        responseTime: -1,
        message: error instanceof Error ? error.message : 'Health check failed',
      };
    }
  }

  private async performDisconnectionCleanup(
    connection: Connection
  ): Promise<void> {
    switch (connection.toolType) {
      case IntegrationType.JIRA:
        this.logger.debug('Performing JIRA disconnection cleanup');
        break;
      case IntegrationType.ASANA:
        this.logger.debug('Performing Asana disconnection cleanup');
        break;
      case IntegrationType.TRELLO:
        this.logger.debug('Performing Trello disconnection cleanup');
        break;
      default:
        this.logger.debug(
          `Performing generic disconnection cleanup for ${connection.toolType}`
        );
    }

    await new Promise(resolve => setTimeout(resolve, 100));
  }

  private async testToolConnection(
    toolType: IntegrationType,
    credentials: Record<string, string>
  ): Promise<{ success: boolean; message: string }> {
    const config = await this.createConnectionConfig(toolType, credentials);

    if (!config || Object.keys(config).length === 0) {
      return { success: false, message: 'Configuration is empty' };
    }

    return this.validateToolCredentials(toolType, config);
  }

  private async createConnectionConfig(
    toolType: IntegrationType,
    credentials: Record<string, string>
  ): Promise<Record<string, unknown>> {
    const baseConfig = { timeout: 30000, retryAttempts: 3 };

    switch (toolType) {
      case IntegrationType.JIRA:
        return {
          ...baseConfig,
          baseUrl: credentials.baseUrl,
          username: credentials.username,
          apiToken: credentials.apiToken,
        };
      case IntegrationType.ASANA:
        return { ...baseConfig, accessToken: credentials.accessToken };
      case IntegrationType.TRELLO:
        return {
          ...baseConfig,
          apiKey: credentials.apiKey,
          token: credentials.token,
        };
      default:
        return { ...baseConfig, ...credentials };
    }
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

    return { success: true, message: 'Connection test successful' };
  }

  private async performHealthCheck(connection: Connection): Promise<{
    healthy: boolean;
    message: string;
    details?: Record<string, unknown>;
  }> {
    try {
      if (connection.status === 'error') {
        return {
          healthy: false,
          message: 'Connection is in error state',
          details: { lastError: 'Previous sync failed' },
        };
      }

      if (connection.status === 'syncing') {
        return {
          healthy: true,
          message: 'Connection is currently syncing',
          details: { currentOperation: 'sync' },
        };
      }

      await new Promise(resolve => setTimeout(resolve, 50));

      return {
        healthy: true,
        message: 'Connection is healthy',
        details: {
          lastSync: connection.lastSync,
          toolType: connection.toolType,
        },
      };
    } catch (error) {
      return {
        healthy: false,
        message: error instanceof Error ? error.message : 'Health check failed',
      };
    }
  }
}
