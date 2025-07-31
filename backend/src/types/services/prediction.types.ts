import type { ImpactLevel, Priority } from '../database/gap.types';
import type { Duration } from '../database/prediction.types';

// Service interfaces for prediction functionality
export interface PredictiveEngine {
  predictFutureIssues(historicalData: HistoricalData): Promise<Prediction[]>;
  generateEarlyWarnings(currentTrends: TrendData): Alert[];
  calculateRiskProbability(indicators: RiskIndicator[]): RiskAssessment;
  updatePredictionModels(newData: ProjectData): void;
}

// Core prediction data structures
export interface Prediction {
  issueType: string;
  probability: number;
  estimatedTimeToOccurrence: Duration;
  potentialImpact: ImpactLevel;
  preventionWindow: Duration;
  suggestedActions: PreventiveAction[];
}

export interface Alert {
  id: string;
  projectId: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  description: string;
  probability: number;
  estimatedTimeToOccurrence: Duration;
  potentialImpact: ImpactLevel;
  preventionWindow: Duration;
  suggestedActions: PreventiveAction[];
  createdAt: Date;
  expiresAt: Date;
}

export interface PreventiveAction {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  estimatedEffort: string;
  requiredResources: string[];
  expectedImpact: string;
  deadline?: Date;
}

export interface RiskAssessment {
  overallRisk: number;
  riskFactors: RiskFactor[];
  recommendations: string[];
  confidenceLevel: number;
}

export interface RiskFactor {
  factor: string;
  weight: number;
  currentValue: number;
  threshold: number;
  trend: TrendDirection;
}

export interface RiskIndicator {
  indicator: string;
  currentValue: number;
  threshold: number;
  trend: TrendDirection;
  weight: number;
}

// Historical and trend data structures
export interface HistoricalData {
  projectId: string;
  timeRange: TimeRange;
  metrics: HistoricalMetric[];
  events: HistoricalEvent[];
  patterns: HistoricalPattern[];
}

export interface HistoricalMetric {
  name: string;
  values: TimeSeriesValue[];
  unit: string;
}

export interface TimeSeriesValue {
  timestamp: Date;
  value: number;
}

export interface HistoricalEvent {
  timestamp: Date;
  type: string;
  description: string;
  impact: ImpactLevel;
}

export interface HistoricalPattern {
  patternType: PatternType;
  frequency: number;
  confidence: number;
  description: string;
}

export interface TrendData {
  projectId: string;
  currentMetrics: CurrentMetric[];
  recentChanges: TrendChange[];
  velocityIndicators: VelocityIndicator[];
}

export interface CurrentMetric {
  name: string;
  currentValue: number;
  previousValue: number;
  changeRate: number;
  trend: TrendDirection;
  unit: string;
}

export interface TrendChange {
  metric: string;
  changeType: ChangeType;
  magnitude: number;
  timeframe: Duration;
  significance: number;
}

export interface VelocityIndicator {
  name: string;
  currentVelocity: number;
  averageVelocity: number;
  trend: TrendDirection;
  predictedVelocity: number;
}

// Project data for model updates
export interface ProjectData {
  projectId: string;
  currentState: ProjectState;
  metrics: ProjectMetric[];
  events: ProjectEvent[];
  timestamp: Date;
}

export interface ProjectState {
  status: string;
  progress: number;
  health: number;
  riskLevel: number;
}

export interface ProjectMetric {
  name: string;
  value: number;
  unit: string;
  category: string;
}

export interface ProjectEvent {
  type: string;
  description: string;
  impact: ImpactLevel;
  timestamp: Date;
}

// Supporting types and enums
export interface TimeRange {
  startDate: Date;
  endDate: Date;
}

export enum AlertType {
  EARLY_WARNING = 'early_warning',
  RISK_ALERT = 'risk_alert',
  TREND_ALERT = 'trend_alert',
  ANOMALY_ALERT = 'anomaly_alert',
}

export enum AlertSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum TrendDirection {
  IMPROVING = 'improving',
  STABLE = 'stable',
  DECLINING = 'declining',
  VOLATILE = 'volatile',
}

export enum PatternType {
  SEASONAL = 'seasonal',
  CYCLICAL = 'cyclical',
  TRENDING = 'trending',
  ANOMALOUS = 'anomalous',
  CORRELATION = 'correlation',
}

export enum ChangeType {
  GRADUAL = 'gradual',
  SUDDEN = 'sudden',
  ACCELERATING = 'accelerating',
  DECELERATING = 'decelerating',
}

// Trend analysis specific types
export interface TrendAnalysisResult {
  projectId: string;
  analysisTimestamp: Date;
  trends: IdentifiedTrend[];
  predictions: TrendPrediction[];
  recommendations: TrendRecommendation[];
  confidenceLevel: number;
}

export interface IdentifiedTrend {
  metric: string;
  direction: TrendDirection;
  strength: number;
  duration: Duration;
  significance: number;
  description: string;
}

export interface TrendPrediction {
  metric: string;
  predictedValue: number;
  timeHorizon: Duration;
  confidence: number;
  bounds: PredictionBounds;
}

export interface PredictionBounds {
  lower: number;
  upper: number;
}

export interface TrendRecommendation {
  priority: Priority;
  action: string;
  rationale: string;
  expectedImpact: string;
  timeframe: Duration;
}
