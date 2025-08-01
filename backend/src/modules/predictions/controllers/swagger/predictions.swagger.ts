import {
  ApiBadRequestResponse,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import {
  CalculateRiskProbabilityDto,
  CalculateRiskProbabilityResponseDto,
  GenerateEarlyWarningsDto,
  GenerateEarlyWarningsResponseDto,
  PredictFutureIssuesDto,
  PredictFutureIssuesResponseDto,
} from '../../dto';

// Core predictions Swagger documentation
export const PredictionsSwaggerDocs = {
  // Future Issues Prediction
  predictFutureIssues: {
    operation: ApiOperation({
      summary: 'Predict future issues based on historical data',
      description: `Advanced AI-powered prediction system that analyzes historical project data to predict potential future issues with 72+ hour advance warning. This endpoint:
      • Uses machine learning algorithms to identify patterns in historical data
      • Provides probability scores for each predicted issue
      • Estimates time to occurrence with confidence intervals
      • Suggests preventive actions with resource requirements
      • Supports multiple data sources (metrics, events, patterns)`,
    }),
    body: ApiBody({
      description: 'Historical project data for future issue prediction',
      type: PredictFutureIssuesDto,
      examples: {
        comprehensiveAnalysis: {
          summary: 'Comprehensive Historical Analysis',
          description:
            'Example with comprehensive historical data for accurate predictions',
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
                  { timestamp: '2024-07-29T00:00:00Z', value: 12 },
                ],
                unit: 'story_points',
              },
              {
                name: 'bug_rate',
                values: [
                  { timestamp: '2024-07-01T00:00:00Z', value: 0.05 },
                  { timestamp: '2024-07-08T00:00:00Z', value: 0.08 },
                  { timestamp: '2024-07-15T00:00:00Z', value: 0.12 },
                  { timestamp: '2024-07-22T00:00:00Z', value: 0.15 },
                  { timestamp: '2024-07-29T00:00:00Z', value: 0.18 },
                ],
                unit: 'bugs_per_story',
              },
            ],
            events: [
              {
                timestamp: '2024-07-15T10:00:00Z',
                type: 'team_change',
                description: 'Senior developer left the team',
                impact: 'high',
              },
              {
                timestamp: '2024-07-20T14:30:00Z',
                type: 'requirement_change',
                description: 'Major scope change requested',
                impact: 'medium',
              },
            ],
            patterns: [
              {
                patternType: 'trending',
                frequency: 0.8,
                confidence: 0.92,
                description: 'Consistent velocity decline over 4 weeks',
              },
              {
                patternType: 'correlation',
                frequency: 0.7,
                confidence: 0.85,
                description: 'Bug rate increases correlate with velocity drops',
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
        type: PredictFutureIssuesResponseDto,
      }),
      badRequest: ApiBadRequestResponse({
        description:
          'Invalid historical data or insufficient data for prediction',
      }),
      serverError: ApiInternalServerErrorResponse({
        description: 'Prediction analysis failed due to internal error',
      }),
    },
  },

  // Early Warnings Generation
  generateEarlyWarnings: {
    operation: ApiOperation({
      summary: 'Generate early warning alerts',
      description: `Proactive alert generation system that analyzes current trends to generate early warnings with priority levels and probability scores. This endpoint:
      • Analyzes current metrics and trend data
      • Generates alerts with severity levels and probability scores
      • Provides time-to-occurrence estimates
      • Suggests preventive actions with effort estimates
      • Supports real-time trend analysis`,
    }),
    body: ApiBody({
      description: 'Current trend data for early warning generation',
      type: GenerateEarlyWarningsDto,
      examples: {
        trendAnalysis: {
          summary: 'Current Trend Analysis',
          description: 'Example with current metrics and trend data',
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
                changeType: 'sudden',
                magnitude: 0.2,
                timeframe: { value: 1, unit: 'weeks' },
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
            ],
          },
        },
      },
    }),
    responses: {
      success: ApiResponse({
        status: 200,
        description: 'Early warnings generated successfully',
        type: GenerateEarlyWarningsResponseDto,
      }),
      badRequest: ApiBadRequestResponse({
        description: 'Invalid trend data or insufficient metrics for analysis',
      }),
      serverError: ApiInternalServerErrorResponse({
        description: 'Early warning generation failed due to internal error',
      }),
    },
  },

  // Risk Probability Calculation
  calculateRiskProbability: {
    operation: ApiOperation({
      summary: 'Calculate risk probability based on indicators',
      description: `Comprehensive risk assessment system that calculates risk probability based on multiple indicators. This endpoint:
      • Analyzes multiple risk indicators with weighted importance
      • Calculates overall risk probability with confidence levels
      • Provides detailed risk factor breakdown
      • Generates actionable recommendations
      • Supports trend-based risk assessment`,
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
                indicator: 'velocity_decline',
                currentValue: 15,
                threshold: 20,
                trend: 'declining',
                weight: 0.3,
              },
              {
                indicator: 'bug_rate_increase',
                currentValue: 0.18,
                threshold: 0.1,
                trend: 'increasing',
                weight: 0.25,
              },
              {
                indicator: 'team_stability',
                currentValue: 0.7,
                threshold: 0.8,
                trend: 'declining',
                weight: 0.2,
              },
              {
                indicator: 'code_coverage',
                currentValue: 0.65,
                threshold: 0.8,
                trend: 'declining',
                weight: 0.25,
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
        description:
          'Invalid risk indicators or insufficient data for calculation',
      }),
      serverError: ApiInternalServerErrorResponse({
        description: 'Risk calculation failed due to internal error',
      }),
    },
  },
};

export const {
  predictFutureIssues,
  generateEarlyWarnings,
  calculateRiskProbability,
} = PredictionsSwaggerDocs;
