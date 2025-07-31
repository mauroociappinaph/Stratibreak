import {
  ApiBadRequestResponse,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { GenerateEarlyWarningsDto } from '../dto';

// Swagger decorators for comprehensive warning endpoints
export const ComprehensiveSwaggerDocs = {
  generateComprehensiveWarnings: {
    operation: ApiOperation({
      summary: 'Generate comprehensive early warnings',
      description: `Advanced early warning system with comprehensive analysis using multiple data sources and correlation analysis. This endpoint:
      • Performs multi-dimensional risk analysis
      • Correlates data across different metrics and indicators
      • Generates comprehensive warnings with detailed context
      • Provides advanced prevention strategies
      • Uses machine learning for pattern recognition
      • Offers detailed impact assessments and mitigation plans`,
    }),
    body: ApiBody({
      description: 'Comprehensive trend data for advanced warning generation',
      type: GenerateEarlyWarningsDto,
      examples: {
        comprehensiveAnalysis: {
          summary: 'Comprehensive Multi-Source Analysis',
          description: 'Example with comprehensive data for advanced warnings',
          value: {
            projectId: 'proj_123456789',
            currentMetrics: [
              {
                name: 'velocity',
                currentValue: 15,
                previousValue: 25,
                changeRate: -0.4,
                trend: 'declining',
                unit: 'story_points',
              },
              {
                name: 'bug_rate',
                currentValue: 0.18,
                previousValue: 0.05,
                changeRate: 2.6,
                trend: 'increasing',
                unit: 'bugs_per_story',
              },
              {
                name: 'code_coverage',
                currentValue: 0.65,
                previousValue: 0.85,
                changeRate: -0.24,
                trend: 'declining',
                unit: 'percentage',
              },
            ],
            recentChanges: [
              {
                metric: 'team_size',
                changeType: 'decrease',
                magnitude: 0.2,
                timeframe: { value: 2, unit: 'weeks' },
                significance: 0.8,
              },
              {
                metric: 'requirements_stability',
                changeType: 'decrease',
                magnitude: 0.3,
                timeframe: { value: 1, unit: 'week' },
                significance: 0.9,
              },
            ],
            velocityIndicators: [
              {
                name: 'sprint_velocity',
                currentVelocity: 15,
                averageVelocity: 22,
                trend: 'declining',
                predictedVelocity: 12,
              },
              {
                name: 'story_completion_rate',
                currentVelocity: 0.7,
                averageVelocity: 0.9,
                trend: 'declining',
                predictedVelocity: 0.6,
              },
            ],
          },
        },
      },
    }),
    responses: {
      success: ApiResponse({
        status: 200,
        description: 'Comprehensive warnings generated successfully',
        schema: {
          type: 'object',
          properties: {
            projectId: { type: 'string', example: 'proj_123456789' },
            warnings: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string', example: 'warning_001' },
                  type: {
                    type: 'string',
                    example: 'comprehensive_risk',
                    description: 'Type of comprehensive warning',
                  },
                  severity: {
                    type: 'string',
                    example: 'critical',
                    enum: ['low', 'medium', 'high', 'critical'],
                  },
                  title: {
                    type: 'string',
                    example: 'Multi-Factor Project Risk Alert',
                  },
                  description: {
                    type: 'string',
                    example:
                      'Multiple risk factors detected: velocity decline, quality degradation, and team instability',
                  },
                  probability: {
                    type: 'number',
                    example: 0.95,
                    description: 'Probability of issue occurring (0-1)',
                  },
                  estimatedTimeToOccurrence: {
                    type: 'object',
                    properties: {
                      value: { type: 'number', example: 2 },
                      unit: { type: 'string', example: 'days' },
                    },
                  },
                  potentialImpact: {
                    type: 'string',
                    example: 'critical',
                    enum: ['low', 'medium', 'high', 'critical'],
                  },
                  preventionWindow: {
                    type: 'object',
                    properties: {
                      value: { type: 'number', example: 1 },
                      unit: { type: 'string', example: 'day' },
                    },
                  },
                  suggestedActions: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        title: { type: 'string' },
                        description: { type: 'string' },
                        priority: { type: 'string' },
                        estimatedEffort: { type: 'string' },
                        requiredResources: {
                          type: 'array',
                          items: { type: 'string' },
                        },
                        expectedImpact: { type: 'string' },
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
          'Invalid comprehensive data or insufficient metrics for analysis',
      }),
      serverError: ApiInternalServerErrorResponse({
        description:
          'Comprehensive warning generation failed due to internal error',
      }),
    },
  },
};
