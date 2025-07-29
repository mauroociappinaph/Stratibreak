import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Max,
  Min,
} from 'class-validator';

// Common Validation Schemas
export class PaginationDto {
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  limit?: number = 20;

  @IsInt()
  @Min(0)
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  offset?: number = 0;
}

export class SearchDto {
  @IsString()
  @IsOptional()
  @Length(1, 255)
  query?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @ArrayMaxSize(20)
  filters?: string[];

  @IsString()
  @IsOptional()
  @Length(1, 100)
  sortBy?: string;

  @IsEnum(['asc', 'desc'])
  @IsOptional()
  sortOrder?: 'asc' | 'desc' = 'desc';
}

export class BulkOperationDto {
  @IsArray()
  @IsUUID(undefined, { each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  ids: string[];

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  operation: string;

  @IsObject()
  @IsOptional()
  parameters?: Record<string, unknown>;
}
