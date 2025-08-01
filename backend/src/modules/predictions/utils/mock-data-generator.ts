import { MockDataHelpers } from './mock-data-helpers';
import {
  MockAccuracyTrendEntry,
  MockPredictionHistoryEntry,
  MockTrendHistory,
} from './mock-data-types';

/**
 * Utility class for generating mock prediction data
 * Used for development and testing purposes
 */
export class MockDataGenerator {
  /**
   * Generate mock prediction history data
   */
  static generatePredictionHistory(
    projectId: string,
    startDate: Date,
    endDate: Date,
    predictionType?: string,
    limit = 50
  ): MockPredictionHistoryEntry[] {
    const predictions: MockPredictionHistoryEntry[] = [];
    const types = predictionType
      ? [predictionType]
      : ['risk_alert', 'trend_alert', 'early_warning', 'anomaly_alert'];
    const severities = ['low', 'medium', 'high', 'critical'];
    const outcomes = ['confirmed', 'false_positive', 'prevented', 'pending'];

    const timeRange = endDate.getTime() - startDate.getTime();

    for (let i = 0; i < Math.min(limit, 50); i++) {
      const predictedAt = new Date(
        startDate.getTime() + Math.random() * timeRange
      );
      const expectedAt = new Date(
        predictedAt.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000
      ); // Within 7 days
      const type =
        types[Math.floor(Math.random() * types.length)] || 'risk_alert';
      const severity =
        severities[Math.floor(Math.random() * severities.length)] || 'medium';
      const outcome =
        outcomes[Math.floor(Math.random() * outcomes.length)] || 'pending';

      const entry: MockPredictionHistoryEntry = {
        id: `pred_${Date.now()}_${i}`,
        projectId,
        type,
        title: MockDataHelpers.generatePredictionTitle(type),
        description: MockDataHelpers.generatePredictionDescription(type),
        probability: 0.6 + Math.random() * 0.4, // 60-100%
        severity,
        predictedAt: predictedAt.toISOString(),
        expectedAt: expectedAt.toISOString(),
        actualOutcome: outcome,
        actionsTaken: MockDataHelpers.generateActionsTaken(type, outcome),
      };

      // Add optional properties only when they have values
      if (outcome !== 'pending') {
        entry.verifiedAt = new Date(
          expectedAt.getTime() + Math.random() * 24 * 60 * 60 * 1000
        ).toISOString();
        entry.accuracyScore =
          outcome === 'confirmed'
            ? 0.85 + Math.random() * 0.15
            : 0.3 + Math.random() * 0.4;
      }

      predictions.push(entry);
    }

    return predictions.sort(
      (a, b) =>
        new Date(b.predictedAt).getTime() - new Date(a.predictedAt).getTime()
    );
  }

  /**
   * Generate mock trend history data
   */
  static generateTrendHistory(
    metric: string,
    startDate: Date,
    endDate: Date,
    granularity: string
  ): MockTrendHistory {
    const dataPoints = [];
    const timeRange = endDate.getTime() - startDate.getTime();
    const intervalMs = MockDataHelpers.getIntervalMs(granularity);
    const numPoints = Math.floor(timeRange / intervalMs);

    const baseValue = MockDataHelpers.getBaseValue(metric);
    const trend = Math.random() > 0.5 ? 'improving' : 'declining';
    const trendStrength = 0.1 + Math.random() * 0.3; // 10-40% trend strength

    for (let i = 0; i < Math.min(numPoints, 100); i++) {
      const timestamp = new Date(startDate.getTime() + i * intervalMs);

      // Apply trend
      const trendFactor =
        trend === 'improving'
          ? 1 + (trendStrength * i) / numPoints
          : 1 - (trendStrength * i) / numPoints;
      const noise = 0.9 + Math.random() * 0.2; // ±10% noise
      const value = baseValue * trendFactor * noise;

      const changeRate: number =
        i > 0 && dataPoints[i - 1]
          ? (value - dataPoints[i - 1]!.value) / dataPoints[i - 1]!.value
          : 0;
      const movingAverage: number =
        i >= 6
          ? dataPoints
              .slice(Math.max(0, i - 6), i)
              .reduce((sum, dp) => sum + dp.value, 0) / Math.min(7, i + 1)
          : value;

      dataPoints.push({
        timestamp: timestamp.toISOString(),
        value: Math.round(value * 100) / 100,
        trend: MockDataHelpers.determineTrendDirection(changeRate),
        changeRate: Math.round(changeRate * 1000) / 1000,
        movingAverage: Math.round(movingAverage * 100) / 100,
      });
    }

    // Calculate overall trend analysis
    const overallTrend = {
      direction: trend,
      strength: trendStrength,
      duration: MockDataHelpers.formatDuration(timeRange),
      significance: 0.7 + Math.random() * 0.3,
      volatility: MockDataHelpers.calculateVolatility(
        dataPoints.map(dp => dp.value)
      ),
    };

    // Generate prediction
    const lastValue = dataPoints[dataPoints.length - 1]?.value || baseValue;
    const nextValue =
      trend === 'improving' ? lastValue * 1.05 : lastValue * 0.95;
    const prediction = {
      nextValue: Math.round(nextValue * 100) / 100,
      confidence: 0.75 + Math.random() * 0.2,
      timeHorizon: '1 week',
      bounds: {
        lower: Math.round(nextValue * 0.9 * 100) / 100,
        upper: Math.round(nextValue * 1.1 * 100) / 100,
      },
    };

    return {
      metric,
      unit: MockDataHelpers.getMetricUnit(metric),
      dataPoints,
      overallTrend,
      prediction,
    };
  }

  /**
   * Generate accuracy trend data
   */
  static generateAccuracyTrend(
    startDate: Date,
    endDate: Date
  ): MockAccuracyTrendEntry[] {
    const trend: MockAccuracyTrendEntry[] = [];
    const timeRange = endDate.getTime() - startDate.getTime();
    const weekMs = 7 * 24 * 60 * 60 * 1000;
    const numWeeks = Math.floor(timeRange / weekMs);

    let baseAccuracy = 0.75;
    for (let i = 0; i < Math.min(numWeeks, 12); i++) {
      const weekStart = new Date(startDate.getTime() + i * weekMs);
      baseAccuracy += (Math.random() - 0.5) * 0.1; // Random walk with small steps
      baseAccuracy = Math.max(0.5, Math.min(0.95, baseAccuracy)); // Clamp between 50-95%

      trend.push({
        period: weekStart.toISOString().split('T')[0] || '',
        accuracy: Math.round(baseAccuracy * 100) / 100,
        predictions: 8 + Math.floor(Math.random() * 10), // 8-17 predictions per week
      });
    }

    return trend;
  }
}
