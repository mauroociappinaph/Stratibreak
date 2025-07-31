import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { IntegrationEntity } from '../../entities';

export const FindOneSwaggerDocs = {
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
};
