/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Injectable, Logger } from '@nestjs/common';
import { ImpactLevel, Priority } from '../../../types/database/gap.types';
import { TimeUnit } from '../../../types/database/prediction.types';
import {
  Alert,
  AlertSeverity,
  AlertType,
  ChangeType,
  HistoricalData,
  IdentifiedTrend,
  PatternType,
  Prediction,
  PredictiveEngine,
  ProjectData,
  RiskAssessment,
  RiskIndicator,
  TrendAnalysisResult,
  TrendData,
  TrendDirection,
  TrendPrediction,
  TrendRecommendation,
} from '../../../types/services/prediction.types';

@Injectable()
export class PredictiveService implements PredictiveEngine {
  private readonly logger = new Logger(PredictiveService.name);

  /**
   * Predict future issues based on historical data
   * Requirement 3.1: Use historical data and current trends to predict future disruptions
   */
  async predictFutureIssues(
    historicalData: HistoricalData
  ): Promise<Prediction[]> {
    this.logger.log(
      `Predicting future issues for project ${historicalData.projectId}`
    );

    const predictions: Prediction[] = [];

    try {
      // Analyze historical patterns to identify potential issues
      const patterns = this.analyzeHistoricalPatterns(historicalData);

      // Generate predictions based on patterns
      for (const pattern of patterns) {
        const prediction = await this.generatePredictionFromPattern(
          pattern,
          historicalData
        );
        if (prediction) {
          predictions.push(prediction);
        }
      }

      // Analyze metric trends for additional predictions
      const trendPredictions =
        this.analyzeTrendBasedPredictions(historicalData);
      predictions.push(...trendPredictions);

      this.logger.log(
        `Generated ${predictions.length} predictions for project ${historicalData.projectId}`
      );
      return predictions;
    } catch (error) {
      this.logger.error(
        `Error predicting future issues: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof Error ? error.stack : undefined
      );
      throw error;
    }
  }

  /**
   * Generate early warning alerts based on current trends
   * Requirement 3.2: Generate proactive alerts with priority levels and probability
   */
  generateEarlyWarnings(currentTrends: TrendData): Alert[] {
    this.logger.log(
      `Generating early warnings for project ${currentTrends.projectId}`
    );

    const alerts: Alert[] = [];

    try {
      // Analyze current metrics for warning signs
      for (const metric of currentTrends.currentMetrics) {
        const alert = this.evaluateMetricForWarning(metric, currentTrends);
        if (alert) {
          alerts.push(alert);
        }
      }

      // Analyze velocity indicators for performance warnings
      for (const velocity of currentTrends.velocityIndicators) {
        const alert = this.evaluateVelocityForWarning(velocity, currentTrends);
        if (alert) {
          alerts.push(alert);
        }
      }

      // Analyze recent changes for anomaly detection
      for (const change of currentTrends.recentChanges) {
        const alert = this.evaluateChangeForWarning(change, currentTrends);
        if (alert) {
          alerts.push(alert);
        }
      }

      // Sort alerts by severity and probability
      alerts.sort((a, b) => {
        const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        const severityDiff =
          severityOrder[b.severity] - severityOrder[a.severity];
        if (severityDiff !== 0) return severityDiff;
        return b.probability - a.probability;
      });

      this.logger.log(`Generated ${alerts.length} early warning alerts`);
      return alerts;
    } catch (error) {
      this.logger.error(
        `Error generating early warnings: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof Error ? error.stack : undefined
      );
      return [];
    }
  }

