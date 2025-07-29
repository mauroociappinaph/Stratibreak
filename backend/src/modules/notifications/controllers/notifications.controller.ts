import { Body, Controller, Post } from '@nestjs/common';
import type { NotificationRequest, NotificationResponse } from '../../../types';
import { NotificationsService } from '../services/notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // TODO: Implement notification endpoints
  // This is a placeholder implementation for task 0.1.b

  @Post('send')
  async sendNotification(
    @Body() notification: NotificationRequest
  ): Promise<NotificationResponse> {
    return this.notificationsService.sendNotification(notification);
  }
}
