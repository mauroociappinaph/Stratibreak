import { Module } from '@nestjs/common';
import {
  PredictionsAdvancedController,
  PredictionsController,
  PredictionsHistoryController,
} from './controllers';
import {
  EarlyWarningService,
  PredictionsService,
  PredictiveService,
  RiskCalculatorService,
} from './services';

@Module({
  controllers: [
    PredictionsController,
    PredictionsAdvancedController,
    PredictionsHistoryController,
  ],
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
