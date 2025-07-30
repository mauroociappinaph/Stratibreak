import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class ProjectAreaEntity {
  @ApiProperty({
    description: 'Unique identifier of the project area',
    example: 'area_123456789',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'Gap identifier this project area belongs to',
    example: 'gap_123456789',
  })
  @IsString()
  gapId: string;

  @ApiProperty({
    description: 'Name of the affected project area',
    example: 'Team Productivity',
  })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    description: 'Description of the project area',
    example: 'Team performance and sustainability',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiProperty({
    description: 'Impact level of this area',
    example: 'high',
    enum: ['low', 'medium', 'high', 'critical'],
  })
  @IsEnum(['low', 'medium', 'high', 'critical'])
  impactLevel: string;

  @ApiProperty({
    description: 'Timestamp when the project area was created',
    example: '2024-01-15T10:30:00Z',
    type: 'string',
    format: 'date-time',
  })
  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the project area was last updated',
    example: '2024-01-15T14:20:00Z',
    type: 'string',
    format: 'date-time',
  })
  @IsDate()
  @Type(() => Date)
  updatedAt: Date;
}
