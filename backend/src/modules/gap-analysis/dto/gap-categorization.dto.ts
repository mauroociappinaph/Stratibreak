import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { DetailedGapDto } from './gap-analysis-result.dto';

export class GapCategoryAnalysisDto {
  @ApiProperty({
    description: 'Category name',
    example: 'resource',
  })
  @IsString()
  category: string;

  @ApiProperty({
    description: 'Gaps in this category',
    type: [DetailedGapDto],
  })
  @IsArray()
  gaps: DetailedGapDto[];

  @ApiProperty({
    description: 'Total count of gaps in this category',
    example: 5,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  totalCount: number;

  @ApiProperty({
    description: 'Distribution by severity level',
    example: { low: 1, medium: 2, high: 1, critical: 1 },
  })
  severityDistribution: Record<string, number>;

  @ApiProperty({
    description: 'Average confidence level for this category',
    example: 0.82,
    minimum: 0,
    maximum: 1,
  })
  @IsNumber()
  @Min(0)
  @Max(1)
  averageConfidence: number;

  @ApiProperty({
    description: 'Most common root causes in this category',
    example: ['process', 'resource_allocation'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  commonRootCauses: string[];

  @ApiProperty({
    description: 'Recommended priority level for addressing this category',
    example: 'high',
    enum: ['low', 'medium', 'high', 'urgent'],
  })
  @IsString()
  recommendedPriority: string;

  @ApiProperty({
    description:
      'Estimated effort to address all gaps in this category (hours)',
    example: 120,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  estimatedEffort?: number;

  @ApiProperty({
    description: 'Potential impact of addressing this category (0-1)',
    example: 0.85,
    minimum: 0,
    maximum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  potentialImpact?: number;
}

export class GapTrendAnalysisDto {
  @ApiProperty({
    description: 'Category being analyzed',
    example: 'resource',
  })
  @IsString()
  category: string;

  @ApiProperty({
    description: 'Current period gap count',
    example: 5,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  currentCount: number;

  @ApiProperty({
    description: 'Previous period gap count',
    example: 3,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  previousCount: number;

  @ApiProperty({
    description: 'Trend direction',
    example: 'increasing',
    enum: ['increasing', 'decreasing', 'stable', 'new'],
  })
  @IsString()
  trend: 'increasing' | 'decreasing' | 'stable' | 'new';

  @ApiProperty({
    description: 'Percentage change from previous period',
    example: 66.7,
  })
  @IsNumber()
  percentageChange: number;

  @ApiProperty({
    description: 'Trend analysis over time',
    example: [
      { period: '2024-01', count: 2 },
      { period: '2024-02', count: 3 },
      { period: '2024-03', count: 5 },
    ],
  })
  @IsArray()
  historicalData: Array<{
    period: string;
    count: number;
    averageSeverity: number;
  }>;
}

export class GapCategorizationRequestDto {
  @ApiProperty({
    description: 'Project ID to categorize gaps for',
    example: 'proj_123456789',
  })
  @IsString()
  projectId: string;

  @ApiProperty({
    description: 'Include trend analysis',
    example: true,
    required: false,
    default: false,
  })
  @IsOptional()
  includeTrends?: boolean = false;

  @ApiProperty({
    description: 'Include effort estimation',
    example: true,
    required: false,
    default: false,
  })
  @IsOptional()
  includeEffortEstimation?: boolean = false;

  @ApiProperty({
    description: 'Include impact analysis',
    example: true,
    required: false,
    default: false,
  })
  @IsOptional()
  includeImpactAnalysis?: boolean = false;

  @ApiProperty({
    description: 'Time period for trend analysis (in days)',
    example: 30,
    minimum: 1,
    maximum: 365,
    required: false,
    default: 30,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(365)
  trendPeriodDays?: number = 30;
}

export class GapCategorizationResponseDto {
  @ApiProperty({
    description: 'Project ID that was analyzed',
    example: 'proj_123456789',
  })
  projectId: string;

  @ApiProperty({
    description: 'Analysis timestamp',
    example: '2024-01-15T10:30:00Z',
    type: 'string',
    format: 'date-time',
  })
  analysisTimestamp: Date;

  @ApiProperty({
    description: 'Gap analysis by category',
    type: [GapCategoryAnalysisDto],
  })
  categoryAnalysis: GapCategoryAnalysisDto[];

  @ApiProperty({
    description: 'Trend analysis by category (if requested)',
    type: [GapTrendAnalysisDto],
    required: false,
  })
  @IsOptional()
  trendAnalysis?: GapTrendAnalysisDto[];

  @ApiProperty({
    description: 'Overall categorization summary',
    type: 'object',
  })
  summary: {
    totalGaps: number;
    totalCategories: number;
    mostAffectedCategory: string;
    leastAffectedCategory: string;
    overallTrend: string;
    recommendedFocus: string[];
  };

  @ApiProperty({
    description: 'Execution time in milliseconds',
    example: 1250,
    minimum: 0,
  })
  executionTimeMs: number;
}
