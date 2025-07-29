import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { PredictionType } from './create-prediction.dto';

export class UpdatePredictionDto {
  @IsOptional()
  @IsString()
  projectId?: string;

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
  probability?: number;

  @IsOptional()
  @IsNumber()
  impact?: number;
}
