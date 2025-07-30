import { Injectable, Logger } from '@nestjs/common';
import {
  GapCategory,
  GapType,
  ImpactLevel,
  SeverityLevel,
} from '../../../types/database/gap.types';
import type {
  AnalysisConfig,
  Gap,
  SeverityFactors,
} from '../../../types/services/gap-analysis.types';
import { SeverityCalculationHelper } from '../helpers/severity-calculation.helper';

/**
 * Core severity calculation service with focused responsibilities
 */
@Injectable()
export class SeverityCalculatorService {
  private readonly logger = new Logger(SeverityCalculatorService.name);

  // Severity calculation weights for different factors
  private readonly severityWeights = {
    impact: 0.35,
    urgency: 0.25,
    complexity: 0.15,
    resourceRequirement: 0.15,
    stakeholderImpact: 0.1,
  };

  // Gap type multipliers for severity calculation
  private readonly gapTypeMultipliers: Record<GapType, number> = {
    [GapType.RESOURCE]: 0.9,
    [GapType.PROCESS]: 0.8,
    [GapType.COMMUNICATION]: 0.7,
    [GapType.TECHNOLOGY]: 0.8,
    [GapType.CULTURE]: 0.6,
    [GapType.TIMELINE]: 0.9,
    [GapType.QUALITY]: 0.8,
    [GapType.BUDGET]: 0.9,
    [GapType.SKILL]: 0.7,
  };

  // Category impact multipliers
  private readonly categoryMultipliers: Record<GapCategory, number> = {
    [GapCategory.OPERATIONAL]: 0.9,
    [GapCategory.STRATEGIC]: 0.8,
    [GapCategory.TACTICAL]: 0.7,
    [GapCategory.TECHNICAL]: 0.8,
    [GapCategory.ORGANIZATIONAL]: 0.6,
  };

  /**
   * Main severity calculation method using weighted factors
   */
  calculateGapSeverity(gap: Gap): SeverityLevel {
    try {
      // Extract severity factors from gap
      const factors = this.extractSeverityFactors(gap);

      // Calculate weighted severity score
      const weightedScore = this.calculateWeightedSeverityScore(
        factors,
        gap.type,
        gap.category
      );

      // Apply confidence adjustment
      const confidenceAdjustedScore = this.applyConfidenceAdjustment(
        weightedScore,
        gap.confidence
      );

      // Convert to severity level
      const severity = this.convertScoreToSeverityLevel(
        confidenceAdjustedScore
      );

      this.logger.debug(
        `Calculated severity for gap ${gap.title}: ${severity} (score: ${confidenceAdjustedScore.toFixed(3)})`
      );

      return severity;
    } catch (error) {
      this.logger.error(
        `Error calculating severity for gap ${gap.title}:`,
        error
      );
      return SeverityLevel.MEDIUM; // Default fallback
    }
  }

  /**
   * Multi-algorithm ensemble severity calculation
   */
  calculateEnsembleSeverity(
    gap: Gap,
    options?: {
      historicalGaps?: Gap[];
      benchmarkGaps?: Gap[];
      config?: AnalysisConfig;
    }
  ): SeverityLevel {
    try {
      const severities: SeverityLevel[] = [];
      const weights: number[] = [];

      // Standard weighted calculation
      severities.push(this.calculateGapSeverity(gap));
      weights.push(0.4);

      // Risk-based calculation
      severities.push(this.calculateRiskBasedSeverity(gap));
      weights.push(0.3);

      // ML-inspired calculation (if historical data available)
      if (options?.historicalGaps && options.historicalGaps.length > 0) {
        severities.push(
          this.calculateMLInspiredSeverity(gap, options.historicalGaps)
        );
        weights.push(0.2);
      } else {
        weights[1] = (weights[1] || 0) + 0.2; // Add weight to risk-based
      }

      // Comparative calculation (if benchmark data available)
      if (options?.benchmarkGaps && options.benchmarkGaps.length > 0) {
        severities.push(
          this.calculateComparativeSeverity(gap, options.benchmarkGaps)
        );
        weights.push(0.1);
      } else {
        weights[0] = (weights[0] || 0) + 0.1; // Add weight to standard
      }

      // Calculate weighted ensemble result
      return this.calculateWeightedEnsemble(severities, weights);
    } catch (error) {
      this.logger.error(`Error in ensemble severity calculation:`, error);
      return SeverityLevel.MEDIUM;
    }
  }

