import { Module } from '@nestjs/common';
import { GapAnalysisController } from './controllers';
import { GapAnalysisService } from './services';

@Module({
  controllers: [GapAnalysisController],
  providers: [GapAnalysisService],
  exports: [GapAnalysisService],
})
export class GapAnalysisModule {}
