import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ImpactLevel } from '../../../types/database/gap.types';
import { PatternType } from '../../../types/services/prediction.types';
import {
  AccuracyMetricsResponse,
  CalculateRiskProbabilityDto,
  CalculateRiskProbabilityResponseDto,
  CreatePredictionDto,
  GenerateEarlyWarningsDto,
  PredictFutureIssuesDto,
  UpdatePredictionDto,
} from '../dto';
import { PredictionEntity } from '../entities';
import {
  EarlyWarningService,
  PredictionsService,
  PredictiveService,
  RiskCalculatorService,
} from '../services';
import { MonteCarloRiskAnalysisResponseDto } from './predictions-statistical.swagger';

@ApiTags('predictions')
@Controller('predictions')
export class PredictionsController {
  constructor(
    private readonly predictionsService: PredictionsService,
    private readonly predictiveService: PredictiveService,
    private readonly earlyWarningService: EarlyWarningService,
    private readonly riskCalculatorService: RiskCalculatorService
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new prediction' })
  @ApiResponse({
    status: 201,
    description: 'Prediction created successfully',
    type: PredictionEntity,
  })
  async create(
    @Body() createPredictionDto: CreatePredictionDto
  ): Promise<PredictionEntity> {
    return this.predictionsService.create(createPredictionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all predictions' })
  @ApiResponse({
    status: 200,
    description: 'List of predictions',
    type: [PredictionEntity],
  })
  async findAll(): Promise<PredictionEntity[]> {
    return this.predictionsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get prediction by ID' })
  @ApiResponse({
    status: 200,
    description: 'Prediction found',
    type: PredictionEntity,
  })
  async findOne(@Param('id') id: string): Promise<PredictionEntity> {
    return this.predictionsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update prediction' })
  @ApiResponse({
    status: 200,
    description: 'Prediction updated successfully',
    type: PredictionEntity,
  })
  async update(
    @Param('id') id: string,
    @Body() updatePredictionDto: UpdatePredictionDto
  ): Promise<PredictionEntity> {
    return this.predictionsService.update(id, updatePredictionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete prediction' })
  @ApiResponse({
    status: 204,
    description: 'Prediction deleted successfully',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.predictionsService.remove(id);
  }

  @Post('generate/:projectId')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Generate predictions for a project' })
  @ApiResponse({
    status: 201,
    description: 'Predictions generated successfully',
    type: [PredictionEntity],
  })
  async generatePredictions(
    @Param('projectId') projectId: string
  ): Promise<PredictionEntity[]> {
    return this.predictionsService.generatePredictions(projectId);
  }

  @Get('project/:projectId')
  @ApiOperation({ summary: 'Get predictions by project' })
  @ApiResponse({
    status: 200,
    description: 'Project predictions found',
    type: [PredictionEntity],
  })
  async findByProject(
    @Param('projectId') projectId: string
  ): Promise<PredictionEntity[]> {
    return this.predictionsService.findByProject(projectId);
  }

  // Advanced Prediction Endpoints

  @Post('predict-future-issues')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Predict future issues based on historical data',
    description:
      'Uses AI to analyze historical data and predict potential future issues with 72+ hour advance warning',
  })
  @ApiResponse({
    status: 200,
    description: 'Future issues predicted successfully',
  })
  async predictFutureIssues(
    @Body() predictFutureIssuesDto: PredictFutureIssuesDto
  ): Promise<{
    projectId: string;
    predictions: unknown[];
    analysisTimestamp: string;
  }> {
    const historicalData = {
      projectId: predictFutureIssuesDto.projectId,
      timeRange: {
        startDate: new Date(predictFutureIssuesDto.timeRange.startDate),
        endDate: new Date(predictFutureIssuesDto.timeRange.endDate),
      },
      metrics: predictFutureIssuesDto.metrics.map(metric => ({
        name: metric.name,
        values: metric.values.map(value => ({
          timestamp: new Date(value.timestamp),
          value: value.value,
        })),
        unit: metric.unit,
      })),
      events: predictFutureIssuesDto.events.map(event => ({
        timestamp: new Date(event.timestamp),
        type: event.type,
        description: event.description,
        impact: event.impact as ImpactLevel,
      })),
      patterns: predictFutureIssuesDto.patterns.map(pattern => ({
        patternType: pattern.patternType as PatternType,
        frequency: pattern.frequency,
        confidence: pattern.confidence,
        description: pattern.description,
      })),
    };

    const predictions =
      await this.predictiveService.predictFutureIssues(historicalData);

    return {
      projectId: predictFutureIssuesDto.projectId,
      predictions,
      analysisTimestamp: new Date().toISOString(),
    };
  }

  @Post('generate-early-warnings')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Generate early warning alerts',
    description:
      'Generates proactive alerts based on current trends with priority levels and probability',
  })
  @ApiResponse({
    status: 200,
    description: 'Early warnings generated successfully',
  })
  async generateEarlyWarnings(
    @Body() generateEarlyWarningsDto: GenerateEarlyWarningsDto
  ): Promise<{
    projectId: string;
    alerts: any[];
    analysisTimestamp: string;
  }> {
    const trendData = {
      projectId: generateEarlyWarningsDto.projectId,
      currentMetrics: generateEarlyWarningsDto.currentMetrics.map(metric => ({
        name: metric.name,
        currentValue: metric.currentValue,
        previousValue: metric.previousValue,
        changeRate: metric.changeRate,
        trend: metric.trend as any,
        unit: metric.unit,
      })),
      recentChanges: generateEarlyWarningsDto.recentChanges.map(change => ({
        metric: change.metric,
        changeType: change.changeType as any,
        magnitude: change.magnitude,
        timeframe: {
          value: change.timeframe.value,
          unit: change.timeframe.unit as any,
        },
        significance: change.significance,
      })),
      velocityIndicators: generateEarlyWarningsDto.velocityIndicators.map(
        velocity => ({
          name: velocity.name,
          currentVelocity: velocity.currentVelocity,
          averageVelocity: velocity.averageVelocity,
          trend: velocity.trend as any,
          predictedVelocity: velocity.predictedVelocity,
        })
      ),
    };

    const alerts = this.predictiveService.generateEarlyWarnings(trendData);

    return {
      projectId: generateEarlyWarningsDto.projectId,
      alerts,
      analysisTimestamp: new Date().toISOString(),
    };
  }

  @Post('calculate-risk-probability')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Calculate risk probability based on indicators',
    description:
      'Calculates comprehensive risk assessment with time to occurrence and impact potential',
  })
  @ApiResponse({
    status: 200,
    description: 'Risk probability calculated successfully',
    type: CalculateRiskProbabilityResponseDto,
  })
  async calculateRiskProbability(
    @Body() calculateRiskDto: CalculateRiskProbabilityDto
  ): Promise<CalculateRiskProbabilityResponseDto> {
    const riskIndicators = calculateRiskDto.indicators.map(indicator => ({
      indicator: indicator.indicator,
      currentValue: indicator.currentValue,
      threshold: indicator.threshold,
      trend: indicator.trend as any,
      weight: indicator.weight,
    }));

    const riskAssessment =
      this.predictiveService.calculateRiskProbability(riskIndicators);

    return {
      projectId: calculateRiskDto.projectId,
      riskAssessment: {
        overallRisk: riskAssessment.overallRisk,
        riskFactors: riskAssessment.riskFactors.map(factor => ({
          factor: factor.factor,
          weight: factor.weight,
          currentValue: factor.currentValue,
          threshold: factor.threshold,
          trend: factor.trend as string,
        })),
        recommendations: riskAssessment.recommendations,
        confidenceLevel: riskAssessment.confidenceLevel,
      },
      analysisTimestamp: new Date().toISOString(),
    };
  }

  @Post('monte-carlo-risk-analysis')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Perform Monte Carlo risk simulation',
    description:
      'Advanced risk analysis using Monte Carlo simulation to provide confidence intervals and risk distribution',
  })
  @ApiResponse({
    status: 200,
    description: 'Monte Carlo risk analysis completed successfully',
    type: MonteCarloRiskAnalysisResponseDto,
  })
  async performMonteCarloRiskAnalysis(
    @Body() calculateRiskDto: CalculateRiskProbabilityDto
  ) {
    const riskIndicators = calculateRiskDto.indicators.map(indicator => ({
      indicator: indicator.indicator,
      currentValue: indicator.currentValue,
      threshold: indicator.threshold,
      trend: indicator.trend as unknown,
      weight: indicator.weight,
    }));

    // Perform Monte Carlo simulation
    const monteCarloResult =
      await this.riskCalculatorService.calculateMonteCarloRisk(
        riskIndicators,
        1000 // Number of simulations
      );

    // Calculate additional risk metrics
    const compoundRisk = this.riskCalculatorService.calculateCompoundRisk(
      riskIndicators.map(indicator =>
        this.riskCalculatorService.calculateIndicatorRisk(indicator)
      )
    );

    return {
      projectId: calculateRiskDto.projectId,
      monteCarloAnalysis: {
        meanRisk: monteCarloResult.meanRisk,
        confidenceInterval: monteCarloResult.confidenceInterval,
        riskDistribution: {
          samples: monteCarloResult.riskDistribution.length,
          min: Math.min(...monteCarloResult.riskDistribution),
          max: Math.max(...monteCarloResult.riskDistribution),
          percentiles: {
            p5:
              [...monteCarloResult.riskDistribution].sort(
                (a: number, b: number) => a - b
              )[Math.floor(monteCarloResult.riskDistribution.length * 0.05)] ??
              0,
            p25:
              [...monteCarloResult.riskDistribution].sort(
                (a: number, b: number) => a - b
              )[Math.floor(monteCarloResult.riskDistribution.length * 0.25)] ??
              0,
            p50:
              [...monteCarloResult.riskDistribution].sort(
                (a: number, b: number) => a - b
              )[Math.floor(monteCarloResult.riskDistribution.length * 0.5)] ??
              0,
            p75:
              [...monteCarloResult.riskDistribution].sort(
                (a: number, b: number) => a - b
              )[Math.floor(monteCarloResult.riskDistribution.length * 0.75)] ??
              0,
            p95:
              [...monteCarloResult.riskDistribution].sort(
                (a: number, b: number) => a - b
              )[Math.floor(monteCarloResult.riskDistribution.length * 0.95)] ??
              0,
          },
        },
      },
      compoundRisk,
      riskMetrics: {
        volatility: this.riskCalculatorService.calculateRiskVolatility(
          monteCarloResult.riskDistribution
        ),
        skewness: this.riskCalculatorService.calculateSkewness(
          monteCarloResult.riskDistribution
        ),
        kurtosis: this.riskCalculatorService.calculateKurtosis(
          monteCarloResult.riskDistribution
        ),
      },
      recommendations: [
        monteCarloResult.meanRisk > 0.8
          ? 'CRITICAL: Immediate risk mitigation required'
          : monteCarloResult.meanRisk > 0.6
            ? 'HIGH: Implement risk reduction strategies'
            : monteCarloResult.meanRisk > 0.4
              ? 'MEDIUM: Monitor and prepare contingencies'
              : 'LOW: Continue regular monitoring',
        `Risk confidence interval: ${(monteCarloResult.confidenceInterval.lower * 100).toFixed(1)}% - ${(monteCarloResult.confidenceInterval.upper * 100).toFixed(1)}%`,
        'Consider diversification strategies to reduce compound risk',
      ],
      analysisTimestamp: new Date().toISOString(),
      simulationParameters: {
        iterations: 1000,
        confidenceLevel: 0.9,
        method: 'Monte Carlo',
      },
    };
  }

  // Prediction History and Trend Analysis Endpoints

  @Get('history/:projectId')
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
  ) {
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

  @Get('trend-history/:projectId')
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
  ) {
    return this.predictionsService.getTrendHistory(
      projectId,
      metric,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
      granularity || 'daily'
    );
  }

  @Get('accuracy-metrics/:projectId')
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
