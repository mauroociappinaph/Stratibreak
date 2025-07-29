// Barrel exports for all types
export * from './api';
export * from './database';
// Export services types with explicit naming to avoid conflicts
export type {
  Alert,
  CategorizedGaps,
  GapAnalysisResult,
  HistoricalData,
  IGapAnalysisService,
  IIntegrationService,
  INotificationService,
  IPredictiveService,
  NotificationData,
  NotificationFilters,
  ProjectAnalysisData,
  ProjectEvent,
  ProjectGoals,
  QualityRequirements,
  RecoveryAction,
  ResourceRequirements,
  RiskAssessment,
  ServiceIntegrationError,
  ServiceMilestone,
  ServiceProjectState,
  ServiceQualityState,
  ServiceResourceState,
  ServiceRiskIndicator,
  ServiceTimelineState,
  SyncResult,
  TimelineRequirements,
  TrendData,
  ValidationResult,
} from './services';
export * from './validation';
