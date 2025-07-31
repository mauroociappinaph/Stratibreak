/**
 * Jira Data Transformation Helper
 *
 * Handles data transformation between internal and Jira formats
 */

import {
  AdapterData,
  ExternalToolData,
} from '../../interfaces/base-adapter.interface';
import { JiraIssue } from './jira.types';

export class JiraDataTransformer {
  /**
   * Transform Jira issues to internal adapter data format
   */
  async transformToInternal(
    externalData: ExternalToolData
  ): Promise<AdapterData[]> {
    const jiraIssues = Array.isArray(externalData)
      ? (externalData as JiraIssue[])
      : [externalData as JiraIssue];

    return jiraIssues.map((issue): AdapterData => {
      // Extract description text from Jira's ADF format
      let description = '';
      if (issue.fields.description?.content) {
        description = this.extractTextFromADF(issue.fields.description);
      }

      return this.createAdapterData(issue.id, 'issue', issue.fields.summary, {
        description,
        status: issue.fields.status.name,
        assignee: issue.fields.assignee?.displayName || '',
        priority: issue.fields.priority.name,
        labels: issue.fields.labels || [],
        createdAt: new Date(issue.fields.created),
        updatedAt: new Date(issue.fields.updated),
        externalId: issue.key,
        customFields: {
          jiraKey: issue.key,
          jiraId: issue.id,
          issueType: issue.fields.issuetype.name,
          projectKey: issue.fields.project.key,
          projectName: issue.fields.project.name,
          statusCategory: issue.fields.status.statusCategory.key,
          assigneeAccountId: issue.fields.assignee?.accountId,
        },
        metadata: {
          source: 'jira',
          projectKey: issue.fields.project.key,
          issueTypeId: issue.fields.issuetype.id,
          priorityId: issue.fields.priority.id,
          statusId: issue.fields.status.id,
          self: issue.self,
        },
      });
    });
  }

  /**
   * Transform internal data to Jira format
   */
  async transformToExternal(
    internalData: AdapterData[]
  ): Promise<ExternalToolData> {
    const jiraIssues: Partial<JiraIssue>[] = internalData.map(
      (item): Partial<JiraIssue> =>
        ({
          key: (item.customFields?.jiraKey as string) || `PROJ-${item.id}`,
          fields: {
            summary: item.title,
            description: item.description
              ? this.convertToADF(item.description)
              : undefined,
            status: {
              id: '3',
              name: item.status || 'To Do',
              statusCategory: {
                id: 2,
                key: 'new',
                colorName: 'blue-gray',
                name: 'To Do',
              },
            },
            issuetype: {
              id: '10001',
              name: (item.customFields?.issueType as string) || 'Task',
              iconUrl: 'https://example.com/icon.png',
            },
            priority: {
              id: '3',
              name: item.priority || 'Medium',
              iconUrl: 'https://example.com/priority.png',
            },
            labels: item.labels || [],
            created: item.createdAt.toISOString(),
            updated: item.updatedAt.toISOString(),
            project: {
              id: '10000',
              key: (item.customFields?.projectKey as string) || 'PROJ',
              name: 'Project Name',
            },
          },
        }) as Partial<JiraIssue>
    );

    return jiraIssues as unknown as ExternalToolData;
  }

  /**
   * Extract plain text from Jira's Atlassian Document Format (ADF)
   */
  private extractTextFromADF(adf: JiraIssue['fields']['description']): string {
    if (!adf?.content) return '';

    let text = '';
    for (const block of adf.content) {
      if (block.content) {
        for (const inline of block.content) {
          if (inline.type === 'text' && inline.text) {
            text += `${inline.text} `;
          }
        }
      }
    }

    return text.trim();
  }

  /**
   * Convert plain text to Jira's Atlassian Document Format (ADF)
   */
  private convertToADF(text: string): JiraIssue['fields']['description'] {
    return {
      type: 'doc',
      version: 1,
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text,
            },
          ],
        },
      ],
    };
  }

  /**
   * Create adapter data with proper typing
   */
  private createAdapterData(
    id: string,
    type: string,
    title: string,
    data: Partial<AdapterData>
  ): AdapterData {
    const defaults = {
      description: '',
      status: 'unknown',
      assignee: '',
      priority: 'medium',
      labels: [] as string[],
      createdAt: new Date(),
      updatedAt: new Date(),
      externalId: '',
      customFields: {} as Record<string, unknown>,
      metadata: {} as Record<string, unknown>,
    };

    return { id, type, title, ...defaults, ...data };
  }
}
