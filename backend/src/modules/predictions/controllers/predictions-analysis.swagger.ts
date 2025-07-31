import {
  ApiBadRequestResponse,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { PredictFutureIssuesDto } from '../dto';

// Swagger decorators for analysis endpoints
export const AnalysisSwaggerDocs = {
  predictFutureIssues: {
    operation: ApiOperation({
      summary: 'Predict future issues based on historical data',
      description: `Advanced AI-powered prediction engine that analyzes historical project data to predict potential future issues. This endpoint:
      • Uses machine learning algorithms to identify patterns in historical data
      • Predicts issues with 72+ hour advance warning
      • Calculates probability scores and confidence intervals
      • Provides estimated time to occurrence for each predicted issue
      • Generates actionable prevention strategies
      • Analyzes trends, events, and patterns to improve prediction accuracy`,
    }),
    body: ApiBody({
      description: 'Historical data for prediction analysis',
      type: PredictFutureIssuesDto,
      examples: {
        comprehensiveAnalysis: {
          summary: 'Comprehensive Historical Analysis',
          description:
            'Example with full historical data for accurate predictions',
          value: {
            projectId: 'proj_123456789',
            timeRange: {
              startDate: '2024-01-01T00:00:00Z',
              endDate: '2024-07-31T23:59:59Z',
            },
            metrics: [
              {
                name: 'velocity',
                values: [
                  { timestamp: '2024-07-01T00:00:00Z', value: 25 },
                  { timestamp: '2024-07-08T00:00:00Z', value: 22 },
                  { timestamp: '2024-07-15T00:00:00Z', value: 18 },
                  { timestamp: '2024-07-22T00:00:00Z', value: 15 },
                ],
                unit: 'story_points',
              },
              {
                name: 'bug_rate',
                values: [
                  { timestamp: '2024-07-01T00:00:00Z', value: 0.05 },
                  { timestamp: '2024-07-08T00:00:00Z', value: 0.08 },
                  { timestamp: '2024-07-15T00:00:00Z', value: 0.12 },
                  { timestamp: '2024-07-22T00:00:00Z', value: 0.18 },
                ],
                unit: 'bugs_per_story',
              },
            ],
            events: [
              {
                timestamp: '2024-07-10T14:30:00Z',
                type: 'team_change',
                description: 'Senior developer left the team',
                impact: 'high',
              },
              {
                timestamp: '2024-07-20T09:00:00Z',
                type: 'scope_change',
                description: 'Major feature requirements changed',
                impact: 'medium',
              },
            ],
            patterns: [
              {
                patternType: 'velocity_decline',
                frequency: 0.8,
                confidence: 0.92,
                description: 'Consistent velocity decline over 4 weeks',
              },
            ],
          },
        },
      },
    }),
    responses: {
      success: ApiResponse({
        status: 200,
        description: 'Future issues predicted successfully',
        schema: {
          type: 'object',
          properties: {
            projectId: { type: 'string', example: 'proj_123456789' },
            predictions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  issueType: {
                    type: 'string',
                    example: 'resource_shortage',
                    description: 'Type of predicted issue',
                  },
                  probability: {
                    type: 'number',
                    example: 0.85,
                    description: 'Probability of occurrence (0-1)',
                  },
                  estimatedTimeToOccurrence: {
                    type: 'object',
                    properties: {
                      value: { type: 'number', example: 5 },
                      unit: { type: 'string', example: 'days' },
                    },
                    description: 'Estimated time until issue occurs',
                  },
                  potentialImpact: {
                    type: 'string',
                    example: 'high',
                    enum: ['low', 'medium', 'high', 'critical'],
                    description: 'Expected impact level',
                  },
                  preventionWindow: {
                    type: 'object',
                    properties: {
                      value: { type: 'number', example: 3 },
                      unit: { type: 'string', example: 'days' },
                    },
                    description: 'Time window available for prevention',
                  },
                  suggestedActions: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'string', example: 'action_001' },
                        title: {
                          type: 'string',
                          example: 'Hire additional developer',
                        },
                        description: {
                          type: 'string',
                          example:
                            'Bring in a senior developer to maintain velocity',
                        },
                        priority: {
                          type: 'string',
                          example: 'high',
                          enum: ['low', 'medium', 'high', 'critical'],
                        },
                        estimatedEffort: {
                          type: 'string',
                          example: '2-3 weeks',
                        },
                        requiredResources: {
                          type: 'array',
                          items: { type: 'string' },
                          example: ['HR team', 'Budget approval'],
                        },
                        expectedImpact: {
                          type: 'string',
                          example: 'Maintains current velocity',
                        },
                      },
                    },
                  },
                },
              },
            },
            analysisTimestamp: {
              type: 'string',
              format: 'date-time',
              example: '2024-07-31T15:30:00Z',
            },
          },
        },
      }),
      badRequest: ApiBadRequestResponse({
        description:
          'Invalid historical data or insufficient data for analysis',
      }),
      serverError: ApiInternalServerErrorResponse({
        description: 'Prediction analysis failed due to internal error',
      }),
    },
  },
};
