import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { NotificationRequest, NotificationResponse } from '../../../types';
import { CreateNotificationDto, UpdateNotificationDto } from '../dto';
import { NotificationEntity } from '../entities';
import { NotificationsService } from '../services/notifications.service';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new notification' })
  @ApiResponse({
    status: 201,
    description: 'Notification created successfully',
    type: NotificationEntity,
  })
  async create(
    @Body() createNotificationDto: CreateNotificationDto
  ): Promise<NotificationEntity> {
    return this.notificationsService.create(createNotificationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all notifications' })
  @ApiResponse({
    status: 200,
    description: 'List of notifications',
    type: [NotificationEntity],
  })
  @ApiQuery({ name: 'userId', required: false, type: String })
  @ApiQuery({ name: 'read', required: false, type: Boolean })
  async findAll(
    @Query('userId') userId?: string,
    @Query('read') read?: boolean
  ): Promise<NotificationEntity[]> {
    return this.notificationsService.findAll({ userId, read });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get notification by ID' })
  @ApiResponse({
    status: 200,
    description: 'Notification found',
    type: NotificationEntity,
  })
  async findOne(@Param('id') id: string): Promise<NotificationEntity> {
    return this.notificationsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update notification' })
  @ApiResponse({
    status: 200,
    description: 'Notification updated successfully',
    type: NotificationEntity,
  })
  async update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto
  ): Promise<NotificationEntity> {
    return this.notificationsService.update(id, updateNotificationDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete notification' })
  @ApiResponse({
    status: 204,
    description: 'Notification deleted successfully',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.notificationsService.remove(id);
  }

  @Post('send')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Send notification',
    description:
      'Send a notification to specified recipients via configured channels (email, SMS, push, etc.)',
  })
  @ApiResponse({
    status: 200,
    description: 'Notification sent successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        messageId: { type: 'string' },
        recipients: { type: 'array', items: { type: 'string' } },
        channel: { type: 'string' },
        timestamp: { type: 'string' },
      },
    },
  })
  async sendNotification(
    @Body() notification: NotificationRequest
  ): Promise<NotificationResponse> {
    return this.notificationsService.sendNotification(notification);
  }

  @Patch(':id/mark-read')
  @ApiOperation({ summary: 'Mark notification as read' })
  @ApiResponse({
    status: 200,
    description: 'Notification marked as read',
    type: NotificationEntity,
  })
  async markAsRead(@Param('id') id: string): Promise<NotificationEntity> {
    return this.notificationsService.markAsRead(id);
  }

  @Post('mark-all-read')
  @ApiOperation({ summary: 'Mark all notifications as read for a user' })
  @ApiResponse({
    status: 200,
    description: 'All notifications marked as read',
    schema: {
      type: 'object',
      properties: {
        updated: { type: 'number' },
      },
    },
  })
  async markAllAsRead(
    @Body('userId') userId: string
  ): Promise<{ updated: number }> {
    return this.notificationsService.markAllAsRead(userId);
  }
}
