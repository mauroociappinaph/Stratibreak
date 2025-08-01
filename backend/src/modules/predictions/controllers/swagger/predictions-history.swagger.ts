import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';

// History endpoints Swagger documentation
export const PredictionsHistorySwaggerDocs = {
  // Prediction History
  getPredictionHistory: {
    operation: ApiOperation({
      summary: 'Get prediction history for project',
      description: `Retrieves comprehensive prediction history with accuracy metrics and outcomes. Supports advanced filtering and pagination.`,
    }),
    params: [
      ApiParam({
        name: 'projectId',
        description: 'Unique project identifier',
        example: 'proj_123456789',
      }),
    ],
    queries: [
      ApiQuery({
        name: 'startDate',
        required: false,
        description: 'Start date for history range (ISO 8601)',
        example: '2024-01-01T00:00:00Z',
      }),
      ApiQuery({
        name: 'endDate',
        required: false,
        description: 'End date for history range (ISO 8601)',
        example: '2024-07-31T23:59:59Z',
      }),
      ApiQuery({
        name: 'predictionType',
        required: false,
        description: 'Filter by prediction type',
        example: 'risk_alert',
      }),
      ApiQuery({
        name: 'limit',
        required: false,
        description: 'Maximum number of results',
        example: '50',
      }),
    ],
    responses: {
      success: ApiResponse({
        status: 200,
        description: 'Prediction history retrieved successfully',
        schema: {
          type: 'object',
          properties: {
            projectId: { type: 'string' },
            timeRange: {
              type: 'object',
              properties: {
                startDate: { type: 'string', format: 'date-time' },
                endDate: { type: 'string', format: 'date-time' },
              },
            },
            predictions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  type: { type: 'string' },
                  title: { type: 'string' },
                  probability: { type: 'number' },
                  severity: { type: 'string' },
                  actualOutcome: { type: 'string' },
                  accuracyScore: { type: 'number' },
                },
              },
            },
            summary: {
              type: 'object',
              properties: {
                totalPredictions: { type: 'number' },
                averageAccuracy: { type: 'number' },
                accuracyTrend: { type: 'string' },
              },
            },
          },
        },
      }),
    },
  },

  // Trend History
  getTrendHistory: {
    operation: ApiOperation({
      summary: 'Get trend analysis history for project',
      description: `Retrieves historical trend data with predictions and insights. Supports metric filtering and time granularity options.`,
    }),
    params: [
      ApiParam({
        name: 'projectId',
        description: 'Unique project identifier',
        example: 'proj_123456789',
      }),
    ],
    queries: [
      ApiQuery({
        name: 'metric',
        required: false,
        description: 'Filter by specific metric',
        example: 'velocity',
      }),
      ApiQuery({
        name: 'startDate',
        required: false,
        description: 'Start date for trend analysis',
        example: '2024-01-01T00:00:00Z',
      }),
      ApiQuery({
        name: 'endDate',
        required: false,
        description: 'End date for trend analysis',
        example: '2024-07-31T23:59:59Z',
      }),
      ApiQuery({
        name: 'granularity',
        required: false,
        description: 'Time granularity for data points',
        example: 'daily',
        enum: ['hourly', 'daily', 'weekly', 'monthly'],
      }),
    ],
    responses: {
      success: ApiResponse({
        status: 200,
        description: 'Trend history retrieved successfully',
        schema: {
          type: 'object',
          properties: {
            projectId: { type: 'string' },
            metrics: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  metric: { type: 'string' },
                  unit: { type: 'string' },
                  dataPoints: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        timestamp: { type: 'string', format: 'date-time' },
                        value: { type: 'number' },
                        trend: { type: 'string' },
                        changeRate: { type: 'number' },
                      },
                    },
                  },
                  overallTrend: {
                    type: 'object',
                    properties: {
                      direction: { type: 'string' },
                      strength: { type: 'number' },
                      significance: { type: 'number' },
                    },
                  },
                },
              },
            },
            insights: {
              type: 'object',
              properties: {
                significantTrends: { type: 'number' },
                overallHealthTrend: { type: 'string' },
              },
            },
          },
        },
      }),
    },
  },
};

export const { getPredictionHistory, getTrendHistory } =
  PredictionsHistorySwaggerDocs;
