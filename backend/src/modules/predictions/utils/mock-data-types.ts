/**
 * Type definitions for mock data generation
 */

export interface MockPredictionHistoryEntry {
  id: string;
  projectId: string;
  type: string;
  title: string;
  description: string;
  probability: number;
  severity: string;
  predictedAt: string;
  expectedAt: string;
  actualOutcome: string;
  verifiedAt?: string;
  accuracyScore?: number;
  actionsTaken: string[];
}

export interface MockTrendDataPoint {
  timestamp: string;
  value: number;
  trend: string;
  changeRate: number;
  movingAverage: number;
}

export interface MockTrendHistory {
  metric: string;
  unit: string;
  dataPoints: MockTrendDataPoint[];
  overallTrend: {
    direction: string;
    strength: number;
    duration: string;
    significance: number;
    volatility: number;
  };
  prediction: {
    nextValue: number;
    confidence: number;
    timeHorizon: string;
    bounds: {
      lower: number;
      upper: number;
    };
  };
}

export interface MockAccuracyTrendEntry {
  period: string;
  accuracy: number;
  predictions: number;
}
