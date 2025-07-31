import {
  ApiBadRequestResponse,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { IntegrationEntity } from '../../entities';

export const CreateSwaggerDocs = {
  operation: ApiOperation({
    summary: 'Create a new integration',
    description: `Creates a new integration configuration for connecting to external tools. This endpoint:
    • Registers a new integration with specified tool type and configuration
    • Validates integration parameters and project association
    • Sets up initial configuration for the integration
    • Returns the created integration entity with unique ID
    • Prepares the integration for connection establishment`,
  }),
  body: ApiBody({
    description: 'Integration configuration data',
    examples: {
      jiraIntegration: {
        summary: 'Jira Integration',
        description: 'Example of creating a Jira integration',
        value: {
          name: 'Main Jira Instance',
          type: 'JIRA',
          projectId: 'proj_123456789',
          description: 'Primary Jira instance for project management',
          config: {
            baseUrl: 'https://company.atlassian.net',
            timeout: 30000,
            retryAttempts: 3,
          },
        },
      },
      asanaIntegration: {
        summary: 'Asana Integration',
        description: 'Example of creating an Asana integration',
        value: {
          name: 'Team Asana Workspace',
          type: 'ASANA',
          projectId: 'proj_123456789',
          description: 'Asana workspace for task management',
          config: {
            timeout: 30000,
            retryAttempts: 3,
          },
        },
      },
      trelloIntegration: {
        summary: 'Trello Integration',
        description: 'Example of creating a Trello integration',
        value: {
          name: 'Development Board',
          type: 'TRELLO',
          projectId: 'proj_123456789',
          description: 'Trello board for development workflow',
          config: {
            timeout: 30000,
            retryAttempts: 3,
          },
        },
      },
    },
  }),
  responses: {
    success: ApiResponse({
      status: 201,
      description: 'Integration created successfully',
      type: IntegrationEntity,
    }),
    badRequest: ApiBadRequestResponse({
      description: 'Invalid integration data',
      schema: {
        type: 'object',
        properties: {
          error: { type: 'string', example: 'Validation failed' },
          message: {
            type: 'array',
            items: { type: 'string' },
            example: [
              'name should not be empty',
              'type must be a valid enum value',
              'projectId should not be empty',
            ],
          },
          statusCode: { type: 'number', example: 400 },
        },
      },
    }),
    serverError: ApiInternalServerErrorResponse({
      description: 'Internal server error during integration creation',
    }),
  },
};
