// Import shared types to avoid duplication
import type { ImpactLevel, Priority, SeverityLevel } from './gap.types';
import type { RiskIndicator } from './state.types';

// Prediction Database Entity Types
export interface PredictionEntity {
  id: string;
  projectId: string;
  modelId: string;
  type: PredictionType;
  category: PredictionCategory;
  title: string;
  description: string;
  probability: number;
  confidence: number;
  impact: ImpactLevel;
  severity: SeverityLevel;
  estimatedTimeToOccurrence: Duration;
  preventionWindow: Duration;
  suggestedActions: PreventiveAction[];
  riskIndicators: RiskIndicator[];
  historicalPatterns: Pattern[];
  status: PredictionStatus;
  actualOutcome?: PredictionOutcome;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  validUntil: Date;
}

export interface PreventiveAction {
  id: string;
  predictionId: string;
  title: string;
  description: string;
  priority: Priority;
  estimatedEffort: string;
  requiredResources: string[];
  expectedImpact: string;
  deadline?: Date;
}

export interface Pattern {
  id: string;
  predictionId: string;
  patternType: PatternType;
  description: string;
  frequency: number;
  confidence: number;
  historicalOccurrences: Date[];
}

export interface PredictionOutcome {
  id: string;
  predictionId: string;
  actualOccurred: boolean;
  actualDate?: Date;
  actualImpact?: ImpactLevel;
  accuracy: number;
  notes?: string;
  recordedAt: Date;
}

export interface Duration {
  value: number;
  unit: TimeUnit;
}

// Prediction-related enums
export enum PredictionType {
  RISK = 'risk',
  OPPORTUNITY = 'opportunity',
  TREND = 'trend',
  ANOMALY = 'anomaly',
  FORECAST = 'forecast',
}

export enum PredictionCategory {
  TIMELINE = 'timeline',
  BUDGET = 'budget',
  QUALITY = 'quality',
  RESOURCE = 'resource',
  SCOPE = 'scope',
  STAKEHOLDER = 'stakeholder',
}

export enum PredictionStatus {
  ACTIVE = 'active',
  RESOLVED = 'resolved',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
  MONITORING = 'monitoring',
}

export enum PatternType {
  SEASONAL = 'seasonal',
  CYCLICAL = 'cyclical',
  TRENDING = 'trending',
  ANOMALOUS = 'anomalous',
  CORRELATION = 'correlation',
}

export enum TimeUnit {
  MINUTES = 'minutes',
  HOURS = 'hours',
  DAYS = 'days',
  WEEKS = 'weeks',
  MONTHS = 'months',
}

// Import shared types to avoid duplication
