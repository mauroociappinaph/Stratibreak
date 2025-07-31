/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
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
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ImpactLevel } from '../../../types/database/gap.types';
import { PatternType } from '../../../types/services/prediction.types';
import {
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
} from '../services';

@ApiTags('predictions')
@Controller('predictions')
export class PredictionsController {
  constructor(
    private readonly predictionsService: PredictionsService,
    private readonly predictiveService: PredictiveService,
    private readonly earlyWarningService: EarlyWarningService
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
    predictions: any[];
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

  @Get('risk-assessment/:projectId')
  @ApiOperation({
    summary: 'Get comprehensive risk assessment for project',
    description:
      'Provides detailed risk analysis including trends, predictions, and recommendations',
  })
  @ApiResponse({
    status: 200,
    description: 'Risk assessment retrieved successfully',
  })
  async getRiskAssessment(@Param('projectId') projectId: string) {
    // This would typically fetch current project data and calculate comprehensive risk
    // For now, return a structured response that matches the expected format
    return {
      projectId,
      overallRiskLevel: 'MEDIUM',
      riskScore: 0.45,
      criticalRisks: [
        'Resource allocation below optimal levels',
        'Timeline compression detected',
      ],
      recommendations: [
        'Increase resource allocation by 15%',
        'Review timeline constraints with stakeholders',
        'Implement additional monitoring for critical path items',
      ],
      nextReviewDate: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ).toISOString(),
      analysisTimestamp: new Date().toISOString(),
    };
  }

  @Get('trend-analysis/:projectId')
  @ApiOperation({
    summary: 'Get trend analysis for project',
    description:
      'Provides comprehensive trend analysis with predictions and recommendations',
  })
  @ApiResponse({
    status: 200,
    description: 'Trend analysis retrieved successfully',
  })
  async getTrendAnalysis(@Param('projectId') projectId: string) {
    // This would typically fetch historical data and perform trend analysis
    // For now, return a structured response that matches the expected format
    const mockHistoricalData = {
      projectId,
      timeRange: {
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        endDate: new Date(),
      },
      metrics: [
        {
          name: 'velocity',
          values: Array.from({ length: 30 }, (_, i) => ({
            timestamp: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000),
            value: 8 + Math.sin(i / 5) * 2 + Math.random() * 0.5,
          })),
          unit: 'story_points',
        },
      ],
      events: [],
      patterns: [],
    };

    const trendAnalysis = await this.predictiveService.analyzeTrends(
      projectId,
      mockHistoricalData
    );

    return trendAnalysis;
  }

  @Post('comprehensive-warnings')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Generate comprehensive early warnings',
    description:
      'Advanced early warning system with multiple data sources and correlation analysis',
  })
  @ApiResponse({
    status: 200,
    description: 'Comprehensive warnings generated successfully',
  })
  async generateComprehensiveWarnings(
    @Body() generateEarlyWarningsDto: GenerateEarlyWarningsDto
  ) {
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

    const warnings =
      await this.earlyWarningService.generateComprehensiveWarnings(trendData);

    return {
      projectId: generateEarlyWarningsDto.projectId,
      warnings,
      analysisTimestamp: new Date().toISOString(),
    };
  }
}
