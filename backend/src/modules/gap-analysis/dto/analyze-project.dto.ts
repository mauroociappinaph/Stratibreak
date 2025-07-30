import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class AnalyzeProjectDto {
  @ApiProperty({
    description: 'Unique identifier of the project to analyze',
    example: 'proj_123456789',
    type: 'string',
  })
  @IsString()
  projectId: string;

  @ApiProperty({
    description: 'Enable predictive analysis for future issues',
    example: true,
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  enablePredictiveAnalysis?: boolean = true;

  @ApiProperty({
    description: 'Minimum confidence threshold for gap identification (0-1)',
    example: 0.7,
    minimum: 0,
    maximum: 1,
    required: false,
    default: 0.7,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  confidenceThreshold?: number = 0.7;

  @ApiProperty({
    description: 'Include historical trends in analysis',
    example: true,
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  includeHistoricalTrends?: boolean = true;

  @ApiProperty({
    description: 'Maximum number of gaps to identify per category',
    example: 10,
    minimum: 1,
    maximum: 50,
    required: false,
    default: 10,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(50)
  maxGapsPerCategory?: number = 10;

  @ApiProperty({
    description: 'Custom severity weights for different gap types',
    example: {
      resource: 1.0,
      timeline: 0.9,
      quality: 0.8,
      communication: 0.7,
    },
    required: false,
  })
  @IsOptional()
  @IsObject()
  severityWeights?: Record<string, number>;

  @ApiProperty({
    description: 'Additional context data for analysis',
    example: {
      teamSize: 5,
      projectDuration: 12,
      budget: 100000,
    },
    required: false,
  })
  @IsOptional()
  @IsObject()
  contextData?: Record<string, unknown>;
}

export class BulkAnalyzeProjectsDto {
  @ApiProperty({
    description: 'Array of project IDs to analyze',
    example: ['proj_123456789', 'proj_987654321'],
    type: [String],
  })
  @IsString({ each: true })
  projectIds: string[];

  @ApiProperty({
    description: 'Analysis configuration to apply to all projects',
    type: AnalyzeProjectDto,
    required: false,
  })
  @IsOptional()
  @IsObject()
  analysisConfig?: Omit<AnalyzeProjectDto, 'projectId'>;
}
