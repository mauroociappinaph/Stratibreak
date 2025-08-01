import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ImpactLevel } from '../../../types/database/gap.types';
import { TimeUnit } from '../../../types/database/prediction.types';
import { TrendDirection as StateTrendDirection } from '../../../types/database/state.types';
import {
  Alert,
  ChangeType,
  PatternType,
  TrendDirection,
} from '../../../types/services/prediction.types';
import {
  CalculateRiskProbabilityDto,
  CalculateRiskProbabilityResponseDto,
  GenerateEarlyWarningsDto,
  GenerateEarlyWarningsResponseDto,
  PredictFutureIssuesDto,
  PredictFutureIssuesResponseDto,
} from '../dto';
import { PredictiveService } from '../services';

@ApiTags('predictions-advanced')
@Controller('predictions/advanced')
export class PredictionsAdvancedController {
  constructor(private readonly predictiveService: PredictiveService) {}

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
    type: PredictFutureIssuesResponseDto,
  })
  async predictFutureIssues(
    @Body() predictFutureIssuesDto: PredictFutureIssuesDto
  ): Promise<PredictFutureIssuesResponseDto> {
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
      predictions: predictions.map(prediction => ({
        issueType: prediction.issueType,
        probability: prediction.probability,
        estimatedTimeToOccurrence: {
          value: prediction.estimatedTimeToOccurrence.value,
          unit: prediction.estimatedTimeToOccurrence.unit,
        },
        potentialImpact: prediction.potentialImpact.toString(),
        preventionWindow: {
          value: prediction.preventionWindow.value,
          unit: prediction.preventionWindow.unit,
        },
        suggestedActions: prediction.suggestedActions.map(action => ({
          id: action.id,
          title: action.title,
          description: action.description,
          priority: action.priority.toString(),
          estimatedEffort: action.estimatedEffort,
          requiredResources: action.requiredResources,
          expectedImpact: action.expectedImpact,
          deadline: action.deadline?.toISOString() || '',
        })),
      })),
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
    type: GenerateEarlyWarningsResponseDto,
  })
  async generateEarlyWarnings(
    @Body() generateEarlyWarningsDto: GenerateEarlyWarningsDto
  ): Promise<GenerateEarlyWarningsResponseDto> {
    const trendData = {
      projectId: generateEarlyWarningsDto.projectId,
      currentMetrics: generateEarlyWarningsDto.currentMetrics.map(metric => ({
        name: metric.name,
        currentValue: metric.currentValue,
        previousValue: metric.previousValue,
        changeRate: metric.changeRate,
        trend: metric.trend as TrendDirection,
        unit: metric.unit,
      })),
      recentChanges: generateEarlyWarningsDto.recentChanges.map(change => ({
        metric: change.metric,
        changeType: change.changeType as ChangeType,
        magnitude: change.magnitude,
        timeframe: {
          value: change.timeframe.value,
          unit: change.timeframe.unit as TimeUnit,
        },
        significance: change.significance,
      })),
      velocityIndicators: generateEarlyWarningsDto.velocityIndicators.map(
        velocity => ({
          name: velocity.name,
          currentVelocity: velocity.currentVelocity,
          averageVelocity: velocity.averageVelocity,
          trend: velocity.trend as TrendDirection,
          predictedVelocity: velocity.predictedVelocity,
        })
      ),
    };

    const alerts = this.predictiveService.generateEarlyWarnings(trendData);
    const overallRiskLevel = this.calculateOverallRiskLevel(alerts);

    return {
      projectId: generateEarlyWarningsDto.projectId,
      overallRiskLevel,
      alerts: alerts.map(alert => ({
        id: alert.id,
        projectId: alert.projectId,
        type: alert.type.toString(),
        severity: alert.severity.toString(),
        title: alert.title,
        description: alert.description,
        probability: alert.probability,
        estimatedTimeToOccurrence: {
          value: alert.estimatedTimeToOccurrence.value,
          unit: alert.estimatedTimeToOccurrence.unit,
        },
        potentialImpact: alert.potentialImpact.toString(),
        preventionWindow: {
          value: alert.preventionWindow.value,
          unit: alert.preventionWindow.unit,
        },
        suggestedActions: alert.suggestedActions.map(action => ({
          id: action.id,
          title: action.title,
          description: action.description,
          priority: action.priority.toString(),
          estimatedEffort: action.estimatedEffort,
          requiredResources: action.requiredResources,
          expectedImpact: action.expectedImpact,
          deadline: action.deadline?.toISOString() || '',
        })),
        createdAt: alert.createdAt.toISOString(),
        expiresAt: alert.expiresAt.toISOString(),
      })),
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
      trend: indicator.trend as StateTrendDirection,
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
          trend: factor.trend.toString(),
        })),
        recommendations: riskAssessment.recommendations,
        confidenceLevel: riskAssessment.confidenceLevel,
      },
      analysisTimestamp: new Date().toISOString(),
    };
  }

  private calculateOverallRiskLevel(alerts: Alert[]): string {
    if (alerts.length === 0) return 'low';

    const criticalCount = alerts.filter(
      alert => alert.severity === 'critical'
    ).length;
    const highCount = alerts.filter(alert => alert.severity === 'high').length;
    const mediumCount = alerts.filter(
      alert => alert.severity === 'medium'
    ).length;

    if (criticalCount > 0) return 'critical';
    if (highCount > 1) return 'high';
    if (highCount > 0 || mediumCount > 2) return 'medium';
    return 'low';
  }
}
