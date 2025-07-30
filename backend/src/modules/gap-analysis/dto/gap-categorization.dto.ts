import { ApiProperty } from '@nestjs/swagger';
import { DetailedGapDto } from './detailed-gap.dto';

export class GapCategoryMetricsDto {
  @ApiProperty({
    description: 'Total number of gaps in this category',
    example: 5,
  })
  totalCount: number;

  @ApiProperty({
    description: 'Number of gaps by severity level',
    example: { low: 1, medium: 2, high: 1, critical: 1 },
  })
  bySeverity: Record<string, number>;

  @ApiProperty({
    description: 'Average confidence level for gaps in this category',
    example: 0.82,
    minimum: 0,
    maximum: 1,
  })
  averageConfidence: number;

  @ApiProperty({
    description: 'Most common root cause category',
    example: 'process',
  })
  primaryRootCause: string;

  @ApiProperty({
    description: 'Trend compared to previous analysis',
    example: 'increasing',
    enum: ['increasing', 'decreasing', 'stable', 'new'],
  })
  trend: string;
}

export class CategorizedGapsDto {
  @ApiProperty({
    description: 'Resource-related gaps',
    type: [DetailedGapDto],
  })
  resource: DetailedGapDto[];

  @ApiProperty({
    description: 'Process-related gaps',
    type: [DetailedGapDto],
  })
  process: DetailedGapDto[];

  @ApiProperty({
    description: 'Communication-related gaps',
    type: [DetailedGapDto],
  })
  communication: DetailedGapDto[];

  @ApiProperty({
    description: 'Technology-related gaps',
    type: [DetailedGapDto],
  })
  technology: DetailedGapDto[];

  @ApiProperty({
    description: 'Culture-related gaps',
    type: [DetailedGapDto],
  })
  culture: DetailedGapDto[];

  @ApiProperty({
    description: 'Timeline-related gaps',
    type: [DetailedGapDto],
  })
  timeline: DetailedGapDto[];

  @ApiProperty({
    description: 'Quality-related gaps',
    type: [DetailedGapDto],
  })
  quality: DetailedGapDto[];

  @ApiProperty({
    description: 'Budget-related gaps',
    type: [DetailedGapDto],
  })
  budget: DetailedGapDto[];

  @ApiProperty({
    description: 'Skill-related gaps',
    type: [DetailedGapDto],
  })
  skill: DetailedGapDto[];

  @ApiProperty({
    description: 'Governance-related gaps',
    type: [DetailedGapDto],
  })
  governance: DetailedGapDto[];

  @ApiProperty({
    description: 'Metrics for each gap category',
    type: 'object',
    additionalProperties: {
      type: 'object',
      $ref: '#/components/schemas/GapCategoryMetricsDto',
    },
  })
  categoryMetrics: Record<string, GapCategoryMetricsDto>;

  @ApiProperty({
    description: 'Summary statistics across all categories',
    type: 'object',
  })
  summary: {
    totalGaps: number;
    criticalGaps: number;
    highPriorityGaps: number;
    averageConfidence: number;
    mostAffectedCategory: string;
    leastAffectedCategory: string;
  };
}
