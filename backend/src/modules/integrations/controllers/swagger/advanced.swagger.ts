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
 * Advanced Swagger documentation for connection management endpoints
 */
export const AdvancedSwaggerDocs = {
  getAllConnections: {
    operation: ApiOperation({
      summary: 'Get all connections',
      description: `Retrieves all integration connections with optional filtering. This endpoint:
      • Lists all active and inactive connections
      • Supports filtering by status, tool type, and project
      • Returns connection details including sync status and configuration
      • Useful for connection overview and management`,
    }),
    query: {
      status: {
        name: 'status',
        description: 'Filter by connection status',
        required: false,
        enum: ['connected', 'failed', 'pending', 'disconnected'],
      },
      toolType: {
        name: 'toolType',
        description: 'Filter by tool type',
        required: false,
        enum: ['JIRA', 'ASANA', 'TRELLO', 'MONDAY', 'BITRIX24'],
      },
      projectId: {
        name: 'projectId',
        description: 'Filter by project ID',
        required: false,
        type: 'string',
      },
    },
    responses: {
      success: ApiResponse({
        status: 200,
        description: 'Connections retrieved successfully',
        type: [ConnectionResponseDto],
      }),
      serverError: ApiInternalServerErrorResponse({
        description: 'Failed to retrieve connections',
      }),
    },
  },

  getConnection: {
    operation: ApiOperation({
      summary: 'Get connection details',
      description: `Retrieves detailed information about a specific connection. This endpoint:
      • Returns complete connection configuration
      • Shows current sync status and statistics
      • Includes connection health information
      • Provides last sync details and next sync schedule`,
    }),
    param: ApiParam({
      name: 'connectionId',
      description: 'Unique identifier of the connection',
      example: 'jira_1640995200000_abc123',
      type: 'string',
    }),
    responses: {
      success: ApiResponse({
        status: 200,
        description: 'Connection details retrieved successfully',
        type: ConnectionResponseDto,
      }),
      notFound: ApiNotFoundResponse({
        description: 'Connection not found',
      }),
      serverError: ApiInternalServerErrorResponse({
        description: 'Failed to retrieve connection details',
      }),
    },
  },

  updateConnectionStatus: {
    operation: ApiOperation({
      summary: 'Update connection status',
      description: `Updates the status of a connection. This endpoint:
      • Changes connection status (connected, disconnected, error, etc.)
      • Optionally records a reason for the status change
      • Updates connection metadata
      • Triggers appropriate connection lifecycle events`,
    }),
    param: ApiParam({
      name: 'connectionId',
      description: 'Unique identifier of the connection',
      example: 'jira_1640995200000_abc123',
      type: 'string',
    }),
    body: ApiBody({
      description: 'Status update information',
      schema: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            enum: ['connected', 'failed', 'pending', 'disconnected'],
            example: 'disconnected',
          },
          reason: {
            type: 'string',
            example: 'Manual disconnection by user',
            required: ['status'],
          },
        },
        required: ['status'],
      },
    }),
    responses: {
      success: ApiResponse({
        status: 200,
        description: 'Connection status updated successfully',
        type: ConnectionResponseDto,
      }),
      notFound: ApiNotFoundResponse({
        description: 'Connection not found',
      }),
      serverError: ApiInternalServerErrorResponse({
        description: 'Failed to update connection status',
      }),
    },
  },

  disconnectTool: {
    operation: ApiOperation({
      summary: 'Disconnect tool',
      description: `Disconnects a tool integration. This endpoint:
      • Gracefully closes the connection to the external tool
      • Performs cleanup operations
      • Updates connection status to disconnected
      • Preserves connection configuration for potential reconnection`,
    }),
    param: ApiParam({
      name: 'connectionId',
      description: 'Unique identifier of the connection to disconnect',
      example: 'jira_1640995200000_abc123',
      type: 'string',
    }),
    responses: {
      success: ApiResponse({
        status: 204,
        description: 'Tool disconnected successfully',
      }),
      notFound: ApiNotFoundResponse({
        description: 'Connection not found',
      }),
      serverError: ApiInternalServerErrorResponse({
        description: 'Failed to disconnect tool',
      }),
    },
  },

  reconnectTool: {
    operation: ApiOperation({
      summary: 'Reconnect tool',
      description: `Reconnects a previously disconnected tool. This endpoint:
      • Attempts to re-establish connection using stored credentials
      • Tests the connection before marking as active
      • Updates connection status and metadata
      • Resumes normal sync operations if successful`,
    }),
    param: ApiParam({
      name: 'connectionId',
      description: 'Unique identifier of the connection to reconnect',
      example: 'jira_1640995200000_abc123',
      type: 'string',
    }),
    responses: {
      success: ApiResponse({
        status: 200,
        description: 'Tool reconnected successfully',
        type: ConnectionResponseDto,
      }),
      notFound: ApiNotFoundResponse({
        description: 'Connection not found',
      }),
      serverError: ApiInternalServerErrorResponse({
        description: 'Failed to reconnect tool',
      }),
    },
  },

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
