import {
  ApiBadRequestResponse,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { PredictionEntity } from '../entities';

// Swagger decorators for CRUD operations
export const CrudSwaggerDocs = {
  create: {
    operation: ApiOperation({
      summary: 'Create a new prediction',
      description:
        'Creates a new prediction record for a specific project. This endpoint allows manual creation of prediction entries with specified type, probability, and impact.',
    }),
    body: ApiBody({
      description: 'Prediction data to create',
      examples: {
        riskPrediction: {
          summary: 'Risk Prediction Example',
          description: 'Example of a risk-based prediction',
          value: {
            projectId: 'proj_123456789',
            type: 'risk',
            title: 'Resource Shortage Risk',
            description:
              'High probability of resource shortage in the next sprint based on current velocity trends',
            probability: 0.85,
            impact: 'high',
            timeToOccurrence: {
              value: 5,
              unit: 'days',
            },
          },
        },
        performancePrediction: {
          summary: 'Performance Prediction Example',
          description: 'Example of a performance-related prediction',
          value: {
            projectId: 'proj_123456789',
            type: 'performance',
            title: 'Velocity Decline Prediction',
            description:
              'Team velocity is predicted to decline by 20% in the next iteration',
            probability: 0.72,
            impact: 'medium',
            timeToOccurrence: {
              value: 2,
              unit: 'weeks',
            },
          },
        },
      },
    }),
    responses: {
      success: ApiResponse({
        status: 201,
        description: 'Prediction created successfully',
        type: PredictionEntity,
      }),
      badRequest: ApiBadRequestResponse({
        description: 'Invalid input data',
      }),
      serverError: ApiInternalServerErrorResponse({
        description: 'Internal server error',
      }),
    },
  },

  findAll: {
    operation: ApiOperation({
      summary: 'Get all predictions',
      description:
        'Retrieves a list of all prediction records across all projects. Results are ordered by creation date (newest first) and include probability and impact assessments.',
    }),
    responses: {
      success: ApiResponse({
        status: 200,
        description: 'List of predictions retrieved successfully',
        type: [PredictionEntity],
      }),
      serverError: ApiInternalServerErrorResponse({
        description: 'Internal server error',
      }),
    },
  },

  findOne: {
    operation: ApiOperation({
      summary: 'Get prediction by ID',
      description:
        'Retrieves a specific prediction record by its unique identifier, including all associated metadata and confidence scores.',
    }),
    param: ApiParam({
      name: 'id',
      description: 'Unique identifier of the prediction',
      example: 'pred_987654321',
      type: 'string',
    }),
    responses: {
      success: ApiResponse({
        status: 200,
        description: 'Prediction found successfully',
        type: PredictionEntity,
      }),
      notFound: ApiNotFoundResponse({
        description: 'Prediction not found',
      }),
      serverError: ApiInternalServerErrorResponse({
        description: 'Internal server error',
      }),
    },
  },

  update: {
    operation: ApiOperation({
      summary: 'Update prediction',
      description:
        'Updates an existing prediction record. Only provided fields will be updated. Useful for adjusting probability scores or impact assessments based on new data.',
    }),
    param: ApiParam({
      name: 'id',
      description: 'Unique identifier of the prediction to update',
      example: 'pred_987654321',
      type: 'string',
    }),
    body: ApiBody({
      description: 'Prediction data to update',
      examples: {
        updateProbability: {
          summary: 'Update Probability',
          description: 'Example of updating the probability score',
          value: { probability: 0.92 },
        },
        updateImpact: {
          summary: 'Update Impact Level',
          description: 'Example of updating the impact assessment',
          value: { impact: 'critical' },
        },
        updateDescription: {
          summary: 'Update Description',
          description: 'Example of updating the prediction description',
          value: {
            description:
              'Updated prediction with additional context from recent sprint data',
          },
        },
      },
    }),
    responses: {
      success: ApiResponse({
        status: 200,
        description: 'Prediction updated successfully',
        type: PredictionEntity,
      }),
      badRequest: ApiBadRequestResponse({
        description: 'Invalid input data',
      }),
      notFound: ApiNotFoundResponse({
        description: 'Prediction not found',
      }),
      serverError: ApiInternalServerErrorResponse({
        description: 'Internal server error',
      }),
    },
  },

  remove: {
    operation: ApiOperation({
      summary: 'Delete prediction',
      description:
        'Permanently deletes a prediction record. This action cannot be undone and will remove all associated prediction data.',
    }),
    param: ApiParam({
      name: 'id',
      description: 'Unique identifier of the prediction to delete',
      example: 'pred_987654321',
      type: 'string',
    }),
    responses: {
      success: ApiResponse({
        status: 204,
        description: 'Prediction deleted successfully',
      }),
      notFound: ApiNotFoundResponse({
        description: 'Prediction not found',
      }),
      serverError: ApiInternalServerErrorResponse({
        description: 'Internal server error',
      }),
    },
  },

  generatePredictions: {
    operation: ApiOperation({
      summary: 'Generate predictions for a project',
      description: `Automatically generates AI-powered predictions for a specific project. This endpoint:
      • Analyzes historical project data and patterns
      • Applies machine learning models to predict future issues
      • Calculates probability scores and impact assessments
      • Generates actionable early warnings
      • Provides confidence intervals for predictions`,
    }),
    param: ApiParam({
      name: 'projectId',
      description:
        'Unique identifier of the project to generate predictions for',
      example: 'proj_123456789',
      type: 'string',
    }),
    responses: {
      success: ApiResponse({
        status: 201,
        description: 'Predictions generated successfully',
        type: [PredictionEntity],
      }),
      badRequest: ApiBadRequestResponse({
        description: 'Invalid project ID or insufficient data for predictions',
      }),
      notFound: ApiNotFoundResponse({
        description: 'Project not found',
      }),
      serverError: ApiInternalServerErrorResponse({
        description: 'Prediction generation failed due to internal error',
      }),
    },
  },

  findByProject: {
    operation: ApiOperation({
      summary: 'Get predictions by project',
      description:
        'Retrieves all prediction records for a specific project, ordered by probability (highest first) and including trend analysis.',
    }),
    param: ApiParam({
      name: 'projectId',
      description: 'Unique identifier of the project to get predictions for',
      example: 'proj_123456789',
      type: 'string',
    }),
    responses: {
      success: ApiResponse({
        status: 200,
        description: 'Project predictions retrieved successfully',
        type: [PredictionEntity],
      }),
      notFound: ApiNotFoundResponse({
        description: 'Project not found or no predictions available',
      }),
      serverError: ApiInternalServerErrorResponse({
        description: 'Failed to retrieve project predictions',
      }),
    },
  },
};
