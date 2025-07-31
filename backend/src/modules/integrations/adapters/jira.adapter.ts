/**
 * Jira Integration Adapter
 *
 * This adapter implements the base integration interface for Jira integration.
 */

import { type AxiosInstance } from 'axios';
import {
  ConnectionStatus,
  HealthStatus,
  IntegrationType,
} from '../../../types/database/integration.types';
import {
  BaseIntegrationAdapter,
  type AdapterConfigurationSchema,
  type AdapterConnectionResult,
  type AdapterCredentialValidation,
  type AdapterData,
  type AdapterDisconnectionResult,
  type AdapterFeature,
  type AdapterHealthCheck,
  type AdapterPushResult,
  type AdapterSyncOptions,
  type AdapterSyncResult,
  type ExternalToolData,
} from '../interfaces/base-adapter.interface';
import { JiraConfigHelper } from './jira/jira-config.helper';
import { JiraDataTransformer } from './jira/jira-data-transformer';
import { JiraHttpHelper } from './jira/jira-http.helper';
import { JiraSyncHelper } from './jira/jira-sync-helper';
import { JiraCredentials } from './jira/jira.types';

// Re-export for external use
export type { JiraCredentials } from './jira/jira.types';

/**
 * Jira Integration Adapter Implementation
 */
export class JiraAdapter extends BaseIntegrationAdapter {
  readonly adapterType = IntegrationType.JIRA;
  readonly adapterName = 'Jira Integration Adapter';
  readonly version = '1.0.0';

  private readonly connections = new Map<string, JiraCredentials>();
  private readonly httpClients = new Map<string, AxiosInstance>();
  private readonly httpHelper = new JiraHttpHelper();
  private readonly dataTransformer = new JiraDataTransformer();
  private readonly syncHelper = new JiraSyncHelper(
    this.httpHelper,
    this.dataTransformer
  );

