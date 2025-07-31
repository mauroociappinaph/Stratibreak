import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';

export class CurrentMetricDto {
  @IsString()
  name: string;

  @IsNumber()
  currentValue: number;

  @IsNumber()
  previousValue: number;

  @IsNumber()
  changeRate: number;

  @IsString()
  trend: string; // TrendDirection as string

  @IsString()
  unit: string;
}

export class DurationDto {
  @IsNumber()
  value: number;

  @IsString()
  unit: string; // TimeUnit as string
}

export class TrendChangeDto {
  @IsString()
  metric: string;

  @IsString()
  changeType: string; // ChangeType as string

  @IsNumber()
  magnitude: number;

  @ValidateNested()
  @Type(() => DurationDto)
  timeframe: DurationDto;

  @IsNumber()
  significance: number;
}

export class VelocityIndicatorDto {
  @IsString()
  name: string;

  @IsNumber()
  currentVelocity: number;

  @IsNumber()
  averageVelocity: number;

  @IsString()
  trend: string; // TrendDirection as string

  @IsNumber()
  predictedVelocity: number;
}

export class GenerateEarlyWarningsDto {
  @IsString()
  projectId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CurrentMetricDto)
  currentMetrics: CurrentMetricDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TrendChangeDto)
  recentChanges: TrendChangeDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VelocityIndicatorDto)
  velocityIndicators: VelocityIndicatorDto[];
}
