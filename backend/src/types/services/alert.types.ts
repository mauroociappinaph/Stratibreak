import type {
  ComprehensiveAlertDto as AlertDto,
  AlertPriorityScoreDto,
  AlertSummaryDto,
  CreateAlertDto,
  ComprehensivePreventiveActionDto as PreventiveActionDto,
  ComprehensiveRiskIndicatorDto as RiskIndicatorDto,
  RiskIndicatorWithHistoryDto,
  UpdateAlertDto,
} from '../../modules/predictions/dto';
import type {
  AlertEntity,
  AlertPriorityScoreEntity,
} from '../database/alert.types';

// Service interfaces for Alert and Risk Indicator management
export interface AlertService {
  // Alert management
  createAlert(createAlertDto: CreateAlertDto): Promise<AlertDto>;
  findAllAlerts(projectId: string): Promise<AlertDto[]>;
  findActiveAlerts(projectId: string): Promise<AlertDto[]>;
  findAlertById(id: string): Promise<AlertDto | null>;
  updateAlert(id: string, updateAlertDto: UpdateAlertDto): Promise<AlertDto>;
  deleteAlert(id: string): Promise<void>;

  // Alert prioritization (Requirement 3.4)
  calculateAlertPriority(alertId: string): Promise<AlertPriorityScoreDto>;
  prioritizeAlerts(projectId: string): Promise<AlertDto[]>;

  // Alert lifecycle
  acknowledgeAlert(id: string, userId: string): Promise<AlertDto>;
  resolveAlert(id: string, userId: string, notes?: string): Promise<AlertDto>;
  dismissAlert(id: string, userId: string): Promise<AlertDto>;

  // Alert summary and monitoring
  getAlertSummary(projectId: string): Promise<AlertSummaryDto>;
  getExpiredAlerts(): Promise<AlertDto[]>;
  cleanupExpiredAlerts(): Promise<number>;
}

export interface RiskIndicatorService {
  // Risk indicator management
  createRiskIndicator(
    projectId: string,
    indicator: Partial<RiskIndicatorDto>
  ): Promise<RiskIndicatorDto>;
  findAllRiskIndicators(projectId: string): Promise<RiskIndicatorDto[]>;
  findRiskIndicatorById(
    id: string
  ): Promise<RiskIndicatorWithHistoryDto | null>;
  updateRiskIndicator(
    id: string,
    updates: Partial<RiskIndicatorDto>
  ): Promise<RiskIndicatorDto>;
  deleteRiskIndicator(id: string): Promise<void>;

  // Risk indicator analysis (Requirements 3.1, 3.2)
  analyzeRiskIndicators(projectId: string): Promise<RiskAnalysisResult>;
  detectThresholdBreaches(projectId: string): Promise<RiskIndicatorDto[]>;
  calculateTrendAnalysis(indicatorId: string): Promise<TrendAnalysisResult>;

  // Historical data management
  addHistoricalDataPoint(
    indicatorId: string,
    value: number,
    context?: string
  ): Promise<void>;
  getHistoricalData(
    indicatorId: string,
    fromDate?: Date,
    toDate?: Date
  ): Promise<HistoricalDataPoint[]>;

  // Predictive capabilities (Requirement 3.1)
  predictFutureValues(
    indicatorId: string,
    hoursAhead: number
  ): Promise<PredictedValue[]>;
  identifyAnomalies(indicatorId: string): Promise<AnomalyDetectionResult>;
}

export interface AlertPriorityService {
  // Priority calculation (Requirement 3.4)
  calculatePriorityScore(alert: AlertEntity): Promise<AlertPriorityScoreEntity>;
  rankAlertsByPriority(alerts: AlertEntity[]): Promise<AlertEntity[]>;
  updatePriorityScores(projectId: string): Promise<void>;

  // Priority factors analysis
  analyzeImpactFactor(alert: AlertEntity): Promise<number>;
  analyzeProbabilityFactor(alert: AlertEntity): Promise<number>;
  analyzePreventionCapacityFactor(alert: AlertEntity): Promise<number>;
  analyzeUrgencyFactor(alert: AlertEntity): Promise<number>;
}

// Supporting types for service interfaces
export interface RiskAnalysisResult {
  projectId: string;
  overallRiskLevel: number;
  criticalIndicators: RiskIndicatorDto[];
  trendingIndicators: RiskIndicatorDto[];
  anomalousIndicators: RiskIndicatorDto[];
  recommendations: string[];
  analysisTimestamp: Date;
}

export interface TrendAnalysisResult {
  indicatorId: string;
  currentTrend: 'improving' | 'stable' | 'declining' | 'volatile';
  trendStrength: number; // 0-1, how strong the trend is
  trendDuration: number; // How long the trend has been active (in hours)
  predictedDirection: 'up' | 'down' | 'stable';
  confidence: number; // 0-1, confidence in the prediction
  changePoints: Date[]; // Points where trend changed significantly
}

export interface PredictedValue {
  timestamp: Date;
  predictedValue: number;
  confidence: number;
  upperBound: number;
  lowerBound: number;
}

export interface AnomalyDetectionResult {
  indicatorId: string;
  anomalies: AnomalyPoint[];
  anomalyScore: number; // Overall anomaly score for the indicator
  detectionMethod: string;
  analysisTimestamp: Date;
}

export interface AnomalyPoint {
  timestamp: Date;
  value: number;
  expectedValue: number;
  anomalyScore: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

export interface HistoricalDataPoint {
  timestamp: Date;
  value: number;
  context?: string;
}

// Alert generation service interface (Requirements 3.1, 3.2, 3.3)
export interface EarlyWarningService {
  // Early warning generation (Requirement 3.1 - 72+ hours anticipation)
  generateEarlyWarnings(projectId: string): Promise<AlertDto[]>;

  // Proactive alert generation (Requirement 3.2)
  generateProactiveAlerts(
    projectId: string,
    lookAheadHours: number
  ): Promise<AlertDto[]>;

  // Alert context and prevention (Requirement 3.3)
  enrichAlertWithContext(alert: AlertDto): Promise<AlertDto>;
  generatePreventiveActions(alert: AlertDto): Promise<PreventiveActionDto[]>;

  // Continuous monitoring
  monitorRiskIndicators(projectId: string): Promise<void>;
  schedulePeriodicAnalysis(
    projectId: string,
    intervalHours: number
  ): Promise<void>;
}

// Note: DTOs are available in the predictions module
// Import them directly from '../../modules/predictions/dto' when needed
