/**
 * Jira-specific type definitions
 */

import {
  AdapterCredentials,
  ExternalToolData,
} from '../../interfaces/base-adapter.interface';

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
 * Jira API response interfaces
 */
export interface JiraIssue extends ExternalToolData {
  id: string;
  key: string;
  self: string;
  fields: {
    summary: string;
    description?: {
      content: Array<{
        content: Array<{
          text: string;
          type: string;
        }>;
        type: string;
      }>;
      type: string;
      version: number;
    };
    status: {
      id: string;
      name: string;
      statusCategory: {
        id: number;
        key: string;
        colorName: string;
        name: string;
      };
    };
    assignee?: {
      accountId: string;
      displayName: string;
      emailAddress?: string;
      active: boolean;
    } | null;
    priority: {
      id: string;
      name: string;
      iconUrl: string;
    };
    labels: string[];
    created: string;
    updated: string;
    project: {
      id: string;
      key: string;
      name: string;
    };
    issuetype: {
      id: string;
      name: string;
      iconUrl: string;
    };
    [key: string]: unknown;
  };
}

export interface JiraSearchResponse {
  expand: string;
  startAt: number;
  maxResults: number;
  total: number;
  issues: JiraIssue[];
}

export interface JiraServerInfo {
  baseUrl: string;
  version: string;
  versionNumbers: number[];
  deploymentType: string;
  buildNumber: number;
  buildDate: string;
  serverTime: string;
  scmInfo: string;
  serverTitle: string;
}
