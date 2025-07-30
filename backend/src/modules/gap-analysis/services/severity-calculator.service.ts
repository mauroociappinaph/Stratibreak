import { Injectable, Logger } from '@nestjs/common';
import type {
  GapCategory,
  GapType,
  ImpactLevel,
} from '../../../types/database/gap.types';
import type {
  AnalysisConfig,
  Gap,
  SeverityFactors,
} from '../../../types/services/gap-analysis.types';

/**
 * Advanced severity calculation service with multiple algorithms
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
    resource: 0.9,
    process: 0.8,
    communication: 0.7,
    technology: 0.8,
    culture: 0.6,
    timeline: 0.9,
    quality: 0.8,
    budget: 0.9,
    skill: 0.7,
    governance: 0.6,
  };

  // Category impact multipliers
  private readonly categoryMultipliers: Record<GapCategory, number> = {
    operational: 0.9,
    strategic: 0.8,
    tactical: 0.7,
    technical: 0.8,
    organizational: 0.6,
  };

  /**
   * Main severity calculation method using weighted factors
   */
  calculateGapSeverity(gap: Gap, _config?: AnalysisConfig): SeverityLevel {
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
      return 'medium'; // Default fallback
    }
  }

  /**
   * Alternative severity calculation using machine learning-inspired approach
   */
  calculateMLInspiredSeverity(gap: Gap, historicalGaps?: Gap[]): SeverityLevel {
    try {
      // Feature extraction
      const features = this.extractMLFeatures(gap);

      // Apply learned weights (simplified ML approach)
      const mlScore = this.applyMLWeights(features, historicalGaps);

      // Normalize and convert to severity
      const normalizedScore = this.normalizeMLScore(mlScore);

      return this.convertScoreToSeverityLevel(normalizedScore);
    } catch (error) {
      this.logger.error(`Error in ML-inspired severity calculation:`, error);
      return this.calculateGapSeverity(gap); // Fallback to standard method
    }
  }

  /**
   * Risk-based severity calculation
   */
  calculateRiskBasedSeverity(gap: Gap): SeverityLevel {
    try {
      // Calculate probability of escalation
      const escalationProbability = this.calculateEscalationProbability(gap);

      // Calculate potential impact magnitude
      const impactMagnitude = this.calculateImpactMagnitude(gap);

      // Calculate time sensitivity
      const timeSensitivity = this.calculateTimeSensitivity(gap);

      // Combine risk factors
      const riskScore =
        escalationProbability * 0.4 +
        impactMagnitude * 0.4 +
        timeSensitivity * 0.2;

      return this.convertScoreToSeverityLevel(riskScore);
    } catch (error) {
      this.logger.error(`Error in risk-based severity calculation:`, error);
      return 'medium';
    }
  }

  /**
   * Comparative severity calculation using benchmarks
   */
  calculateComparativeSeverity(gap: Gap, benchmarkGaps: Gap[]): SeverityLevel {
    try {
      if (benchmarkGaps.length === 0) {
        return this.calculateGapSeverity(gap);
      }

      // Calculate percentile ranking
      const gapScore = this.calculateGapScore(gap);
      const benchmarkScores = benchmarkGaps.map(g => this.calculateGapScore(g));

      const percentile = this.calculatePercentile(gapScore, benchmarkScores);

      // Convert percentile to severity
      if (percentile >= 0.9) return 'critical';
      if (percentile >= 0.7) return 'high';
      if (percentile >= 0.4) return 'medium';
      return 'low';
    } catch (error) {
      this.logger.error(`Error in comparative severity calculation:`, error);
      return 'medium';
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
      severities.push(this.calculateGapSeverity(gap, options?.config));
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
        if (weights[1] !== undefined) weights[1] += 0.2; // Add weight to risk-based
      }

      // Comparative calculation (if benchmark data available)
      if (options?.benchmarkGaps && options.benchmarkGaps.length > 0) {
        severities.push(
          this.calculateComparativeSeverity(gap, options.benchmarkGaps)
        );
        weights.push(0.1);
      } else {
        if (weights[0] !== undefined) weights[0] += 0.1; // Add weight to standard
      }

      // Calculate weighted ensemble result
      return this.calculateWeightedEnsemble(severities, weights);
    } catch (error) {
      this.logger.error(`Error in ensemble severity calculation:`, error);
      return 'medium';
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
    // Base urgency on variance magnitude and timeframe
    const varianceUrgency = Math.min(1.0, Math.abs(gap.variance) * 2);

    const timeframeUrgency =
      gap.estimatedImpact.timeframe === 'immediate'
        ? 1.0
        : gap.estimatedImpact.timeframe === 'short-term'
          ? 0.8
          : gap.estimatedImpact.timeframe === 'medium-term'
            ? 0.6
            : gap.estimatedImpact.timeframe === 'long-term'
              ? 0.4
              : 0.5;

    return (varianceUrgency + timeframeUrgency) / 2;
  }

  private calculateComplexityScore(gap: Gap): number {
    // Complexity based on number of root causes and affected areas
    const rootCauseComplexity = Math.min(1.0, gap.rootCauses.length / 5);
    const areaComplexity = Math.min(1.0, gap.affectedAreas.length / 3);
    const typeComplexity = this.getTypeComplexity(gap.type);

    return (rootCauseComplexity + areaComplexity + typeComplexity) / 3;
  }

  private calculateResourceRequirementScore(gap: Gap): number {
    // Resource requirement based on gap type and complexity
    const baseRequirement = this.getBaseResourceRequirement(gap.type);
    const complexityMultiplier = 1 + gap.rootCauses.length * 0.1;

    return Math.min(1.0, baseRequirement * complexityMultiplier);
  }

  private calculateStakeholderImpactScore(gap: Gap): number {
    const stakeholderCount = gap.estimatedImpact.affectedStakeholders.length;
    return Math.min(1.0, stakeholderCount / 10); // Normalize to max 10 stakeholders
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

    // Apply type and category multipliers
    const typeMultiplier = this.gapTypeMultipliers[gapType] || 0.5;
    const categoryMultiplier = this.categoryMultipliers[category] || 0.5;

    return Math.min(1.0, baseScore * typeMultiplier * categoryMultiplier);
  }

  private applyConfidenceAdjustment(score: number, confidence: number): number {
    // Reduce severity for low-confidence gaps
    const confidenceAdjustment = 0.8 + confidence * 0.2; // Range: 0.8 to 1.0
    return score * confidenceAdjustment;
  }

  private convertScoreToSeverityLevel(score: number): SeverityLevel {
    if (score >= 0.8) return 'critical';
    if (score >= 0.6) return 'high';
    if (score >= 0.4) return 'medium';
    return 'low';
  }

  // ML-inspired methods
  private extractMLFeatures(gap: Gap): number[] {
    return [
      Math.abs(gap.variance),
      gap.rootCauses.length,
      gap.affectedAreas.length,
      gap.confidence,
      this.mapImpactLevelToScore(gap.estimatedImpact.level),
      gap.estimatedImpact.affectedStakeholders.length,
      this.getTypeComplexity(gap.type),
      this.getCategoryWeight(gap.category),
    ];
  }

  private applyMLWeights(features: number[], historicalGaps?: Gap[]): number {
    // Simplified ML approach - in real implementation, this would use trained weights
    const defaultWeights = [0.2, 0.15, 0.1, 0.15, 0.2, 0.1, 0.05, 0.05];

    if (historicalGaps && historicalGaps.length > 10) {
      // Adjust weights based on historical patterns (simplified)
      const adjustedWeights = this.adjustWeightsFromHistory(
        defaultWeights,
        historicalGaps
      );
      return features.reduce(
        (sum, feature, index) => sum + feature * (adjustedWeights[index] || 0),
        0
      );
    }

    return features.reduce(
      (sum, feature, index) => sum + feature * (defaultWeights[index] || 0),
      0
    );
  }

  private adjustWeightsFromHistory(
    weights: number[],
    _historicalGaps: Gap[]
  ): number[] {
    // Simplified weight adjustment based on historical gap patterns
    // In real implementation, this would use proper ML techniques
    return weights.map(weight => weight * (0.9 + Math.random() * 0.2)); // Simplified adjustment
  }

  private normalizeMLScore(score: number): number {
    // Normalize ML score to 0-1 range
    return Math.min(1.0, Math.max(0.0, score / 2)); // Assuming max possible score is ~2
  }

  // Risk-based calculation methods
  private calculateEscalationProbability(gap: Gap): number {
    // Probability that gap will escalate if not addressed
    const varianceFactor = Math.min(1.0, Math.abs(gap.variance) * 1.5);
    const complexityFactor = Math.min(1.0, gap.rootCauses.length / 3);
    const urgencyFactor =
      gap.estimatedImpact.timeframe === 'immediate' ? 1.0 : 0.5;

    return (varianceFactor + complexityFactor + urgencyFactor) / 3;
  }

  private calculateImpactMagnitude(gap: Gap): number {
    const impactScore = this.mapImpactLevelToScore(gap.estimatedImpact.level);
    const stakeholderFactor = Math.min(
      1.0,
      gap.estimatedImpact.affectedStakeholders.length / 5
    );
    const areaFactor = Math.min(1.0, gap.affectedAreas.length / 3);

    return (impactScore + stakeholderFactor + areaFactor) / 3;
  }

  private calculateTimeSensitivity(gap: Gap): number {
    switch (gap.estimatedImpact.timeframe) {
      case 'immediate':
        return 1.0;
      case 'short-term':
        return 0.8;
      case 'medium-term':
        return 0.6;
      case 'long-term':
        return 0.4;
      default:
        return 0.5;
    }
  }

  // Comparative calculation methods
  private calculateGapScore(gap: Gap): number {
    const factors = this.extractSeverityFactors(gap);
    return this.calculateWeightedSeverityScore(factors, gap.type, gap.category);
  }

  private calculatePercentile(value: number, dataset: number[]): number {
    const sorted = dataset.sort((a, b) => a - b);
    const rank = sorted.filter(v => v <= value).length;
    return rank / sorted.length;
  }

  // Ensemble calculation methods
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
      case 'critical':
        return 4;
      case 'high':
        return 3;
      case 'medium':
        return 2;
      case 'low':
        return 1;
      default:
        return 2;
    }
  }

  private scoreToSeverity(score: number): SeverityLevel {
    if (score >= 3.5) return 'critical';
    if (score >= 2.5) return 'high';
    if (score >= 1.5) return 'medium';
    return 'low';
  }

  // Helper methods
  private getTypeComplexity(type: GapType): number {
    const complexityMap: Record<GapType, number> = {
      resource: 0.6,
      process: 0.8,
      communication: 0.7,
      technology: 0.9,
      culture: 1.0,
      timeline: 0.5,
      quality: 0.7,
      budget: 0.4,
      skill: 0.8,
      governance: 0.9,
    };

    return complexityMap[type] || 0.5;
  }

  private getCategoryWeight(category: GapCategory): number {
    return this.categoryMultipliers[category] || 0.5;
  }

  private getBaseResourceRequirement(type: GapType): number {
    const resourceMap: Record<GapType, number> = {
      resource: 0.9,
      process: 0.7,
      communication: 0.5,
      technology: 0.8,
      culture: 0.9,
      timeline: 0.6,
      quality: 0.7,
      budget: 0.8,
      skill: 0.8,
      governance: 0.6,
    };

    return resourceMap[type] || 0.5;
  }
}
