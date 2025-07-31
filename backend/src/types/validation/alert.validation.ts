import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

// Validation schemas for Alert and Risk Indicator structures
// These schemas ensure compliance with Requirements 3.1, 3.2, and 3.4

export enum AlertValidationSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum AlertValidationType {
  RISK = 'risk',
  OPPORTUNITY = 'opportunity',
  ANOMALY = 'anomaly',
  THRESHOLD_BREACH = 'threshold_breach',
  TREND_CHANGE = 'trend_change',
  PREDICTION = 'prediction',
}

export enum ImpactValidationLevel {
  MINIMAL = 'minimal',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  SEVERE = 'severe',
}

// Validation for Requirement 3.1: 72+ hours anticipation
export class PredictiveTimeValidation {
  @IsNumber()
  @Min(72) // Minimum 72 hours as per requirement 3.1
  hoursAhead: number;

  @IsString()
  @IsEnum(['hours', 'days', 'weeks'])
  unit: 'hours' | 'days' | 'weeks';
}

// Validation for Requirement 3.2: Priority levels and probability
export class AlertPriorityValidation {
  @IsEnum(AlertValidationSeverity)
  severity: AlertValidationSeverity; // Required priority levels: low, medium, high, critical

  @IsNumber()
  @Min(0)
  @Max(1)
  probability: number; // Probability of occurrence (0-1)

  @IsNumber()
  @Min(0)
  @Max(1)
  confidence: number; // Confidence in the prediction (0-1)
}

// Validation for Requirement 3.3: Time estimation and intervention window
export class AlertTimingValidation {
  @ValidateNested()
  @Type(() => PredictiveTimeValidation)
  estimatedTimeToOccurrence: PredictiveTimeValidation;

  @IsNumber()
  @Min(1) // Must have at least 1 hour prevention window
  preventionWindowHours: number;

  @IsEnum(ImpactValidationLevel)
  potentialImpact: ImpactValidationLevel;
}

// Validation for Requirement 3.4: Alert prioritization factors
export class AlertPrioritizationValidation {
  @IsNumber()
  @Min(0)
  @Max(1)
  impactScore: number; // Impact potential factor

  @IsNumber()
  @Min(0)
  @Max(1)
  probabilityScore: number; // Probability factor

  @IsNumber()
  @Min(0)
  @Max(1)
  preventionCapacityScore: number; // Capacity for prevention factor

  @IsNumber()
  @Min(0)
  @Max(100)
  overallPriorityScore: number; // Combined priority score (0-100)

  @IsString()
  reasoning: string; // Explanation of priority calculation
}

// Comprehensive alert validation combining all requirements
export class ComprehensiveAlertValidation {
  @IsString()
  id: string;

  @IsString()
  projectId: string;

  @IsEnum(AlertValidationType)
  type: AlertValidationType;

  @ValidateNested()
  @Type(() => AlertPriorityValidation)
  priority: AlertPriorityValidation; // Requirement 3.2

  @ValidateNested()
  @Type(() => AlertTimingValidation)
  timing: AlertTimingValidation; // Requirements 3.1, 3.3

  @ValidateNested()
  @Type(() => AlertPrioritizationValidation)
  prioritization: AlertPrioritizationValidation; // Requirement 3.4

  @IsArray()
  @IsString({ each: true })
  suggestedPreventiveActions: string[]; // Required preventive suggestions

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  historicalPatterns?: string[]; // Historical data context

  @IsString()
  predictiveContext: string; // Differentiating context from reactive notifications
}

// Risk Indicator validation for supporting alert generation
export class RiskIndicatorValidation {
  @IsString()
  id: string;

  @IsString()
  projectId: string;

  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  currentValue: number;

  @IsNumber()
  @Min(0)
  threshold: number;

  @IsNumber()
  @Min(0)
  @Max(1)
  weight: number; // Importance weight for prioritization

  @IsEnum(['improving', 'stable', 'declining', 'volatile'])
  trend: 'improving' | 'stable' | 'declining' | 'volatile';

