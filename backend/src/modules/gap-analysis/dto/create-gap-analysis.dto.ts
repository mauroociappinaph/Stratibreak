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
  @IsString()
  projectId: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(GapType)
  type: GapType;

  @IsEnum(SeverityLevel)
  severity: SeverityLevel;
}
