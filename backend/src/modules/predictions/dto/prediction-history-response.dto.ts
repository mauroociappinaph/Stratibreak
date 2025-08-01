import { ApiProperty } from '@nestjs/swagger';
import { MockPredictionHistoryEntry } from '../utils/mock-data-types';
import { PredictionSummary } from '../utils/prediction-analytics';

export class PredictionHistoryResponse {
  @ApiProperty({ description: 'Project ID' })
  projectId: string;

  @ApiProperty({
    description: 'Time range for the prediction history',
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
    description: 'List of prediction history entries',
    type: [Object],
  })
  predictions: MockPredictionHistoryEntry[];

  @ApiProperty({
    description: 'Summary statistics for predictions',
    type: 'object',
  })
  summary: PredictionSummary;

  @ApiProperty({ description: 'Timestamp when response was generated' })
  generatedAt: string;
}
