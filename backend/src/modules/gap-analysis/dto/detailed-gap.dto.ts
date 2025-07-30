import { ApiProperty } from '@nestjs/swagger';
import { GapType, SeverityLevel } from '../../../types/database/gap.types';
import { ImpactDto } from './impact.dto';
import { ProjectAreaDto } from './project-area.dto';
import { RootCauseDto } from './root-cause.dto';

export class DetailedGapDto {
  @ApiProperty({
    description: 'Unique identifier of the gap',
    example: 'gap_detailed_123456789',
  })
  id?: string;

  @ApiProperty({
    description: 'Project identifier',
    example: 'proj_123456789',
  })
  projectId: string;

  @ApiProperty({
    description: 'Type of gap identified',
    enum: GapType,
    example: GapType.RESOURCE,
  })
  type: GapType;

  @ApiProperty({
    description: 'Category of the gap',
    example: 'operational',
    enum: [
      'operational',
      'strategic',
      'tactical',
      'technical',
      'organizational',
    ],
  })
  category: string;

  @ApiProperty({
    description: 'Title of the gap',
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
    description: 'Variance between current and target values',
    example: 0.15,
  })
  variance: number;

  @ApiProperty({
    description: 'Severity level of the gap',
    enum: SeverityLevel,
    example: SeverityLevel.HIGH,
  })
  severity: SeverityLevel;

  @ApiProperty({
    description: 'Status of the gap',
    example: 'identified',
    enum: [
      'identified',
      'analyzing',
      'planning',
      'in_progress',
      'resolved',
      'closed',
      'deferred',
    ],
  })
  status: string;

  @ApiProperty({
    description: 'Root causes contributing to this gap',
    type: [RootCauseDto],
  })
  rootCauses: RootCauseDto[];

  @ApiProperty({
    description: 'Project areas affected by this gap',
    type: [ProjectAreaDto],
  })
  affectedAreas: ProjectAreaDto[];

  @ApiProperty({
    description: 'Estimated impact of this gap',
    type: ImpactDto,
  })
  estimatedImpact: ImpactDto;

  @ApiProperty({
    description: 'Confidence level in this gap identification (0-1)',
    example: 0.85,
    minimum: 0,
    maximum: 1,
  })
  confidence: number;

  @ApiProperty({
    description: 'Priority level for addressing this gap',
    example: 'high',
    enum: ['low', 'medium', 'high', 'urgent'],
  })
  priority: string;

  @ApiProperty({
    description: 'Tags for categorization and filtering',
    example: ['urgent', 'team-related'],
    type: [String],
  })
  tags: string[];

  @ApiProperty({
    description: 'Timestamp when the gap was identified',
    example: '2024-01-15T10:30:00Z',
    type: 'string',
    format: 'date-time',
  })
  identifiedAt: Date;

  @ApiProperty({
    description: 'User who identified the gap',
    example: 'user_123456789',
  })
  identifiedBy: string;
}
