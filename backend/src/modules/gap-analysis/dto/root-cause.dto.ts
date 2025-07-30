import { ApiProperty } from '@nestjs/swagger';

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