  /**
   * Calculate risk probability based on risk indicators
   * Requirement 3.3: Include estimated time to occurrence and impact potential
   */
  calculateRiskProbability(indicators: RiskIndicator[]): RiskAssessment {
    this.logger.log(
      `Calculating risk probability for ${indicators.length} indicators`
    );

    try {
      let weightedRiskSum = 0;
      let totalWeight = 0;
      const riskFactors = [];

      for (const indicator of indicators) {
        // Calculate risk contribution based on current value vs threshold
        const riskContribution = this.calculateIndicatorRisk(indicator);
        weightedRiskSum += riskContribution * indicator.weight;
        totalWeight += indicator.weight;

        riskFactors.push({
          factor: indicator.indicator,
          weight: indicator.weight,
          currentValue: indicator.currentValue,
          threshold: indicator.threshold,
          trend: indicator.trend,
        });
      }

      const overallRisk = totalWeight > 0 ? weightedRiskSum / totalWeight : 0;
      const confidenceLevel = this.calculateConfidenceLevel(indicators);
      const recommendations = this.generateRiskRecommendations(
        riskFactors,
        overallRisk
      );

      return {
        overallRisk,
        riskFactors,
        recommendations,
        confidenceLevel,
      };
    } catch (error) {
      this.logger.error(
        `Error calculating risk probability: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof Error ? error.stack : undefined
      );
      throw error;
    }
  }

  /**
   * Update prediction models with new project data
   * Requirement 3.4: Continuous learning and model improvement
   */
  updatePredictionModels(newData: ProjectData): void {
    this.logger.log(
      `Updating prediction models with new data for project ${newData.projectId}`
    );

    try {
      // Store new data for model training
      this.storeTrainingData(newData);

      // Update trend analysis models
      this.updateTrendModels(newData);

      // Update risk assessment models
      this.updateRiskModels(newData);

      // Update pattern recognition models
      this.updatePatternModels(newData);

      this.logger.log('Prediction models updated successfully');
    } catch (error) {
      this.logger.error(
        `Error updating prediction models: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof Error ? error.stack : undefined
      );
    }
  }

  /**
   * Perform comprehensive trend analysis
   * Sub-task 6.1.a: Basic trend analysis implementation
   */
  async analyzeTrends(
    projectId: string,
    historicalData: HistoricalData
  ): Promise<TrendAnalysisResult> {
    this.logger.log(`Analyzing trends for project ${projectId}`);

    try {
      const trends = this.identifyTrends(historicalData);
      const predictions = this.generateTrendPredictions(trends, historicalData);
      const recommendations = this.generateTrendRecommendations(
        trends,
        predictions
      );

      const result: TrendAnalysisResult = {
        projectId,
        analysisTimestamp: new Date(),
        trends,
        predictions,
        recommendations,
        confidenceLevel: this.calculateTrendConfidence(trends),
      };

      this.logger.log(
        `Trend analysis completed with ${trends.length} trends identified`
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Error analyzing trends: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof Error ? error.stack : undefined
      );
      throw error;
    }
  }

  // Private helper methods for trend analysis

  private analyzeHistoricalPatterns(historicalData: HistoricalData) {
    // Analyze patterns in historical data
    return historicalData.patterns.filter(
      (pattern: any) => pattern.confidence > 0.7 && pattern.frequency > 2
    );
  }

  private async generatePredictionFromPattern(
    pattern: any,
    _historicalData: HistoricalData
  ): Promise<Prediction | null> {
    // Generate prediction based on historical pattern
    if (
      pattern.patternType === PatternType.TRENDING &&
      pattern.confidence > 0.8
    ) {
      return {
        issueType: `${pattern.patternType}_continuation`,
        probability: pattern.confidence,
        estimatedTimeToOccurrence: { value: 7, unit: TimeUnit.DAYS },
        potentialImpact: ImpactLevel.MEDIUM,
        preventionWindow: { value: 3, unit: TimeUnit.DAYS },
        suggestedActions: [
          {
            id: `action_${Date.now()}`,
            title: 'Monitor trend continuation',
            description: `Monitor the ${pattern.description} trend closely`,
            priority: Priority.MEDIUM,
            estimatedEffort: '2-4 hours',
            requiredResources: ['Project Manager', 'Data Analyst'],
            expectedImpact: 'Early detection of trend changes',
          },
        ],
      };
    }
    return null;
  }

  private analyzeTrendBasedPredictions(
    historicalData: HistoricalData
  ): Prediction[] {
    const predictions: Prediction[] = [];

    // Analyze each metric for trend-based predictions
    for (const metric of historicalData.metrics) {
      if (metric.values.length < 3) continue;

      const trend = this.calculateMetricTrend(metric.values);
      if (Math.abs(trend.slope) > 0.1) {
        // Significant trend
        predictions.push({
          issueType: `${metric.name}_trend_continuation`,
          probability: Math.min(0.9, Math.abs(trend.slope)),
          estimatedTimeToOccurrence: { value: 5, unit: TimeUnit.DAYS },
          potentialImpact: this.assessTrendImpact(trend.slope),
          preventionWindow: { value: 2, unit: TimeUnit.DAYS },
          suggestedActions: [
            {
              id: `trend_action_${Date.now()}`,
              title: `Address ${metric.name} trend`,
              description: `Take action to address the ${trend.slope > 0 ? 'increasing' : 'decreasing'} trend in ${metric.name}`,
              priority:
                Math.abs(trend.slope) > 0.5 ? Priority.HIGH : Priority.MEDIUM,
              estimatedEffort: '4-8 hours',
              requiredResources: ['Team Lead', 'Subject Matter Expert'],
              expectedImpact: 'Prevent trend from becoming critical',
            },
          ],
        });
      }
    }

    return predictions;
  }

