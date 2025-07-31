// Export existing DTOs first
export * from './alert-response.dto';
export * from './calculate-risk-probability.dto';
export * from './create-prediction.dto';
export * from './generate-early-warnings.dto';
export * from './predict-future-issues.dto';
export * from './prediction-response.dto';
export * from './risk-assessment-response.dto';
export * from './update-prediction.dto';

// Export new comprehensive DTOs with explicit names to avoid conflicts
export {
  AlertContextDto,
  AlertPriorityScoreDto,
  AlertSummaryDto,
  AlertDto as ComprehensiveAlertDto,
  AlertSeverity as ComprehensiveAlertSeverity,
  AlertStatus as ComprehensiveAlertStatus,
  AlertType as ComprehensiveAlertType,
  DurationDto as ComprehensiveDurationDto,
  ImpactLevel as ComprehensiveImpactLevel,
  PreventiveActionDto as ComprehensivePreventiveActionDto,
  CreateAlertDto,
  UpdateAlertDto,
} from './alert.dto';

export {
  RiskIndicatorDto as ComprehensiveRiskIndicatorDto,
  RiskLevel as ComprehensiveRiskLevel,
  TrendDirection as ComprehensiveTrendDirection,
  CreateRiskIndicatorDto,
  HistoricalDataPointDto,
  IndicatorCategory,
  RiskIndicatorWithHistoryDto,
  UpdateRiskIndicatorDto,
} from './risk-indicator.dto';
