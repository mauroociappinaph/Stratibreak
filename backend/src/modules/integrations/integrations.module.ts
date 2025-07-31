import { PrismaService } from '@/common/services';
import { Module } from '@nestjs/common';
import { IntegrationsController } from './controllers';
import {
  ConnectionLifecycleService,
  ConnectionManagementService,
  ConnectionSetupService,
  ConnectionStatusService,
  IntegrationCrudService,
  IntegrationsCoreService,
  IntegrationsService,
  IntegrationTestingService,
  SyncHistoryService,
} from './services';

@Module({
  controllers: [IntegrationsController],
  providers: [
    IntegrationsService,
    IntegrationsCoreService,
    IntegrationCrudService,
    ConnectionLifecycleService,
    ConnectionManagementService,
    ConnectionSetupService,
    ConnectionStatusService,
    IntegrationTestingService,
    SyncHistoryService,
    PrismaService,
  ],
  exports: [IntegrationsService],
})
export class IntegrationsModule {}
