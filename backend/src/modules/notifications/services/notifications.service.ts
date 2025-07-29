/* eslint-disable no-console */
import { Injectable } from '@nestjs/common';
import type { NotificationRequest, NotificationResponse } from '../../../types';

@Injectable()
export class NotificationsService {
  // TODO: Implement notification logic
  // This is a placeholder implementation for task 0.1.b

  async sendNotification(
    notification: NotificationRequest
  ): Promise<NotificationResponse> {
    // Placeholder implementation
    console.log('Sending notification to:', notification.recipients);

    return {
      notificationId: 'placeholder-notification',
      status: 'sent',
      recipients: notification.recipients.map(recipient => ({
        recipient,
        status: 'sent',
        sentAt: new Date(),
      })),
      type: notification.type,
      subject: notification.subject,
      priority: notification.priority || 'medium',
      category: notification.category,
      createdAt: new Date(),
      sentAt: new Date(),
    };
  }
}
