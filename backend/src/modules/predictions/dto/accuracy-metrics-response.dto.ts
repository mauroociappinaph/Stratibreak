import { ApiProperty } from '@nestjs/swagger';
import { MockAccuracyTrendEntry } from '../utils/mock-data-types';

export class AccuracyMetricsResponse {
  @ApiProperty({ description: 'Project ID' })
  projectId: string;

  @ApiProperty({
    description: 'Time period for accuracy metrics',
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
      overallAccuracy: { type: 'number' },
      precision: { type: 'number' },
      recall: { type: 'number' },
      f1Score: { type: 'number' },
      falsePositiveRate: { type: 'number' },
      falseNegativeRate: { type: 'number' },
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
    description: 'Accuracy metrics by prediction type',
    type: 'object',
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
    type: [Object],
  })
  accuracyTrend: MockAccuracyTrendEntry[];

  @ApiProperty({
    description: 'Insights about accuracy performance',
    type: [String],
  })
  insights: string[];

  @ApiProperty({ description: 'Timestamp when metrics were calculated' })
  calculatedAt: string;
}
