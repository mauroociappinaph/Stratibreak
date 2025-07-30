import { Module } from '@nestjs/common';
import { PrismaService } from '../../common/services';
import { GapAnalysisController } from './controllers';
import { GapRepository } from './repositories/gap.repository';
import { GapMapper } from './mappers/gap.mapper';
import { GapAnalysisService, SeverityCalculatorService } from './services';

@Module({
  controllers: [GapAnalysisController],
  providers: [
    GapAnalysisService,
    SeverityCalculatorService,
    PrismaService,
    GapRepository,
    GapMapper,
  ],
  exports: [GapAnalysisService, SeverityCalculatorService],
})
export class GapAnalysisModule {}
