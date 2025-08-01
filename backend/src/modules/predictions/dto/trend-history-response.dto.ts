import { ApiProperty } from '@nestjs/swagger';
import { MockTrendHistory } from '../utils/mock-data-types';
import {
  TrendInsights,
  TrendRecommendations,
} from '../utils/prediction-analytics';

export class TrendHistoryResponse {
  @ApiProperty({ description: 'Project ID' })
  projectId: string;

  @ApiProperty({
    description: 'Time range for the trend history',
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
    description: 'Trend metrics data',
    type: [Object],
  })
  metrics: MockTrendHistory[];

  @ApiProperty({
    description: 'Trend analysis insights',
    type: 'object',
  })
  insights: TrendInsights;

  @ApiProperty({
    description: 'Trend-based recommendations',
    type: 'object',
  })
  recommendations: TrendRecommendations;

  @ApiProperty({ description: 'Timestamp when response was generated' })
  generatedAt: string;
}
