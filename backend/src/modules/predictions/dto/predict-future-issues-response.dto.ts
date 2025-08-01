import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';

export class DurationResponseDto {
  @ApiProperty({
    description: 'Duration value',
    example: 72,
  })
  @IsNumber()
  value: number;

  @ApiProperty({
    description: 'Duration unit',
    example: 'hours',
    enum: ['minutes', 'hours', 'days', 'weeks', 'months'],
  })
  @IsString()
  unit: string;
}

export class PreventiveActionResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the preventive action',
    example: 'action_001',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'Title of the preventive action',
    example: 'Increase code review frequency',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Detailed description of the action',
    example:
      'Implement mandatory peer reviews for all code changes to improve quality',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Priority level of the action',
    example: 'high',
    enum: ['low', 'medium', 'high', 'critical'],
  })
  @IsString()
  priority: string;

  @ApiProperty({
    description: 'Estimated effort required',
    example: '2-3 days',
  })
  @IsString()
  estimatedEffort: string;

  @ApiProperty({
    description: 'Required resources for implementation',
    example: ['Senior Developer', 'Team Lead'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  requiredResources: string[];

  @ApiProperty({
    description: 'Expected impact of the action',
    example: 'Reduce bug rate by 30%',
  })
  @IsString()
  expectedImpact: string;
}

export class PredictionResponseDto {
  @ApiProperty({
    description: 'Type of issue predicted',
    example: 'quality_degradation',
  })
  @IsString()
  issueType: string;

  @ApiProperty({
    description: 'Probability of the issue occurring',
    example: 0.85,
    minimum: 0,
    maximum: 1,
  })
  @IsNumber()
  probability: number;

  @ApiProperty({
    description: 'Estimated time until the issue occurs',
    type: DurationResponseDto,
  })
  @ValidateNested()
  @Type(() => DurationResponseDto)
  estimatedTimeToOccurrence: DurationResponseDto;

  @ApiProperty({
    description: 'Potential impact level of the issue',
    example: 'high',
    enum: ['low', 'medium', 'high', 'critical'],
  })
  @IsString()
  potentialImpact: string;

  @ApiProperty({
    description: 'Time window available for prevention',
    type: DurationResponseDto,
  })
  @ValidateNested()
  @Type(() => DurationResponseDto)
  preventionWindow: DurationResponseDto;

  @ApiProperty({
    description: 'Suggested preventive actions',
    type: [PreventiveActionResponseDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PreventiveActionResponseDto)
  suggestedActions: PreventiveActionResponseDto[];
}

export class PredictFutureIssuesResponseDto {
  @ApiProperty({
    description: 'Project identifier',
    example: 'proj_123456789',
  })
  @IsString()
  projectId: string;

  @ApiProperty({
    description: 'Array of predicted future issues',
    type: [PredictionResponseDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PredictionResponseDto)
  predictions: PredictionResponseDto[];

  @ApiProperty({
    description: 'Timestamp when the analysis was performed',
    example: '2024-07-31T15:30:00Z',
    format: 'date-time',
  })
  @IsString()
  analysisTimestamp: string;
}
