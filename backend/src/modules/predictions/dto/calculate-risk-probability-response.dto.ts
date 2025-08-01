import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';

export class RiskFactorResponseDto {
  @ApiProperty({
    description: 'Risk factor name',
    example: 'velocity_decline',
  })
  @IsString()
  factor: string;

  @ApiProperty({
    description: 'Weight of this factor in overall risk calculation',
    example: 0.3,
    minimum: 0,
    maximum: 1,
  })
  @IsNumber()
  weight: number;

  @ApiProperty({
    description: 'Current value of the risk factor',
    example: 15.5,
  })
  @IsNumber()
  currentValue: number;

  @ApiProperty({
    description: 'Threshold value for this risk factor',
    example: 20.0,
  })
  @IsNumber()
  threshold: number;

  @ApiProperty({
    description: 'Trend direction of this risk factor',
    example: 'declining',
    enum: ['improving', 'stable', 'declining', 'volatile'],
  })
  @IsString()
  trend: string;
}

export class RiskAssessmentResponseDto {
  @ApiProperty({
    description: 'Overall risk score',
    example: 0.75,
    minimum: 0,
    maximum: 1,
  })
  @IsNumber()
  overallRisk: number;

  @ApiProperty({
    description: 'Individual risk factors contributing to overall risk',
    type: [RiskFactorResponseDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RiskFactorResponseDto)
  riskFactors: RiskFactorResponseDto[];

  @ApiProperty({
    description: 'Recommended actions to mitigate risk',
    example: [
      'Increase team velocity monitoring',
      'Review sprint planning process',
    ],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  recommendations: string[];

  @ApiProperty({
    description: 'Confidence level of the risk assessment',
    example: 0.85,
    minimum: 0,
    maximum: 1,
  })
  @IsNumber()
  confidenceLevel: number;
}

export class CalculateRiskProbabilityResponseDto {
  @ApiProperty({
    description: 'Project identifier',
    example: 'proj_123456789',
  })
  @IsString()
  projectId: string;

  @ApiProperty({
    description: 'Detailed risk assessment results',
    type: RiskAssessmentResponseDto,
  })
  @ValidateNested()
  @Type(() => RiskAssessmentResponseDto)
  riskAssessment: RiskAssessmentResponseDto;

  @ApiProperty({
    description: 'Timestamp when the analysis was performed',
    example: '2024-07-31T15:30:00Z',
    format: 'date-time',
  })
  @IsString()
  analysisTimestamp: string;
}
