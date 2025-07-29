import { Module } from '@nestjs/common';
import { NotificationsController } from './controllers';
import { NotificationsService } from './services';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
