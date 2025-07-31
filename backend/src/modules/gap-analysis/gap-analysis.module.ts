import { Module } from '@nestjs/common';
import { PrismaService } from '../../common/services';
import { GapAnalysisController } from './controllers';
import { GapMapper } from './mappers/gap.mapper';
import { GapRepository } from './repositories/gap.repository';
import {
  GapAnalysisService,
  ProjectDataService,
  ProjectStateAnalyzerService,
  SeverityCalculatorService,
} from './services';

@Module({
  controllers: [GapAnalysisController],
  providers: [
    GapAnalysisService,
    SeverityCalculatorService,
    ProjectDataService,
    ProjectStateAnalyzerService,
    PrismaService,
    GapRepository,
    GapMapper,
  ],
  exports: [GapAnalysisService, SeverityCalculatorService],
})
export class GapAnalysisModule {}
