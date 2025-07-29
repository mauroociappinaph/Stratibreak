import { Module } from '@nestjs/common';
import { IntegrationsController } from './controllers';
import { IntegrationsService } from './services';

@Module({
  controllers: [IntegrationsController],
  providers: [IntegrationsService],
  exports: [IntegrationsService],
})
export class IntegrationsModule {}
