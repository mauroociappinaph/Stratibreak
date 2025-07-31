import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { DurationDto } from './generate-early-warnings.dto';

export class PreventiveActionDto {
  @IsString()
  id: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  priority: string; // Priority as string

  @IsString()
  estimatedEffort: string;

  @IsArray()
  @IsString({ each: true })
  requiredResources: string[];

  @IsString()
  expectedImpact: string;

  @IsOptional()
  @IsDateString()
  deadline?: string;
}

export class PredictionDto {
  @IsString()
  issueType: string;

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
}

export class PredictFutureIssuesResponseDto {
  @IsString()
  projectId: string;

  @IsDateString()
  analysisTimestamp: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PredictionDto)
  predictions: PredictionDto[];

  @IsNumber()
  confidenceLevel: number;
}
