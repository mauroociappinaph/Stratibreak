import { IsEnum, IsOptional, IsString } from 'class-validator';
import { IntegrationType } from './create-integration.dto';

export class UpdateIntegrationDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(IntegrationType)
  type?: IntegrationType;

  @IsOptional()
  @IsString()
  projectId?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  config?: Record<string, unknown>;
}
