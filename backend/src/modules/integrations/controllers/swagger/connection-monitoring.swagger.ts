import {
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { ConnectionResponseDto } from '../../dto';

/**
 * Swagger documentation for connection monitoring and configuration endpoints
 */
export const ConnectionMonitoringSwaggerDocs = {
  getConnectionHealth: {
    operation: ApiOperation({
      summary: 'Get connection health',
      description: `Checks the health status of a connection. This endpoint:
      • Performs a live connectivity test
      • Measures response time to the external tool
      • Returns detailed health information
      • Useful for monitoring and troubleshooting`,
    }),
    param: ApiParam({
      name: 'connectionId',
      description: 'Unique identifier of the connection to check',
      example: 'jira_1640995200000_abc123',
      type: 'string',
    }),
    responses: {
      success: ApiResponse({
        status: 200,
        description: 'Connection health retrieved successfully',
        schema: {
          type: 'object',
          properties: {
            connectionId: {
              type: 'string',
              example: 'jira_1640995200000_abc123',
            },
            status: { type: 'string', example: 'healthy' },
            lastChecked: { type: 'string', format: 'date-time' },
            responseTime: { type: 'number', example: 250 },
            message: { type: 'string', example: 'Connection is healthy' },
            details: { type: 'object' },
          },
        },
      }),
      notFound: ApiNotFoundResponse({
        description: 'Connection not found',
      }),
      serverError: ApiInternalServerErrorResponse({
        description: 'Failed to check connection health',
      }),
    },
  },

  updateConnectionConfig: {
    operation: ApiOperation({
      summary: 'Update connection configuration',
      description: `Updates the configuration of a connection. This endpoint:
      • Modifies sync frequency, data mapping, and filters
      • Validates configuration changes
      • Updates connection metadata
      • Applies changes to future sync operations`,
    }),
    param: ApiParam({
      name: 'connectionId',
      description: 'Unique identifier of the connection to update',
      example: 'jira_1640995200000_abc123',
      type: 'string',
    }),
    body: ApiBody({
      description: 'Configuration update information',
      schema: {
        type: 'object',
        properties: {
          syncFrequency: {
            type: 'number',
            example: 30,
            description: 'Sync frequency in minutes',
          },
          dataMapping: {
            type: 'array',
            items: { type: 'object' },
            description: 'Data field mapping configuration',
          },
          filters: {
            type: 'object',
            description: 'Sync filters and conditions',
          },
        },
      },
    }),
    responses: {
      success: ApiResponse({
        status: 200,
        description: 'Connection configuration updated successfully',
        type: ConnectionResponseDto,
      }),
      notFound: ApiNotFoundResponse({
        description: 'Connection not found',
      }),
      serverError: ApiInternalServerErrorResponse({
        description: 'Failed to update connection configuration',
      }),
    },
  },

  getSyncHistory: {
    operation: ApiOperation({
      summary: 'Get sync history',
      description: `Retrieves the synchronization history for a connection. This endpoint:
      • Lists past sync operations with details
      • Shows sync statistics and error information
      • Supports pagination for large histories
      • Useful for monitoring and troubleshooting sync issues`,
    }),
    param: ApiParam({
      name: 'connectionId',
      description: 'Unique identifier of the connection',
      example: 'jira_1640995200000_abc123',
      type: 'string',
    }),
    query: {
      limit: {
        name: 'limit',
        description: 'Maximum number of sync records to return',
        required: false,
        type: 'number',
        example: 10,
      },
      offset: {
        name: 'offset',
        description: 'Number of sync records to skip',
        required: false,
        type: 'number',
        example: 0,
      },
    },
    responses: {
      success: ApiResponse({
        status: 200,
        description: 'Sync history retrieved successfully',
        schema: {
          type: 'object',
          properties: {
            connectionId: { type: 'string' },
            history: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  syncId: { type: 'string' },
                  startedAt: { type: 'string', format: 'date-time' },
                  completedAt: { type: 'string', format: 'date-time' },
                  status: { type: 'string' },
                  recordsProcessed: { type: 'number' },
                  recordsCreated: { type: 'number' },
                  recordsUpdated: { type: 'number' },
                  recordsSkipped: { type: 'number' },
                  errors: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        message: { type: 'string' },
                        recordId: { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
            totalCount: { type: 'number' },
          },
        },
      }),
      notFound: ApiNotFoundResponse({
        description: 'Connection not found',
      }),
      serverError: ApiInternalServerErrorResponse({
        description: 'Failed to retrieve sync history',
      }),
    },
  },
};