  @IsNumber()
  @Min(0)
  @Max(1)
  confidence: number; // Confidence in the measurement

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HistoricalDataValidation)
  historicalData?: HistoricalDataValidation[]; // For trend analysis
}

export class HistoricalDataValidation {
  @IsString()
  timestamp: string; // ISO date string

  @IsNumber()
  value: number;

  @IsOptional()
  @IsString()
  context?: string;
}

// Validation for early warning system (Requirements 3.1, 3.2, 3.3)
export class EarlyWarningValidation {
  @IsString()
  projectId: string;

  @IsNumber()
  @Min(72) // Minimum 72 hours ahead as per requirement 3.1
  predictionHorizonHours: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ComprehensiveAlertValidation)
  predictiveAlerts: ComprehensiveAlertValidation[];

  @IsNumber()
  @Min(0)
  @Max(100)
  overallRiskLevel: number;

  @IsString()
  analysisTimestamp: string; // ISO date string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RiskIndicatorValidation)
  triggeringIndicators: RiskIndicatorValidation[];
}

// Validation for alert prioritization system (Requirement 3.4)
export class AlertRankingValidation {
  @IsString()
  projectId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ComprehensiveAlertValidation)
  rankedAlerts: ComprehensiveAlertValidation[]; // Sorted by priority

  @IsString()
  rankingCriteria: string; // Explanation of ranking methodology

  @IsString()
  rankingTimestamp: string; // ISO date string

  @IsNumber()
  @Min(1)
  totalAlertsEvaluated: number;
}

// Validation helper functions to reduce complexity
const validatePredictionTime = (
  alert: ComprehensiveAlertValidation
): boolean => {
  return alert.timing?.estimatedTimeToOccurrence?.hoursAhead >= 72;
};

const validatePriorityLevels = (
  alert: ComprehensiveAlertValidation
): boolean => {
  const validSeverities = ['low', 'medium', 'high', 'critical'];
  return validSeverities.includes(alert.priority?.severity);
};

const validateProbability = (alert: ComprehensiveAlertValidation): boolean => {
  return (
    typeof alert.priority?.probability === 'number' &&
    alert.priority.probability >= 0 &&
    alert.priority.probability <= 1
  );
};

const validateTiming = (alert: ComprehensiveAlertValidation): boolean => {
  return (
    alert.timing?.estimatedTimeToOccurrence != null &&
    alert.timing?.potentialImpact != null &&
    typeof alert.timing?.preventionWindowHours === 'number' &&
    alert.timing.preventionWindowHours >= 1
  );
};

const validatePrioritization = (
  alert: ComprehensiveAlertValidation
): boolean => {
  return (
    typeof alert.prioritization?.overallPriorityScore === 'number' &&
    alert.prioritization.overallPriorityScore >= 0 &&
    alert.prioritization.overallPriorityScore <= 100
  );
};

// Export validation functions for runtime validation
export const validateAlertMeetsRequirements = (
  alert: ComprehensiveAlertValidation
): boolean => {
  return (
    validatePredictionTime(alert) &&
    validatePriorityLevels(alert) &&
    validateProbability(alert) &&
    validateTiming(alert) &&
    validatePrioritization(alert)
  );
};

export const validateRiskIndicatorSupportsAlerts = (
  indicator: RiskIndicatorValidation
): boolean => {
  const hasValues =
    typeof indicator.currentValue === 'number' &&
    typeof indicator.threshold === 'number';

  const hasWeight =
    typeof indicator.weight === 'number' &&
    indicator.weight >= 0 &&
    indicator.weight <= 1;

  const validTrends = ['improving', 'stable', 'declining', 'volatile'];
  const hasTrend = validTrends.includes(indicator.trend);

  const hasConfidence =
    typeof indicator.confidence === 'number' &&
    indicator.confidence >= 0 &&
    indicator.confidence <= 1;

  return hasValues && hasWeight && hasTrend && hasConfidence;
};
