import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export enum TrendDirection {
  IMPROVING = 'improving',
  STABLE = 'stable',
  DECLINING = 'declining',
  VOLATILE = 'volatile',
}

export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum IndicatorCategory {
  TIMELINE = 'timeline',
  BUDGET = 'budget',
  QUALITY = 'quality',
  RESOURCE = 'resource',
  SCOPE = 'scope',
  STAKEHOLDER = 'stakeholder',
  COMMUNICATION = 'communication',
  TECHNOLOGY = 'technology',
}

export class RiskIndicatorDto {
  @IsString()
  id: string;

  @IsString()
  projectId: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsEnum(IndicatorCategory)
  category: IndicatorCategory;

  @IsNumber()
  @Min(0)
  currentValue: number;

  @IsNumber()
  @Min(0)
  threshold: number;

  @IsNumber()
  @Min(0)
  @Max(1)
  weight: number; // Importance weight for this indicator (0-1)

  @IsEnum(TrendDirection)
  trend: TrendDirection;

  @IsEnum(RiskLevel)
  riskLevel: RiskLevel;

  @IsNumber()
  @Min(0)
  @Max(1)
  confidence: number; // Confidence in the indicator measurement (0-1)

  @IsDateString()
  lastUpdated: string;

  @IsOptional()
  @IsString()
  unit?: string; // Unit of measurement (e.g., 'hours', 'percentage', 'count')

  @IsOptional()
  @IsString()
  source?: string; // Data source for this indicator
}

export class HistoricalDataPointDto {
  @IsDateString()
  timestamp: string;

  @IsNumber()
  value: number;

  @IsOptional()
  @IsString()
  context?: string; // Additional context for this data point
}

export class RiskIndicatorWithHistoryDto extends RiskIndicatorDto {
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => HistoricalDataPointDto)
  historicalData?: HistoricalDataPointDto[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  predictedTrend?: number; // Predicted trend direction confidence (0-1)
}

export class CreateRiskIndicatorDto {
  @IsString()
  projectId: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsEnum(IndicatorCategory)
  category: IndicatorCategory;

  @IsNumber()
  @Min(0)
  currentValue: number;

  @IsNumber()
  @Min(0)
  threshold: number;

  @IsNumber()
  @Min(0)
  @Max(1)
  weight: number;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsString()
  source?: string;
}

export class UpdateRiskIndicatorDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  currentValue?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  threshold?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  weight?: number;

  @IsOptional()
  @IsEnum(TrendDirection)
  trend?: TrendDirection;

  @IsOptional()
  @IsString()
  description?: string;
}
