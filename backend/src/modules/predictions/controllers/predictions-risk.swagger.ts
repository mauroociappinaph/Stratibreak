import {
  ApiBadRequestResponse,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import {
  CalculateRiskProbabilityDto,
  CalculateRiskProbabilityResponseDto,
} from '../dto';

// Swagger decorators for risk assessment endpoints
export const RiskSwaggerDocs = {
  calculateRiskProbability: {
    operation: ApiOperation({
      summary: 'Calculate risk probability based on indicators',
      description: `Comprehensive risk assessment engine that calculates risk probability using multiple indicators. This endpoint:
      • Analyzes multiple risk indicators with weighted importance
      • Calculates overall risk probability using advanced algorit
 Provides detailed risk factor breakdown
      • Generates confidence levels for risk assessments
      • Offers prioritized recommendations for risk mitigation
      • Uses threshold-based analysis for accurate risk scoring`,
    }),
    body: ApiBody({
      description: 'Risk indicators for probability calculation',
      type: CalculateRiskProbabilityDto,
      examples: {
        riskAssessment: {
          summary: 'Multi-Factor Risk Assessment',
          description: 'Example with multiple risk indicators',
          value: {
            projectId: 'proj_123456789',
            indicators: [
              {
                indicator: 'velocity_trend',
                currentValue: 15,
                threshold: 20,
                trend: 'declining',
                weight: 0.3,
              },
              {
                indicator: 'bug_rate',
                currentValue: 0.18,
                threshold: 0.1,
                trend: 'increasing',
                weight: 0.25,
              },
              {
                indicator: 'team_stability',
                currentValue: 0.7,
                threshold: 0.9,
                trend: 'declining',
                weight: 0.2,
              },
              {
                indicator: 'scope_changes',
                currentValue: 5,
                threshold: 2,
                trend: 'increasing',
                weight: 0.15,
              },
              {
                indicator: 'resource_utilization',
                currentValue: 0.95,
                threshold: 0.8,
                trend: 'stable',
                weight: 0.1,
              },
            ],
          },
        },
      },
    }),
    responses: {
      success: ApiResponse({
        status: 200,
        description: 'Risk probability calculated successfully',
        type: CalculateRiskProbabilityResponseDto,
      }),
      badRequest: ApiBadRequestResponse({
        description: 'Invalid risk indicators or missing required data',
      }),
      serverError: ApiInternalServerErrorResponse({
        description: 'Risk calculation failed due to internal error',
      }),
    },
  },

  getRiskAssessment: {
    operation: ApiOperation({
      summary: 'Get comprehensive risk assessment for project',
      description: `Provides a comprehensive risk assessment for a project including overall risk level, critical risks, and actionable recommendations. This endpoint:
      • Calculates overall project risk score
      • Identifies critical risk factors
      • Provides prioritized recommendations
      • Schedules next review dates
      • Offers real-time risk monitoring insights`,
    }),
    param: ApiParam({
      name: 'projectId',
      description: 'Unique identifier of the project for risk assessment',
      example: 'proj_123456789',
      type: 'string',
    }),
    responses: {
      success: ApiResponse({
        status: 200,
        description: 'Risk assessment retrieved successfully',
        schema: {
          type: 'object',
          properties: {
            projectId: { type: 'string', example: 'proj_123456789' },
            overallRiskLevel: {
              type: 'string',
              example: 'MEDIUM',
              enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
              description: 'Overall risk level for the project',
            },
            riskScore: {
              type: 'number',
              example: 0.45,
              description: 'Numerical risk score (0-1)',
            },
            criticalRisks: {
              type: 'array',
              items: { type: 'string' },
              example: [
                'Resource allocation below optimal levels',
                'Timeline compression detected',
              ],
              description:
                'List of critical risks requiring immediate attention',
            },
            recommendations: {
              type: 'array',
              items: { type: 'string' },
              example: [
                'Increase resource allocation by 15%',
                'Review timeline constraints with stakeholders',
                'Implement additional monitoring for critical path items',
              ],
              description: 'Prioritized recommendations for risk mitigation',
            },
            nextReviewDate: {
              type: 'string',
              format: 'date-time',
              example: '2024-08-07T15:30:00Z',
              description: 'Recommended date for next risk assessment',
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
        description: 'Project not found or insufficient data for assessment',
      }),
      serverError: ApiInternalServerErrorResponse({
        description: 'Risk assessment failed due to internal error',
      }),
    },
  },
};
