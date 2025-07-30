import { GapCategory, GapType } from '../../../types/database/gap.types';
import type { Gap } from '../../../types/services/gap-analysis.types';

export class SeverityCalculationHelper {
  /**
   * ML-inspired feature extraction
   */
  static extractMLFeatures(gap: Gap): number[] {
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

  /**
   * Apply ML weights to features
   */
  static applyMLWeights(features: number[], historicalGaps?: Gap[]): number {
    const defaultWeights = [0.2, 0.15, 0.1, 0.15, 0.2, 0.1, 0.05, 0.05];

    if (historicalGaps && historicalGaps.length > 10) {
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

  /**
   * Calculate escalation probability for risk-based analysis
   */
  static calculateEscalationProbability(gap: Gap): number {
    const varianceFactor = Math.min(1.0, Math.abs(gap.variance) * 1.5);
    const complexityFactor = Math.min(1.0, gap.rootCauses.length / 3);
    const urgencyFactor =
      gap.estimatedImpact.timeframe === 'immediate' ? 1.0 : 0.5;

    return (varianceFactor + complexityFactor + urgencyFactor) / 3;
  }

  /**
   * Calculate impact magnitude
   */
  static calculateImpactMagnitude(gap: Gap): number {
    const impactScore = this.mapImpactLevelToScore(gap.estimatedImpact.level);
    const stakeholderFactor = Math.min(
      1.0,
      gap.estimatedImpact.affectedStakeholders.length / 5
    );
    const areaFactor = Math.min(1.0, gap.affectedAreas.length / 3);

    return (impactScore + stakeholderFactor + areaFactor) / 3;
  }

  /**
   * Calculate time sensitivity
   */
  static calculateTimeSensitivity(gap: Gap): number {
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

  /**
   * Calculate percentile ranking
   */
  static calculatePercentile(value: number, dataset: number[]): number {
    const sorted = dataset.sort((a, b) => a - b);
    const rank = sorted.filter(v => v <= value).length;
    return rank / sorted.length;
  }

  /**
   * Normalize ML score to 0-1 range
   */
  static normalizeMLScore(score: number): number {
    return Math.min(1.0, Math.max(0.0, score / 2));
  }

  // Helper methods
  private static mapImpactLevelToScore(level: string): number {
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

  private static getTypeComplexity(type: GapType): number {
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

  private static getCategoryWeight(category: GapCategory): number {
    const categoryMultipliers: Record<GapCategory, number> = {
      [GapCategory.OPERATIONAL]: 0.9,
      [GapCategory.STRATEGIC]: 0.8,
      [GapCategory.TACTICAL]: 0.7,
      [GapCategory.TECHNICAL]: 0.8,
      [GapCategory.ORGANIZATIONAL]: 0.6,
    };

    return categoryMultipliers[category] || 0.5;
  }

  private static adjustWeightsFromHistory(
    weights: number[],
    historicalGaps: Gap[]
  ): number[] {
    const adjustmentFactor = historicalGaps.length > 0 ? 0.1 : 0.0;
    return weights.map(
      weight => weight * (0.9 + adjustmentFactor + Math.random() * 0.1)
    );
  }
}
