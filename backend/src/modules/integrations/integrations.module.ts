import { PrismaService } from '@/common/services';
import { Module } from '@nestjs/common';
import { IntegrationsController } from './controllers';
import { IntegrationsCoreService, IntegrationsService } from './services';

@Module({
  controllers: [IntegrationsController],
  providers: [IntegrationsService, IntegrationsCoreService, PrismaService],
  exports: [IntegrationsService],
})
export class IntegrationsModule {}
