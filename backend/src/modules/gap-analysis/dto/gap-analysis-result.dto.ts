import { ApiProperty } from '@nestjs/swagger';
import { CategorizedGapsDto } from './gap-categorization.dto';
import { RecommendationDto } from './recommendation.dto';

export class GapAnalysisResultDto {
  @ApiProperty({
    description: 'Project identifier that was analyzed',
    example: 'proj_123456789',
  })
  projectId: string;

  @ApiProperty({
    description: 'Timestamp when the analysis was performed',
    example: '2024-01-15T10:30:00Z',
    type: 'string',
    format: 'date-time',
  })
  analysisTimestamp: Date;

  @ApiProperty({
    description: 'Gaps identified and categorized by type',
    type: CategorizedGapsDto,
  })
  identifiedGaps: CategorizedGapsDto;

  @ApiProperty({
    description: 'Overall project health score (0-100)',
    example: 75,
    minimum: 0,
    maximum: 100,
  })
  overallHealthScore: number;

  @ApiProperty({
    description: 'Prioritized recommendations to address identified gaps',
    type: [RecommendationDto],
  })
  prioritizedRecommendations: RecommendationDto[];

  @ApiProperty({
    description: 'Time taken to execute the analysis in milliseconds',
    example: 1250,
    minimum: 0,
  })
  executionTimeMs: number;

  @ApiProperty({
    description: 'Overall confidence in the analysis results (0-1)',
    example: 0.87,
    minimum: 0,
    maximum: 1,
  })
  confidence: number;
}

// Re-export all DTOs for convenience
export * from './detailed-gap.dto';
export * from './gap-categorization.dto';
export * from './impact.dto';
export * from './project-area.dto';
export * from './recommendation.dto';
export * from './root-cause.dto';
