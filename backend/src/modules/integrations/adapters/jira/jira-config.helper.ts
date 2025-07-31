/**
 * Jira Configuration Helper
 *
 * Handles configuration schema and supported features
 */

import {
  AdapterFeatureType,
  type AdapterConfigurationSchema,
  type AdapterFeature,
} from '../../interfaces/base-adapter.interface';

export class JiraConfigHelper {
  static getConfigurationSchema(): AdapterConfigurationSchema {
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
          description: 'Jira username (email address for Jira Cloud)',
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
      },
      required: ['baseUrl', 'username', 'apiToken'],
      additionalProperties: false,
    };
  }

  static getSupportedFeatures(): AdapterFeature[] {
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
    ];
  }
}
