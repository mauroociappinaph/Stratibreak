import { ApiProperty } from '@nestjs/swagger';

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
