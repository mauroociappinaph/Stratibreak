import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum GapType {
  RESOURCE = 'resource',
  SKILL = 'skill',
  PROCESS = 'process',
  TECHNOLOGY = 'technology',
  COMMUNICATION = 'communication',
}

export enum SeverityLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

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
    description: 'Severity level indicating the urgency and impact of the gap',
    enum: SeverityLevel,
    example: SeverityLevel.HIGH,
    enumName: 'SeverityLevel',
  })
  @IsEnum(SeverityLevel)
  severity: SeverityLevel;
}
