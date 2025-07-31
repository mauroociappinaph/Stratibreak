import { Module } from '@nestjs/common';
import { PredictionsController } from './controllers';
import {
  EarlyWarningService,
  PredictionsService,
  PredictiveService,
  RiskCalculatorService,
} from './services';

@Module({
  controllers: [PredictionsController],
  providers: [
    PredictionsService,
    PredictiveService,
    RiskCalculatorService,
    EarlyWarningService,
  ],
  exports: [
    PredictionsService,
    PredictiveService,
    RiskCalculatorService,
    EarlyWarningService,
  ],
})
export class PredictionsModule {}
