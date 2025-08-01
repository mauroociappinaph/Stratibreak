import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class GetPredictionHistoryDto {
  @ApiProperty({
    description: 'Project ID to get prediction history for',
    example: 'proj_123456789',
  })
  @IsString()
  projectId: string;

  @ApiProperty({
    description: 'Start date for history range (ISO 8601)',
    example: '2024-01-01T00:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({
    description: 'End date for history range (ISO 8601)',
    example: '2024-07-31T23:59:59Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({
    description: 'Type of prediction to filter by',
    example: 'risk_alert',
    required: false,
    enum: ['early_warning', 'risk_alert', 'trend_alert', 'anomaly_alert'],
  })
  @IsOptional()
  @IsString()
  predictionType?: string;

  @ApiProperty({
    description: 'Maximum number of records to return',
    example: 50,
    minimum: 1,
    maximum: 1000,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(1000)
  limit?: number;
}

export class PredictionHistoryEntryDto {
  @ApiProperty({
    description: 'Unique prediction ID',
    example: 'pred_123456789',
  })
  id: string;

  @ApiProperty({
    description: 'Project ID',
    example: 'proj_123456789',
  })
  projectId: string;

  @ApiProperty({
    description: 'Type of prediction',
    example: 'risk_alert',
    enum: ['early_warning', 'risk_alert', 'trend_alert', 'anomaly_alert'],
  })
  type: string;

  @ApiProperty({
    description: 'Prediction title',
    example: 'Velocity decline predicted',
  })
  title: string;

  @ApiProperty({
    description: 'Prediction description',
    example: 'Development velocity expected to decline by 20% within 72 hours',
  })
  description: string;

  @ApiProperty({
    description: 'Predicted probability (0-1)',
    example: 0.85,
    minimum: 0,
    maximum: 1,
  })
  probability: number;

  @ApiProperty({
    description: 'Severity level',
    example: 'high',
    enum: ['low', 'medium', 'high', 'critical'],
  })
  severity: string;

  @ApiProperty({
    description: 'When the prediction was made',
    example: '2024-07-29T10:00:00Z',
  })
  predictedAt: string;

  @ApiProperty({
    description: 'When the predicted event was expected to occur',
    example: '2024-07-31T10:00:00Z',
  })
  expectedAt: string;

  @ApiProperty({
    description: 'Actual outcome of the prediction',
    example: 'confirmed',
    enum: ['confirmed', 'false_positive', 'prevented', 'pending'],
    required: false,
  })
  actualOutcome?: string;

  @ApiProperty({
    description: 'When the outcome was verified',
    example: '2024-07-31T12:00:00Z',
    required: false,
  })
  verifiedAt?: string;

  @ApiProperty({
    description: 'Accuracy score of the prediction (0-1)',
    example: 0.92,
    minimum: 0,
    maximum: 1,
    required: false,
  })
  accuracyScore?: number;

  @ApiProperty({
    description: 'Actions taken in response to the prediction',
    type: [String],
    example: ['Increased monitoring', 'Resource reallocation'],
    required: false,
  })
  actionsTaken?: string[];
}

export class PredictionHistoryResponseDto {
  @ApiProperty({
    description: 'Project ID',
    example: 'proj_123456789',
  })
  projectId: string;

  @ApiProperty({
    description: 'Time range of the history',
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
    type: [PredictionHistoryEntryDto],
  })
  predictions: PredictionHistoryEntryDto[];

  @ApiProperty({
    description: 'Summary statistics',
    type: 'object',
    properties: {
      totalPredictions: { type: 'number', example: 45 },
      confirmedPredictions: { type: 'number', example: 38 },
      falsePositives: { type: 'number', example: 4 },
      preventedIssues: { type: 'number', example: 3 },
      averageAccuracy: { type: 'number', example: 0.87 },
      accuracyTrend: { type: 'string', example: 'improving' },
    },
  })
  summary: {
    totalPredictions: number;
    confirmedPredictions: number;
    falsePositives: number;
    preventedIssues: number;
    averageAccuracy: number;
    accuracyTrend: string;
  };

  @ApiProperty({
    description: 'When this history was generated',
    example: '2024-07-31T15:30:00Z',
  })
  generatedAt: string;
}
