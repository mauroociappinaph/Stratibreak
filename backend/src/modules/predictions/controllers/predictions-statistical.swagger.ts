import { ApiProperty } from '@nestjs/swagger';

// Statistical Analysis Response DTOs
export class MonteCarloRiskAnalysisResponseDto {
  @ApiProperty({ example: 'project-123' })
  projectId: string;

  @ApiProperty({
    type: 'object',
    properties: {
      meanRisk: { type: 'number', example: 0.45 },
      confidenceInterval: {
        type: 'object',
        properties: {
          lower: { type: 'number', example: 0.32 },
          upper: { type: 'number', example: 0.58 },
        },
      },
      riskDistribution: {
        type: 'object',
        properties: {
          samples: { type: 'number', example: 1000 },
          min: { type: 'number' },
          max: { type: 'number' },
          percentiles: {
            type: 'object',
            properties: {
              p5: { type: 'number' },
              p25: { type: 'number' },
              p50: { type: 'number' },
              p75: { type: 'number' },
              p95: { type: 'number' },
            },
          },
        },
      },
    },
  })
  monteCarloAnalysis: object;

  @ApiProperty({ type: 'number', example: 0.52 })
  compoundRisk: number;

  @ApiProperty({
    type: 'object',
    properties: {
      volatility: { type: 'number' },
      skewness: { type: 'number' },
      kurtosis: { type: 'number' },
    },
  })
  riskMetrics: object;

  @ApiProperty({
    type: 'array',
    items: { type: 'string' },
  })
  recommendations: string[];

  @ApiProperty({ example: '2024-01-08T10:30:00.000Z' })
  analysisTimestamp: string;

  @ApiProperty({
    type: 'object',
    properties: {
      iterations: { type: 'number', example: 1000 },
      confidenceLevel: { type: 'number', example: 0.9 },
      method: { type: 'string', example: 'Monte Carlo' },
    },
  })
  simulationParameters: object;
}

export class DynamicRiskThresholdsResponseDto {
  @ApiProperty({ example: 'project-123' })
  projectId: string;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
      properties: {
        indicator: { type: 'string' },
        currentValue: { type: 'number' },
        staticThreshold: { type: 'number' },
        dynamicThresholds: {
          type: 'object',
          properties: {
            warning: { type: 'number' },
            critical: { type: 'number' },
            emergency: { type: 'number' },
          },
        },
        riskLevels: {
          type: 'object',
          properties: {
            low: { type: 'boolean' },
            medium: { type: 'boolean' },
            high: { type: 'boolean' },
            critical: { type: 'boolean' },
          },
        },
        adaptationReason: { type: 'string' },
      },
    },
  })
  dynamicThresholds: object[];

  @ApiProperty({
    type: 'object',
    properties: {
      adaptiveIndicators: { type: 'number' },
      totalIndicators: { type: 'number' },
      averageAdaptation: { type: 'number' },
    },
  })
  thresholdAnalysis: object;

  @ApiProperty({
    type: 'array',
    items: { type: 'string' },
  })
  recommendations: string[];

  @ApiProperty({ example: '2024-01-08T10:30:00.000Z' })
  analysisTimestamp: string;

  @ApiProperty({ example: '90 days' })
  historicalDataPeriod: string;
}
