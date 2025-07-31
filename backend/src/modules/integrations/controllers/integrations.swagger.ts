import {
  ApiBadRequestResponse,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { ConnectionResponseDto, SyncResultDto } from '../dto';
import { IntegrationEntity } from '../entities';
import { CrudSwaggerDocs } from './integrations-crud.swagger';
import { AdvancedSwaggerDocs } from './swagger/advanced.swagger';

// Swagger decorators for the integrations controller methods
export const SwaggerDocs = {
  // Re-export CRUD operations
  ...CrudSwaggerDocs,

  connectTool: {
    operation: ApiOperation({
      summary: 'Connect to external tool',
      description: `Establishes a connection to an external project management or collaboration tool. This endpoint:
      • Validates tool type and credentials
      • Tests the connection to ensure it's working
      • Creates a connection pool entry for ongoing sync
      • Returns connection status and configuration
      • Supports multiple tool types (Jira, Asana, Trello, Monday.com, Bitrix24)`,
    }),
    body: ApiBody({
      description: 'Tool connection configuration',
      examples: {
        jira: {
          summary: 'Jira Connection',
          description: 'Example of connecting to Jira',
          value: {
            toolType: 'JIRA',
            credentials: {
              baseUrl: 'https://company.atlassian.net',
              username: 'user@company.com',
              apiToken: 'ATATT3xFfGF0...',
            },
          },
        },
        asana: {
          summary: 'Asana Connection',
          description: 'Example of connecting to Asana',
          value: {
            toolType: 'ASANA',
            credentials: {
              accessToken: '1/1234567890:abcdef...',
            },
          },
        },
        trello: {
          summary: 'Trello Connection',
          description: 'Example of connecting to Trello',
          value: {
            toolType: 'TRELLO',
            credentials: {
              apiKey: 'a1b2c3d4e5f6...',
              token: '1a2b3c4d5e6f...',
            },
          },
        },
      },
    }),
    responses: {
      success: ApiResponse({
        status: 201,
        description: 'Tool connected successfully',
        type: ConnectionResponseDto,
      }),
      badRequest: ApiBadRequestResponse({
        description: 'Invalid tool type or credentials',
        schema: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Invalid credentials' },
            message: {
              type: 'string',
              example: 'Missing required JIRA credentials',
            },
            statusCode: { type: 'number', example: 400 },
          },
        },
      }),
      serverError: ApiInternalServerErrorResponse({
        description: 'Connection failed due to internal error',
      }),
    },
  },

  syncData: {
    operation: ApiOperation({
      summary: 'Sync data from integration',
      description: `Synchronizes data from an external tool integration. This endpoint:
      • Fetches latest data from the connected tool
      • Transforms and validates the data
      • Updates local database with synchronized records
      • Handles conflicts and error recovery
      • Returns sync statistics and any errors encountered`,
    }),
    param: ApiParam({
      name: 'connectionId',
      description: 'Unique identifier of the connection to sync',
      example: 'jira_1640995200000_abc123',
      type: 'string',
    }),
    responses: {
      success: ApiResponse({
        status: 200,
        description: 'Data synchronized successfully',
        type: SyncResultDto,
      }),
      notFound: ApiNotFoundResponse({
        description: 'Connection not found',
        schema: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Connection not found' },
            message: {
              type: 'string',
              example: 'No active connection found with the provided ID',
            },
            statusCode: { type: 'number', example: 404 },
          },
        },
      }),
      serverError: ApiInternalServerErrorResponse({
        description: 'Sync failed due to internal error',
      }),
    },
  },

  findByTypeAndProject: {
    operation: ApiOperation({
      summary: 'Find integrations by type and project',
      description: `Retrieves integrations filtered by tool type and project. This endpoint:
      • Filters integrations by specific tool type (Jira, Asana, etc.)
      • Scopes results to a specific project
      • Returns detailed integration information
      • Useful for project-specific integration management
      • Supports integration discovery and configuration`,
    }),
    param: {
      type: ApiParam({
        name: 'type',
        description: 'Integration tool type to filter by',
        example: 'JIRA',
        enum: ['JIRA', 'ASANA', 'TRELLO', 'MONDAY', 'BITRIX24'],
        type: 'string',
      }),
      projectId: ApiParam({
        name: 'projectId',
        description: 'Project ID to filter integrations for',
        example: 'proj_123456789',
        type: 'string',
      }),
    },
    responses: {
      success: ApiResponse({
        status: 200,
        description: 'Integrations found successfully',
        type: [IntegrationEntity],
      }),
      badRequest: ApiBadRequestResponse({
        description: 'Invalid tool type or project ID',
      }),
      serverError: ApiInternalServerErrorResponse({
        description: 'Failed to retrieve integrations',
      }),
    },
  },

  // Connection Management Swagger Documentation
  ...AdvancedSwaggerDocs,
};
