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

/**
 * Comprehensive Swagger documentation for the Integrations API
 *
 * Service Architecture Overview:
 * ============================
 *
 * 1. IntegrationsService (Main Orchestrator)
 *    - Handles CRUD operations for integrations
 *    - Orchestrates calls to specialized services
 *    - Manages database operations through Prisma
 *
 * 2. IntegrationsCoreService (Core Logic)
 *    - Handles tool connectivity and validation
 *    - Manages connection pooling and configuration
 *    - Coordinates with specialized services for complex operations
 *
 * 3. ConnectionLifecycleService (Connection Management)
 *    - Specializes in connection state transitions
 *    - Handles connect/disconnect/reconnect operations
 *    - Performs tool-specific cleanup and health checks
 *
 * 4. SyncHistoryService (Data Synchronization)
 *    - Manages sync operation history and statistics
 *    - Stores and retrieves sync results
 *    - Provides sync analytics and reporting
 *
 * API Endpoint Categories:
 * =======================
 * - CRUD Operations: Basic integration management
 * - Connection Management: Tool connectivity and status
 * - Lifecycle Operations: Connect/disconnect/reconnect workflows
 * - Monitoring: Health checks and sync history
 * - Configuration: Connection settings and data mapping
 */

// Swagger decorators for the integrations controller methods
export const SwaggerDocs = {
  // Re-export CRUD operations
  ...CrudSwaggerDocs,

  connectTool: {
    operation: ApiOperation({
      summary: 'Connect to external tool',
      description: `Establishes a connection to an external project management or collaboration tool. This endpoint:
      • Validates tool type using ConnectionSetupService.isValidToolType()
      • Creates tool-specific connection configuration with proper timeouts and retry settings
      • Tests the connection to ensure credentials are valid and tool is accessible
      • Creates a connection pool entry for ongoing sync operations
      • Returns connection status and configuration details
      • Supports multiple tool types (Jira, Asana, Trello, Monday.com, Bitrix24)

      **Service Architecture**: This operation leverages the ConnectionSetupService
      for tool validation, configuration creation, and connection testing before
      establishing the final connection through the IntegrationsCoreService.`,
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