  /**
   * Risk-based severity calculation
   */
  private calculateRiskBasedSeverity(gap: Gap): SeverityLevel {
    try {
      const escalationProbability =
        SeverityCalculationHelper.calculateEscalationProbability(gap);
      const impactMagnitude =
        SeverityCalculationHelper.calculateImpactMagnitude(gap);
      const timeSensitivity =
        SeverityCalculationHelper.calculateTimeSensitivity(gap);

      const riskScore =
        escalationProbability * 0.4 +
        impactMagnitude * 0.4 +
        timeSensitivity * 0.2;

      return this.convertScoreToSeverityLevel(riskScore);
    } catch (error) {
      this.logger.error(`Error in risk-based severity calculation:`, error);
      return SeverityLevel.MEDIUM;
    }
  }

  /**
   * ML-inspired severity calculation
   */
  private calculateMLInspiredSeverity(
    gap: Gap,
    historicalGaps?: Gap[]
  ): SeverityLevel {
    try {
      const features = SeverityCalculationHelper.extractMLFeatures(gap);
      const mlScore = SeverityCalculationHelper.applyMLWeights(
        features,
        historicalGaps
      );
      const normalizedScore =
        SeverityCalculationHelper.normalizeMLScore(mlScore);

      return this.convertScoreToSeverityLevel(normalizedScore);
    } catch (error) {
      this.logger.error(`Error in ML-inspired severity calculation:`, error);
      return this.calculateGapSeverity(gap);
    }
  }

  /**
   * Comparative severity calculation using benchmarks
   */
  private calculateComparativeSeverity(
    gap: Gap,
    benchmarkGaps: Gap[]
  ): SeverityLevel {
    try {
      if (benchmarkGaps.length === 0) {
        return this.calculateGapSeverity(gap);
      }

      const gapScore = this.calculateGapScore(gap);
      const benchmarkScores = benchmarkGaps.map(g => this.calculateGapScore(g));
      const percentile = SeverityCalculationHelper.calculatePercentile(
        gapScore,
        benchmarkScores
      );

      if (percentile >= 0.9) return SeverityLevel.CRITICAL;
      if (percentile >= 0.7) return SeverityLevel.HIGH;
      if (percentile >= 0.4) return SeverityLevel.MEDIUM;
      return SeverityLevel.LOW;
    } catch (error) {
      this.logger.error(`Error in comparative severity calculation:`, error);
      return SeverityLevel.MEDIUM;
    }
  }

  /**
   * Extract severity factors from gap data
   */
  private extractSeverityFactors(gap: Gap): SeverityFactors {
    return {
      impactLevel: this.mapImpactLevelToScore(gap.estimatedImpact.level),
      urgency: this.calculateUrgencyScore(gap),
      complexity: this.calculateComplexityScore(gap),
      resourceRequirement: this.calculateResourceRequirementScore(gap),
      stakeholderImpact: this.calculateStakeholderImpactScore(gap),
    };
  }

  private mapImpactLevelToScore(level: ImpactLevel): number {
    switch (level) {
      case 'severe':
        return 1.0;
      case 'high':
        return 0.8;
      case 'medium':
        return 0.6;
      case 'low':
        return 0.4;
      case 'negligible':
        return 0.2;
      default:
        return 0.5;
    }
  }

  private calculateUrgencyScore(gap: Gap): number {
    const varianceUrgency = Math.min(1.0, Math.abs(gap.variance) * 2);
    const timeframeUrgency =
      SeverityCalculationHelper.calculateTimeSensitivity(gap);
    return (varianceUrgency + timeframeUrgency) / 2;
  }

  private calculateComplexityScore(gap: Gap): number {
    const rootCauseComplexity = Math.min(1.0, gap.rootCauses.length / 5);
    const areaComplexity = Math.min(1.0, gap.affectedAreas.length / 3);
    const typeComplexity = this.getTypeComplexity(gap.type);
    return (rootCauseComplexity + areaComplexity + typeComplexity) / 3;
  }

