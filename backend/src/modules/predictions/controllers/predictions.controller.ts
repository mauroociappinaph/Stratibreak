import { Body, Controller, Post } from '@nestjs/common';
import type { PredictionRequest, PredictionResponse } from '../../../types';
import { PredictionsService } from '../services/predictions.service';

@Controller('predictions')
export class PredictionsController {
  constructor(private readonly predictionsService: PredictionsService) {}

  // TODO: Implement prediction endpoints
  // This is a placeholder implementation for task 0.1.b

  @Post('analyze')
  async predictIssues(
    @Body() request: PredictionRequest
  ): Promise<PredictionResponse> {
    return this.predictionsService.predictFutureIssues(request);
  }
}
