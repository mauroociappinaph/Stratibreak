import {
  ApiBadRequestResponse,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { IntegrationEntity } from '../entities';

// Swagger decorators for CRUD operations
export const CrudSwaggerDocs = {
  create: {
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
  },

  findAll: {
    operation: ApiOperation({
      summary: 'Get all integrations',
      description: `Retrieves a list of all integration configurations. This endpoint:
      • Returns all integrations across all projects (if no filter applied)
      • Supports filtering by project ID to get project-specific integrations
      • Orders results by creation date (newest first)
      • Includes integration status and configuration details
      • Useful for integration management and overview dashboards`,
    }),
    query: ApiQuery({
      name: 'projectId',
      required: false,
      type: String,
      description: 'Optional project ID to filter integrations',
      example: 'proj_123456789',
    }),
    responses: {
      success: ApiResponse({
        status: 200,
        description: 'List of integrations retrieved successfully',
        type: [IntegrationEntity],
        schema: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'int_987654321' },
              name: { type: 'string', example: 'Main Jira Instance' },
              type: { type: 'string', example: 'JIRA' },
              projectId: { type: 'string', example: 'proj_123456789' },
              description: {
                type: 'string',
                example: 'Primary Jira instance for project management',
              },
              isActive: { type: 'boolean', example: true },
              createdAt: {
                type: 'string',
                format: 'date-time',
                example: '2024-01-15T10:30:00Z',
              },
              updatedAt: {
                type: 'string',
                format: 'date-time',
                example: '2024-01-15T10:30:00Z',
              },
            },
          },
        },
      }),
      serverError: ApiInternalServerErrorResponse({
        description: 'Internal server error while retrieving integrations',
      }),
    },
  },

  findOne: {
    operation: ApiOperation({
      summary: 'Get integration by ID',
      description: `Retrieves a specific integration configuration by its unique identifier. This endpoint:
      • Returns detailed integration information including configuration
      • Shows current status and activity state
      • Includes creation and modification timestamps
      • Useful for integration detail views and configuration management
      • Required for integration editing and connection management`,
    }),
    param: ApiParam({
      name: 'id',
      description: 'Unique identifier of the integration',
      example: 'int_987654321',
      type: 'string',
    }),
    responses: {
      success: ApiResponse({
        status: 200,
        description: 'Integration found successfully',
        type: IntegrationEntity,
      }),
      notFound: ApiNotFoundResponse({
        description: 'Integration not found',
        schema: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Integration not found' },
            message: {
              type: 'string',
              example: 'Integration with ID int_987654321 not found',
            },
            statusCode: { type: 'number', example: 404 },
          },
        },
      }),
      serverError: ApiInternalServerErrorResponse({
        description: 'Internal server error while retrieving integration',
      }),
    },
  },

  update: {
    operation: ApiOperation({
      summary: 'Update integration configuration',
      description: `Updates an existing integration configuration. This endpoint:
      • Allows partial updates of integration properties
      • Validates updated configuration parameters
      • Maintains integration history and audit trail
      • Updates modification timestamp automatically
      • Supports configuration changes without affecting active connections`,
    }),
    param: ApiParam({
      name: 'id',
      description: 'Unique identifier of the integration to update',
      example: 'int_987654321',
      type: 'string',
    }),
    body: ApiBody({
      description: 'Integration data to update (partial update supported)',
      examples: {
        updateName: {
          summary: 'Update Name',
          description: 'Example of updating only the integration name',
          value: {
            name: 'Updated Jira Instance Name',
          },
        },
        updateConfig: {
          summary: 'Update Configuration',
          description: 'Example of updating integration configuration',
          value: {
            config: {
              baseUrl: 'https://newcompany.atlassian.net',
              timeout: 45000,
              retryAttempts: 5,
            },
          },
        },
        updateDescription: {
          summary: 'Update Description',
          description: 'Example of updating the description',
          value: {
            description: 'Updated description for the integration',
          },
        },
        deactivateIntegration: {
          summary: 'Deactivate Integration',
          description: 'Example of deactivating an integration',
          value: {
            isActive: false,
          },
        },
      },
    }),
    responses: {
      success: ApiResponse({
        status: 200,
        description: 'Integration updated successfully',
        type: IntegrationEntity,
      }),
      badRequest: ApiBadRequestResponse({
        description: 'Invalid update data',
        schema: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Validation failed' },
            message: {
              type: 'array',
              items: { type: 'string' },
              example: ['type must be a valid enum value'],
            },
            statusCode: { type: 'number', example: 400 },
          },
        },
      }),
      notFound: ApiNotFoundResponse({
        description: 'Integration not found',
      }),
      serverError: ApiInternalServerErrorResponse({
        description: 'Internal server error during integration update',
      }),
    },
  },

  remove: {
    operation: ApiOperation({
      summary: 'Delete integration',
      description: `Permanently deletes an integration configuration. This endpoint:
      • Removes the integration configuration from the system
      • Disconnects any active connections associated with the integration
      • Cleans up connection pool entries and sync schedules
      • Cannot be undone - use with caution
      • Recommended to deactivate first before permanent deletion`,
    }),
    param: ApiParam({
      name: 'id',
      description: 'Unique identifier of the integration to delete',
      example: 'int_987654321',
      type: 'string',
    }),
    responses: {
      success: ApiResponse({
        status: 204,
        description: 'Integration deleted successfully',
      }),
      notFound: ApiNotFoundResponse({
        description: 'Integration not found',
        schema: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Integration not found' },
            message: {
              type: 'string',
              example: 'Integration with ID int_987654321 not found',
            },
            statusCode: { type: 'number', example: 404 },
          },
        },
      }),
      serverError: ApiInternalServerErrorResponse({
        description: 'Internal server error during integration deletion',
      }),
    },
  },

  testConnection: {
    operation: ApiOperation({
      summary: 'Test integration connection',
      description: `Tests the connection to an external tool using the integration configuration.`,
    }),
    param: ApiParam({
      name: 'id',
      description: 'Unique identifier of the integration to test',
      example: 'int_987654321',
      type: 'string',
    }),
    responses: {
      success: ApiResponse({
        status: 200,
        description: 'Connection test completed',
        schema: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
          },
        },
      }),
      notFound: ApiNotFoundResponse({
        description: 'Integration not found',
      }),
      serverError: ApiInternalServerErrorResponse({
        description: 'Internal server error during connection test',
      }),
    },
  },
};
