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
    description: `Tests the connection to an external tool using the integration configuration. This endpoint:
    • Validates the integration configuration and credentials
    • Uses ConnectionSetupService to create tool-specific connection config
    • Performs live connectivity test to the external tool
    • Validates tool-specific credential requirements (API tokens, URLs, etc.)
    • Returns detailed success/failure information with specific error messages

    **Service Architecture**: This operation uses the ConnectionSetupService internally
    to validate tool types, create connection configurations, and test tool connectivity.`,
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
