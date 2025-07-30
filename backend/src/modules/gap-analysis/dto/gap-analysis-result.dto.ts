import { ApiProperty } from '@nestjs/swagger';
import { GapType, SeverityLevel } from './create-gap-analysis.dto';

export class RootCauseDto {
  @ApiProperty({
    description: 'Unique identifier of the root cause',
    example: 'rc_123456789',
  })
  id: string;

  @ApiProperty({
    description: 'Category of the root cause',
    example: 'process',
  })
  category: string;

  @ApiProperty({
    description: 'Description of the root cause',
    example: 'Insufficient resource planning and allocation',
  })
  description: string;

  @ApiProperty({
    description: 'Confidence level in this root cause identification (0-1)',
    example: 0.8,
    minimum: 0,
    maximum: 1,
  })
  confidence: number;

  @ApiProperty({
    description: 'Evidence supporting this root cause',
    example: ['Resource utilization metrics', 'Team workload data'],
    type: [String],
  })
  evidence: string[];

  @ApiProperty({
    description: 'Weight of this root cause contribution (0-1)',
    example: 0.9,
    minimum: 0,
    maximum: 1,
  })
  contributionWeight: number;
}

export class ProjectAreaDto {
  @ApiProperty({
    description: 'Unique identifier of the project area',
    example: 'area_123456789',
  })
  id: string;

  @ApiProperty({
    description: 'Name of the affected project area',
    example: 'Team Productivity',
  })
  name: string;

  @ApiProperty({
    description: 'Description of the project area',
    example: 'Team performance and sustainability',
  })
  description: string;

  @ApiProperty({
    description: 'Criticality level of this area',
    example: 'high',
    enum: ['low', 'medium', 'high', 'critical'],
  })
  criticality: string;
}

export class ImpactDto {
  @ApiProperty({
    description: 'Unique identifier of the impact',
    example: 'impact_123456789',
  })
  id: string;

  @ApiProperty({
    description: 'Type of impact',
    example: 'team_morale',
    enum: [
      'timeline',
      'budget',
      'quality',
      'scope',
      'team_morale',
      'customer_satisfaction',
      'reputation',
    ],
  })
  type: string;

  @ApiProperty({
    description: 'Level of impact',
    example: 'high',
    enum: ['negligible', 'low', 'medium', 'high', 'severe'],
  })
  level: string;

  @ApiProperty({
    description: 'Description of the impact',
    example: 'Team burnout risk and decreased productivity',
  })
  description: string;

  @ApiProperty({
    description: 'Timeframe when impact will be felt',
    example: 'short-term',
    enum: ['immediate', 'short-term', 'medium-term', 'long-term'],
  })
  timeframe: string;

  @ApiProperty({
    description: 'List of stakeholders affected by this impact',
    example: ['team-members', 'project-manager'],
    type: [String],
  })
  affectedStakeholders: string[];
}

export class DetailedGapDto {
  @ApiProperty({
    description: 'Unique identifier of the gap',
    example: 'gap_detailed_123456789',
  })
  id?: string;

  @ApiProperty({
    description: 'Project identifier',
    example: 'proj_123456789',
  })
  projectId: string;

  @ApiProperty({
    description: 'Type of gap identified',
    enum: GapType,
    example: GapType.RESOURCE,
  })
  type: GapType;

  @ApiProperty({
    description: 'Category of the gap',
    example: 'operational',
    enum: [
      'operational',
      'strategic',
      'tactical',
      'technical',
      'organizational',
    ],
  })
  category: string;

  @ApiProperty({
    description: 'Title of the gap',
    example: 'Resource Over-utilization',
  })
  title: string;

  @ApiProperty({
    description: 'Detailed description of the gap',
    example:
      'Resources are over-utilized at 95.0% affecting team sustainability',
  })
  description: string;

  @ApiProperty({
    description: 'Current value of the metric',
    example: 0.95,
  })
  currentValue: any;

  @ApiProperty({
    description: 'Target value for the metric',
    example: 0.8,
  })
  targetValue: any;

  @ApiProperty({
    description: 'Variance between current and target values',
    example: 0.15,
  })
  variance: number;

  @ApiProperty({
    description: 'Severity level of the gap',
    enum: SeverityLevel,
    example: SeverityLevel.HIGH,
  })
  severity: SeverityLevel;

  @ApiProperty({
    description: 'Root causes contributing to this gap',
    type: [RootCauseDto],
  })
  rootCauses: RootCauseDto[];

  @ApiProperty({
    description: 'Project areas affected by this gap',
    type: [ProjectAreaDto],
  })
  affectedAreas: ProjectAreaDto[];

  @ApiProperty({
    description: 'Estimated impact of this gap',
    type: ImpactDto,
  })
  estimatedImpact: ImpactDto;

  @ApiProperty({
    description: 'Confidence level in this gap identification (0-1)',
    example: 0.85,
    minimum: 0,
    maximum: 1,
  })
  confidence: number;
}

export class RecommendationDto {
  @ApiProperty({
    description: 'Unique identifier of the recommendation',
    example: 'rec_123456789',
  })
  id: string;

  @ApiProperty({
    description: 'Gap identifier this recommendation addresses',
    example: 'gap_123456789',
  })
  gapId: string;

  @ApiProperty({
    description: 'Title of the recommendation',
    example: 'Address Resource Over-utilization',
  })
  title: string;

  @ApiProperty({
    description: 'Detailed description of the recommended action',
    example:
      'Allocate additional resources or optimize current resource utilization for Resource Over-utilization',
  })
  description: string;

  @ApiProperty({
    description: 'Priority level of this recommendation',
    example: 'high',
    enum: ['low', 'medium', 'high', 'urgent'],
  })
  priority: string;

  @ApiProperty({
    description: 'Estimated effort required in hours',
    example: 36,
    minimum: 0,
  })
  estimatedEffort: number;

  @ApiProperty({
    description: 'Estimated impact of implementing this recommendation (0-1)',
    example: 0.85,
    minimum: 0,
    maximum: 1,
  })
  estimatedImpact: number;

  @ApiProperty({
    description: 'Resources required to implement this recommendation',
    example: ['Project Manager', 'HR Manager', 'Additional Team Members'],
    type: [String],
  })
  requiredResources: string[];

  @ApiProperty({
    description: 'Estimated timeline for implementation',
    example: '2-4 weeks',
  })
  timeline: string;

  @ApiProperty({
    description: 'Dependencies that must be resolved first',
    example: [],
    type: [String],
  })
  dependencies: string[];
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
}

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
