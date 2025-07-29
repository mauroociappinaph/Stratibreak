/* eslint-disable max-lines */
// Base API Types
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  timestamp: Date;
  requestId: string;
  version: string;
}

export interface PaginatedResponse<T = unknown> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  message?: string;
  timestamp: Date;
  requestId: string;
}

export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
  timestamp: Date;
  requestId: string;
  details?: Record<string, unknown>;
  stack?: string; // Only in development
}

// Auth API Types
export interface LoginRequest {
  email: string;
  password: string;
  tenantId?: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  role?: string;
  tenantId?: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: UserResponse;
  expiresIn: number;
  permissions: string[];
}

export interface UserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  tenantId: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Gap Analysis API Types
export interface ProjectAnalysisRequest {
  projectId: string;
  projectName: string;
  description?: string;
  goals: ProjectGoalsRequest;
  currentState: ProjectStateRequest;
  analysisOptions?: AnalysisOptionsRequest;
}

export interface ProjectGoalsRequest {
  targetProgress: number;
  targetEndDate: Date;
  qualityThreshold: number;
  budgetLimit: number;
  resourceRequirements: ResourceRequirementRequest[];
}

export interface ResourceRequirementRequest {
  type: string;
  quantity: number;
  skills: string[];
}

export interface ProjectStateRequest {
  currentProgress: number;
  currentDate: Date;
  budgetSpent: number;
  teamSize: number;
  completedTasks: number;
  totalTasks: number;
  qualityMetrics: QualityMetricsRequest;
}

export interface QualityMetricsRequest {
  defectRate: number;
  testCoverage: number;
  codeQuality: number;
  customerSatisfaction?: number;
}

export interface AnalysisOptionsRequest {
  includeHistoricalData: boolean;
  analysisDepth: 'basic' | 'detailed' | 'comprehensive';
  focusAreas: string[];
  excludeAreas?: string[];
}

export interface GapAnalysisResponse {
  projectId: string;
  analysisId: string;
  gaps: GapResponse[];
  recommendations: RecommendationResponse[];
  overallHealthScore: number;
  analysisTimestamp: Date;
  analysisOptions: AnalysisOptionsRequest;
  summary: AnalysisSummaryResponse;
}

