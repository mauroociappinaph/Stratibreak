import { ApiProperty } from '@nestjs/swagger';

export class NotificationEntity {
  @ApiProperty({
    description: 'Unique identifier for the notification',
    example: 'notif_123456789',
  })
  id: string;

  @ApiProperty({
    description: 'User ID who will receive the notification',
    example: 'user_123456789',
  })
  userId: string;

  @ApiProperty({
    description: 'Notification title',
    example: 'Critical Gap Detected',
  })
  title: string;

  @ApiProperty({
    description: 'Notification message content',
    example: 'A critical resource gap has been identified in Project Alpha',
  })
  message: string;

  @ApiProperty({
    description: 'Notification type',
    example: 'gap_alert',
    enum: ['gap_alert', 'prediction_warning', 'system_update', 'reminder'],
  })
  type: 'gap_alert' | 'prediction_warning' | 'system_update' | 'reminder';

  @ApiProperty({
    description: 'Notification priority level',
    example: 'high',
    enum: ['low', 'medium', 'high', 'urgent'],
  })
  priority: 'low' | 'medium' | 'high' | 'urgent';

  @ApiProperty({
    description: 'Whether the notification has been read',
    example: false,
  })
  read: boolean;

  @ApiProperty({
    description: 'Notification channel',
    example: 'email',
    enum: ['email', 'sms', 'push', 'in_app'],
  })
  channel: 'email' | 'sms' | 'push' | 'in_app';

  @ApiProperty({
    description: 'Additional metadata for the notification',
    example: { projectId: 'proj_123', gapId: 'gap_456' },
    required: false,
  })
  metadata?: Record<string, unknown>;

  @ApiProperty({
    description: 'Timestamp when the notification was created',
    example: '2024-01-15T10:30:00Z',
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the notification was last updated',
    example: '2024-01-15T10:30:00Z',
    type: 'string',
    format: 'date-time',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Timestamp when the notification was read',
    example: '2024-01-15T11:00:00Z',
    type: 'string',
    format: 'date-time',
    required: false,
  })
  readAt?: Date;
}
