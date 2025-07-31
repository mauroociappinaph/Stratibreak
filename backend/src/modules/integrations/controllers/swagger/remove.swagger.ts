import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

export const RemoveSwaggerDocs = {
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
};
