import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDate, IsEnum, IsNumber, IsString } from 'class-validator';

export enum SyncStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
  PARTIAL = 'partial',
}

export class SyncResultDto {
  @ApiProperty({
    description: 'Connection ID that was synced',
    example: 'jira_1640995200000_abc123',
  })
  @IsString()
  connectionId: string;

  @ApiProperty({
    description: 'Status of the sync operation',
    enum: SyncStatus,
    example: SyncStatus.SUCCESS,
  })
  @IsEnum(SyncStatus)
  status: SyncStatus;

  @ApiProperty({
    description: 'Number of records processed during sync',
    example: 42,
  })
  @IsNumber()
  recordsProcessed: number;

  @ApiProperty({
    description: 'List of errors encountered during sync',
    type: [String],
    example: [],
  })
  @IsArray()
  @IsString({ each: true })
  errors: string[];

  @ApiProperty({
    description: 'Timestamp when sync was completed',
    example: '2024-01-15T10:35:00Z',
  })
  @IsDate()
  lastSync: Date;
}
