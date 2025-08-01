import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';

export class AlertResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the alert',
    example: 'alert_001',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'Project identifier',
    example: 'proj_123456789',
  })
  @IsString()
  projectId: string;

  @ApiProperty({
    description: 'Type of alert',
    example: 'early_warning',
    enum: ['early_warning', 'risk_alert', 'trend_alert', 'anomaly_alert'],
  })
  @IsString()
  type: string;

  @ApiProperty({
    description: 'Severity level of the alert',
    example: 'high',
    enum: ['low', 'medium', 'high', 'critical'],
  })
  @IsString()
  severity: string;

  @ApiProperty({
    description: 'Alert title',
    example: 'Velocity Decline Detected',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Detailed alert description',
    example: 'Team velocity has declined by 40% over the past 2 weeks',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Probability of the predicted issue',
    example: 0.85,
    minimum: 0,
    maximum: 1,
  })
  @IsNumber()
  probability: number;

  @ApiProperty({
    description: 'Estimated time until the issue occurs',
    type: 'object',
    properties: {
      value: { type: 'number', example: 72 },
      unit: { type: 'string', example: 'hours' },
    },
  })
  estimatedTimeToOccurrence: {
    value: number;
    unit: string;
  };

  @ApiProperty({
    description: 'Potential impact level',
    example: 'high',
    enum: ['low', 'medium', 'high', 'critical'],
  })
  @IsString()
  potentialImpact: string;

  @ApiProperty({
    description: 'Time window available for prevention',
    type: 'object',
    properties: {
      value: { type: 'number', example: 48 },
      unit: { type: 'string', example: 'hours' },
    },
  })
  preventionWindow: {
    value: number;
    unit: string;
  };

  @ApiProperty({
    description: 'Suggested preventive actions',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string' },
        priority: { type: 'string' },
        estimatedEffort: { type: 'string' },
        requiredResources: { type: 'array', items: { type: 'string' } },
        expectedImpact: { type: 'string' },
        deadline: { type: 'string', format: 'date-time' },
      },
    },
  })
  @IsArray()
  suggestedActions: Array<{
    id: string;
    title: string;
    description: string;
    priority: string;
    estimatedEffort: string;
    requiredResources: string[];
    expectedImpact: string;
    deadline: string;
  }>;

  @ApiProperty({
    description: 'Timestamp when the alert was created',
    example: '2024-07-31T15:30:00Z',
    format: 'date-time',
  })
  @IsString()
  createdAt: string;

  @ApiProperty({
    description: 'Timestamp when the alert expires',
    example: '2024-08-07T15:30:00Z',
    format: 'date-time',
  })
  @IsString()
  expiresAt: string;
}

export class GenerateEarlyWarningsResponseDto {
  @ApiProperty({
    description: 'Project identifier',
    example: 'proj_123456789',
  })
  @IsString()
  projectId: string;

  @ApiProperty({
    description: 'Overall risk level based on all alerts',
    example: 'high',
    enum: ['low', 'medium', 'high', 'critical'],
  })
  @IsString()
  overallRiskLevel: string;

  @ApiProperty({
    description: 'Array of generated early warning alerts',
    type: [AlertResponseDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AlertResponseDto)
  alerts: AlertResponseDto[];

  @ApiProperty({
    description: 'Timestamp when the analysis was performed',
    example: '2024-07-31T15:30:00Z',
    format: 'date-time',
  })
  @IsString()
  analysisTimestamp: string;
}
