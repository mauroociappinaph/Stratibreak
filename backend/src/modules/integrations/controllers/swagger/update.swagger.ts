import {
  ApiBadRequestResponse,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { IntegrationEntity } from '../../entities';

export const UpdateSwaggerDocs = {
  operation: ApiOperation({
    summary: 'Update integration configuration',
    description: `Updates an existing integration configuration. This endpoint:
    • Allows partial updates of integration properties
    • Validates updated configuration parameters
    • Maintains integration history and audit trail
    • Updates modification timestamp automatically
    • Supports configuration changes without affecting active connections`,
  }),
  param: ApiParam({
    name: 'id',
    description: 'Unique identifier of the integration to update',
    example: 'int_987654321',
    type: 'string',
  }),
  body: ApiBody({
    description: 'Integration data to update (partial update supported)',
    examples: {
      updateName: {
        summary: 'Update Name',
        description: 'Example of updating only the integration name',
        value: {
          name: 'Updated Jira Instance Name',
        },
      },
      updateConfig: {
        summary: 'Update Configuration',
        description: 'Example of updating integration configuration',
        value: {
          config: {
            baseUrl: 'https://newcompany.atlassian.net',
            timeout: 45000,
            retryAttempts: 5,
          },
        },
      },
      updateDescription: {
        summary: 'Update Description',
        description: 'Example of updating the description',
        value: {
          description: 'Updated description for the integration',
        },
      },
      deactivateIntegration: {
        summary: 'Deactivate Integration',
        description: 'Example of deactivating an integration',
        value: {
          isActive: false,
        },
      },
    },
  }),
  responses: {
    success: ApiResponse({
      status: 200,
      description: 'Integration updated successfully',
      type: IntegrationEntity,
    }),
    badRequest: ApiBadRequestResponse({
      description: 'Invalid update data',
      schema: {
        type: 'object',
        properties: {
          error: { type: 'string', example: 'Validation failed' },
          message: {
            type: 'array',
            items: { type: 'string' },
            example: ['type must be a valid enum value'],
          },
          statusCode: { type: 'number', example: 400 },
        },
      },
    }),
    notFound: ApiNotFoundResponse({
      description: 'Integration not found',
    }),
    serverError: ApiInternalServerErrorResponse({
      description: 'Internal server error during integration update',
    }),
  },
};
