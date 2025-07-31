import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum IntegrationType {
  JIRA = 'JIRA',
  ASANA = 'ASANA',
  TRELLO = 'TRELLO',
  MONDAY = 'MONDAY',
  BITRIX24 = 'BITRIX24',
}

export class CreateIntegrationDto {
  @ApiProperty({
    description: 'Name of the integration',
    example: 'Main Jira Instance',
  })
  @IsString()
  @IsNotEmpty({ message: 'Integration name is required' })
  name: string;

  @ApiProperty({
    description: 'Type of integration tool',
    enum: IntegrationType,
    example: IntegrationType.JIRA,
  })
  @IsEnum(IntegrationType)
  type: IntegrationType;

  @ApiProperty({
    description: 'Project ID this integration belongs to',
    example: 'proj_123456789',
  })
  @IsString()
  @IsNotEmpty({ message: 'Project ID is required' })
  projectId: string;

  @ApiProperty({
    description: 'Optional description of the integration',
    example: 'Primary Jira instance for project management',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Integration configuration settings',
    type: 'object',
    additionalProperties: true,
    example: {
      baseUrl: 'https://company.atlassian.net',
      timeout: 30000,
      retryAttempts: 3,
    },
    required: false,
  })
  @IsOptional()
  config?: Record<string, unknown>;
}
