import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsString } from 'class-validator';

export class ConnectToolDto {
  @ApiProperty({
    description: 'Type of external tool to connect to',
    example: 'JIRA',
    enum: ['JIRA', 'ASANA', 'TRELLO', 'MONDAY', 'BITRIX24'],
  })
  @IsString()
  toolType: string;

  @ApiProperty({
    description: 'Credentials for connecting to the external tool',
    example: {
      baseUrl: 'https://company.atlassian.net',
      username: 'user@company.com',
      apiToken: 'ATATT3xFfGF0...',
    },
  })
  @IsObject()
  credentials: Record<string, string>;
}
