import { ApiProperty } from '@nestjs/swagger';

// Risk Assessment Response DTOs
export class RiskAssessmentResponseDto {
  @ApiProperty({ example: 'project-123' })
  projectId: string;

  @ApiProperty({
    example: 'MEDIUM',
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
  })
  overallRiskLevel: string;

  @ApiProperty({ example: 0.45, minimum: 0, maximum: 1 })
  riskScore: number;

  @ApiProperty({
    type: 'object',
    properties: {
      overallRisk: { type: 'number', example: 0.45 },
      riskFactors: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            factor: { type: 'string', example: 'velocity_trend' },
            weight: { type: 'number', example: 0.8 },
            currentValue: { type: 'number', example: 7.2 },
            threshold: { type: 'number', example: 8.5 },
            trend: { type: 'string', example: 'declining' },
          },
        },
      },
      recommendations: {
        type: 'array',
        items: { type: 'string' },
        example: ['Increase resource allocation by 15%'],
      },
      confidenceLevel: { type: 'number', example: 0.85 },
    },
  })
  riskAssessment: object;

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
      },
    },
  })
  earlyWarnings: object[];

  @ApiProperty({
    type: 'array',
    items: { type: 'string' },
    example: ['velocity_trend: 7.2 (threshold: 8.5)'],
  })
  criticalRisks: string[];

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  nextReviewDate: string;

  @ApiProperty({ example: '2024-01-08T10:30:00.000Z' })
  analysisTimestamp: string;
}

export class PredictiveAlertsResponseDto {
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
        createdAt: { type: 'string', format: 'date-time' },
        expiresAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  predictiveAlerts: object[];

  @ApiProperty({ example: '2024-01-08T10:30:00.000Z' })
  analysisTimestamp: string;

  @ApiProperty({ example: 72, description: 'Minimum advance warning in hours' })
  advanceWarningHours: number;
}

export class RiskCorrelationAnalysisResponseDto {
  @ApiProperty({ example: 'project-123' })
  projectId: string;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
      properties: {
        indicator: { type: 'string' },
        risk: { type: 'number' },
        weight: { type: 'number' },
      },
    },
  })
  individualRisks: object[];

  @ApiProperty({
    type: 'object',
    properties: {
      overallRisk: { type: 'number' },
      confidenceLevel: { type: 'number' },
    },
  })
  compoundRisk: object;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'array',
      items: { type: 'number' },
    },
    description: 'Correlation matrix between risk indicators',
  })
  correlationMatrix: number[][];

  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
      properties: {
        indicator: { type: 'string' },
        correlatedWith: { type: 'array', items: { type: 'string' } },
        compoundEffect: { type: 'number' },
      },
    },
  })
  riskInteractions: object[];

  @ApiProperty({
    type: 'array',
    items: { type: 'string' },
  })
  recommendations: string[];

  @ApiProperty({ example: '2024-01-08T10:30:00.000Z' })
  analysisTimestamp: string;
}

export class EarlyWarningStatusResponseDto {
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
        createdAt: { type: 'string', format: 'date-time' },
        expiresAt: { type: 'string', format: 'date-time' },
        escalationLevel: { type: 'number' },
        timeToEscalation: {
          type: 'object',
          properties: {
            value: { type: 'number' },
            unit: { type: 'string' },
          },
        },
      },
    },
  })
  activeWarnings: object[];

  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        originalWarningId: { type: 'string' },
        severity: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string' },
        escalatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  escalationAlerts: object[];

  @ApiProperty({
    type: 'object',
    properties: {
      totalActive: { type: 'number' },
      critical: { type: 'number' },
      high: { type: 'number' },
      medium: { type: 'number' },
      low: { type: 'number' },
      requiresEscalation: { type: 'number' },
    },
  })
  warningStatistics: object;

  @ApiProperty({ example: '2024-01-08T14:30:00.000Z' })
  nextReviewTime: string;

  @ApiProperty({ example: '2024-01-08T10:30:00.000Z' })
  analysisTimestamp: string;
}
