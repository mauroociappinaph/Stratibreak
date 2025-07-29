import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Length,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import {
  ImpactLevel,
  PatternType,
  PredictionCategory,
  PredictionStatus,
  PredictionType,
  Priority,
  SeverityLevel,
  TimeUnit,
  TrendDirection,
} from '../database';

// Prediction Validation Schemas
export class CreatePredictionDto {
  @IsUUID()
  projectId: string;

  @IsString()
  @IsNotEmpty()
  modelId: string;

  @IsEnum(PredictionType)
  type: PredictionType;

  @IsEnum(PredictionCategory)
  category: PredictionCategory;

  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  title: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 2000)
  description: string;

  @IsNumber()
  @Min(0)
  @Max(1)
  probability: number;

  @IsNumber()
  @Min(0)
  @Max(1)
  confidence: number;

  @IsEnum(ImpactLevel)
  impact: ImpactLevel;

  @IsEnum(SeverityLevel)
  severity: SeverityLevel;

  @ValidateNested()
  @Type(() => DurationDto)
  estimatedTimeToOccurrence: DurationDto;

  @ValidateNested()
  @Type(() => DurationDto)
  preventionWindow: DurationDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PreventiveActionDto)
  @ArrayMaxSize(20)
  suggestedActions: PreventiveActionDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RiskIndicatorDto)
  @ArrayMaxSize(50)
  riskIndicators: RiskIndicatorDto[];

  @IsDate()
  @Type(() => Date)
  validUntil: Date;
}

export class UpdatePredictionDto {
  @IsEnum(PredictionStatus)
  @IsOptional()
  status?: PredictionStatus;

  @IsNumber()
  @Min(0)
  @Max(1)
  @IsOptional()
  probability?: number;

  @IsNumber()
  @Min(0)
  @Max(1)
  @IsOptional()
  confidence?: number;

  @IsEnum(SeverityLevel)
  @IsOptional()
  severity?: SeverityLevel;
}

export class PreventiveActionDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  title: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 2000)
  description: string;

  @IsEnum(Priority)
  priority: Priority;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  estimatedEffort: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(20)
  requiredResources: string[];

  @IsString()
  @IsNotEmpty()
  @Length(1, 500)
  expectedImpact: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  deadline?: Date;
}

export class RiskIndicatorDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  indicator: string;

  @IsNumber()
  currentValue: number;

  @IsNumber()
  threshold: number;

  @IsEnum(TrendDirection)
  trend: TrendDirection;

  @IsNumber()
  @Min(0)
  @Max(1)
  weight: number;
}

export class PatternDto {
  @IsEnum(PatternType)
  patternType: PatternType;

  @IsString()
  @IsNotEmpty()
  @Length(1, 1000)
  description: string;

  @IsNumber()
  @Min(0)
  frequency: number;

  @IsNumber()
  @Min(0)
  @Max(1)
  confidence: number;

  @IsArray()
  @IsDate({ each: true })
  @Type(() => Date)
  @ArrayMaxSize(100)
  historicalOccurrences: Date[];
}

export class PredictionOutcomeDto {
  @IsBoolean()
  actualOccurred: boolean;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  actualDate?: Date;

  @IsEnum(ImpactLevel)
  @IsOptional()
  actualImpact?: ImpactLevel;

  @IsNumber()
  @Min(0)
  @Max(1)
  accuracy: number;

  @IsString()
  @IsOptional()
  @Length(0, 2000)
  notes?: string;
}

export class DurationDto {
  @IsNumber()
  @IsPositive()
  value: number;

  @IsEnum(TimeUnit)
  unit: TimeUnit;
}
