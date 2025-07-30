import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class RootCauseEntity {
  @ApiProperty({
    description: 'Unique identifier of the root cause',
    example: 'rc_123456789',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'Gap identifier this root cause belongs to',
    example: 'gap_123456789',
  })
  @IsString()
  gapId: string;

  @ApiProperty({
    description: 'Category of the root cause',
    example: 'process',
    enum: [
      'people',
      'process',
      'technology',
      'environment',
      'management',
      'external',
    ],
  })
  @IsString()
  category: string;

  @ApiProperty({
    description: 'Description of the root cause',
    example: 'Insufficient resource planning and allocation',
  })
  @IsString()
  @MaxLength(1000)
  description: string;

  @ApiProperty({
    description: 'Confidence level in this root cause identification (0-1)',
    example: 0.8,
    minimum: 0,
    maximum: 1,
  })
  @IsNumber()
  @Min(0)
  @Max(1)
  confidence: number;

  @ApiProperty({
    description: 'Evidence supporting this root cause',
    example: ['Resource utilization metrics', 'Team workload data'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  evidence: string[];

  @ApiProperty({
    description: 'Weight of this root cause contribution (0-1)',
    example: 0.9,
    minimum: 0,
    maximum: 1,
  })
  @IsNumber()
  @Min(0)
  @Max(1)
  contributionWeight: number;

  @ApiProperty({
    description: 'Timestamp when the root cause was created',
    example: '2024-01-15T10:30:00Z',
    type: 'string',
    format: 'date-time',
  })
  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the root cause was last updated',
    example: '2024-01-15T14:20:00Z',
    type: 'string',
    format: 'date-time',
  })
  @IsDate()
  @Type(() => Date)
  updatedAt: Date;
}
