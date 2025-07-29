import { IsEnum, IsOptional, IsString } from 'class-validator';
import { GapType, SeverityLevel } from './create-gap-analysis.dto';

export class UpdateGapAnalysisDto {
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
  @IsEnum(GapType)
  type?: GapType;

  @IsOptional()
  @IsEnum(SeverityLevel)
  severity?: SeverityLevel;
}