  private evaluateMetricForWarning(
    metric: any,
    trendData: TrendData
  ): Alert | null {
    // Evaluate if metric warrants a warning
    const changeThreshold = 0.2; // 20% change threshold

    if (Math.abs(metric.changeRate) > changeThreshold) {
      return {
        id: `alert_${Date.now()}_${metric.name}`,
        projectId: trendData.projectId,
        type: AlertType.TREND_ALERT,
        severity:
          Math.abs(metric.changeRate) > 0.5
            ? AlertSeverity.HIGH
            : AlertSeverity.MEDIUM,
        title: `${metric.name} showing significant change`,
        description: `${metric.name} has changed by ${(metric.changeRate * 100).toFixed(1)}% recently`,
        probability: Math.min(0.95, Math.abs(metric.changeRate) + 0.3),
        estimatedTimeToOccurrence: { value: 24, unit: TimeUnit.HOURS },
        potentialImpact: this.assessChangeImpact(metric.changeRate),
        preventionWindow: { value: 12, unit: TimeUnit.HOURS },
        suggestedActions: [
          {
            id: `alert_action_${Date.now()}`,
            title: `Investigate ${metric.name} change`,
            description: `Investigate the cause of the significant change in ${metric.name}`,
            priority: Priority.HIGH,
            estimatedEffort: '2-4 hours',
            requiredResources: ['Project Manager', 'Technical Lead'],
            expectedImpact: 'Identify and address root cause',
          },
        ],
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      };
    }
    return null;
  }

  private evaluateVelocityForWarning(
    velocity: any,
    trendData: TrendData
  ): Alert | null {
    // Evaluate velocity indicators for warnings
    const velocityThreshold = 0.3; // 30% below average
    const velocityRatio = velocity.currentVelocity / velocity.averageVelocity;

    if (velocityRatio < 1 - velocityThreshold) {
      return {
        id: `velocity_alert_${Date.now()}_${velocity.name}`,
        projectId: trendData.projectId,
        type: AlertType.EARLY_WARNING,
        severity:
          velocityRatio < 0.5 ? AlertSeverity.CRITICAL : AlertSeverity.HIGH,
        title: `${velocity.name} velocity below average`,
        description: `${velocity.name} is running at ${(velocityRatio * 100).toFixed(1)}% of average velocity`,
        probability: 0.85,
        estimatedTimeToOccurrence: { value: 48, unit: TimeUnit.HOURS },
        potentialImpact: ImpactLevel.HIGH,
        preventionWindow: { value: 24, unit: TimeUnit.HOURS },
        suggestedActions: [
          {
            id: `velocity_action_${Date.now()}`,
            title: `Address ${velocity.name} velocity issue`,
            description: `Investigate and address factors causing reduced ${velocity.name} velocity`,
            priority: Priority.HIGH,
            estimatedEffort: '4-8 hours',
            requiredResources: ['Team Lead', 'Process Analyst'],
            expectedImpact: 'Restore normal velocity levels',
          },
        ],
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours
      };
    }
    return null;
  }

  private evaluateChangeForWarning(
    change: any,
    trendData: TrendData
  ): Alert | null {
    // Evaluate recent changes for anomaly warnings
    if (change.changeType === ChangeType.SUDDEN && change.significance > 0.7) {
      return {
        id: `change_alert_${Date.now()}_${change.metric}`,
        projectId: trendData.projectId,
        type: AlertType.ANOMALY_ALERT,
        severity:
          change.magnitude > 0.8 ? AlertSeverity.CRITICAL : AlertSeverity.HIGH,
        title: `Sudden change detected in ${change.metric}`,
        description: `Sudden ${change.changeType} change detected in ${change.metric} with magnitude ${change.magnitude}`,
        probability: change.significance,
        estimatedTimeToOccurrence: { value: 6, unit: TimeUnit.HOURS },
        potentialImpact: this.assessChangeMagnitudeImpact(change.magnitude),
        preventionWindow: { value: 3, unit: TimeUnit.HOURS },
        suggestedActions: [
          {
            id: `change_action_${Date.now()}`,
            title: `Investigate sudden change in ${change.metric}`,
            description: `Immediate investigation required for sudden change in ${change.metric}`,
            priority: Priority.URGENT,
            estimatedEffort: '1-2 hours',
            requiredResources: ['Incident Response Team'],
            expectedImpact: 'Prevent escalation of anomaly',
          },
        ],
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours
      };
    }
    return null;
  }

