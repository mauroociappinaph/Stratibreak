import { ApiProperty } from '@nestjs/swagger';
import { IntegrationType } from '@prisma/client';

export class IntegrationEntity {
  @ApiProperty({
    description: 'Unique identifier of the integration',
    example: 'int_987654321',
  })
  id: string;

  @ApiProperty({
    description: 'Name of the integration',
    example: 'Main Jira Instance',
  })
  name: string;

  @ApiProperty({
    description: 'Type of integration tool',
    enum: IntegrationType,
    example: 'JIRA',
  })
  type: IntegrationType;

  @ApiProperty({
    description: 'Project ID this integration belongs to',
    example: 'proj_123456789',
  })
  projectId: string;

  @ApiProperty({
    description: 'Description of the integration',
    example: 'Primary Jira instance for project management',
    required: false,
  })
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
  config?: Record<string, unknown>;

  @ApiProperty({
    description: 'Whether the integration is active',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'When the integration was created',
    example: '2024-01-15T10:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'When the integration was last updated',
    example: '2024-01-15T10:30:00Z',
  })
  updatedAt: Date;
}
