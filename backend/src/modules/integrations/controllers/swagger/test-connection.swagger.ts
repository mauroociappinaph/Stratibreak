import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

export const TestConnectionSwaggerDocs = {
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
};
