import { ApiProperty } from '@nestjs/swagger';
import { GapType, SeverityLevel } from '../dto/create-gap-analysis.dto';

export class GapAnalysisEntity {
  @ApiProperty({
    description: 'Unique identifier of the gap analysis record',
    example: 'gap_987654321',
    type: 'string',
  })
  id: string;

  @ApiProperty({
    description:
      'Unique identifier of the project this gap analysis belongs to',
    example: 'proj_123456789',
    type: 'string',
  })
  projectId: string;

  @ApiProperty({
    description: 'Title or name of the identified gap',
    example: 'Insufficient Development Resources',
    type: 'string',
  })
  title: string;

  @ApiProperty({
    description: 'Detailed description of the gap and its implications',
    example:
      'The project lacks sufficient senior developers to meet the delivery timeline',
    type: 'string',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Category or type of the identified gap',
    enum: GapType,
    example: GapType.RESOURCE,
    enumName: 'GapType',
  })
  type: GapType;

  @ApiProperty({
    description: 'Severity level indicating the urgency and impact of the gap',
    enum: SeverityLevel,
    example: SeverityLevel.HIGH,
    enumName: 'SeverityLevel',
  })
  severity: SeverityLevel;

  @ApiProperty({
    description: 'Timestamp when the gap analysis was created',
    example: '2024-01-15T10:30:00Z',
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the gap analysis was last updated',
    example: '2024-01-15T14:20:00Z',
    type: 'string',
    format: 'date-time',
  })
  updatedAt: Date;
}
