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
 * Swagger documentation for connection management endpoints
 *
 * Service Architecture:
 * These operations are handled through service delegation:
 * 1. IntegrationsController → IntegrationsService (orchestration)
 * 2. IntegrationsService → ConnectionManagementService (specialized operations)
 * 3. ConnectionManagementService → ConnectionStatusService (status operations)
 *
 * This architecture provides:
 * - Clear separation of concerns between services
 * - Consistent error handling across operations
 * - Improved maintainability and testability
 * - Scalable service composition
 */
export const ConnectionManagementSwaggerDocs = {
  getAllConnections: {
    operation: ApiOperation({
      summary: 'Get all connections',
      description: `Retrieves all integration connections with optional filtering using the ConnectionManagementService. This endpoint:
      • Lists all active and inactive connections across all projects
      • Supports filtering by status, tool type, and project ID
      • Returns connection details including sync status and configuration
      • Delegates to ConnectionStatusService for status information
      • Uses ConnectionResponseHelper for consistent response formatting

      **Service Flow**: IntegrationsController → IntegrationsService → ConnectionManagementService → ConnectionStatusService`,
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
      description: `Retrieves detailed information about a specific connection using the ConnectionManagementService. This endpoint:
      • Returns complete connection configuration and metadata
      • Shows current sync status and statistics
      • Includes connection health information and diagnostics
      • Provides last sync details and next sync schedule
      • Uses ConnectionResponseHelper for consistent response formatting

      **Service Flow**: IntegrationsController → IntegrationsService → ConnectionManagementService → ConnectionStatusService`,
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
      description: `Updates the status of a connection using the ConnectionManagementService. This endpoint:
      • Changes connection status (connected, disconnected, error, etc.)
      • Optionally records a reason for the status change in connection config
      • Updates connection metadata and timestamps
      • Delegates to ConnectionStatusService for status validation and mapping
      • Triggers appropriate connection lifecycle events

      **Service Flow**: IntegrationsController → IntegrationsService → ConnectionManagementService → ConnectionStatusService`,
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
      description: `Disconnects a tool integration using the ConnectionManagementService. This endpoint:
      • Delegates to IntegrationsCoreService for graceful tool disconnection
      • Performs tool-specific cleanup operations through ConnectionLifecycleService
      • Updates connection status to 'INACTIVE' in the database
      • Preserves connection configuration for potential reconnection
      • Handles connection removal from active connection pool

      **Service Flow**: IntegrationsController → IntegrationsService → ConnectionManagementService → IntegrationsCoreService`,
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
      description: `Reconnects a previously disconnected tool using the ConnectionManagementService. This endpoint:
      • Retrieves stored connection configuration and credentials
      • Delegates to IntegrationsCoreService for reconnection attempt
      • Uses ConnectionLifecycleService for credential validation and testing
      • Updates connection status based on reconnection result (ACTIVE/ERROR)
      • Stores reconnection metadata including attempt timestamp and result message
      • Resumes normal sync operations if successful

      **Service Flow**: IntegrationsController → IntegrationsService → ConnectionManagementService → IntegrationsCoreService → ConnectionLifecycleService`,
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
};
