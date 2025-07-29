import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export enum PredictionType {
  RISK = 'risk',
  DELAY = 'delay',
  RESOURCE_SHORTAGE = 'resource_shortage',
  QUALITY_ISSUE = 'quality_issue',
}

export class CreatePredictionDto {
  @IsString()
  projectId: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(PredictionType)
  type: PredictionType;

  @IsNumber()
  probability: number;

  @IsNumber()
  impact: number;
}
