/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, Logger } from '@nestjs/common';
import { ImpactLevel } from '../../../types/database/gap.types';
import {
  HistoricalData,
  ProjectData,
  RiskAssessment,
  RiskFactor,
  RiskIndicator,
  TrendDirection,
} from '../../../types/services/prediction.types';

/**
 * Advanced risk probability calculation service
 * Requirement 3.2: Generate proactive alerts with priority levels and probability
 * Requirement 3.3: Include estimated time to occurrence and impact potential
 */
@Injectable()
export class RiskCalculatorService {
  private readonly logger = new Logger(RiskCalculatorService.name);

  // Risk calculation weights and thresholds (for future use)
  // @ts-ignore - Reserved for future implementation
  private readonly RISK_WEIGHTS = {
    trend: 0.3,
    deviation: 0.4,
    volatility: 0.2,
    historical: 0.1,
  };

  // @ts-ignore - Reserved for future implementation
  private readonly IMPACT_MULTIPLIERS = {
    [ImpactLevel.LOW]: 0.25,
    [ImpactLevel.MEDIUM]: 0.5,
    [ImpactLevel.HIGH]: 0.75,
    [ImpactLevel.SEVERE]: 1.0,
  };

  /**
   * Calculate comprehensive risk assessment
   */
  async calculateComprehensiveRisk(
    indicators: RiskIndicator[],
    historicalData?: HistoricalData,
    _projectData?: ProjectData
  ): Promise<RiskAssessment> {
    this.logger.log(
      `Calculating comprehensive risk for ${indicators.length} indicators`
    );

    try {
      const riskFactors = await this.analyzeRiskFactors(
        indicators,
        historicalData
      );
      const overallRisk = this.calculateWeightedRisk(riskFactors);
      const confidenceLevel = this.calculateConfidenceLevel(
        indicators,
        historicalData
      );
      const recommendations = this.generateRiskRecommendations(
        riskFactors,
        overallRisk
      );

      const assessment: RiskAssessment = {
        overallRisk,
        riskFactors,
        recommendations,
        confidenceLevel,
      };

      this.logger.log(
        `Risk assessment completed: ${overallRisk.toFixed(3)} overall risk`
      );
      return assessment;
    } catch (error) {
      this.logger.error(
        `Error calculating comprehensive risk: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof Error ? error.stack : undefined
      );
      throw error;
    }
  }

  /**
   * Calculate risk probability for a single indicator
   */
  calculateIndicatorRisk(indicator: RiskIndicator): number {
    // Base risk calculation using threshold deviation
    const thresholdDeviation = this.calculateThresholdDeviation(indicator);

    // Trend-based risk adjustment
    const trendMultiplier = this.getTrendMultiplier(indicator.trend);

    // Weight-based importance scaling
    const weightedRisk =
      thresholdDeviation * trendMultiplier * indicator.weight;

    // Normalize to 0-1 range
    return Math.min(1.0, Math.max(0.0, weightedRisk));
  }

  /**
   * Calculate risk probability with time decay
   */
  calculateTimeDecayRisk(
    baseRisk: number,
    timeToOccurrence: number,
    decayRate: number = 0.1
  ): number {
    // Risk decreases over time with exponential decay
    const timeDecayFactor = Math.exp(-decayRate * timeToOccurrence);
    return baseRisk * timeDecayFactor;
  }

  /**
   * Calculate compound risk from multiple indicators
   */
  calculateCompoundRisk(risks: number[]): number {
    if (risks.length === 0) return 0;
    if (risks.length === 1) return risks[0] ?? 0;

    // Use probability theory for compound risk calculation
    // P(A or B) = P(A) + P(B) - P(A and B)
    // For multiple risks, use: 1 - ∏(1 - Pi)
    const compoundRisk =
      1 - risks.reduce((product, risk) => product * (1 - risk), 1);

    return Math.min(1.0, compoundRisk);
  }

  /**
   * Calculate risk with Monte Carlo simulation
   */
  async calculateMonteCarloRisk(
    indicators: RiskIndicator[],
    simulations: number = 1000
  ): Promise<{
    meanRisk: number;
    confidenceInterval: { lower: number; upper: number };
    riskDistribution: number[];
  }> {
    this.logger.log(
      `Running Monte Carlo simulation with ${simulations} iterations`
    );

    const riskSamples: number[] = [];

    for (let i = 0; i < simulations; i++) {
      const simulatedRisks = indicators.map(indicator => {
        // Add random variation to indicator values
        const variation = this.generateRandomVariation();
        const adjustedIndicator = {
          ...indicator,
          currentValue: indicator.currentValue * (1 + variation),
        };
        return this.calculateIndicatorRisk(adjustedIndicator);
      });

      const compoundRisk = this.calculateCompoundRisk(simulatedRisks);
      riskSamples.push(compoundRisk);
    }

    // Calculate statistics
    const meanRisk =
      riskSamples.reduce((sum, risk) => sum + risk, 0) / simulations;
    const sortedSamples = riskSamples.sort((a, b) => a - b);
    const lowerIndex = Math.floor(simulations * 0.05); // 5th percentile
    const upperIndex = Math.floor(simulations * 0.95); // 95th percentile

    return {
      meanRisk,
      confidenceInterval: {
        lower: sortedSamples[lowerIndex] ?? 0,
        upper: sortedSamples[upperIndex] ?? 0,
      },
      riskDistribution: riskSamples,
    };
  }

  /**
   * Calculate risk correlation between indicators
   */
  calculateRiskCorrelation(
    indicator1: RiskIndicator,
    indicator2: RiskIndicator,
    historicalData?: HistoricalData
  ): number {
    if (!historicalData) {
      // Use basic correlation based on trend similarity
      return this.calculateTrendCorrelation(indicator1.trend, indicator2.trend);
    }

    // Calculate correlation from historical data
    const metric1Data = historicalData.metrics.find(
      m => m.name === indicator1.indicator
    );
    const metric2Data = historicalData.metrics.find(
      m => m.name === indicator2.indicator
    );

    if (!metric1Data || !metric2Data) {
      return this.calculateTrendCorrelation(indicator1.trend, indicator2.trend);
    }

    return this.calculatePearsonCorrelation(
      metric1Data.values.map(v => v.value),
      metric2Data.values.map(v => v.value)
    );
  }

  /**
   * Calculate dynamic risk thresholds based on historical data
   */
  calculateDynamicThresholds(
    indicator: RiskIndicator,
    historicalData: HistoricalData
  ): { warning: number; critical: number; emergency: number } {
    const metricData = historicalData.metrics.find(
      m => m.name === indicator.indicator
    );

    if (!metricData || metricData.values.length < 10) {
      // Fallback to static thresholds
      return {
        warning: indicator.threshold * 0.8,
        critical: indicator.threshold,
        emergency: indicator.threshold * 1.2,
      };
    }

    const values = metricData.values.map(v => v.value);
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const stdDev = Math.sqrt(
      values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
        values.length
    );

    return {
      warning: mean + stdDev,
      critical: mean + 2 * stdDev,
      emergency: mean + 3 * stdDev,
    };
  }

  /**
   * Calculate risk velocity (rate of risk change)
   */
  calculateRiskVelocity(
    currentRisk: number,
    previousRisk: number,
    timeInterval: number
  ): number {
    if (timeInterval <= 0) return 0;
    return (currentRisk - previousRisk) / timeInterval;
  }

  /**
   * Calculate risk acceleration (rate of velocity change)
   */
  calculateRiskAcceleration(
    currentVelocity: number,
    previousVelocity: number,
    timeInterval: number
  ): number {
    if (timeInterval <= 0) return 0;
    return (currentVelocity - previousVelocity) / timeInterval;
  }

  // Private helper methods

  private async analyzeRiskFactors(
    indicators: RiskIndicator[],
    _historicalData?: HistoricalData
  ): Promise<RiskFactor[]> {
    const riskFactors: RiskFactor[] = [];

    for (const indicator of indicators) {
      // Calculate base risk and volatility for future use
      // const baseRisk = this.calculateIndicatorRisk(indicator);
      // const volatility = historicalData
      //   ? this.calculateVolatility(indicator, historicalData)
      //   : 0.1;

      riskFactors.push({
        factor: indicator.indicator,
        weight: indicator.weight,
        currentValue: indicator.currentValue,
        threshold: indicator.threshold,
        trend: indicator.trend,
      });
    }

    return riskFactors;
  }

  private calculateWeightedRisk(riskFactors: RiskFactor[]): number {
    if (riskFactors.length === 0) return 0;

    let weightedSum = 0;
    let totalWeight = 0;

    for (const factor of riskFactors) {
      const factorRisk = this.calculateThresholdDeviation({
        indicator: factor.factor,
        currentValue: factor.currentValue,
        threshold: factor.threshold,
        trend: factor.trend,
        weight: factor.weight,
      });

      weightedSum += factorRisk * factor.weight;
      totalWeight += factor.weight;
    }

    return totalWeight > 0 ? weightedSum / totalWeight : 0;
  }

  private calculateConfidenceLevel(
    indicators: RiskIndicator[],
    historicalData?: HistoricalData
  ): number {
    // Base confidence on number of indicators
    let confidence = Math.min(0.9, indicators.length * 0.1 + 0.3);

    // Adjust for data quality
    if (historicalData) {
      const dataQuality = this.assessDataQuality(historicalData);
      confidence *= dataQuality;
    }

    // Adjust for indicator weights
    const avgWeight =
      indicators.reduce((sum, ind) => sum + ind.weight, 0) / indicators.length;
    confidence *= 0.5 + avgWeight * 0.5;

    return Math.min(0.95, confidence);
  }

  private generateRiskRecommendations(
    riskFactors: RiskFactor[],
    overallRisk: number
  ): string[] {
    const recommendations: string[] = [];

    // Overall risk recommendations
    if (overallRisk > 0.8) {
      recommendations.push(
        'CRITICAL: Immediate action required - Risk level is critical'
      );
      recommendations.push('Escalate to senior management immediately');
      recommendations.push('Implement emergency risk mitigation procedures');
    } else if (overallRisk > 0.6) {
      recommendations.push(
        'HIGH: Urgent attention needed - Risk level is high'
      );
      recommendations.push('Activate risk response team');
      recommendations.push('Implement high-priority mitigation strategies');
    } else if (overallRisk > 0.4) {
      recommendations.push('MEDIUM: Monitor closely - Risk level is moderate');
      recommendations.push('Prepare contingency plans');
      recommendations.push('Increase monitoring frequency');
    } else {
      recommendations.push(
        'LOW: Continue monitoring - Risk level is acceptable'
      );
      recommendations.push('Maintain current risk management practices');
    }

    // Factor-specific recommendations
    const highRiskFactors = riskFactors.filter(factor => {
      const factorRisk = this.calculateThresholdDeviation({
        indicator: factor.factor,
        currentValue: factor.currentValue,
        threshold: factor.threshold,
        trend: factor.trend,
        weight: factor.weight,
      });
      return factorRisk > 0.7;
    });

    for (const factor of highRiskFactors) {
      recommendations.push(`Address high-risk factor: ${factor.factor}`);

      if (factor.trend === TrendDirection.DECLINING) {
        recommendations.push(
          `${factor.factor} is declining - investigate root causes`
        );
      } else if (factor.trend === TrendDirection.VOLATILE) {
        recommendations.push(
          `${factor.factor} is volatile - stabilize the metric`
        );
      }
    }

    return recommendations;
  }

  private calculateThresholdDeviation(indicator: RiskIndicator): number {
    if (indicator.threshold === 0) return 0;

    const deviation =
      Math.abs(indicator.currentValue - indicator.threshold) /
      Math.abs(indicator.threshold);

    // Risk increases exponentially with deviation
    return Math.min(1.0, Math.pow(deviation, 1.5));
  }

  private getTrendMultiplier(trend: TrendDirection): number {
    switch (trend) {
      case TrendDirection.DECLINING:
        return 1.3; // Higher risk for declining trends
      case TrendDirection.VOLATILE:
        return 1.2; // Higher risk for volatile trends
      case TrendDirection.STABLE:
        return 1.0; // Neutral
      case TrendDirection.IMPROVING:
        return 0.8; // Lower risk for improving trends
      default:
        return 1.0;
    }
  }

  // @ts-ignore - Reserved for future implementation
  private calculateVolatility(
    indicator: RiskIndicator,
    historicalData: HistoricalData
  ): number {
    const metricData = historicalData.metrics.find(
      m => m.name === indicator.indicator
    );

    if (!metricData || metricData.values.length < 3) {
      return 0.1; // Default low volatility
    }

    const values = metricData.values.map(v => v.value);
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance =
      values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
      values.length;

    return Math.sqrt(variance) / Math.abs(mean); // Coefficient of variation
  }

  private assessDataQuality(historicalData: HistoricalData): number {
    let qualityScore = 1.0;

    // Penalize for insufficient data
    const avgDataPoints =
      historicalData.metrics.reduce(
        (sum, metric) => sum + metric.values.length,
        0
      ) / historicalData.metrics.length;

    if (avgDataPoints < 10) {
      qualityScore *= 0.7;
    } else if (avgDataPoints < 30) {
      qualityScore *= 0.85;
    }

    // Penalize for data gaps
    const timeRange =
      historicalData.timeRange.endDate.getTime() -
      historicalData.timeRange.startDate.getTime();
    const expectedDataPoints = timeRange / (24 * 60 * 60 * 1000); // Daily data points

    if (avgDataPoints < expectedDataPoints * 0.5) {
      qualityScore *= 0.6; // Significant data gaps
    } else if (avgDataPoints < expectedDataPoints * 0.8) {
      qualityScore *= 0.8; // Some data gaps
    }

    return Math.max(0.3, qualityScore);
  }

  private generateRandomVariation(): number {
    // Generate random variation using Box-Muller transform for normal distribution
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);

    // Scale to ±10% variation
    return z0 * 0.1;
  }

  private calculateTrendCorrelation(
    trend1: TrendDirection,
    trend2: TrendDirection
  ): number {
    // Simple correlation based on trend similarity
    if (trend1 === trend2) return 1.0;

    const trendValues = {
      [TrendDirection.IMPROVING]: 1,
      [TrendDirection.STABLE]: 0,
      [TrendDirection.DECLINING]: -1,
      [TrendDirection.VOLATILE]: 0,
    };

    const diff = Math.abs(trendValues[trend1] - trendValues[trend2]);
    return Math.max(0, 1 - diff / 2);
  }

  private calculatePearsonCorrelation(x: number[], y: number[]): number {
    if (x.length !== y.length || x.length < 2) return 0;

    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * (y[i] ?? 0), 0);
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumYY = y.reduce((sum, yi) => sum + yi * yi, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt(
      (n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY)
    );

    return denominator === 0 ? 0 : numerator / denominator;
  }
}
