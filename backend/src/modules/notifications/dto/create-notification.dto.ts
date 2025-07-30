import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty({
    description: 'User IDs who will receive the notification',
    example: ['user_123456789'],
  })
  @IsArray()
  @IsString({ each: true })
  recipients: string[];

  @ApiProperty({
    description: 'Notification subject',
    example: 'Critical Gap Detected',
  })
  @IsString()
  subject: string;

  @ApiProperty({
    description: 'Notification message content',
    example: 'A critical resource gap has been identified in Project Alpha',
  })
  @IsString()
  message: string;

  @ApiProperty({
    description: 'Notification type',
    example: 'in_app',
    enum: ['email', 'in-app', 'webhook', 'sms'],
  })
  @IsEnum(['email', 'in-app', 'webhook', 'sms'])
  type: 'email' | 'in-app' | 'webhook' | 'sms';

  @ApiProperty({
    description: 'Notification priority level',
    example: 'high',
    enum: ['low', 'medium', 'high', 'urgent'],
  })
  @IsEnum(['low', 'medium', 'high', 'urgent'])
  priority: 'low' | 'medium' | 'high' | 'urgent';

  @ApiProperty({
    description: 'Notification category',
    example: 'gap_analysis',
    enum: [
      'gap_analysis',
      'prediction',
      'integration',
      'system',
      'user_action',
    ],
  })
  @IsEnum([
    'gap_analysis',
    'prediction',
    'integration',
    'system',
    'user_action',
  ])
  category:
    | 'gap_analysis'
    | 'prediction'
    | 'integration'
    | 'system'
    | 'user_action';

  @ApiProperty({
    description: 'Whether the notification has been read',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  read?: boolean;

  @ApiProperty({
    description: 'Additional metadata for the notification',
    example: { projectId: 'proj_123', gapId: 'gap_456' },
    required: false,
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
