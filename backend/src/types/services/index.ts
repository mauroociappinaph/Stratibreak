// Service Interface Types
import type {
  ConnectionResponse,
  Gap,
  NotificationResponse,
  Prediction,
  Recommendation,
} from '../api';
import type { SeverityLevel } from '../database';
import type { TrendDirection } from '../database/state.types';

// Gap Analysis Service Types
export interface IGapAnalysisService {
  analyzeProject(projectData: ProjectAnalysisData): Promise<GapAnalysisResult>;
  identifyDiscrepancies(
    current: ServiceProjectState,
    target: ProjectGoals
  ): Promise<Gap[]>;
  categorizeGaps(gaps: Gap[]): Promise<CategorizedGaps>;
  calculateGapSeverity(gap: Gap): Promise<SeverityLevel>;
}

export interface ProjectAnalysisData {
  projectId: string;
  projectName: string;
  currentState: ServiceProjectState;
  targetGoals: ProjectGoals;
  historicalData?: Record<string, unknown>;
}

export interface ServiceProjectState {
  progress: number;
  resources: ServiceResourceState;
  timeline: ServiceTimelineState;
  quality: ServiceQualityState;
}

export interface ProjectGoals {
  targetProgress: number;
  requiredResources: ResourceRequirements;
  targetTimeline: TimelineRequirements;
  qualityStandards: QualityRequirements;
}

export interface GapAnalysisResult {
  projectId: string;
  analysisTimestamp: Date;
  identifiedGaps: CategorizedGaps;
  overallHealthScore: number;
  prioritizedRecommendations: Recommendation[];
}

export interface CategorizedGaps {
  resource: Gap[];
  process: Gap[];
  communication: Gap[];
  technology: Gap[];
  culture: Gap[];
  timeline: Gap[];
  quality: Gap[];
}

// Prediction Service Types
export interface IPredictiveService {
  predictFutureIssues(historicalData: HistoricalData): Promise<Prediction[]>;
  generateEarlyWarnings(currentTrends: TrendData): Promise<Alert[]>;
  calculateRiskProbability(
    indicators: ServiceRiskIndicator[]
  ): Promise<RiskAssessment>;
  updatePredictionModels(newData: ProjectAnalysisData): Promise<void>;
}

export interface HistoricalData {
  projectId: string;
  timeRange: {
    start: Date;
    end: Date;
  };
  metrics: Record<string, number[]>;
  events: ProjectEvent[];
}

export interface TrendData {
  projectId: string;
  currentMetrics: Record<string, number>;
  trends: Record<string, TrendDirection>;
  velocity: number;
}

export interface Alert {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  estimatedImpact: string;
  recommendedActions: string[];
}

export interface ServiceRiskIndicator {
  indicator: string;
  currentValue: number;
  threshold: number;
  trend: TrendDirection;
  weight: number;
}

export interface RiskAssessment {
  overallRisk: 'low' | 'medium' | 'high' | 'critical';
  probability: number;
  confidence: number;
  keyRisks: ServiceRiskIndicator[];
}

// Integration Service Types
export interface IIntegrationService {
  connectToTool(
    toolType: string,
    credentials: Record<string, string>
  ): Promise<ConnectionResponse>;
  syncData(connectionId: string): Promise<SyncResult>;
  handleIntegrationFailure(
    error: ServiceIntegrationError
  ): Promise<RecoveryAction>;
  validateDataConsistency(
    localData: unknown,
    externalData: unknown
  ): Promise<ValidationResult>;
}

export interface SyncResult {
  connectionId: string;
  status: 'success' | 'partial' | 'failed';
  recordsProcessed: number;
  errors: string[];
  lastSync: Date;
}

export interface ServiceIntegrationError {
  connectionId: string;
  errorType: string;
  message: string;
  timestamp: Date;
  retryable: boolean;
}

export interface RecoveryAction {
  action: 'retry' | 'fallback' | 'manual_intervention';
  delay?: number;
  maxRetries?: number;
  fallbackMethod?: string;
}

export interface ValidationResult {
  isValid: boolean;
  inconsistencies: string[];
  confidence: number;
}

// Notification Service Types
export interface INotificationService {
  sendNotification(
    notification: NotificationData
  ): Promise<NotificationResponse>;
  scheduleNotification(
    notification: NotificationData,
    scheduleTime: Date
  ): Promise<string>;
  getNotificationHistory(
    tenantId: string,
    filters?: NotificationFilters
  ): Promise<NotificationResponse[]>;
}

export interface NotificationData {
  tenantId: string;
  recipient: string;
  type: 'email' | 'in-app' | 'webhook';
  subject: string;
  message: string;
  priority?: 'low' | 'medium' | 'high';
  metadata?: Record<string, unknown>;
}

export interface NotificationFilters {
  type?: string;
  status?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

// Service-specific Types (avoiding conflicts with database types)
export interface ServiceResourceState {
  allocated: number;
  available: number;
  utilization: number;
}

export interface ResourceRequirements {
  required: number;
  critical: number;
  optimal: number;
}

export interface ServiceTimelineState {
  startDate: Date;
  currentDate: Date;
  endDate: Date;
  milestones: ServiceMilestone[];
}

export interface TimelineRequirements {
  targetEndDate: Date;
  criticalMilestones: ServiceMilestone[];
  bufferTime: number;
}

export interface ServiceQualityState {
  currentScore: number;
  defectRate: number;
  testCoverage: number;
}

export interface QualityRequirements {
  minimumScore: number;
  maxDefectRate: number;
  requiredTestCoverage: number;
}

export interface ServiceMilestone {
  id: string;
  name: string;
  targetDate: Date;
  actualDate?: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed';
}

export interface ProjectEvent {
  id: string;
  type: string;
  timestamp: Date;
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
}

// Re-export database types with aliases to avoid conflicts
export type { SeverityLevel, TrendDirection };
