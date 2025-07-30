import { ApiProperty } from '@nestjs/swagger';
import { SeverityLevel } from '../../../types/database/gap.types';
import { DetailedGapDto } from './detailed-gap.dto';

export class SeverityDistributionDto {
  @ApiProperty({
    description: 'Number of critical severity gaps',
    example: 2,
  })
  critical: number;

  @ApiProperty({
    description: 'Number of high severity gaps',
    example: 5,
  })
  high: number;

  @ApiProperty({
    description: 'Number of medium severity gaps',
    example: 8,
  })
  medium: number;

  @ApiProperty({
    description: 'Number of low severity gaps',
    example: 3,
  })
  low: number;

  @ApiProperty({
    description: 'Total number of gaps analyzed',
    example: 18,
  })
  total: number;
}

export class SeverityTrendDto {
  @ApiProperty({
    description: 'Severity level',
    enum: SeverityLevel,
    example: SeverityLevel.HIGH,
  })
  severity: SeverityLevel;

  @ApiProperty({
    description: 'Current count of gaps at this severity',
    example: 5,
  })
  currentCount: number;

  @ApiProperty({
    description: 'Previous count of gaps at this severity',
    example: 3,
  })
  previousCount: number;

  @ApiProperty({
    description: 'Percentage change from previous analysis',
    example: 66.67,
  })
  changePercentage: number;

  @ApiProperty({
    description: 'Trend direction',
    example: 'increasing',
    enum: ['increasing', 'decreasing', 'stable'],
  })
  trend: 'increasing' | 'decreasing' | 'stable';
}

export class SeverityMetricsDto {
  @ApiProperty({
    description: 'Average severity score (0-1 scale)',
    example: 0.72,
    minimum: 0,
    maximum: 1,
  })
  averageSeverityScore: number;

  @ApiProperty({
    description: 'Weighted severity score considering gap types',
    example: 0.68,
    minimum: 0,
    maximum: 1,
  })
  weightedSeverityScore: number;

  @ApiProperty({
    description: 'Severity volatility (standard deviation)',
    example: 0.15,
    minimum: 0,
    maximum: 1,
  })
  severityVolatility: number;

  @ApiProperty({
    description: 'Risk escalation probability',
    example: 0.35,
    minimum: 0,
    maximum: 1,
  })
  escalationProbability: number;

  @ApiProperty({
    description: 'Most common severity level',
    enum: SeverityLevel,
    example: SeverityLevel.MEDIUM,
  })
  dominantSeverity: SeverityLevel;

  @ApiProperty({
    description: 'Confidence in severity calculations',
    example: 0.87,
    minimum: 0,
    maximum: 1,
  })
  calculationConfidence: number;
}

export class SeverityRecommendationDto {
  @ApiProperty({
    description: 'Unique identifier for the recommendation',
    example: 'sev_rec_001',
  })
  id: string;

  @ApiProperty({
    description: 'Target severity level to address',
    enum: SeverityLevel,
    example: SeverityLevel.CRITICAL,
  })
  targetSeverity: SeverityLevel;

  @ApiProperty({
    description: 'Recommended action',
    example:
      'Immediately address critical resource gaps to prevent project failure',
  })
  action: string;

  @ApiProperty({
    description: 'Priority level for this recommendation',
    example: 'urgent',
    enum: ['low', 'medium', 'high', 'urgent'],
  })
  priority: 'low' | 'medium' | 'high' | 'urgent';

  @ApiProperty({
    description: 'Expected impact of implementing this recommendation',
    example: 'Reduce critical gaps by 80% within 2 weeks',
  })
  expectedImpact: string;

  @ApiProperty({
    description: 'Estimated effort required',
    example: 'high',
    enum: ['low', 'medium', 'high'],
  })
  estimatedEffort: 'low' | 'medium' | 'high';

  @ApiProperty({
    description: 'Timeline for implementation',
    example: '1-2 weeks',
  })
  timeline: string;
}

export class SeverityAnalysisDto {
  @ApiProperty({
    description: 'Project identifier',
    example: 'proj_123456789',
  })
  projectId: string;

  @ApiProperty({
    description: 'Timestamp of the severity analysis',
    example: '2024-01-15T10:30:00Z',
    type: 'string',
    format: 'date-time',
  })
  analysisTimestamp: Date;

  @ApiProperty({
    description: 'Distribution of gaps by severity level',
    type: SeverityDistributionDto,
  })
  severityDistribution: SeverityDistributionDto;

  @ApiProperty({
    description: 'Severity trends compared to previous analyses',
    type: [SeverityTrendDto],
  })
  severityTrends: SeverityTrendDto[];

  @ApiProperty({
    description: 'Calculated severity metrics and statistics',
    type: SeverityMetricsDto,
  })
  severityMetrics: SeverityMetricsDto;

  @ApiProperty({
    description: 'Gaps grouped by severity level',
    type: 'object',
    additionalProperties: {
      type: 'array',
      items: { $ref: '#/components/schemas/DetailedGapDto' },
    },
  })
  gapsBySeverity: Record<string, DetailedGapDto[]>;

  @ApiProperty({
    description: 'Recommendations for addressing severity issues',
    type: [SeverityRecommendationDto],
  })
  recommendations: SeverityRecommendationDto[];

  @ApiProperty({
    description: 'Overall severity assessment',
    example: 'moderate',
    enum: ['low', 'moderate', 'high', 'critical'],
  })
  overallSeverityAssessment: 'low' | 'moderate' | 'high' | 'critical';

  @ApiProperty({
    description: 'Confidence in the overall severity analysis',
    example: 0.89,
    minimum: 0,
    maximum: 1,
  })
  analysisConfidence: number;

  @ApiProperty({
    description:
      'Time taken to perform the severity analysis (in milliseconds)',
    example: 1250,
  })
  executionTimeMs: number;
}
