import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccuracyMetricsResponse } from '../dto';
import { PredictionsService } from '../services';

@ApiTags('predictions-history')
@Controller('predictions/history')
export class PredictionsHistoryController {
  constructor(private readonly predictionsService: PredictionsService) {}

  @Get(':projectId')
  @ApiOperation({
    summary: 'Get prediction history for project',
    description:
      'Retrieves historical predictions with accuracy metrics and outcomes. Supports filtering by date range and prediction type.',
  })
  @ApiResponse({
    status: 200,
    description: 'Prediction history retrieved successfully',
  })
  async getPredictionHistory(
    @Param('projectId') projectId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('predictionType') predictionType?: string,
    @Query('limit') limit?: string
  ): Promise<unknown> {
    const parsedStartDate = startDate ? new Date(startDate) : undefined;
    const parsedEndDate = endDate ? new Date(endDate) : undefined;
    const parsedLimit = limit ? parseInt(limit, 10) : 50;

    return this.predictionsService.getPredictionHistory(
      projectId,
      parsedStartDate,
      parsedEndDate,
      predictionType,
      parsedLimit
    );
  }

  @Get('trend/:projectId')
  @ApiOperation({
    summary: 'Get trend analysis history for project',
    description:
      'Retrieves historical trend data for project metrics with predictions and insights. Supports filtering by metric and time granularity.',
  })
  @ApiResponse({
    status: 200,
    description: 'Trend history retrieved successfully',
  })
  async getTrendHistory(
    @Param('projectId') projectId: string,
    @Query('metric') metric?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('granularity') granularity?: string
  ): Promise<unknown> {
    return this.predictionsService.getTrendHistory(
      projectId,
      metric,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
      granularity || 'daily'
    );
  }

  @Get('accuracy/:projectId')
  @ApiOperation({
    summary: 'Get prediction accuracy metrics for project',
    description:
      'Retrieves comprehensive accuracy metrics including precision, recall, F1-score, and accuracy trends over time.',
  })
  @ApiResponse({
    status: 200,
    description: 'Accuracy metrics retrieved successfully',
    type: AccuracyMetricsResponse,
  })
  async getPredictionAccuracyMetrics(
    @Param('projectId') projectId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ): Promise<AccuracyMetricsResponse> {
    const parsedStartDate = startDate ? new Date(startDate) : undefined;
    const parsedEndDate = endDate ? new Date(endDate) : undefined;

    return this.predictionsService.getPredictionAccuracyMetrics(
      projectId,
      parsedStartDate,
      parsedEndDate
    );
  }
}
