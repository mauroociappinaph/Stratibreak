import { PredictionStatus, PredictionType, Severity } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class UpdatePredictionDto {
  @IsOptional()
  @IsString()
  projectId?: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(PredictionType)
  type?: PredictionType;

  @IsOptional()
  @IsNumber()
  @Min(0.0)
  @Max(1.0)
  probability?: number; // Float value between 0.0 and 1.0 representing likelihood

  @IsOptional()
  @IsEnum(Severity)
  impact?: Severity; // Impact level using Severity enum (LOW, MEDIUM, HIGH, CRITICAL)

  @IsOptional()
  @IsEnum(PredictionStatus)
  status?: PredictionStatus;

  @IsOptional()
  @IsDateString()
  predictedAt?: string;

  @IsOptional()
  @IsDateString()
  actualAt?: string;

  @IsOptional()
  @IsNumber()
  @Min(0.0)
  @Max(1.0)
  accuracy?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  estimatedTimeToOccurrence?: number; // in hours

  @IsOptional()
  @IsNumber()
  @Min(0)
  preventionWindow?: number; // in hours
}
