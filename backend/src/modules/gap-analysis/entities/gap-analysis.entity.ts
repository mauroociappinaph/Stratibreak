import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
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
} from '../dto/create-gap-analysis.dto';

export class RootCauseEntity {
  @ApiProperty({
    description: 'Unique identifier of the root cause',
    example: 'rc_123456789',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'Gap identifier this root cause belongs to',
    example: 'gap_123456789',
  })
  @IsString()
  gapId: string;

  @ApiProperty({
    description: 'Category of the root cause',
    example: 'process',
    enum: [
      'people',
      'process',
      'technology',
      'environment',
      'management',
      'external',
    ],
  })
  @IsString()
  category: string;

  @ApiProperty({
    description: 'Description of the root cause',
    example: 'Insufficient resource planning and allocation',
  })
  @IsString()
  @MaxLength(1000)
  description: string;

  @ApiProperty({
    description: 'Confidence level in this root cause identification (0-1)',
    example: 0.8,
    minimum: 0,
    maximum: 1,
  })
  @IsNumber()
  @Min(0)
  @Max(1)
  confidence: number;

  @ApiProperty({
    description: 'Evidence supporting this root cause',
    example: ['Resource utilization metrics', 'Team workload data'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  evidence: string[];

  @ApiProperty({
    description: 'Weight of this root cause contribution (0-1)',
    example: 0.9,
    minimum: 0,
    maximum: 1,
  })
  @IsNumber()
  @Min(0)
  @Max(1)
  contributionWeight: number;

  @ApiProperty({
    description: 'Timestamp when the root cause was created',
    example: '2024-01-15T10:30:00Z',
    type: 'string',
    format: 'date-time',
  })
  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the root cause was last updated',
    example: '2024-01-15T14:20:00Z',
    type: 'string',
    format: 'date-time',
  })
  @IsDate()
  @Type(() => Date)
  updatedAt: Date;
}

export class ProjectAreaEntity {
  @ApiProperty({
    description: 'Unique identifier of the project area',
    example: 'area_123456789',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'Gap identifier this project area belongs to',
    example: 'gap_123456789',
  })
  @IsString()
  gapId: string;

  @ApiProperty({
    description: 'Name of the affected project area',
    example: 'Team Productivity',
  })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    description: 'Description of the project area',
    example: 'Team performance and sustainability',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiProperty({
    description: 'Impact level of this area',
    example: 'high',
    enum: ['low', 'medium', 'high', 'critical'],
  })
  @IsEnum(['low', 'medium', 'high', 'critical'])
  impactLevel: string;

  @ApiProperty({
    description: 'Timestamp when the project area was created',
    example: '2024-01-15T10:30:00Z',
    type: 'string',
    format: 'date-time',
  })
  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the project area was last updated',
    example: '2024-01-15T14:20:00Z',
    type: 'string',
    format: 'date-time',
  })
  @IsDate()
  @Type(() => Date)
  updatedAt: Date;
}

export class GapAnalysisEntity {
  @ApiProperty({
    description: 'Unique identifier of the gap analysis record',
    example: 'gap_987654321',
    type: 'string',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description:
      'Unique identifier of the project this gap analysis belongs to',
    example: 'proj_123456789',
    type: 'string',
  })
  @IsString()
  projectId: string;

  @ApiProperty({
    description: 'Title or name of the identified gap',
    example: 'Insufficient Development Resources',
    type: 'string',
  })
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiProperty({
    description: 'Detailed description of the gap and its implications',
    example:
      'The project lacks sufficient senior developers to meet the delivery timeline',
    type: 'string',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiProperty({
    description: 'Category or type of the identified gap',
    enum: GapType,
    example: GapType.RESOURCE,
    enumName: 'GapType',
  })
  @IsEnum(GapType)
  type: GapType;

  @ApiProperty({
    description: 'Gap category for classification',
    enum: GapCategory,
    example: GapCategory.OPERATIONAL,
    enumName: 'GapCategory',
    required: false,
  })
  @IsOptional()
  @IsEnum(GapCategory)
  category?: GapCategory;

  @ApiProperty({
    description: 'Severity level indicating the urgency and impact of the gap',
    enum: SeverityLevel,
    example: SeverityLevel.HIGH,
    enumName: 'SeverityLevel',
  })
  @IsEnum(SeverityLevel)
  severity: SeverityLevel;

  @ApiProperty({
    description: 'Status of the gap',
    enum: GapStatus,
    example: GapStatus.OPEN,
    enumName: 'GapStatus',
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
    description: 'Variance between current and target values',
    example: 0.15,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  variance?: number;

  @ApiProperty({
    description: 'Impact description',
    example: 'High impact on team productivity and project timeline',
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
    description: 'Tags for categorization and filtering',
    example: ['urgent', 'team-related'],
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({
    description: 'User ID who identified the gap',
    example: 'user_123456789',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'Root causes contributing to this gap',
    type: [RootCauseEntity],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @Type(() => RootCauseEntity)
  rootCauses?: RootCauseEntity[];

  @ApiProperty({
    description: 'Project areas affected by this gap',
    type: [ProjectAreaEntity],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @Type(() => ProjectAreaEntity)
  affectedAreas?: ProjectAreaEntity[];

  @ApiProperty({
    description: 'Timestamp when the gap was identified',
    example: '2024-01-15T10:30:00Z',
    type: 'string',
    format: 'date-time',
  })
  @IsDate()
  @Type(() => Date)
  identifiedAt: Date;

  @ApiProperty({
    description: 'Timestamp when the gap analysis was created',
    example: '2024-01-15T10:30:00Z',
    type: 'string',
    format: 'date-time',
  })
  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the gap analysis was last updated',
    example: '2024-01-15T14:20:00Z',
    type: 'string',
    format: 'date-time',
  })
  @IsDate()
  @Type(() => Date)
  updatedAt: Date;
}
