/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Example Jira Adapter Implementation
 *
 * This is an example implementation of the base integration adapter interface
 * for Jira integration. This demonstrates how concrete adapters should implement
 * the base interface and handle Jira-specific functionality.
 *
 * NOTE: This is an example/template file and not a complete implementation.
 * A full implementation would include actual Jira API calls, proper error handling,
 * and comprehensive data transformation logic.
 */

import {
  ConnectionStatus,
  HealthStatus,
  IntegrationType,
  SyncStatus,
} from '../../../types/database/integration.types';
import {
  AdapterFeatureType,
  BaseIntegrationAdapter,
  type AdapterConfigurationSchema,
  type AdapterConnectionResult,
  type AdapterCredentials,
  type AdapterCredentialValidation,
  type AdapterData,
  type AdapterDisconnectionResult,
  type AdapterFeature,
  type AdapterHealthCheck,
  type AdapterPushResult,
  type AdapterSyncOptions,
  type AdapterSyncResult,
  type ExternalToolData,
} from './base-adapter.interface';

/**
 * Jira-specific credentials interface
 */
export interface JiraCredentials extends AdapterCredentials {
  baseUrl: string;
  username: string;
  apiToken: string;
  projectKey?: string;
}

/**
 * Jira-specific external data structure
 */
export interface JiraIssue extends ExternalToolData {
  id: string;
  key: string;
  fields: {
    summary: string;
    description?: string;
    status: {
      name: string;
    };
    assignee?: {
      displayName: string;
      emailAddress: string;
    } | null;
    priority: {
      name: string;
    };
    labels: string[];
    created: string;
    updated: string;
    [key: string]: unknown;
  };
}

/**
 * Example Jira Adapter Implementation
 */
export class ExampleJiraAdapter extends BaseIntegrationAdapter {
  readonly adapterType = IntegrationType.JIRA;
  readonly adapterName = 'Jira Integration Adapter';
  readonly version = '1.0.0';