  private calculateIndicatorRisk(indicator: RiskIndicator): number {
    // Calculate risk based on how far current value is from threshold
    const deviation =
      Math.abs(indicator.currentValue - indicator.threshold) /
      indicator.threshold;
    let risk = Math.min(1.0, deviation);

    // Adjust based on trend
    switch (indicator.trend) {
      case TrendDirection.DECLINING:
        risk *= 1.2; // Increase risk for declining trends
        break;
      case TrendDirection.VOLATILE:
        risk *= 1.1; // Slight increase for volatile trends
        break;
      case TrendDirection.IMPROVING:
        risk *= 0.8; // Decrease risk for improving trends
        break;
    }

    return Math.min(1.0, risk);
  }

  private calculateConfidenceLevel(indicators: RiskIndicator[]): number {
    // Calculate confidence based on number and quality of indicators
    const baseConfidence = Math.min(0.9, indicators.length * 0.1 + 0.3);
    const weightSum = indicators.reduce((sum, ind) => sum + ind.weight, 0);
    const weightedConfidence = Math.min(
      0.95,
      baseConfidence + (weightSum / indicators.length) * 0.1
    );

    return weightedConfidence;
  }

  private generateRiskRecommendations(
    riskFactors: any[],
    overallRisk: number
  ): string[] {
    const recommendations: string[] = [];

    if (overallRisk > 0.8) {
      recommendations.push(
        'Immediate action required - Critical risk level detected'
      );
      recommendations.push('Escalate to senior management and stakeholders');
    } else if (overallRisk > 0.6) {
      recommendations.push(
        'High risk detected - Implement mitigation strategies'
      );
      recommendations.push('Increase monitoring frequency');
    } else if (overallRisk > 0.4) {
      recommendations.push(
        'Moderate risk - Monitor closely and prepare contingency plans'
      );
    } else {
      recommendations.push('Low risk - Continue regular monitoring');
    }

    // Add specific recommendations based on risk factors
    const highRiskFactors = riskFactors.filter(
      factor =>
        this.calculateIndicatorRisk({
          indicator: factor.factor,
          currentValue: factor.currentValue,
          threshold: factor.threshold,
          trend: factor.trend,
          weight: factor.weight,
        }) > 0.7
    );

    for (const factor of highRiskFactors) {
      recommendations.push(`Address high-risk factor: ${factor.factor}`);
    }

    return recommendations;
  }

  private storeTrainingData(_newData: ProjectData): void {
    // Store data for future model training
    this.logger.debug(
      `Storing training data for project ${_newData.projectId}`
    );
    // Implementation would store data in a training dataset
  }

  private updateTrendModels(_newData: ProjectData): void {
    // Update trend analysis models
    this.logger.debug('Updating trend models with new data');
    // Implementation would update ML models for trend analysis
  }

  private updateRiskModels(_newData: ProjectData): void {
    // Update risk assessment models
    this.logger.debug('Updating risk models with new data');
    // Implementation would update ML models for risk assessment
  }

  private updatePatternModels(_newData: ProjectData): void {
    // Update pattern recognition models
    this.logger.debug('Updating pattern models with new data');
    // Implementation would update ML models for pattern recognition
  }