  async connect(
    credentials: JiraCredentials
  ): Promise<AdapterConnectionResult> {
    try {
      const validation = await this.validateCredentials(credentials);
      if (!validation.isValid) {
        return {
          success: false,
          status: ConnectionStatus.ERROR,
          message: validation.message,
        };
      }

      const connectionId = `jira_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      const httpClient = this.httpHelper.createHttpClient(credentials);

      await this.httpHelper.testAuthentication(httpClient);
      const serverInfo = await this.httpHelper.fetchServerInfo(httpClient);

      if (!serverInfo) {
        return {
          success: false,
          status: ConnectionStatus.ERROR,
          message: 'Failed to connect to Jira server',
        };
      }

      this.connections.set(connectionId, credentials);
      this.httpClients.set(connectionId, httpClient);

      return {
        success: true,
        connectionId,
        status: ConnectionStatus.CONNECTED,
        message: 'Successfully connected to Jira',
        metadata: {
          baseUrl: credentials.baseUrl,
          username: credentials.username,
          projectKey: credentials.projectKey,
          serverVersion: serverInfo.version,
          serverTitle: serverInfo.serverTitle,
        },
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      };
    } catch (error) {
      return {
        success: false,
        status: ConnectionStatus.ERROR,
        message:
          error instanceof Error ? error.message : 'Unknown connection error',
      };
    }
  }

  async disconnect(connectionId: string): Promise<AdapterDisconnectionResult> {
    try {
      const wasConnected = this.connections.has(connectionId);
      this.connections.delete(connectionId);
      this.httpClients.delete(connectionId);

      return {
        success: true,
        message: wasConnected
          ? 'Successfully disconnected from Jira'
          : 'Connection was already disconnected',
        cleanupPerformed: wasConnected,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : 'Disconnection failed',
        cleanupPerformed: false,
      };
    }
  }

  async testConnection(connectionId: string): Promise<AdapterHealthCheck> {
    const startTime = Date.now();

    try {
      const httpClient = this.httpClients.get(connectionId);
      if (!httpClient) {
        return {
          status: HealthStatus.UNHEALTHY,
          responseTime: Date.now() - startTime,
          lastChecked: new Date(),
          message: 'Connection not found',
        };
      }

      const serverInfo = await this.httpHelper.fetchServerInfo(httpClient);
      const responseTime = Date.now() - startTime;

      if (serverInfo) {
        return {
          status: HealthStatus.HEALTHY,
          responseTime,
          lastChecked: new Date(),
          message: 'Jira connection is healthy',
          details: {
            serverVersion: serverInfo.version,
            serverTitle: serverInfo.serverTitle,
            deploymentType: serverInfo.deploymentType,
          },
        };
      } else {
        return {
          status: HealthStatus.UNHEALTHY,
          responseTime,
          lastChecked: new Date(),
          message: 'Failed to fetch server information',
        };
      }
    } catch (error) {
      return {
        status: HealthStatus.UNHEALTHY,
        responseTime: Date.now() - startTime,
        lastChecked: new Date(),
        message:
          error instanceof Error ? error.message : 'Connection test failed',
      };
    }
  }

  async syncData(
    connectionId: string,
    options?: AdapterSyncOptions
  ): Promise<AdapterSyncResult> {
    const startedAt = new Date();

    try {
      const { httpClient, credentials } = this.getConnectionData(connectionId);
      const syncOptions = this.syncHelper.prepareSyncOptions(options);
      const jql = this.syncHelper.buildJqlQuery(credentials, syncOptions);

      const issues = await this.syncHelper.fetchIssues(
        httpClient,
        jql,
        syncOptions.batchSize
      );
      const syncResults = await this.syncHelper.processIssues(issues);

      return this.syncHelper.createSyncResult(
        syncResults,
        startedAt,
        syncOptions,
        jql
      );
    } catch (error) {
      return this.syncHelper.createFailedSyncResult(error, startedAt);
    }
  }

  async pushData(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _connectionId: string,
    data: AdapterData[]
  ): Promise<AdapterPushResult> {
    // Simplified implementation
    return {
      success: false,
      recordsPushed: 0,
      recordsFailed: data.length,
      errors: [
        {
          errorType: 'not_implemented',
          message: 'Push data not yet implemented',
          retryable: false,
        },
      ],
    };
  }

  async validateCredentials(
    credentials: JiraCredentials
  ): Promise<AdapterCredentialValidation> {
    const requiredFields = ['baseUrl', 'username', 'apiToken'];
    const baseValidation = this.validateRequiredCredentials(
      credentials,
      requiredFields
    );

    if (!baseValidation.isValid) {
      return baseValidation;
    }

    try {
      new URL(credentials.baseUrl);
    } catch {
      return {
        isValid: false,
        message: 'Base URL is not a valid URL',
        suggestions: [
          'Ensure the URL is in format: https://your-domain.atlassian.net',
        ],
      };
    }

    if (!credentials.apiToken.length || credentials.apiToken.length < 10) {
      return {
        isValid: false,
        message: 'API token appears to be invalid',
        suggestions: [
          'Generate a new API token from your Jira account settings',
        ],
      };
    }

    if (!credentials.username.includes('@')) {
      return {
        isValid: false,
        message: 'Username should be an email address for Jira Cloud',
        suggestions: ['Use your email address as the username for Jira Cloud'],
      };
    }

    return {
      isValid: true,
      message: 'Jira credentials are valid',
    };
  }

  async transformToInternal(
    externalData: ExternalToolData
  ): Promise<AdapterData[]> {
    return this.dataTransformer.transformToInternal(externalData);
  }

  async transformToExternal(
    internalData: AdapterData[]
  ): Promise<ExternalToolData> {
    return this.dataTransformer.transformToExternal(internalData);
  }

  getConfigurationSchema(): AdapterConfigurationSchema {
    return JiraConfigHelper.getConfigurationSchema();
  }

  getSupportedFeatures(): AdapterFeature[] {
    return JiraConfigHelper.getSupportedFeatures();
  }

  private getConnectionData(connectionId: string): {
    httpClient: AxiosInstance;
    credentials: JiraCredentials;
  } {
    const httpClient = this.httpClients.get(connectionId);
    const credentials = this.connections.get(connectionId);

    if (!httpClient || !credentials) {
      throw new Error('Connection not found');
    }

    return { httpClient, credentials };
  }
}
