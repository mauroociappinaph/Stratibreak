/**
 * Jira Sync Operations Helper
 *
 * Handles sync-related operations and data processing
 */

import { type AxiosInstance } from 'axios';
import { SyncStatus } from '../../../../types/database/integration.types';
import {
  type AdapterData,
  type AdapterSyncOptions,
  type AdapterSyncResult,
  type ExternalToolData,
} from '../../interfaces/base-adapter.interface';
import { JiraDataTransformer } from './jira-data-transformer';
import { JiraHttpHelper } from './jira-http.helper';
import { JiraCredentials, JiraIssue } from './jira.types';

export class JiraSyncHelper {
  constructor(
    private readonly httpHelper: JiraHttpHelper,
    private readonly dataTransformer: JiraDataTransformer
  ) {}

  prepareSyncOptions(options?: AdapterSyncOptions): {
    batchSize: number;
    modifiedSince?: Date;
    dataTypes: string[];
    incremental: boolean;
  } {
    const result = {
      batchSize: options?.batchSize || 100,
      dataTypes: options?.dataTypes || ['issue'],
      incremental: options?.incremental ?? true,
    };

    if (options?.modifiedSince) {
      return { ...result, modifiedSince: options.modifiedSince };
    }

    return result;
  }

  buildJqlQuery(
    credentials: JiraCredentials,
    options: ReturnType<typeof this.prepareSyncOptions>
  ): string {
    let jql = '';

    if (credentials.projectKey) {
      jql += `project = "${credentials.projectKey}"`;
    }

    if (options.modifiedSince && options.incremental) {
      const dateStr = options.modifiedSince.toISOString().split('T')[0];
      jql += jql ? ` AND updated >= "${dateStr}"` : `updated >= "${dateStr}"`;
    }

    return jql;
  }

  async processIssues(issues: JiraIssue[]): Promise<{
    recordsProcessed: number;
    recordsCreated: number;
    recordsSkipped: number;
    errors: Array<{
      recordId?: string;
      errorType: string;
      message: string;
      retryable: boolean;
    }>;
  }> {
    let recordsProcessed = 0;
    let recordsCreated = 0;
    let recordsSkipped = 0;
    const errors: Array<{
      recordId?: string;
      errorType: string;
      message: string;
      retryable: boolean;
    }> = [];

    for (const issue of issues) {
      try {
        recordsProcessed++;
        const transformedData =
          await this.dataTransformer.transformToInternal(issue);

        if (transformedData.length > 0) {
          recordsCreated++;
        } else {
          recordsSkipped++;
        }
      } catch (error) {
        errors.push({
          recordId: issue.key,
          errorType: 'transform_error',
          message: error instanceof Error ? error.message : 'Transform failed',
          retryable: true,
        });
      }
    }

    return { recordsProcessed, recordsCreated, recordsSkipped, errors };
  }

  createSyncResult(
    syncResults: {
      recordsProcessed: number;
      recordsCreated: number;
      recordsSkipped: number;
      errors: Array<{
        recordId?: string;
        errorType: string;
        message: string;
        retryable: boolean;
      }>;
    },
    startedAt: Date,
    options: ReturnType<typeof this.prepareSyncOptions>,
    jql: string
  ): AdapterSyncResult {
    return {
      status:
        syncResults.errors.length === 0
          ? SyncStatus.COMPLETED
          : SyncStatus.FAILED,
      recordsProcessed: syncResults.recordsProcessed,
      recordsCreated: syncResults.recordsCreated,
      recordsUpdated: 0,
      recordsSkipped: syncResults.recordsSkipped,
      errors: syncResults.errors,
      startedAt,
      completedAt: new Date(),
      nextSyncRecommended: new Date(Date.now() + 15 * 60 * 1000),
      metadata: {
        batchSize: options.batchSize,
        modifiedSince: options.modifiedSince?.toISOString(),
        jqlQuery: jql,
        dataTypes: options.dataTypes,
      },
    };
  }

  createFailedSyncResult(error: unknown, startedAt: Date): AdapterSyncResult {
    return {
      status: SyncStatus.FAILED,
      recordsProcessed: 0,
      recordsCreated: 0,
      recordsUpdated: 0,
      recordsSkipped: 0,
      errors: [
        {
          errorType: 'sync_error',
          message: error instanceof Error ? error.message : 'Sync failed',
          retryable: true,
        },
      ],
      startedAt,
      completedAt: new Date(),
    };
  }

  async fetchIssues(
    httpClient: AxiosInstance,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _jql: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _maxResults: number
  ): Promise<JiraIssue[]> {
    try {
      return await this.httpHelper.withRetry(async () => {
        await this.httpHelper.rateLimitedDelay();

        // Mock data for now - in real implementation would make HTTP request
        const mockIssues: JiraIssue[] = [
          {
            id: '10001',
            key: 'PROJ-1',
            self: `${httpClient.defaults.baseURL}/rest/api/3/issue/10001`,
            fields: {
              summary: 'Example issue from Jira adapter',
              description: {
                type: 'doc',
                version: 1,
                content: [
                  {
                    type: 'paragraph',
                    content: [
                      {
                        type: 'text',
                        text: 'This is an example issue synchronized from Jira',
                      },
                    ],
                  },
                ],
              },
              status: {
                id: '3',
                name: 'In Progress',
                statusCategory: {
                  id: 4,
                  key: 'indeterminate',
                  colorName: 'yellow',
                  name: 'In Progress',
                },
              },
              assignee: {
                accountId: '5b10a2844c20165700ede21g',
                displayName: 'John Doe',
                emailAddress: 'john.doe@example.com',
                active: true,
              },
              priority: {
                id: '3',
                name: 'Medium',
                iconUrl:
                  'https://example.atlassian.net/images/icons/priorities/medium.svg',
              },
              labels: ['bug', 'urgent'],
              created: '2024-01-01T10:00:00.000Z',
              updated: '2024-01-02T15:30:00.000Z',
              project: {
                id: '10000',
                key: 'PROJ',
                name: 'Example Project',
              },
              issuetype: {
                id: '10001',
                name: 'Bug',
                iconUrl:
                  'https://example.atlassian.net/images/icons/issuetypes/bug.png',
              },
            },
          },
        ];

        return mockIssues;
      });
    } catch (error) {
      return [];
    }
  }

  async createOrUpdateIssue(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _httpClient: AxiosInstance,
    item: AdapterData,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _jiraData: ExternalToolData
  ): Promise<string | null> {
    try {
      return await this.httpHelper.withRetry(async () => {
        await this.httpHelper.rateLimitedDelay();

        const jiraIssues = Array.isArray(_jiraData) ? _jiraData : [_jiraData];
        const jiraIssue = jiraIssues[0] as Partial<JiraIssue>;

        if (!jiraIssue.fields) {
          throw new Error('Invalid Jira issue data');
        }

        // Mock implementation - would make actual HTTP requests in real implementation
        return item.externalId || `PROJ-${item.id}`;
      });
    } catch (error) {
      return null;
    }
  }
}
