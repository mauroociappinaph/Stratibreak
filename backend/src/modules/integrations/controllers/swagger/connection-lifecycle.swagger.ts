import {
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

/**
 * Swagger documentation for connection lifecycle management endpoints
 * These operations are handled by the ConnectionLifecycleService
 */
export const ConnectionLifecycleSwaggerDocs = {
  disconnectTool: {
    operation: ApiOperation({
      summary: 'Disconnect tool connection',
      description: `Gracefully disconnects a tool integration using the ConnectionLifecycleService. This endpoint:
      • Performs proper cleanup operations for the specific tool type
      • Closes active connections and releases resources
      • Updates connection status to disconnected
      • Preserves connection configuration for potential reconnection
      • Handles tool-specific disconnection procedures (JIRA, Asana, Trello, etc.)

      **Service Architecture**: This operation is delegated to the ConnectionLifecycleService
      which specializes in connection state management and cleanup procedures.`,
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
        schema: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: {
              type: 'string',
              example: 'Tool disconnected successfully',
            },
          },
        },
      }),
      notFound: ApiNotFoundResponse({
        description: 'Connection not found',
        schema: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Connection not found' },
          },
        },
      }),
      serverError: ApiInternalServerErrorResponse({
        description: 'Failed to disconnect tool',
        schema: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Disconnection failed' },
          },
        },
      }),
    },
  },

  reconnectTool: {
    operation: ApiOperation({
      summary: 'Reconnect tool connection',
      description: `Reconnects a previously disconnected tool using the ConnectionLifecycleService. This endpoint:
      • Validates stored or provided credentials using ConnectionSetupService validation
      • Creates updated connection configuration with tool-specific settings
      • Tests the connection before marking as active to ensure connectivity
      • Updates connection configuration and metadata with new settings
      • Resumes normal sync operations if successful
      • Handles tool-specific reconnection procedures for each supported tool type

      **Service Architecture**: This operation uses the ConnectionLifecycleService
      to manage the reconnection process, which internally leverages ConnectionSetupService
      for credential validation and connection configuration creation.`,
    }),
    param: ApiParam({
      name: 'connectionId',
      description: 'Unique identifier of the connection to reconnect',
      example: 'jira_1640995200000_abc123',
      type: 'string',
    }),
    body: ApiBody({
      description:
        'Optional credentials for reconnection (uses stored credentials if not provided)',
      required: false,
      schema: {
        type: 'object',
        properties: {
          credentials: {
            type: 'object',
            description: 'Tool-specific credentials',
            examples: {
              jira: {
                baseUrl: 'https://company.atlassian.net',
                username: 'user@company.com',
                apiToken: 'ATATT3xFfGF0...',
              },
              asana: {
                accessToken: '1/1234567890:abcdef...',
              },
              trello: {
                apiKey: 'a1b2c3d4e5f6...',
                token: '1a2b3c4d5e6f...',
              },
            },
          },
        },
      },
    }),
    responses: {
      success: ApiResponse({
        status: 200,
        description: 'Tool reconnected successfully',
        schema: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: {
              type: 'string',
              example: 'Tool reconnected successfully',
            },
          },
        },
      }),
      notFound: ApiNotFoundResponse({
        description: 'Original connection not found',
        schema: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: {
              type: 'string',
              example: 'Original connection not found',
            },
          },
        },
      }),
      serverError: ApiInternalServerErrorResponse({
        description: 'Failed to reconnect tool',
        schema: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Reconnection failed' },
          },
        },
      }),
    },
  },

  checkConnectionHealth: {
    operation: ApiOperation({
      summary: 'Check connection health status',
      description: `Performs a comprehensive health check using the ConnectionLifecycleService. This endpoint:
      • Executes live connectivity tests to the external tool
      • Measures response time and connection quality
      • Analyzes connection status and error conditions
      • Returns detailed health information and diagnostics
      • Provides troubleshooting information for failed connections

      **Service Architecture**: This operation leverages the ConnectionLifecycleService
      to perform tool-specific health checks and provide detailed diagnostic information.`,
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
              description: 'Unique identifier of the connection',
            },
            status: {
              type: 'string',
              enum: ['healthy', 'unhealthy'],
              example: 'healthy',
              description: 'Overall health status of the connection',
            },
            lastChecked: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-15T10:30:00Z',
              description: 'Timestamp of the health check',
            },
            responseTime: {
              type: 'number',
              example: 250,
              description: 'Response time in milliseconds',
            },
            message: {
              type: 'string',
              example: 'Connection is healthy',
              description: 'Human-readable status message',
            },
            details: {
              type: 'object',
              description: 'Additional diagnostic information',
              properties: {
                lastSync: {
                  type: 'string',
                  format: 'date-time',
                  description: 'Last successful sync timestamp',
                },
                toolType: {
                  type: 'string',
                  description: 'Type of the connected tool',
                },
                currentOperation: {
                  type: 'string',
                  description: 'Current operation being performed',
                },
                lastError: {
                  type: 'string',
                  description: 'Last error message if connection is unhealthy',
                },
              },
            },
          },
        },
      }),
      notFound: ApiNotFoundResponse({
        description: 'Connection not found',
        schema: {
          type: 'object',
          properties: {
            connectionId: { type: 'string' },
            status: { type: 'string', example: 'unhealthy' },
            lastChecked: { type: 'string', format: 'date-time' },
            responseTime: { type: 'number', example: -1 },
            message: { type: 'string', example: 'Connection not found' },
          },
        },
      }),
      serverError: ApiInternalServerErrorResponse({
        description: 'Health check failed',
        schema: {
          type: 'object',
          properties: {
            connectionId: { type: 'string' },
            status: { type: 'string', example: 'unhealthy' },
            lastChecked: { type: 'string', format: 'date-time' },
            responseTime: { type: 'number', example: -1 },
            message: { type: 'string', example: 'Health check failed' },
          },
        },
      }),
    },
  },
};
