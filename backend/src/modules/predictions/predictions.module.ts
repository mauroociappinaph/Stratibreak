import { Module } from '@nestjs/common';
import { PredictionsController } from './controllers';
import { PredictionsService } from './services';

@Module({
  controllers: [PredictionsController],
  providers: [PredictionsService],
  exports: [PredictionsService],
})
export class PredictionsModule {}
