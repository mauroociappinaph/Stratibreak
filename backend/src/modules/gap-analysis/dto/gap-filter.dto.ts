import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import {
  GapCategory,
  GapStatus,
  GapType,
  SeverityLevel,
} from './create-gap-analysis.dto';

export class GapFilterDto {
  @ApiProperty({
    description: 'Filter by project ID',
    example: 'proj_123456789',
    required: false,
  })
  @IsOptional()
  @IsString()
  projectId?: string;

  @ApiProperty({
    description: 'Filter by gap type',
    enum: GapType,
    required: false,
  })
  @IsOptional()
  @IsEnum(GapType)
  type?: GapType;

  @ApiProperty({
    description: 'Filter by gap category',
    enum: GapCategory,
    required: false,
  })
  @IsOptional()
  @IsEnum(GapCategory)
  category?: GapCategory;

  @ApiProperty({
    description: 'Filter by severity level',
    enum: SeverityLevel,
    required: false,
  })
  @IsOptional()
  @IsEnum(SeverityLevel)
  severity?: SeverityLevel;

  @ApiProperty({
    description: 'Filter by gap status',
    enum: GapStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(GapStatus)
  status?: GapStatus;

  @ApiProperty({
    description: 'Filter by tags (any of the provided tags)',
    example: ['urgent', 'team-related'],
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({
    description: 'Minimum confidence level (0-1)',
    example: 0.7,
    minimum: 0,
    maximum: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  minConfidence?: number;

  @ApiProperty({
    description: 'Maximum confidence level (0-1)',
    example: 1.0,
    minimum: 0,
    maximum: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  maxConfidence?: number;

  @ApiProperty({
    description: 'Filter gaps identified after this date',
    example: '2024-01-01T00:00:00Z',
    type: 'string',
    format: 'date-time',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  identifiedAfter?: string;

  @ApiProperty({
    description: 'Filter gaps identified before this date',
    example: '2024-12-31T23:59:59Z',
    type: 'string',
    format: 'date-time',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  identifiedBefore?: string;

  @ApiProperty({
    description: 'Search term for title and description',
    example: 'resource shortage',
    required: false,
  })
  @IsOptional()
  @IsString()
  searchTerm?: string;

  @ApiProperty({
    description: 'Page number for pagination',
    example: 1,
    minimum: 1,
    required: false,
    default: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    example: 20,
    minimum: 1,
    maximum: 100,
    required: false,
    default: 20,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiProperty({
    description: 'Sort field',
    example: 'identifiedAt',
    enum: ['identifiedAt', 'severity', 'confidence', 'title', 'type'],
    required: false,
    default: 'identifiedAt',
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'identifiedAt';

  @ApiProperty({
    description: 'Sort order',
    example: 'desc',
    enum: ['asc', 'desc'],
    required: false,
    default: 'desc',
  })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';
}

export class GapSearchDto {
  @ApiProperty({
    description: 'Search query for gaps',
    example: 'resource shortage team productivity',
  })
  @IsString()
  query: string;

  @ApiProperty({
    description: 'Project ID to search within (optional)',
    example: 'proj_123456789',
    required: false,
  })
  @IsOptional()
  @IsString()
  projectId?: string;

  @ApiProperty({
    description: 'Additional filters to apply',
    type: GapFilterDto,
    required: false,
  })
  @IsOptional()
  filters?: Omit<
    GapFilterDto,
    'searchTerm' | 'page' | 'limit' | 'sortBy' | 'sortOrder'
  >;

  @ApiProperty({
    description: 'Page number for pagination',
    example: 1,
    minimum: 1,
    required: false,
    default: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    example: 20,
    minimum: 1,
    maximum: 100,
    required: false,
    default: 20,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}
