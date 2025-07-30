import { ApiProperty } from '@nestjs/swagger';

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
    description: 'Time frame when impact will be felt',
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
