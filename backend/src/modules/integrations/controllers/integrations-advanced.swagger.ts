import {
  ApiBadRequestResponse,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

export const AdvancedSwaggerDocs = {
  validateDataConsistency: {
    operation: ApiOperation({
      summary: 'Validate data consistency between local and external data',
      description: `Validates consistency between local and external tool data. This endpoint:
      • Compares local data with external tool data
      • Identifies inconsistencies and conflicts
      • Calculates confidence scores for data accuracy
      • Provides detailed inconsistency reports
      • Helps maintain data integrity across systems`,
    }),
    body: ApiBody({
      description: 'Data consistency validation request',
      schema: {
        type: 'object',
        properties: {
          localData: {
            type: 'object',
            description: 'Local data to validate',
            additionalProperties: true,
          },
          externalData: {
            type: 'object',
            description: 'External data to compare against',
            additionalProperties: true,
          },
        },
        required: ['localData', 'externalData'],
      },
      examples: {
        taskComparison: {
          summary: 'Task Data Comparison',
          description: 'Example of validating task data consistency',
          value: {
            localData: {
              id: 'task-123',
              title: 'Implement user authentication',
              status: 'In Progress',
              assignee: 'john.doe@company.com',
              priority: 'High',
            },
            externalData: {
              id: 'PROJ-123',
              summary: 'Implement user authentication',
              status: 'In Progress',
              assignee: { emailAddress: 'john.doe@company.com' },
              priority: { name: 'High' },
            },
          },
        },
      },
    }),
    responses: {
      success: ApiResponse({
        status: 200,
        description: 'Data consistency validation completed',
        schema: {
          type: 'object',
          properties: {
            isValid: {
              type: 'boolean',
              description: 'Whether the data is consistent',
            },
            inconsistencies: {
              type: 'array',
              items: { type: 'string' },
              description: 'List of identified inconsistencies',
            },
            confidence: {
              type: 'number',
              minimum: 0,
              maximum: 1,
              description: 'Confidence score for the validation',
            },
          },
        },
      }),
      badRequest: ApiBadRequestResponse({
        description: 'Invalid validation request',
      }),
      serverError: ApiInternalServerErrorResponse({
        description: 'Validation failed due to internal error',
      }),
    },
  },

  handleIntegrationFailure: {
    operation: ApiOperation({
      summary: 'Handle integration failure and determine recovery action',
      description: `Handles integration failures and determines appropriate recovery actions. This endpoint:
      • Analyzes the type and severity of integration errors
      • Determines if the error is retryable or requires manual intervention
      • Calculates appropriate retry delays and maximum retry attempts
      • Provides recovery recommendations and fallback strategies
      • Helps maintain integration resilience and reliability`,
    }),
    body: ApiBody({
      description: 'Integration error information',
      schema: {
        type: 'object',
        properties: {
          connectionId: {
            type: 'string',
            description: 'ID of the failed connection',
          },
          errorType: {
            type: 'string',
            enum: [
              'authentication',
              'authorization',
              'network',
              'timeout',
              'rate_limit',
              'validation',
              'system',
            ],
            description: 'Type of error that occurred',
          },
          message: {
            type: 'string',
            description: 'Error message details',
          },
          timestamp: {
            type: 'string',
            format: 'date-time',
            description: 'When the error occurred',
          },
          retryable: {
            type: 'boolean',
            description: 'Whether the error is potentially retryable',
          },
        },
        required: ['connectionId', 'errorType', 'message', 'retryable'],
      },
    }),
    responses: {
      success: ApiResponse({
        status: 200,
        description: 'Recovery action determined successfully',
        schema: {
          type: 'object',
          properties: {
            action: {
              type: 'string',
              enum: ['retry', 'manual_intervention'],
              description: 'Recommended recovery action',
            },
            delay: {
              type: 'number',
              description: 'Delay in milliseconds before retry (if applicable)',
            },
            maxRetries: {
              type: 'number',
              description: 'Maximum number of retry attempts (if applicable)',
            },
          },
        },
      }),
      badRequest: ApiBadRequestResponse({
        description: 'Invalid error information',
      }),
      serverError: ApiInternalServerErrorResponse({
        description: 'Failed to determine recovery action',
      }),
    },
  },
};
