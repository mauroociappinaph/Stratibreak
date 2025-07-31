import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';

export class RiskIndicatorDto {
  @IsString()
  indicator: string;

  @IsNumber()
  currentValue: number;

  @IsNumber()
  threshold: number;

  @IsString()
  trend: string; // TrendDirection as string

  @IsNumber()
  weight: number;
}

export class CalculateRiskProbabilityDto {
  @IsString()
  projectId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RiskIndicatorDto)
  indicators: RiskIndicatorDto[];
}
