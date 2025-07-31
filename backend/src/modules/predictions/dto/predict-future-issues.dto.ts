import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class TimeRangeDto {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}

export class HistoricalMetricDto {
  @IsString()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TimeSeriesValueDto)
  values: TimeSeriesValueDto[];

  @IsString()
  unit: string;
}

export class TimeSeriesValueDto {
  @IsDateString()
  timestamp: string;

  @IsNumber()
  value: number;
}

export class HistoricalEventDto {
  @IsDateString()
  timestamp: string;

  @IsString()
  type: string;

  @IsString()
  description: string;

  @IsString()
  impact: string; // ImpactLevel as string
}

export class HistoricalPatternDto {
  @IsString()
  patternType: string;

  @IsNumber()
  frequency: number;

  @IsNumber()
  confidence: number;

  @IsString()
  description: string;
}

export class PredictFutureIssuesDto {
  @IsString()
  projectId: string;

  @ValidateNested()
  @Type(() => TimeRangeDto)
  timeRange: TimeRangeDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HistoricalMetricDto)
  metrics: HistoricalMetricDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HistoricalEventDto)
  events: HistoricalEventDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HistoricalPatternDto)
  patterns: HistoricalPatternDto[];
}
