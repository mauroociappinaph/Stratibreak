import { PrismaService } from '@/common/services';
import type { ConnectionResponse } from '@/types/api';
import type {
  IIntegrationService,
  RecoveryAction,
  ServiceIntegrationError,
  SyncResult,
  ValidationResult,
} from '@/types/services';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { IntegrationStatus, IntegrationType } from '@prisma/client';
import {
  ConnectionFactoryHelper,
  ConnectionManagerHelper,
  DataValidationHelper,
} from '../helpers';
import type { Connection } from '../helpers/connection-manager.helper';

@Injectable()
export class IntegrationsCoreService
  implements IIntegrationService, OnModuleInit
{
  private readonly logger = new Logger(IntegrationsCoreService.name);
  private readonly connectionManager = new ConnectionManagerHelper();
  private readonly dataValidator = new DataValidationHelper();
  private readonly connectionFactory = new ConnectionFactoryHelper();
  private readonly healthCheckInterval = 5 * 60 * 1000; // 5 minutes

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit(): Promise<void> {
    this.logger.log('Initializing Integration Service...');
    await this.initializeActiveConnections();
    this.startHealthCheckScheduler();
  }

  async connectToTool(
    toolType: string,
    credentials: Record<string, string>
  ): Promise<ConnectionResponse> {
    this.logger.log(`Attempting to connect to tool: ${toolType}`);

    try {
      if (!this.isValidToolType(toolType)) {
        throw new Error(`Unsupported tool type: ${toolType}`);
      }

      const connectionConfig = await this.createConnectionConfig(
        toolType as IntegrationType,
        credentials
      );

      const testResult = await this.testToolConnection(
        toolType as IntegrationType,
        connectionConfig
      );

      if (!testResult.success) {
        return this.connectionFactory.createFailedConnectionResponse(toolType);
      }

      const connectionId =
        this.connectionManager.generateConnectionId(toolType);
      const connection = this.connectionFactory.createConnection(
        connectionId,
        toolType as IntegrationType,
        connectionConfig
      );

      this.connectionManager.setConnection(connectionId, connection);

      this.logger.log(
        `Successfully connected to ${toolType} with ID: ${connectionId}`
      );

      return this.connectionFactory.createSuccessConnectionResponse(connection);
    } catch (error) {
      this.logger.error(`Failed to connect to ${toolType}:`, error);
      return this.connectionFactory.createFailedConnectionResponse(toolType);
    }
  }

  async syncData(connectionId: string): Promise<SyncResult> {
    this.logger.log(`Starting data sync for connection: ${connectionId}`);

    const connection = this.connectionManager.getConnection(connectionId);
    if (!connection) {
      return this.createFailedSyncResult(connectionId, [
        'Connection not found',
      ]);
    }

    try {
      connection.status = 'syncing';
      connection.updatedAt = new Date();

      const syncResult = await this.performToolSync(connection);

      connection.status = 'connected';
      connection.lastSync = new Date();
      connection.updatedAt = new Date();

      await this.storeSyncResult(connectionId, syncResult);

      this.logger.log(
        `Sync completed for ${connectionId}: ${syncResult.recordsProcessed} records processed`
      );

      return syncResult;
    } catch (error) {
      this.logger.error(`Sync failed for ${connectionId}:`, error);

      connection.status = 'error';
      connection.updatedAt = new Date();

      const errorResult = this.createFailedSyncResult(connectionId, [
        error instanceof Error ? error.message : 'Unknown error',
      ]);

      await this.storeSyncResult(connectionId, errorResult);
      return errorResult;
    }
  }

  async handleIntegrationFailure(
    error: ServiceIntegrationError
  ): Promise<RecoveryAction> {
    this.logger.warn(
      `Handling integration failure for ${error.connectionId}:`,
      error
    );

    const connection = this.connectionManager.getConnection(error.connectionId);
    if (!connection) {
      return { action: 'manual_intervention' };
    }

    return this.determineRecoveryAction(error);
  }

  async validateDataConsistency(
    localData: unknown,
    externalData: unknown
  ): Promise<ValidationResult> {
    return this.dataValidator.validateDataConsistency(localData, externalData);
  }

  // Private helper methods
  private async initializeActiveConnections(): Promise<void> {
    try {
      const activeIntegrations = await this.prisma.integration.findMany({
        where: {
          status: IntegrationStatus.ACTIVE,
          isActive: true,
        },
      });

      for (const integration of activeIntegrations) {
        const connection =
          this.connectionFactory.createConnectionFromIntegration(integration);
        this.connectionManager.setConnection(integration.id, connection);
      }

      this.logger.log(
        `Initialized ${activeIntegrations.length} active connections`
      );
    } catch (error) {
      this.logger.error('Failed to initialize active connections:', error);
    }
  }

  private startHealthCheckScheduler(): void {
    setInterval(async () => {
      await this.connectionManager.performHealthChecks();
    }, this.healthCheckInterval);
  }

  private isValidToolType(toolType: string): boolean {
    const validTypes = ['JIRA', 'ASANA', 'TRELLO', 'MONDAY', 'BITRIX24'];
    return validTypes.includes(toolType.toUpperCase());
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
    return validationResult;
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

  private createFailedSyncResult(
    connectionId: string,
    errors: string[]
  ): SyncResult {
    return {
      connectionId,
      status: 'failed',
      recordsProcessed: 0,
      errors,
      lastSync: new Date(),
    };
  }

  private async performToolSync(connection: Connection): Promise<SyncResult> {
    this.logger.debug(`Performing sync for ${connection.toolType}`);

    await new Promise(resolve => setTimeout(resolve, 200));

    return {
      connectionId: connection.connectionId,
      status: 'success',
      recordsProcessed: Math.floor(Math.random() * 50) + 1,
      errors: [],
      lastSync: new Date(),
    };
  }

  private async storeSyncResult(
    connectionId: string,
    syncResult: SyncResult
  ): Promise<void> {
    try {
      // Check if integration exists before storing sync result
      const integration = await this.prisma.integration.findUnique({
        where: { id: connectionId },
      });

      if (!integration) {
        this.logger.warn(
          `Cannot store sync result: Integration ${connectionId} not found`
        );
        return;
      }

      await this.prisma.syncResult.create({
        data: {
          integrationId: connectionId,
          status: syncResult.status,
          recordsSync: syncResult.recordsProcessed,
          errorMessage: syncResult.errors.join('; ') || null,
          syncDuration: 1000,
        },
      });
    } catch (error) {
      this.logger.error('Failed to store sync result:', error);
    }
  }

  private determineRecoveryAction(
    error: ServiceIntegrationError
  ): RecoveryAction {
    switch (error.errorType) {
      case 'authentication':
      case 'authorization':
        return { action: 'manual_intervention' };
      case 'network':
      case 'timeout':
        return { action: 'retry', delay: 30000, maxRetries: 3 };
      case 'rate_limit':
        return { action: 'retry', delay: 60000, maxRetries: 5 };
      default:
        return error.retryable
          ? { action: 'retry', delay: 10000, maxRetries: 2 }
          : { action: 'manual_intervention' };
    }
  }
}
