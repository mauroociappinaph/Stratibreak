import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { GapType, SeverityLevel } from './create-gap-analysis.dto';

export class UpdateGapAnalysisDto {
  @ApiProperty({
    description:
      'Unique identifier of the project this gap analysis belongs to',
    example: 'proj_123456789',
    type: 'string',
    required: false,
  })
  @IsOptional()
  @IsString()
  projectId?: string;

  @ApiProperty({
    description: 'Title or name of the identified gap',
    example: 'Critical Resource Shortage',
    type: 'string',
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'Detailed description of the gap and its implications',
    example:
      'Updated description with more details about the resource gap and its impact on project deliverables',
    type: 'string',
    maxLength: 1000,
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Category or type of the identified gap',
    enum: GapType,
    example: GapType.RESOURCE,
    enumName: 'GapType',
    required: false,
  })
  @IsOptional()
  @IsEnum(GapType)
  type?: GapType;

  @ApiProperty({
    description: 'Severity level indicating the urgency and impact of the gap',
    enum: SeverityLevel,
    example: SeverityLevel.CRITICAL,
    enumName: 'SeverityLevel',
    required: false,
  })
  @IsOptional()
  @IsEnum(SeverityLevel)
  severity?: SeverityLevel;
}
