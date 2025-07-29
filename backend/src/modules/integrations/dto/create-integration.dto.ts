import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum IntegrationType {
  JIRA = 'jira',
  ASANA = 'asana',
  TRELLO = 'trello',
  MONDAY = 'monday',
  BITRIX24 = 'bitrix24',
}

export class CreateIntegrationDto {
  @IsString()
  name: string;

  @IsEnum(IntegrationType)
  type: IntegrationType;

  @IsString()
  projectId: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  config?: Record<string, unknown>;
}
