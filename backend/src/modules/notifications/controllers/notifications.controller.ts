import { Body, Controller, Post } from '@nestjs/common';
import { NotificationsService } from '../services/notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // TODO: Implement notification endpoints
  // This is a placeholder implementation for task 0.1.b

  @Post('send')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async sendNotification(@Body() notification: any): Promise<any> {
    return this.notificationsService.sendNotification(notification);
  }
}