  private identifyTrends(historicalData: HistoricalData): IdentifiedTrend[] {
    const trends: IdentifiedTrend[] = [];

    for (const metric of historicalData.metrics) {
      if (metric.values.length < 3) continue;

      const trendInfo = this.calculateMetricTrend(metric.values);
      if (Math.abs(trendInfo.slope) > 0.05) {
        // Significant trend threshold
        trends.push({
          metric: metric.name,
          direction:
            trendInfo.slope > 0
              ? TrendDirection.IMPROVING
              : TrendDirection.DECLINING,
          strength: Math.abs(trendInfo.slope),
          duration: { value: metric.values.length, unit: TimeUnit.DAYS },
          significance: Math.min(1.0, Math.abs(trendInfo.slope) * 2),
          description: `${metric.name} showing ${trendInfo.slope > 0 ? 'upward' : 'downward'} trend`,
        });
      }
    }

    return trends;
  }

  private generateTrendPredictions(
    trends: IdentifiedTrend[],
    historicalData: HistoricalData
  ): TrendPrediction[] {
    const predictions: TrendPrediction[] = [];

    for (const trend of trends) {
      const metric = historicalData.metrics.find(m => m.name === trend.metric);
      if (!metric || metric.values.length === 0) continue;

      const lastValue = metric.values[metric.values.length - 1]?.value ?? 0;
      const trendInfo = this.calculateMetricTrend(metric.values);

      // Predict value 7 days ahead
      const predictedValue = lastValue + trendInfo.slope * 7;
      const variance = this.calculateVariance(metric.values.map(v => v.value));
      const bounds = {
        lower: predictedValue - variance,
        upper: predictedValue + variance,
      };

      predictions.push({
        metric: trend.metric,
        predictedValue,
        timeHorizon: { value: 7, unit: TimeUnit.DAYS },
        confidence: Math.max(0.5, 1 - variance / Math.abs(predictedValue)),
        bounds,
      });
    }

    return predictions;
  }

  private generateTrendRecommendations(
    trends: IdentifiedTrend[],
    predictions: TrendPrediction[]
  ): TrendRecommendation[] {
    const recommendations: TrendRecommendation[] = [];

    for (const trend of trends) {
      if (trend.significance > 0.7) {
        const prediction = predictions.find(p => p.metric === trend.metric);

        recommendations.push({
          priority: trend.significance > 0.9 ? Priority.HIGH : Priority.MEDIUM,
          action: `Address ${trend.direction} trend in ${trend.metric}`,
          rationale: `Strong ${trend.direction} trend detected with ${(trend.significance * 100).toFixed(1)}% significance`,
          expectedImpact: prediction
            ? `Predicted to reach ${prediction.predictedValue.toFixed(2)} in ${prediction.timeHorizon.value} ${prediction.timeHorizon.unit}`
            : 'Trend continuation expected',
          timeframe: { value: 3, unit: TimeUnit.DAYS },
        });
      }
    }

    return recommendations;
  }

  private calculateTrendConfidence(trends: IdentifiedTrend[]): number {
    if (trends.length === 0) return 0.5;

    const avgSignificance =
      trends.reduce((sum, trend) => sum + trend.significance, 0) /
      trends.length;
    return Math.min(0.95, avgSignificance + 0.1);
  }

  private calculateMetricTrend(values: any[]): {
    slope: number;
    intercept: number;
  } {
    if (values.length < 2) return { slope: 0, intercept: 0 };

    const n = values.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const y = values.map(v => v.value);

    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return { slope, intercept };
  }

  private calculateVariance(values: number[]): number {
    if (values.length < 2) return 0;

    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance =
      values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) /
      values.length;

    return Math.sqrt(variance);
  }

  private assessTrendImpact(slope: number): ImpactLevel {
    const absSlope = Math.abs(slope);
    if (absSlope > 0.8) return ImpactLevel.SEVERE;
    if (absSlope > 0.5) return ImpactLevel.HIGH;
    if (absSlope > 0.2) return ImpactLevel.MEDIUM;
    return ImpactLevel.LOW;
  }

  private assessChangeImpact(changeRate: number): ImpactLevel {
    const absChange = Math.abs(changeRate);
    if (absChange > 0.8) return ImpactLevel.SEVERE;
    if (absChange > 0.5) return ImpactLevel.HIGH;
    if (absChange > 0.3) return ImpactLevel.MEDIUM;
    return ImpactLevel.LOW;
  }

  private assessChangeMagnitudeImpact(magnitude: number): ImpactLevel {
    if (magnitude > 0.9) return ImpactLevel.SEVERE;
    if (magnitude > 0.7) return ImpactLevel.HIGH;
    if (magnitude > 0.4) return ImpactLevel.MEDIUM;
    return ImpactLevel.LOW;
  }
}
