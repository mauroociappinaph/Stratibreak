import { ApiProperty } from '@nestjs/swagger';

// Advanced Prediction Response DTOs
export class TrendAnalysisResponseDto {
  @ApiProperty({ example: 'project-123' })
  projectId: string;

  @ApiProperty({
    type: 'object',
    properties: {
      trends: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            metric: { type: 'string' },
            direction: {
              type: 'string',
              enum: ['increasing', 'decreasing', 'stable'],
            },
            strength: { type: 'number', minimum: 0, maximum: 1 },
            confidence: { type: 'number', minimum: 0, maximum: 1 },
          },
        },
      },
      predictions: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            metric: { type: 'string' },
            predictedValue: { type: 'number' },
            timeHorizon: { type: 'string' },
            confidence: { type: 'number' },
          },
        },
      },
      seasonalPatterns: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            pattern: { type: 'string' },
            strength: { type: 'number' },
            period: { type: 'string' },
          },
        },
      },
    },
  })
  trendAnalysis: object;

  @ApiProperty({ example: '2024-01-08T10:30:00.000Z' })
  analysisTimestamp: string;
}

export class ComprehensiveWarningsResponseDto {
  @ApiProperty({ example: 'project-123' })
  projectId: string;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        type: { type: 'string' },
        severity: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string' },
        probability: { type: 'number' },
        estimatedTimeToOccurrence: {
          type: 'object',
          properties: {
            value: { type: 'number' },
            unit: { type: 'string' },
          },
        },
        potentialImpact: { type: 'string' },
        preventionWindow: {
          type: 'object',
          properties: {
            value: { type: 'number' },
            unit: { type: 'string' },
          },
        },
        suggestedActions: { type: 'array', items: { type: 'object' } },
        correlatedWarnings: { type: 'array', items: { type: 'string' } },
        dataSourcesUsed: { type: 'array', items: { type: 'string' } },
      },
    },
  })
  warnings: object[];

  @ApiProperty({ example: '2024-01-08T10:30:00.000Z' })
  analysisTimestamp: string;
}
