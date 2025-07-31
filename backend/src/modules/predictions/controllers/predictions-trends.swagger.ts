import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

// Swagger decorators for trend analysis endpoints
export const TrendsSwaggerDocs = {
  getTrendAnalysis: {
    operation: ApiOperation({
      summary: 'Get trend analysis for project',
      description: `Comprehensive trend analysis that identifies patterns, predicts future values, and provides actionable recommendations. This endpoint:
      • Analyzes historical trends across multiple metrics
      • Predicts future metric values with confidence intervals
      • Identifies significant trend changes and patterns
      • Provides recommendations based on trend analysis
      • Calculates trend strength and duration`,
    }),
    param: ApiParam({
      name: 'projectId',
      description: 'Unique identifier of the project for trend analysis',
      example: 'proj_123456789',
      type: 'string',
    }),
    responses: {
      success: ApiResponse({
        status: 200,
        description: 'Trend analysis retrieved successfully',
        schema: {
          type: 'object',
          properties: {
            projectId: { type: 'string', example: 'proj_123456789' },
            trends: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  metric: { type: 'string', example: 'velocity' },
                  direction: {
                    type: 'string',
                    example: 'declining',
                    enum: ['increasing', 'decreasing', 'stable', 'volatile'],
                  },
                  strength: {
                    type: 'number',
                    example: 0.8,
                    description: 'Trend strength (0-1)',
                  },
                  duration: {
                    type: 'object',
                    properties: {
                      value: { type: 'number', example: 4 },
                      unit: { type: 'string', example: 'weeks' },
                    },
                  },
                  significance: {
                    type: 'number',
                    example: 0.92,
                    description: 'Statistical significance (0-1)',
                  },
                  description: {
                    type: 'string',
                    example: 'Strong declining trend over 4 weeks',
                  },
                },
              },
            },
            predictions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  metric: { type: 'string', example: 'velocity' },
                  predictedValue: { type: 'number', example: 12 },
                  timeHorizon: {
                    type: 'object',
                    properties: {
                      value: { type: 'number', example: 2 },
                      unit: { type: 'string', example: 'weeks' },
                    },
                  },
                  confidence: {
                    type: 'number',
                    example: 0.85,
                    description: 'Prediction confidence (0-1)',
                  },
                  bounds: {
                    type: 'object',
                    properties: {
                      lower: { type: 'number', example: 10 },
                      upper: { type: 'number', example: 14 },
                    },
                    description: 'Confidence interval bounds',
                  },
                },
              },
            },
            recommendations: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  priority: {
                    type: 'string',
                    example: 'high',
                    enum: ['low', 'medium', 'high', 'critical'],
                  },
                  action: {
                    type: 'string',
                    example: 'Address velocity decline',
                  },
                  rationale: {
                    type: 'string',
                    example: 'Velocity has declined 40% over 4 weeks',
                  },
                  expectedImpact: {
                    type: 'string',
                    example: 'Stabilize velocity at 20+ story points',
                  },
                  timeframe: {
                    type: 'object',
                    properties: {
                      value: { type: 'number', example: 1 },
                      unit: { type: 'string', example: 'week' },
                    },
                  },
                },
              },
            },
            confidenceLevel: {
              type: 'number',
              example: 0.88,
              description: 'Overall analysis confidence (0-1)',
            },
            analysisTimestamp: {
              type: 'string',
              format: 'date-time',
              example: '2024-07-31T15:30:00Z',
            },
          },
        },
      }),
      notFound: ApiNotFoundResponse({
        description:
          'Project not found or insufficient data for trend analysis',
      }),
      serverError: ApiInternalServerErrorResponse({
        description: 'Trend analysis failed due to internal error',
      }),
    },
  },
};
