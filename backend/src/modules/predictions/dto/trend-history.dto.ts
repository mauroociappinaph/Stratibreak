import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class GetTrendHistoryDto {
  @ApiProperty({
    description: 'Project ID to get trend history for',
    example: 'proj_123456789',
  })
  @IsString()
  projectId: string;

  @ApiProperty({
    description: 'Specific metric to analyze trends for',
    example: 'velocity',
    required: false,
  })
  @IsOptional()
  @IsString()
  metric?: string;

  @ApiProperty({
    description: 'Start date for trend analysis (ISO 8601)',
    example: '2024-01-01T00:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({
    description: 'End date for trend analysis (ISO 8601)',
    example: '2024-07-31T23:59:59Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({
    description: 'Time granularity for trend data',
    example: 'daily',
    enum: ['hourly', 'daily', 'weekly', 'monthly'],
    required: false,
  })
  @IsOptional()
  @IsString()
  granularity?: string;
}

export class TrendDataPointDto {
  @ApiProperty({
    description: 'Timestamp of the data point',
    example: '2024-07-29T00:00:00Z',
  })
  timestamp: string;

  @ApiProperty({
    description: 'Metric value at this timestamp',
    example: 8.5,
  })
  value: number;

  @ApiProperty({
    description: 'Trend direction at this point',
    example: 'declining',
    enum: ['improving', 'stable', 'declining', 'volatile'],
  })
  trend: string;

  @ApiProperty({
    description: 'Rate of change from previous period',
    example: -0.15,
  })
  changeRate: number;

  @ApiProperty({
    description: 'Moving average value',
    example: 8.2,
    required: false,
  })
  movingAverage?: number;
}

export class MetricTrendHistoryDto {
  @ApiProperty({
    description: 'Metric name',
    example: 'velocity',
  })
  metric: string;

  @ApiProperty({
    description: 'Metric unit',
    example: 'story_points',
  })
  unit: string;

  @ApiProperty({
    description: 'Historical data points',
    type: [TrendDataPointDto],
  })
  dataPoints: TrendDataPointDto[];

  @ApiProperty({
    description: 'Overall trend analysis',
    type: 'object',
    properties: {
      direction: { type: 'string', example: 'declining' },
      strength: { type: 'number', example: 0.8 },
      duration: { type: 'string', example: '4 weeks' },
      significance: { type: 'number', example: 0.92 },
      volatility: { type: 'number', example: 0.15 },
    },
  })
  overallTrend: {
    direction: string;
    strength: number;
    duration: string;
    significance: number;
    volatility: number;
  };

  @ApiProperty({
    description: 'Trend predictions',
    type: 'object',
    properties: {
      nextValue: { type: 'number', example: 7.8 },
      confidence: { type: 'number', example: 0.85 },
      timeHorizon: { type: 'string', example: '1 week' },
      bounds: {
        type: 'object',
        properties: {
          lower: { type: 'number', example: 7.2 },
          upper: { type: 'number', example: 8.4 },
        },
      },
    },
  })
  prediction: {
    nextValue: number;
    confidence: number;
    timeHorizon: string;
    bounds: {
      lower: number;
      upper: number;
    };
  };
}

export class TrendHistoryResponseDto {
  @ApiProperty({
    description: 'Project ID',
    example: 'proj_123456789',
  })
  projectId: string;

  @ApiProperty({
    description: 'Time range analyzed',
    type: 'object',
    properties: {
      startDate: { type: 'string', format: 'date-time' },
      endDate: { type: 'string', format: 'date-time' },
    },
  })
  timeRange: {
    startDate: string;
    endDate: string;
  };

  @ApiProperty({
    description: 'Trend history for each metric',
    type: [MetricTrendHistoryDto],
  })
  metrics: MetricTrendHistoryDto[];

  @ApiProperty({
    description: 'Key trend insights',
    type: 'object',
    properties: {
      significantTrends: { type: 'number', example: 3 },
      improvingMetrics: { type: 'number', example: 2 },
      decliningMetrics: { type: 'number', example: 1 },
      volatileMetrics: { type: 'number', example: 0 },
      overallHealthTrend: { type: 'string', example: 'stable' },
    },
  })
  insights: {
    significantTrends: number;
    improvingMetrics: number;
    decliningMetrics: number;
    volatileMetrics: number;
    overallHealthTrend: string;
  };

  @ApiProperty({
    description: 'Recommendations based on trend analysis',
    type: [String],
    example: [
      'Monitor velocity decline closely',
      'Consider resource reallocation',
      'Investigate quality metric improvements',
    ],
  })
  recommendations: string[];

  @ApiProperty({
    description: 'When this analysis was generated',
    example: '2024-07-31T15:30:00Z',
  })
  generatedAt: string;
}

export class PredictionAccuracyMetricsDto {
  @ApiProperty({
    description: 'Project ID',
    example: 'proj_123456789',
  })
  projectId: string;

  @ApiProperty({
    description: 'Time period for accuracy analysis',
    type: 'object',
    properties: {
      startDate: { type: 'string', format: 'date-time' },
      endDate: { type: 'string', format: 'date-time' },
    },
  })
  period: {
    startDate: string;
    endDate: string;
  };

  @ApiProperty({
    description: 'Overall accuracy metrics',
    type: 'object',
    properties: {
      overallAccuracy: { type: 'number', example: 0.87 },
      precision: { type: 'number', example: 0.82 },
      recall: { type: 'number', example: 0.91 },
      f1Score: { type: 'number', example: 0.86 },
      falsePositiveRate: { type: 'number', example: 0.08 },
      falseNegativeRate: { type: 'number', example: 0.05 },
    },
  })
  overallMetrics: {
    overallAccuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    falsePositiveRate: number;
    falseNegativeRate: number;
  };

  @ApiProperty({
    description: 'Accuracy by prediction type',
    type: 'object',
    additionalProperties: {
      type: 'object',
      properties: {
        accuracy: { type: 'number' },
        totalPredictions: { type: 'number' },
        confirmedPredictions: { type: 'number' },
      },
    },
    example: {
      risk_alert: {
        accuracy: 0.89,
        totalPredictions: 25,
        confirmedPredictions: 22,
      },
      trend_alert: {
        accuracy: 0.85,
        totalPredictions: 15,
        confirmedPredictions: 13,
      },
    },
  })
  byType: Record<
    string,
    {
      accuracy: number;
      totalPredictions: number;
      confirmedPredictions: number;
    }
  >;

  @ApiProperty({
    description: 'Accuracy trend over time',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        period: { type: 'string', example: '2024-07-01' },
        accuracy: { type: 'number', example: 0.85 },
        predictions: { type: 'number', example: 12 },
      },
    },
  })
  accuracyTrend: Array<{
    period: string;
    accuracy: number;
    predictions: number;
  }>;

  @ApiProperty({
    description: 'Model performance insights',
    type: [String],
    example: [
      'Risk alert predictions show highest accuracy',
      'Accuracy has improved 15% over the last month',
      'False positive rate is within acceptable range',
    ],
  })
  insights: string[];

  @ApiProperty({
    description: 'When these metrics were calculated',
    example: '2024-07-31T15:30:00Z',
  })
  calculatedAt: string;
}
