import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import {
  GapCategory,
  GapStatus,
  GapType,
  SeverityLevel,
} from './create-gap-analysis.dto';

/**
 * DTO representing the simplified gap data structure returned by GapFactoryService
 * This is used for automated gap creation from project state analysis
 */
export class GapFactoryResultDto {
  @ApiProperty({
    description: 'Unique identifier of the gap (optional for new gaps)',
    example: 'gap_auto_123456789',
    required: false,
  })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({
    description: 'Project identifier this gap belongs to',
    example: 'proj_123456789',
  })
  @IsString()
  projectId: string;

  @ApiProperty({
    description: 'Title of the identified gap',
    example: 'Resource Over-utilization',
  })
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiProperty({
    description: 'Detailed description of the gap',
    example:
      'Resources are over-utilized at 95.0% affecting team sustainability',
  })
  @IsString()
  @MaxLength(1000)
  description: string;

  @ApiProperty({
    description: 'Type of gap identified',
    enum: GapType,
    example: GapType.RESOURCE,
  })
  @IsEnum(GapType)
  type: GapType;

  @ApiProperty({
    description: 'Category of the gap',
    enum: GapCategory,
    example: GapCategory.OPERATIONAL,
  })
  @IsEnum(GapCategory)
  category: GapCategory;

  @ApiProperty({
    description: 'Severity level of the gap',
    enum: SeverityLevel,
    example: SeverityLevel.HIGH,
  })
  @IsEnum(SeverityLevel)
  severity: SeverityLevel;

  @ApiProperty({
    description: 'Current status of the gap',
    enum: GapStatus,
    example: GapStatus.OPEN,
  })
  @IsEnum(GapStatus)
  status: GapStatus;

  @ApiProperty({
    description: 'Current value of the metric being analyzed',
    example: 0.95,
    required: false,
  })
  @IsOptional()
  currentValue?: number | string;

  @ApiProperty({
    description: 'Target value for the metric',
    example: 0.8,
    required: false,
  })
  @IsOptional()
  targetValue?: number | string;

  @ApiProperty({
    description: 'Impact description of the gap',
    example: 'Team burnout risk and decreased productivity',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  impact?: string;

  @ApiProperty({
    description: 'Confidence level in this gap identification (0-1)',
    example: 0.85,
    minimum: 0,
    maximum: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  confidence?: number;

  @ApiProperty({
    description: 'User ID who identified the gap (system for automated)',
    example: 'system',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'Timestamp when the gap was identified',
    example: '2024-01-15T10:30:00Z',
    type: 'string',
    format: 'date-time',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  identifiedAt?: Date;

  @ApiProperty({
    description: 'Timestamp when the gap was created',
    example: '2024-01-15T10:30:00Z',
    type: 'string',
    format: 'date-time',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  createdAt?: Date;

  @ApiProperty({
    description: 'Timestamp when the gap was last updated',
    example: '2024-01-15T14:20:00Z',
    type: 'string',
    format: 'date-time',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  updatedAt?: Date;
}

/**
 * DTO for automated gap analysis results containing multiple gaps
 */
export class AutomatedGapAnalysisResultDto {
  @ApiProperty({
    description: 'Project identifier that was analyzed',
    example: 'proj_123456789',
  })
  @IsString()
  projectId: string;

  @ApiProperty({
    description: 'Timestamp when the analysis was performed',
    example: '2024-01-15T10:30:00Z',
    type: 'string',
    format: 'date-time',
  })
  @IsDate()
  @Type(() => Date)
  analysisTimestamp: Date;

  @ApiProperty({
    description: 'List of gaps identified by the automated analysis',
    type: [GapFactoryResultDto],
  })
  identifiedGaps: GapFactoryResultDto[];

  @ApiProperty({
    description: 'Overall analysis confidence score (0-1)',
    example: 0.87,
    minimum: 0,
    maximum: 1,
  })
  @IsNumber()
  @Min(0)
  @Max(1)
  overallConfidence: number;

  @ApiProperty({
    description: 'Time taken to perform the analysis in milliseconds',
    example: 850,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  executionTimeMs: number;

  @ApiProperty({
    description: 'Summary statistics of the analysis',
    example: {
      totalGaps: 3,
      criticalGaps: 1,
      highSeverityGaps: 2,
      averageConfidence: 0.85,
    },
  })
  summary: {
    totalGaps: number;
    criticalGaps: number;
    highSeverityGaps: number;
    averageConfidence: number;
  };
}
