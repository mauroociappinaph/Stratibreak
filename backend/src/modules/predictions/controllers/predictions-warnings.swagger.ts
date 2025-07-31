import {
  ApiBadRequestResponse,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { GenerateEarlyWarningsDto } from '../dto';

// Swagger decorators for warning endpoints
export const WarningsSwaggerDocs = {
  generateEarlyWarnings: {
    operation: ApiOperation({
      summary: 'Generate early warning alerts',
      description: `Proactive early warning system that generates alerts based on current trends and velocity indicators. This endpoint:
      • Analyzes current project metrics and trends
      • Identifies potential issues before they become critical
      • Calculates probability and severity for each warning
      • Provides prevention time windows and suggested actions
      • Uses real-time data to generate immediate actionable alerts
      • Correlates multiple metrics for comprehensive risk assessment`,
    }),
    body: ApiBody({
      description: 'Current trend data for early warning generation',
      type: GenerateEarlyWarningsDto,
      examples: {
        trendAnalysis: {
          summary: 'Current Trend Analysis',
          description: 'Example with current metrics showing concerning trends',
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
            ],
            recentChanges: [
              {
                metric: 'team_size',
                changeType: 'decrease',
                magnitude: 0.2,
                timeframe: { value: 2, unit: 'weeks' },
                significance: 0.8,
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
            ],
          },
        },
      },
    }),
    responses: {
      success: ApiResponse({
        status: 200,
        description: 'Early warnings generated successfully',
        schema: {
          type: 'object',
          properties: {
            projectId: { type: 'string', example: 'proj_123456789' },
            alerts: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string', example: 'alert_001' },
                  projectId: { type: 'string', example: 'proj_123456789' },
                  type: {
                    type: 'string',
                    example: 'velocity_decline',
                    description: 'Type of early warning alert',
                  },
                  severity: {
                    type: 'string',
                    example: 'high',
                    enum: ['low', 'medium', 'high', 'critical'],
                  },
                  title: {
                    type: 'string',
                    example: 'Velocity Decline Alert',
                  },
                  description: {
                    type: 'string',
                    example:
                      'Team velocity has declined by 40% over the past 2 sprints',
                  },
                  probability: {
                    type: 'number',
                    example: 0.92,
                    description: 'Probability of issue occurring (0-1)',
                  },
                  estimatedTimeToOccurrence: {
                    type: 'object',
                    properties: {
                      value: { type: 'number', example: 3 },
                      unit: { type: 'string', example: 'days' },
                    },
                  },
                  potentialImpact: {
                    type: 'string',
                    example: 'high',
                    enum: ['low', 'medium', 'high', 'critical'],
                  },
                  preventionWindow: {
                    type: 'object',
                    properties: {
                      value: { type: 'number', example: 2 },
                      unit: { type: 'string', example: 'days' },
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
                  createdAt: {
                    type: 'string',
                    format: 'date-time',
                    example: '2024-07-31T15:30:00Z',
                  },
                  expiresAt: {
                    type: 'string',
                    format: 'date-time',
                    example: '2024-08-07T15:30:00Z',
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
        description: 'Invalid trend data or insufficient metrics for analysis',
      }),
      serverError: ApiInternalServerErrorResponse({
        description: 'Early warning generation failed due to internal error',
      }),
    },
  },
};
