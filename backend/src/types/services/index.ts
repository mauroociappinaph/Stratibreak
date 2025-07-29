// Service Interface Types
import type {
  ConnectionResponse,
  Gap,
  NotificationResponse,
  Prediction,
  Recommendation,
} from '../api';
import type { SeverityLevel } from '../database';

// Gap Analysis Service Types
export interface IGapAnalysisService {
  analyzeProject(projectData: ProjectAnalysisData): Promise<GapAnalysisResult>;
  identifyDiscrepancies(
    current: ProjectState,
    target: ProjectGoals
  ): Promise<Gap[]>;
  categorizeGaps(gaps: Gap[]): Promise<CategorizedGaps>;
  calculateGapSeverity(gap: Gap): Promise<SeverityLevel>;
}

export interface ProjectAnalysisData {
  projectId: string;
  projectName: string;
  currentState: ProjectState;
  targetGoals: ProjectGoals;
  historicalData?: Record<string, unknown>;
}

export interface ProjectState {
  progress: number;
  resources: ResourceState;
  timeline: TimelineState;
  quality: QualityState;
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
    indicators: RiskIndicator[]
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

export interface RiskIndicator {
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
  keyRisks: RiskIndicator[];
}

// Integration Service Types
export interface IIntegrationService {
  connectToTool(
    toolType: string,
    credentials: Record<string, string>
  ): Promise<ConnectionResponse>;
  syncData(connectionId: string): Promise<SyncResult>;
  handleIntegrationFailure(error: IntegrationError): Promise<RecoveryAction>;
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

export interface IntegrationError {
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

// Common Types
export interface ResourceState {
  allocated: number;
  available: number;
  utilization: number;
}

export interface ResourceRequirements {
  required: number;
  critical: number;
  optimal: number;
}

export interface TimelineState {
  startDate: Date;
  currentDate: Date;
  endDate: Date;
  milestones: Milestone[];
}

export interface TimelineRequirements {
  targetEndDate: Date;
  criticalMilestones: Milestone[];
  bufferTime: number;
}

export interface QualityState {
  currentScore: number;
  defectRate: number;
  testCoverage: number;
}

export interface QualityRequirements {
  minimumScore: number;
  maxDefectRate: number;
  requiredTestCoverage: number;
}

export interface Milestone {
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

export enum TrendDirection {
  IMPROVING = 'improving',
  STABLE = 'stable',
  DECLINING = 'declining',
  VOLATILE = 'volatile',
}

// SeverityLevel is imported from database types to avoid duplication