export interface GapResponse {
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

export interface RecommendationResponse {
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

export interface AnalysisSummaryResponse {
  totalGaps: number;
  criticalGaps: number;
  highPriorityRecommendations: number;
  estimatedResolutionTime: string;
  overallRisk: 'low' | 'medium' | 'high' | 'critical';
}

// Integration API Types
export interface ConnectionRequest {
  toolType:
    | 'jira'
    | 'asana'
    | 'trello'
    | 'monday'
    | 'bitrix24'
    | 'slack'
    | 'teams';
  name: string;
  credentials: Record<string, string>;
  configuration?: IntegrationConfigurationRequest;
}

export interface IntegrationConfigurationRequest {
  syncFrequency: number; // minutes
  dataMapping: FieldMappingRequest[];
  filters: IntegrationFiltersRequest;
  webhookUrl?: string;
}

export interface FieldMappingRequest {
  sourceField: string;
  targetField: string;
  transformation?: string;
}

export interface IntegrationFiltersRequest {
  projects?: string[];
  statuses?: string[];
  assignees?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface ConnectionResponse {
  connectionId: string;
  status: 'connected' | 'failed' | 'pending' | 'disconnected';
  toolType: string;
  name: string;
  lastSync?: Date;
  nextSync?: Date;
  syncStatus: 'idle' | 'syncing' | 'error';
  recordsCount: number;
  configuration: IntegrationConfigurationResponse;
  createdAt: Date;
  updatedAt: Date;
}

export interface IntegrationConfigurationResponse {
  syncFrequency: number;
  dataMapping: FieldMappingResponse[];
  filters: IntegrationFiltersRequest;
  webhookUrl?: string;
}

export interface FieldMappingResponse {
  id: string;
  sourceField: string;
  targetField: string;
  transformation?: string;
  isActive: boolean;
}

export interface SyncRequest {
  connectionId: string;
  forceSync?: boolean;
  syncOptions?: {
    fullSync: boolean;
    dateRange?: {
      start: Date;
      end: Date;
    };
  };
}

export interface SyncResponse {
  syncId: string;
  connectionId: string;
  status: 'started' | 'completed' | 'failed' | 'in_progress';
  recordsProcessed: number;
  recordsCreated: number;
  recordsUpdated: number;
  recordsSkipped: number;
  errors: SyncErrorResponse[];
  startedAt: Date;
  completedAt?: Date;
  duration?: number; // seconds
}

// Prediction API Types
export interface PredictionRequest {
  projectId: string;
  timeframe: 'short' | 'medium' | 'long'; // 1 week, 1 month, 3 months
  predictionTypes?: PredictionType[];
  includeRecommendations?: boolean;
}

export type PredictionType =
  | 'timeline_delay'
  | 'budget_overrun'
  | 'quality_issues'
  | 'resource_shortage'
  | 'scope_creep';

export interface PredictionResponse {
  predictionId: string;
  projectId: string;
  predictions: PredictionItemResponse[];
  overallRiskLevel: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  generatedAt: Date;
  validUntil: Date;
  recommendations?: PredictionRecommendationResponse[];
}

export interface PredictionItemResponse {
  id: string;
  type: PredictionType;
  probability: number;
  impact: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  estimatedTimeToOccurrence: string;
  preventionWindow: string;
  indicators: RiskIndicatorResponse[];
  suggestedActions: string[];
}

export interface RiskIndicatorResponse {
  name: string;
  currentValue: number;
  threshold: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  severity: 'low' | 'medium' | 'high';
}

export interface PredictionRecommendationResponse {
  id: string;
  predictionId: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  actionType: 'preventive' | 'corrective' | 'monitoring';
  estimatedEffort: string;
  expectedOutcome: string;
}

export interface PredictionHistoryRequest {
  projectId: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  predictionTypes?: PredictionType[];
  limit?: number;
  offset?: number;
}

export interface PredictionAccuracyResponse {
  predictionId: string;
  actualOutcome: 'occurred' | 'prevented' | 'false_positive';
  accuracy: number;
  feedback: string;
  verifiedAt: Date;
}

// Notification API Types
export interface NotificationRequest {
  recipients: string[];
  type: 'email' | 'in-app' | 'webhook' | 'sms';
  subject: string;
  message: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  category:
    | 'gap_analysis'
    | 'prediction'
    | 'integration'
    | 'system'
    | 'user_action';
  metadata?: Record<string, unknown>;
  scheduledFor?: Date;
  expiresAt?: Date;
}

export interface NotificationResponse {
  notificationId: string;
  status: 'sent' | 'pending' | 'failed' | 'scheduled' | 'expired';
  recipients: NotificationRecipientResponse[];
  type: string;
  subject: string;
  priority: string;
  category: string;
  createdAt: Date;
  sentAt?: Date;
  scheduledFor?: Date;
  expiresAt?: Date;
  metadata?: Record<string, unknown>;
}

export interface NotificationRecipientResponse {
  recipient: string;
  status: 'sent' | 'pending' | 'failed' | 'bounced';
  sentAt?: Date;
  error?: string;
}

export interface NotificationPreferencesRequest {
  userId: string;
  preferences: {
    email: NotificationChannelPreference;
    inApp: NotificationChannelPreference;
    webhook?: NotificationChannelPreference;
    sms?: NotificationChannelPreference;
  };
}

export interface NotificationChannelPreference {
  enabled: boolean;
  categories: string[];
  quietHours?: {
    start: string; // HH:mm format
    end: string; // HH:mm format
    timezone: string;
  };
  frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
}

export interface NotificationHistoryRequest {
  userId?: string;
  type?: string;
  category?: string;
  status?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  limit?: number;
  offset?: number;
}

// Action Plan API Types
export interface ActionPlanRequest {
  projectId: string;
  gapIds: string[];
  context: ActionPlanContextRequest;
  options?: ActionPlanOptionsRequest;
}

export interface ActionPlanContextRequest {
  teamSize: number;
  budget: number;
  timeline: {
    start: Date;
    end: Date;
  };
  constraints: string[];
  priorities: string[];
}

export interface ActionPlanOptionsRequest {
  includeResourceEstimates: boolean;
  includeTimeline: boolean;
  includeRiskMitigation: boolean;
  prioritizationMethod: 'impact' | 'effort' | 'roi' | 'custom';
}

export interface ActionPlanResponse {
  planId: string;
  projectId: string;
  targetGaps: string[];
  actions: ActionResponse[];
  timeline: TimelineResponse;
  resourceEstimates: ResourceEstimateResponse;
  riskMitigation: RiskMitigationResponse[];
  successMetrics: MetricResponse[];
  estimatedDuration: string;
  totalCost: number;
  createdAt: Date;
}

export interface ActionResponse {
  id: string;
  title: string;
  description: string;
  type: 'immediate' | 'short_term' | 'long_term';
  priority: number;
  impact: 'low' | 'medium' | 'high';
  urgency: 'low' | 'medium' | 'high';
  estimatedEffort: number;
  requiredSkills: string[];
  dependencies: string[];
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
}

export interface TimelineResponse {
  planId: string;
  phases: TimelinePhaseResponse[];
  totalDuration: string;
  criticalPath: string[];
  milestones: TimelineMilestoneResponse[];
}

export interface TimelinePhaseResponse {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  actions: string[];
  dependencies: string[];
  status: 'pending' | 'in_progress' | 'completed';
}

export interface TimelineMilestoneResponse {
  id: string;
  name: string;
  date: Date;
  criteria: string[];
  deliverables: string[];
  status: 'pending' | 'achieved' | 'missed';
}

export interface ResourceEstimateResponse {
  planId: string;
  humanResources: {
    roles: string[];
    totalHours: number;
    totalCost: number;
  };
  technicalResources: {
    tools: string[];
    licenses: string[];
    totalCost: number;
  };
  totalCost: number;
  confidence: number;
}

export interface RiskMitigationResponse {
  id: string;
  riskDescription: string;
  probability: number;
  impact: 'low' | 'medium' | 'high';
  mitigationStrategy: string;
  contingencyPlan: string;
  owner: string;
  status: 'identified' | 'mitigated' | 'occurred';
}

export interface MetricResponse {
  id: string;
  name: string;
  target: number;
  current?: number;
  unit: string;
  measurementMethod: string;
  status: 'on_track' | 'at_risk' | 'off_track';
}

// Metrics and Dashboard API Types
export interface MetricsRequest {
  projectIds: string[];
  timeRange: {
    start: Date;
    end: Date;
  };
  metricTypes?: string[];
  aggregation?: 'hourly' | 'daily' | 'weekly' | 'monthly';
}

export interface MetricsResponse {
  projectMetrics: ProjectMetricsResponse[];
  aggregatedMetrics: AggregatedMetricsResponse;
  generatedAt: Date;
}

export interface ProjectMetricsResponse {
  projectId: string;
  projectName: string;
  metrics: {
    performance: PerformanceMetricsResponse;
    quality: QualityMetricsResponse;
    team: TeamMetricsResponse;
    progress: ProgressMetricsResponse;
  };
  timestamp: Date;
}

export interface PerformanceMetricsResponse {
  velocity: number;
  throughput: number;
  cycleTime: number;
  leadTime: number;
  trend: 'improving' | 'declining' | 'stable';
}

export interface QualityMetricsResponse {
  defectRate: number;
  testCoverage: number;
  codeQuality: number;
  customerSatisfaction: number;
  trend: 'improving' | 'declining' | 'stable';
}

export interface TeamMetricsResponse {
  productivity: number;
  collaboration: number;
  satisfaction: number;
  burnoutRisk: number;
  trend: 'improving' | 'declining' | 'stable';
}

export interface ProgressMetricsResponse {
  completion: number;
  onTime: boolean;
  budgetUtilization: number;
  scopeCreep: number;
  trend: 'improving' | 'declining' | 'stable';
}

export interface AggregatedMetricsResponse {
  totalProjects: number;
  averageHealth: number;
  totalGaps: number;
  resolvedGaps: number;
  activeAlerts: number;
  trends: MetricTrendResponse[];
}

export interface MetricTrendResponse {
  metric: string;
  direction: 'up' | 'down' | 'stable';
  change: number;
  significance: 'low' | 'medium' | 'high';
  period: string;
}

// Common Error Types
export interface SyncErrorResponse {
  code: string;
  message: string;
  field?: string;
  value?: unknown;
}
