import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
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
} from '../../../types/database/gap.types';

// Re-export types for use in other DTOs
export { GapCategory, GapStatus, GapType, SeverityLevel };

export class CreateGapAnalysisDto {
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
    maxLength: 255,
  })
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiProperty({
    description: 'Detailed description of the gap and its implications',
    example:
      'The project lacks sufficient senior developers to meet the delivery timeline. Current team has 3 developers but requires 5 for optimal velocity.',
    type: 'string',
    required: false,
    maxLength: 1000,
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
    description: 'Status of the gap',
    enum: GapStatus,
    example: GapStatus.OPEN,
    enumName: 'GapStatus',
    required: false,
  })
  @IsOptional()
  @IsEnum(GapStatus)
  status?: GapStatus;

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
}