  async connect(
    credentials: JiraCredentials
  ): Promise<AdapterConnectionResult> {
    try {
      // Validate credentials first
      const validation = await this.validateCredentials(credentials);
      if (!validation.isValid) {
        return {
          success: false,
          status: ConnectionStatus.ERROR,
          message: validation.message,
        };
      }

      // In a real implementation, this would make an actual API call to Jira
      // For example: GET /rest/api/3/myself to verify authentication
      const connectionId = `jira_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 100));

      return {
        success: true,
        connectionId,
        status: ConnectionStatus.CONNECTED,
        message: 'Successfully connected to Jira',
        metadata: {
          baseUrl: credentials.baseUrl,
          username: credentials.username,
          projectKey: credentials.projectKey,
        },
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

  async disconnect(_connectionId: string): Promise<AdapterDisconnectionResult> {
    try {
      // In a real implementation, this might revoke tokens or clean up resources
      // For Jira, this might involve clearing cached authentication tokens

      return {
        success: true,
        message: 'Successfully disconnected from Jira',
        cleanupPerformed: true,
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

  async testConnection(_connectionId: string): Promise<AdapterHealthCheck> {
    const startTime = Date.now();

    try {
      // In a real implementation, this would make a lightweight API call
      // For example: GET /rest/api/3/serverInfo

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 50));

      const responseTime = Date.now() - startTime;

      return {
        status: HealthStatus.HEALTHY,
        responseTime,
        lastChecked: new Date(),
        message: 'Jira connection is healthy',
        details: {
          apiVersion: '3',
          serverInfo: 'Jira Cloud',
        },
      };
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
    _connectionId: string,
    options?: AdapterSyncOptions
  ): Promise<AdapterSyncResult> {
    const startedAt = new Date();

    try {
      // In a real implementation, this would:
      // 1. Fetch issues from Jira API using JQL queries
      // 2. Transform the data using transformToInternal
      // 3. Handle pagination and rate limiting
      // 4. Track sync progress and errors

      const batchSize = options?.batchSize || 100;
      const modifiedSince = options?.modifiedSince;

      // Simulate fetching data from Jira
      const mockJiraIssues: JiraIssue[] = [
        {
          id: '10001',
          key: 'PROJ-1',
          fields: {
            summary: 'Example issue',
            description: 'This is an example issue from Jira',
            status: { name: 'In Progress' },
            assignee: {
              displayName: 'John Doe',
              emailAddress: 'john.doe@example.com',
            },
            priority: { name: 'High' },
            labels: ['bug', 'urgent'],
            created: '2024-01-01T10:00:00.000Z',
            updated: '2024-01-02T15:30:00.000Z',
          },
        },
      ];

      // Transform external data to internal format
      const transformedData = await this.transformToInternal(
        mockJiraIssues as unknown as ExternalToolData
      );

      return {
        status: SyncStatus.COMPLETED,
        recordsProcessed: mockJiraIssues.length,
        recordsCreated: transformedData.length,
        recordsUpdated: 0,
        recordsSkipped: 0,
        errors: [],
        startedAt,
        completedAt: new Date(),
        nextSyncRecommended: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
        metadata: {
          batchSize,
          modifiedSince: modifiedSince?.toISOString(),
        },
      };
    } catch (error) {
      return {
        status: SyncStatus.FAILED,
        recordsProcessed: 0,
        recordsCreated: 0,
        recordsUpdated: 0,
        recordsSkipped: 0,
        errors: [
          this.createSyncError(
            error instanceof Error ? error.message : 'Sync failed',
            'sync_error',
            undefined,
            true
          ),
        ],
        startedAt,
        completedAt: new Date(),
      };
    }
  }

  async pushData(
    _connectionId: string,
    data: AdapterData[]
  ): Promise<AdapterPushResult> {
    try {
      // In a real implementation, this would:
      // 1. Transform internal data to Jira format using transformToExternal
      // 2. Create or update issues in Jira via API calls
      // 3. Handle API rate limits and errors
      // 4. Map internal IDs to external IDs

      await this.transformToExternal(data);
      const externalIds: Record<string, string> = {};

      // Simulate creating/updating issues in Jira
      for (const item of data) {
        // Mock external ID generation
        externalIds[item.id] = `PROJ-${Math.floor(Math.random() * 1000)}`;
      }

      return {
        success: true,
        recordsPushed: data.length,
        recordsFailed: 0,
        errors: [],
        externalIds,
      };
    } catch (error) {
      return {
        success: false,
        recordsPushed: 0,
        recordsFailed: data.length,
        errors: [
          this.createSyncError(
            error instanceof Error ? error.message : 'Push failed',
            'push_error',
            undefined,
            true
          ),
        ],
      };
    }
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

    // Additional Jira-specific validation
    if (
      !credentials.baseUrl.includes('atlassian.net') &&
      !credentials.baseUrl.includes('jira')
    ) {
      return {
        isValid: false,
        message: 'Base URL does not appear to be a valid Jira instance',
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

    return {
      isValid: true,
      message: 'Jira credentials are valid',
    };
  }

  async transformToInternal(
    externalData: ExternalToolData
  ): Promise<AdapterData[]> {
    const jiraIssues = externalData as unknown as JiraIssue[];
    return jiraIssues.map(issue =>
      this.createAdapterData(issue.id, 'issue', issue.fields.summary, {
        description: issue.fields.description || '',
        status: issue.fields.status.name,
        ...(issue.fields.assignee?.displayName && {
          assignee: issue.fields.assignee.displayName,
        }),
        priority: issue.fields.priority.name,
        labels: issue.fields.labels,
        createdAt: new Date(issue.fields.created),
        updatedAt: new Date(issue.fields.updated),
        externalId: issue.key,
        customFields: {
          jiraKey: issue.key,
          jiraId: issue.id,
        },
        metadata: {
          source: 'jira',
          projectKey: issue.key.split('-')[0],
        },
      })
    );
  }

  async transformToExternal(
    internalData: AdapterData[]
  ): Promise<ExternalToolData> {
    const jiraIssues: JiraIssue[] = internalData.map(item => ({
      id: item.externalId || item.id,
      key: (item.customFields?.jiraKey as string) || `PROJ-${item.id}`,
      fields: {
        summary: item.title,
        description: item.description || '',
        status: { name: item.status },
        assignee: item.assignee
          ? {
              displayName: item.assignee,
              emailAddress: `${item.assignee.toLowerCase().replace(' ', '.')}@example.com`,
            }
          : null,
        priority: { name: item.priority || 'Medium' },
        labels: item.labels || [],
        created: item.createdAt.toISOString(),
        updated: item.updatedAt.toISOString(),
      },
    }));

    return jiraIssues as unknown as ExternalToolData;
  }

  getConfigurationSchema(): AdapterConfigurationSchema {
    return {
      type: 'object',
      properties: {
        baseUrl: {
          type: 'string',
          description:
            'Jira instance base URL (e.g., https://your-domain.atlassian.net)',
          format: 'uri',
        },
        username: {
          type: 'string',
          description: 'Jira username or email address',
          format: 'email',
        },
        apiToken: {
          type: 'string',
          description: 'Jira API token for authentication',
          sensitive: true,
        },
        projectKey: {
          type: 'string',
          description:
            'Optional: Specific Jira project key to sync (e.g., PROJ)',
        },
        syncInterval: {
          type: 'number',
          description: 'Sync interval in minutes',
          default: 15,
        },
        enableWebhooks: {
          type: 'boolean',
          description: 'Enable real-time webhooks for instant updates',
          default: false,
        },
      },
      required: ['baseUrl', 'username', 'apiToken'],
      additionalProperties: false,
    };
  }

  getSupportedFeatures(): AdapterFeature[] {
    return [
      {
        name: AdapterFeatureType.BIDIRECTIONAL_SYNC,
        description:
          'Support for both pulling data from and pushing data to Jira',
        supported: true,
      },
      {
        name: AdapterFeatureType.REAL_TIME_WEBHOOKS,
        description: 'Real-time updates via Jira webhooks',
        supported: true,
        limitations: ['Requires webhook configuration in Jira'],
      },
      {
        name: AdapterFeatureType.BULK_OPERATIONS,
        description: 'Bulk create/update operations',
        supported: true,
        limitations: ['Limited to 1000 issues per batch'],
      },
      {
        name: AdapterFeatureType.CUSTOM_FIELDS,
        description: 'Support for Jira custom fields',
        supported: true,
      },
      {
        name: AdapterFeatureType.FILE_ATTACHMENTS,
        description: 'Sync file attachments',
        supported: false,
        limitations: ['Not implemented in current version'],
      },
      {
        name: AdapterFeatureType.COMMENTS_SYNC,
        description: 'Sync issue comments',
        supported: true,
      },
      {
        name: AdapterFeatureType.HISTORY_TRACKING,
        description: 'Track issue history and changes',
        supported: true,
      },
      {
        name: AdapterFeatureType.ADVANCED_FILTERING,
        description: 'Advanced JQL-based filtering',
        supported: true,
      },
      {
        name: AdapterFeatureType.RATE_LIMITING,
        description: 'Built-in rate limiting to respect API limits',
        supported: true,
      },
      {
        name: AdapterFeatureType.OAUTH_AUTHENTICATION,
        description: 'OAuth 2.0 authentication support',
        supported: false,
        limitations: ['Currently only supports API token authentication'],
      },
    ];
  }
}
