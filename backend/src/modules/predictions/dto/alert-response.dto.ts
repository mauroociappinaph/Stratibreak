import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { DurationDto } from './generate-early-warnings.dto';
import { PreventiveActionDto } from './prediction-response.dto';

export class AlertDto {
  @IsString()
  id: string;

  @IsString()
  projectId: string;

  @IsString()
  type: string; // AlertType as string

  @IsString()
  severity: string; // AlertSeverity as string

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  probability: number;

  @ValidateNested()
  @Type(() => DurationDto)
  estimatedTimeToOccurrence: DurationDto;

  @IsString()
  potentialImpact: string; // ImpactLevel as string

  @ValidateNested()
  @Type(() => DurationDto)
  preventionWindow: DurationDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PreventiveActionDto)
  suggestedActions: PreventiveActionDto[];

  @IsDateString()
  createdAt: string;

  @IsDateString()
  expiresAt: string;
}

export class GenerateEarlyWarningsResponseDto {
  @IsString()
  projectId: string;

  @IsDateString()
  analysisTimestamp: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AlertDto)
  alerts: AlertDto[];

  @IsNumber()
  overallRiskLevel: number;
}
