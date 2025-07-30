import { ApiProperty } from '@nestjs/swagger';

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