  private calculateResourceRequirementScore(gap: Gap): number {
    const baseRequirement = this.getBaseResourceRequirement(gap.type);
    const complexityMultiplier = 1 + gap.rootCauses.length * 0.1;
    return Math.min(1.0, baseRequirement * complexityMultiplier);
  }

  private calculateStakeholderImpactScore(gap: Gap): number {
    const stakeholderCount = gap.estimatedImpact.affectedStakeholders.length;
    return Math.min(1.0, stakeholderCount / 10);
  }

  private calculateWeightedSeverityScore(
    factors: SeverityFactors,
    gapType: GapType,
    category: GapCategory
  ): number {
    const baseScore =
      factors.impactLevel * this.severityWeights.impact +
      factors.urgency * this.severityWeights.urgency +
      factors.complexity * this.severityWeights.complexity +
      factors.resourceRequirement * this.severityWeights.resourceRequirement +
      factors.stakeholderImpact * this.severityWeights.stakeholderImpact;

    const typeMultiplier = this.gapTypeMultipliers[gapType] || 0.5;
    const categoryMultiplier = this.categoryMultipliers[category] || 0.5;

    return Math.min(1.0, baseScore * typeMultiplier * categoryMultiplier);
  }

  private applyConfidenceAdjustment(score: number, confidence: number): number {
    const confidenceAdjustment = 0.8 + confidence * 0.2;
    return score * confidenceAdjustment;
  }

  private convertScoreToSeverityLevel(score: number): SeverityLevel {
    if (score >= 0.8) return SeverityLevel.CRITICAL;
    if (score >= 0.6) return SeverityLevel.HIGH;
    if (score >= 0.4) return SeverityLevel.MEDIUM;
    return SeverityLevel.LOW;
  }

  private calculateGapScore(gap: Gap): number {
    const factors = this.extractSeverityFactors(gap);
    return this.calculateWeightedSeverityScore(factors, gap.type, gap.category);
  }

  private calculateWeightedEnsemble(
    severities: SeverityLevel[],
    weights: number[]
  ): SeverityLevel {
    const severityScores = severities.map(s => this.severityToScore(s));
    const weightedSum = severityScores.reduce(
      (sum, score, index) => sum + score * (weights[index] || 0),
      0
    );
    const normalizedSum = weightedSum / weights.reduce((sum, w) => sum + w, 0);
    return this.scoreToSeverity(normalizedSum);
  }

  private severityToScore(severity: SeverityLevel): number {
    switch (severity) {
      case SeverityLevel.CRITICAL:
        return 4;
      case SeverityLevel.HIGH:
        return 3;
      case SeverityLevel.MEDIUM:
        return 2;
      case SeverityLevel.LOW:
        return 1;
      default:
        return 2;
    }
  }

  private scoreToSeverity(score: number): SeverityLevel {
    if (score >= 3.5) return SeverityLevel.CRITICAL;
    if (score >= 2.5) return SeverityLevel.HIGH;
    if (score >= 1.5) return SeverityLevel.MEDIUM;
    return SeverityLevel.LOW;
  }

  private getTypeComplexity(type: GapType): number {
    const complexityMap: Record<GapType, number> = {
      [GapType.RESOURCE]: 0.6,
      [GapType.PROCESS]: 0.8,
      [GapType.COMMUNICATION]: 0.7,
      [GapType.TECHNOLOGY]: 0.9,
      [GapType.CULTURE]: 1.0,
      [GapType.TIMELINE]: 0.5,
      [GapType.QUALITY]: 0.7,
      [GapType.BUDGET]: 0.4,
      [GapType.SKILL]: 0.8,
    };
    return complexityMap[type] || 0.5;
  }

  private getBaseResourceRequirement(type: GapType): number {
    const resourceMap: Record<GapType, number> = {
      [GapType.RESOURCE]: 0.9,
      [GapType.PROCESS]: 0.7,
      [GapType.COMMUNICATION]: 0.5,
      [GapType.TECHNOLOGY]: 0.8,
      [GapType.CULTURE]: 0.9,
      [GapType.TIMELINE]: 0.6,
      [GapType.QUALITY]: 0.7,
      [GapType.BUDGET]: 0.8,
      [GapType.SKILL]: 0.8,
    };
    return resourceMap[type] || 0.5;
  }
}
