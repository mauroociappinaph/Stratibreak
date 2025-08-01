import {
  MockPredictionHistoryEntry,
  MockTrendHistory,
} from './mock-data-types';

/**
 * Interface for prediction summary statistics
 */
export interface PredictionSummary {
  totalPredictions: number;
  confirmedPredictions: number;
  falsePositives: number;
  preventedIssues: number;
  pendingPredictions: number;
  averageAccuracy: number;
  accuracyByType: Record<string, number>;
  severityDistribution: Record<string, number>;
}

/**
 * Interface for trend insights
 */
export interface TrendInsights {
  overallTrend: string;
  volatility: number;
  predictability: number;
  riskLevel: string;
  keyMetrics: string[];
}

/**
 * Interface for trend recommendations
 */
export interface TrendRecommendations {
  immediate: string[];
  shortTerm: string[];
  longTerm: string[];
  priority: string;
}

/**
 * Utility class for prediction analytics and insights
 */
export class PredictionAnalytics {
  /**
   * Calculate prediction summary statistics
   */
  static calculatePredictionSummary(
    predictions: MockPredictionHistoryEntry[]
  ): PredictionSummary {
    const totalPredictions = predictions.length;
    const confirmedPredictions = predictions.filter(
      p => p.actualOutcome === 'confirmed'
    ).length;
    const falsePositives = predictions.filter(
      p => p.actualOutcome === 'false_positive'
    ).length;
    const preventedIssues = predictions.filter(
      p => p.actualOutcome === 'prevented'
    ).length;
    const pendingPredictions = predictions.filter(
      p => p.actualOutcome === 'pending'
    ).length;

    // Calculate average accuracy for non-pending predictions
    const completedPredictions = predictions.filter(
      p => p.actualOutcome !== 'pending' && p.accuracyScore !== undefined
    );
    const averageAccuracy =
      completedPredictions.length > 0
        ? completedPredictions.reduce(
            (sum, p) => sum + (p.accuracyScore || 0),
            0
          ) / completedPredictions.length
        : 0;

    // Calculate accuracy by type
    const accuracyByType: Record<string, number> = {};
    const typeGroups = predictions.reduce(
      (groups, p) => {
        if (!groups[p.type]) {
          groups[p.type] = [];
        }
        groups[p.type]!.push(p);
        return groups;
      },
      {} as Record<string, MockPredictionHistoryEntry[]>
    );

    Object.entries(typeGroups).forEach(([type, typePredictions]) => {
      const completedForType = typePredictions.filter(
        p => p.actualOutcome !== 'pending' && p.accuracyScore !== undefined
      );
      accuracyByType[type] =
        completedForType.length > 0
          ? completedForType.reduce(
              (sum, p) => sum + (p.accuracyScore || 0),
              0
            ) / completedForType.length
          : 0;
    });

    // Calculate severity distribution
    const severityDistribution: Record<string, number> = {};
    predictions.forEach(p => {
      severityDistribution[p.severity] =
        (severityDistribution[p.severity] || 0) + 1;
    });

    return {
      totalPredictions,
      confirmedPredictions,
      falsePositives,
      preventedIssues,
      pendingPredictions,
      averageAccuracy,
      accuracyByType,
      severityDistribution,
    };
  }

  /**
   * Calculate trend insights from trend metrics
   */
  static calculateTrendInsights(trends: MockTrendHistory[]): TrendInsights {
    if (trends.length === 0) {
      return {
        overallTrend: 'stable',
        volatility: 0,
        predictability: 0,
        riskLevel: 'low',
        keyMetrics: [],
      };
    }

    // Analyze overall trend direction
    const improvingTrends = trends.filter(
      t => t.overallTrend.direction === 'improving'
    ).length;
    const decliningTrends = trends.filter(
      t => t.overallTrend.direction === 'declining'
    ).length;

    let overallTrend = 'stable';
    if (improvingTrends > decliningTrends) {
      overallTrend = 'improving';
    } else if (decliningTrends > improvingTrends) {
      overallTrend = 'declining';
    }

    // Calculate average volatility
    const averageVolatility =
      trends.reduce((sum, t) => sum + t.overallTrend.volatility, 0) /
      trends.length;

    // Calculate predictability (inverse of volatility)
    const predictability = Math.max(0, 1 - averageVolatility);

    // Determine risk level
    let riskLevel = 'low';
    if (averageVolatility > 0.7 || decliningTrends > trends.length * 0.6) {
      riskLevel = 'high';
    } else if (
      averageVolatility > 0.4 ||
      decliningTrends > trends.length * 0.3
    ) {
      riskLevel = 'medium';
    }

    // Identify key metrics (those with highest volatility or declining trends)
    const keyMetrics = trends
      .filter(
        t =>
          t.overallTrend.volatility > 0.5 ||
          t.overallTrend.direction === 'declining'
      )
      .map(t => t.metric)
      .slice(0, 3);

    return {
      overallTrend,
      volatility: averageVolatility,
      predictability,
      riskLevel,
      keyMetrics,
    };
  }

  /**
   * Generate trend-based recommendations
   */
  static generateTrendRecommendations(
    trends: MockTrendHistory[]
  ): TrendRecommendations {
    const insights = this.calculateTrendInsights(trends);
    const immediate: string[] = [];
    const shortTerm: string[] = [];
    const longTerm: string[] = [];

    // Generate recommendations based on insights
    if (insights.riskLevel === 'high') {
      immediate.push('Implement immediate risk mitigation measures');
      immediate.push('Increase monitoring frequency for key metrics');
      shortTerm.push('Review and adjust project processes');
      longTerm.push('Consider structural changes to improve stability');
    } else if (insights.riskLevel === 'medium') {
      immediate.push('Monitor key metrics closely');
      shortTerm.push('Prepare contingency plans');
      longTerm.push('Optimize processes for better predictability');
    } else {
      immediate.push('Continue current monitoring practices');
      shortTerm.push('Look for optimization opportunities');
      longTerm.push('Maintain current trajectory');
    }

    if (insights.overallTrend === 'declining') {
      immediate.push('Address declining trend indicators');
      shortTerm.push('Investigate root causes of decline');
    } else if (insights.overallTrend === 'improving') {
      shortTerm.push('Reinforce positive trends');
      longTerm.push('Scale successful practices');
    }

    if (insights.volatility > 0.6) {
      immediate.push('Stabilize volatile metrics');
      shortTerm.push('Implement variance reduction strategies');
    }

    // Determine priority
    let priority = 'low';
    if (
      insights.riskLevel === 'high' ||
      insights.overallTrend === 'declining'
    ) {
      priority = 'high';
    } else if (insights.riskLevel === 'medium' || insights.volatility > 0.5) {
      priority = 'medium';
    }

    return {
      immediate,
      shortTerm,
      longTerm,
      priority,
    };
  }
}
