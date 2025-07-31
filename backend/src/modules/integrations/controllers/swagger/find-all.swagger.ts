import {
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { IntegrationEntity } from '../../entities';

export const FindAllSwaggerDocs = {
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
};
