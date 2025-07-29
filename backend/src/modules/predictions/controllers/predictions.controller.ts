import { Body, Controller, Post } from '@nestjs/common';
import { PredictionsService } from '../services/predictions.service';

@Controller('predictions')
export class PredictionsController {
  constructor(private readonly predictionsService: PredictionsService) {}

  // TODO: Implement prediction endpoints
  // This is a placeholder implementation for task 0.1.b

  @Post('analyze')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async predictIssues(@Body() historicalData: any): Promise<any> {
    return this.predictionsService.predictFutureIssues(historicalData);
  }
}
