import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { IntegrationType } from './create-integration.dto';

export class UpdateIntegrationDto {
  @ApiProperty({
    description: 'Name of the integration',
    example: 'Updated Jira Instance Name',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Type of integration tool',
    enum: IntegrationType,
    example: IntegrationType.JIRA,
    required: false,
  })
  @IsOptional()
  @IsEnum(IntegrationType)
  type?: IntegrationType;

  @ApiProperty({
    description: 'Project ID this integration belongs to',
    example: 'proj_123456789',
    required: false,
  })
  @IsOptional()
  @IsString()
  projectId?: string;

  @ApiProperty({
    description: 'Description of the integration',
    example: 'Updated description for the integration',
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
      baseUrl: 'https://newcompany.atlassian.net',
      timeout: 45000,
      retryAttempts: 5,
    },
    required: false,
  })
  @IsOptional()
  config?: Record<string, unknown>;
}
