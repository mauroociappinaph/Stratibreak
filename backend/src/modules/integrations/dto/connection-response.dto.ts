import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsObject, IsString } from 'class-validator';

export type ConnectionStatus =
  | 'connected'
  | 'failed'
  | 'pending'
  | 'disconnected';
export type SyncStatus = 'idle' | 'syncing' | 'error';

export class ConnectionResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the connection',
    example: 'jira_1640995200000_abc123',
  })
  @IsString()
  connectionId: string;

  @ApiProperty({
    description: 'Current status of the connection',
    enum: ['connected', 'failed', 'pending', 'disconnected'],
    example: 'connected',
  })
  status: ConnectionStatus;

  @ApiProperty({
    description: 'Type of external tool',
    example: 'JIRA',
  })
  @IsString()
  toolType: string;

  @ApiProperty({
    description: 'Display name for the connection',
    example: 'Main Jira Instance',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Timestamp of last successful sync',
    example: '2024-01-15T10:30:00Z',
    required: false,
  })
  @IsDate()
  lastSync?: Date;

  @ApiProperty({
    description: 'Timestamp of next scheduled sync',
    example: '2024-01-15T10:45:00Z',
    required: false,
  })
  @IsDate()
  nextSync?: Date;

  @ApiProperty({
    description: 'Current sync status',
    enum: ['idle', 'syncing', 'error'],
    example: 'idle',
  })
  syncStatus: SyncStatus;

  @ApiProperty({
    description: 'Number of records in last sync',
    example: 42,
  })
  @IsNumber()
  recordsCount: number;

  @ApiProperty({
    description: 'Connection configuration settings',
    example: {
      syncFrequency: 15,
      dataMapping: [],
      filters: {},
    },
  })
  @IsObject()
  configuration: {
    syncFrequency: number;
    dataMapping: unknown[];
    filters: Record<string, unknown>;
  };

  @ApiProperty({
    description: 'Connection creation timestamp',
    example: '2024-01-15T10:00:00Z',
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'Connection last update timestamp',
    example: '2024-01-15T10:30:00Z',
  })
  @IsDate()
  updatedAt: Date;
}
