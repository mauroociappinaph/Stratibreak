/* eslint-disable max-lines */
// Service Interface Types
import type { ConnectionResponse, NotificationResponse } from '../api';
import type { SeverityLevel } from '../database';
import type { TrendDirection } from '../database/state.types';

// Service-level Gap and Recommendation types (different from API types)
export interface ServiceGap {
  id: string;
  type:
    | 'resource'
    | 'process'
    | 'communication'
    | 'technology'
    | 'culture'
    | 'timeline'
    | 'quality';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  currentValue: number | string;
  targetValue: number | string;
  impact: 'low' | 'medium' | 'high';
  rootCauses: string[];
  affectedAreas: string[];
  identifiedAt: Date;
}

export interface ServiceRecommendation {
  id: string;
  gapId: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  estimatedEffort: string;
  estimatedCost: number;
  expectedImpact: string;
  timeline: string;
  requiredResources: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

export interface ServicePrediction {
  id: string;
  type:
    | 'timeline_delay'
    | 'budget_overrun'
    | 'quality_issues'
    | 'resource_shortage'
    | 'scope_creep';
  probability: number;
  impact: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  estimatedTimeToOccurrence: string;
  preventionWindow: string;
  indicators: ServiceRiskIndicator[];
  suggestedActions: string[];
}

// Gap Analysis Service Types
export interface IGapAnalysisService {
  analyzeProject(projectData: ProjectAnalysisData): Promise<GapAnalysisResult>;
  identifyDiscrepancies(
    current: ServiceProjectState,
    target: ProjectGoals
  ): Promise<ServiceGap[]>;
  categorizeGaps(gaps: ServiceGap[]): Promise<CategorizedGaps>;
  calculateGapSeverity(gap: ServiceGap): Promise<SeverityLevel>;
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
  prioritizedRecommendations: ServiceRecommendation[];
}

export interface CategorizedGaps {
  resource: ServiceGap[];
  process: ServiceGap[];
  communication: ServiceGap[];
  technology: ServiceGap[];
  culture: ServiceGap[];
  timeline: ServiceGap[];
  quality: ServiceGap[];
}

// Prediction Service Types
export interface IPredictiveService {
  predictFutureIssues(
    historicalData: HistoricalData
  ): Promise<ServicePrediction[]>;
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

// Action Plan Generator Service Types
export interface IActionPlanGenerator {
  generateActionPlan(
    gaps: ServiceGap[],
    context: ProjectContext
  ): Promise<ActionPlan>;
  prioritizeActions(actions: Action[]): Promise<PrioritizedAction[]>;
  estimateResources(action: Action): Promise<ResourceEstimate>;
  createImplementationTimeline(plan: ActionPlan): Promise<Timeline>;
}

export interface ProjectContext {
  projectId: string;
  teamSize: number;
  budget: number;
  timeline: {
    start: Date;
    end: Date;
  };
  constraints: string[];
  priorities: string[];
}

export interface ActionPlan {
  planId: string;
  targetGaps: ServiceGap[];
  actions: PrioritizedAction[];
  estimatedDuration: Duration;
  requiredResources: Resource[];
  successMetrics: Metric[];
  riskMitigation: RiskMitigation[];
}

export interface Action {
  id: string;
  title: string;
  description: string;
  type: 'immediate' | 'short_term' | 'long_term';
  estimatedEffort: number;
  requiredSkills: string[];
}

export interface PrioritizedAction extends Action {
  priority: number;
  impact: 'low' | 'medium' | 'high';
  urgency: 'low' | 'medium' | 'high';
  dependencies: string[];
}

export interface ResourceEstimate {
  actionId: string;
  humanResources: {
    roles: string[];
    hours: number;
    cost: number;
  };
  technicalResources: {
    tools: string[];
    licenses: string[];
    cost: number;
  };
  totalCost: number;
  confidence: number;
}

export interface Timeline {
  planId: string;
  phases: TimelinePhase[];
  totalDuration: Duration;
  criticalPath: string[];
  milestones: TimelineMilestone[];
}

export interface TimelinePhase {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  actions: string[];
  dependencies: string[];
}

export interface TimelineMilestone {
  id: string;
  name: string;
  date: Date;
  criteria: string[];
  deliverables: string[];
}

export interface Duration {
  days: number;
  hours: number;
  minutes: number;
}

export interface Resource {
  id: string;
  type: 'human' | 'technical' | 'financial';
  name: string;
  availability: number;
  cost: number;
  skills?: string[];
}

export interface Metric {
  id: string;
  name: string;
  target: number;
  current?: number;
  unit: string;
  measurementMethod: string;
}

export interface RiskMitigation {
  riskId: string;
  description: string;
  probability: number;
  impact: 'low' | 'medium' | 'high';
  mitigationStrategy: string;
  contingencyPlan: string;
}

// Authentication and Authorization Service Types
export interface IAuthService {
  login(credentials: LoginCredentials): Promise<AuthResult>;
  register(userData: RegisterData): Promise<AuthResult>;
  validateToken(token: string): Promise<TokenValidation>;
  refreshToken(refreshToken: string): Promise<AuthResult>;
  logout(token: string): Promise<void>;
  resetPassword(email: string): Promise<void>;
  changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ): Promise<void>;
}

export interface LoginCredentials {
  email: string;
  password: string;
  tenantId?: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  tenantId?: string;
}

export interface AuthResult {
  token: string;
  refreshToken: string;
  user: AuthUser;
  expiresIn: number;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  tenantId: string;
  permissions: string[];
}

export interface TokenValidation {
  isValid: boolean;
  user?: AuthUser;
  expiresAt?: Date;
}

// Tenant Management Service Types
export interface ITenantService {
  createTenant(tenantData: CreateTenantData): Promise<TenantResult>;
  getTenant(tenantId: string): Promise<TenantResult>;
  updateTenant(
    tenantId: string,
    updates: UpdateTenantData
  ): Promise<TenantResult>;
  deleteTenant(tenantId: string): Promise<void>;
  listTenants(filters?: TenantFilters): Promise<TenantResult[]>;
}

export interface CreateTenantData {
  name: string;
  domain: string;
  adminEmail: string;
  plan: 'basic' | 'professional' | 'enterprise';
  settings: TenantSettings;
}

export interface UpdateTenantData {
  name?: string;
  domain?: string;
  plan?: 'basic' | 'professional' | 'enterprise';
  settings?: Partial<TenantSettings>;
}

export interface TenantResult {
  id: string;
  name: string;
  domain: string;
  plan: string;
  status: 'active' | 'suspended' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
  settings: TenantSettings;
}

export interface TenantSettings {
  maxUsers: number;
  maxProjects: number;
  retentionDays: number;
  allowedIntegrations: string[];
  features: string[];
}

export interface TenantFilters {
  status?: string;
  plan?: string;
  createdAfter?: Date;
  createdBefore?: Date;
}

// Metrics and Monitoring Service Types
export interface IMetricsService {
  collectMetrics(projectId: string): Promise<ProjectMetrics>;
  getRealtimeMetrics(projectId: string): Promise<RealtimeMetrics>;
  aggregateMetrics(
    projectIds: string[],
    timeRange: TimeRange
  ): Promise<AggregatedMetrics>;
  getSystemHealth(): Promise<SystemHealth>;
  recordCustomMetric(metric: CustomMetric): Promise<void>;
}

export interface ProjectMetrics {
  projectId: string;
  timestamp: Date;
  performance: PerformanceMetrics;
  quality: QualityMetrics;
  team: TeamMetrics;
  progress: ProgressMetrics;
}

export interface RealtimeMetrics {
  projectId: string;
  timestamp: Date;
  activeUsers: number;
  currentTasks: number;
  systemLoad: number;
  responseTime: number;
}

export interface AggregatedMetrics {
  timeRange: TimeRange;
  projectCount: number;
  averagePerformance: number;
  totalIssues: number;
  resolvedIssues: number;
  trends: MetricTrend[];
}

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'critical';
  uptime: number;
  responseTime: number;
  errorRate: number;
  services: ServiceHealth[];
}

export interface ServiceHealth {
  name: string;
  status: 'up' | 'down' | 'degraded';
  responseTime: number;
  errorRate: number;
  lastCheck: Date;
}

export interface PerformanceMetrics {
  velocity: number;
  throughput: number;
  cycleTime: number;
  leadTime: number;
}

export interface QualityMetrics {
  defectRate: number;
  testCoverage: number;
  codeQuality: number;
  customerSatisfaction: number;
}

export interface TeamMetrics {
  productivity: number;
  collaboration: number;
  satisfaction: number;
  burnoutRisk: number;
}

export interface ProgressMetrics {
  completion: number;
  onTime: boolean;
  budgetUtilization: number;
  scopeCreep: number;
}

export interface TimeRange {
  start: Date;
  end: Date;
}

export interface CustomMetric {
  name: string;
  value: number;
  unit: string;
  tags: Record<string, string>;
  timestamp: Date;
}

export interface MetricTrend {
  metric: string;
  direction: 'up' | 'down' | 'stable';
  change: number;
  significance: 'low' | 'medium' | 'high';
}

// Re-export database types with aliases to avoid conflicts
export type { SeverityLevel, TrendDirection };

// Re-export prediction service types
export * from './prediction.types';
