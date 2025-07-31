import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';

export class RiskFactorDto {
  @IsString()
  factor: string;

  @IsNumber()
  weight: number;

  @IsNumber()
  currentValue: number;

  @IsNumber()
  threshold: number;

  @IsString()
  trend: string; // TrendDirection as string
}

export class RiskAssessmentDto {
  @IsNumber()
  overallRisk: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RiskFactorDto)
  riskFactors: RiskFactorDto[];

  @IsArray()
  @IsString({ each: true })
  recommendations: string[];

  @IsNumber()
  confidenceLevel: number;
}

export class CalculateRiskProbabilityResponseDto {
  @IsString()
  projectId: string;

  @ValidateNested()
  @Type(() => RiskAssessmentDto)
  riskAssessment: RiskAssessmentDto;

  @IsString()
  analysisTimestamp: string;
}
