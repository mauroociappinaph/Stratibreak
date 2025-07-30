import { ApiProperty } from '@nestjs/swagger';
import {
  GapCategory,
  GapStatus,
  GapType,
  SeverityLevel,
} from '../../../types/database/gap.types';

export class SimpleGapDto {
  @ApiProperty({
    description: 'Project identifier',
    example: 'proj_123456789',
  })
  projectId: string;

  @ApiProperty({
    description: 'Title of the identified gap',
    example: 'Resource Over-utilization',
  })
  title: string;

  @ApiProperty({
    description: 'Detailed description of the gap',
    example:
      'Resources are over-utilized at 95.0% affecting team sustainability',
  })
  description: string;

  @ApiProperty({
    description: 'Type of gap identified',
    enum: GapType,
    example: GapType.RESOURCE,
  })
  type: GapType;

  @ApiProperty({
    description: 'Category of the gap',
    enum: GapCategory,
    example: GapCategory.OPERATIONAL,
  })
  category: GapCategory;

  @ApiProperty({
    description: 'Severity level of the gap',
    enum: SeverityLevel,
    example: SeverityLevel.HIGH,
  })
  severity: SeverityLevel;

  @ApiProperty({
    description: 'Current status of the gap',
    enum: GapStatus,
    example: GapStatus.OPEN,
  })
  status: GapStatus;

  @ApiProperty({
    description: 'Current value of the metric',
    example: 0.95,
  })
  currentValue: number | string;

  @ApiProperty({
    description: 'Target value for the metric',
    example: 0.8,
  })
  targetValue: number | string;

  @ApiProperty({
    description: 'Impact description',
    example: 'Team burnout risk and decreased productivity',
  })
  impact: string;

  @ApiProperty({
    description: 'Confidence level in this gap identification (0-1)',
    example: 0.85,
    minimum: 0,
    maximum: 1,
  })
  confidence: number;

  @ApiProperty({
    description: 'User who identified the gap',
    example: 'system',
  })
  userId: string;
}

export class AnalysisSummaryDto {
  @ApiProperty({
    description: 'Total number of gaps identified',
    example: 3,
    minimum: 0,
  })
  totalGaps: number;

  @ApiProperty({
    description: 'Number of critical severity gaps',
    example: 0,
    minimum: 0,
  })
  criticalGaps: number;

  @ApiProperty({
    description: 'Number of high severity gaps',
    example: 1,
    minimum: 0,
  })
  highSeverityGaps: number;

  @ApiProperty({
    description: 'Average confidence across all identified gaps',
    example: 0.85,
    minimum: 0,
    maximum: 1,
  })
  averageConfidence: number;
}

export class AutomatedGapAnalysisResultDto {
  @ApiProperty({
    description: 'Project identifier that was analyzed',
    example: 'proj_123456789',
  })
  projectId: string;

  @ApiProperty({
    description: 'Timestamp when the analysis was performed',
    example: '2024-01-15T10:30:00Z',
    type: 'string',
    format: 'date-time',
  })
  analysisTimestamp: Date;

  @ApiProperty({
    description: 'List of gaps identified during automated analysis',
    type: [SimpleGapDto],
  })
  identifiedGaps: SimpleGapDto[];

  @ApiProperty({
    description: 'Overall confidence in the analysis results (0-1)',
    example: 0.87,
    minimum: 0,
    maximum: 1,
  })
  overallConfidence: number;

  @ApiProperty({
    description: 'Time taken to execute the analysis in milliseconds',
    example: 850,
    minimum: 0,
  })
  executionTimeMs: number;

  @ApiProperty({
    description: 'Summary statistics of the analysis',
    type: AnalysisSummaryDto,
  })
  summary: AnalysisSummaryDto;
}
