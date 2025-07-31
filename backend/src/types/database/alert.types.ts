// Alert Database Entity Types
export interface AlertEntity {
  id: string;
  projectId: string;
  type: AlertType;
  severity: AlertSeverity;
  status: AlertStatus;
  title: string;
  description: string;
  probability: number;
  confidence: number;
  estimatedTimeToOccurrence: Duration;
  potentialImpact: ImpactLevel;
  preventionWindow: Duration;
  suggestedActions: PreventiveActionEntity[];
  context: AlertContextEntity;
  createdAt: Date;
  expiresAt: Date;
  acknowledgedAt?: Date;
  acknowledgedBy?: string;
  resolvedAt?: Date;
  resolvedBy?: string;
  resolutionNotes?: string;
  updatedAt: Date;
}

export interface PreventiveActionEntity {
  id: string;
  alertId: string;
  title: string;
  description: string;
  priority: AlertSeverity;
  estimatedEffort: string;
  requiredResources: string[];
  expectedImpact: string;
  deadline?: Date;
  effectiveness: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AlertContextEntity {
  id: string;
  alertId: string;
  triggeringIndicators: RiskIndicatorEntity[];
  historicalPatterns?: string[];
  relatedAlerts?: string[];
  rootCause?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RiskIndicatorEntity {
  id: string;
  projectId: string;
  name: string;
  description: string;
  category: IndicatorCategory;
  currentValue: number;
  threshold: number;
  weight: number;
  trend: TrendDirection;
  riskLevel: RiskLevel;
  confidence: number;
  unit?: string;
  source?: string;
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface HistoricalDataPointEntity {
  id: string;
  riskIndicatorId: string;
  timestamp: Date;
  value: number;
  context?: string;
  createdAt: Date;
}

export interface AlertPriorityScoreEntity {
  id: string;
  alertId: string;
  overallScore: number;
  impactScore: number;
  probabilityScore: number;
  preventionCapacityScore: number;
  urgencyScore: number;
  reasoning: string;
  calculatedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Duration {
  value: number;
  unit: TimeUnit;
}

// Alert-related enums
export enum AlertType {
  RISK = 'risk',
  OPPORTUNITY = 'opportunity',
  ANOMALY = 'anomaly',
  THRESHOLD_BREACH = 'threshold_breach',
  TREND_CHANGE = 'trend_change',
  PREDICTION = 'prediction',
}

export enum AlertSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum AlertStatus {
  ACTIVE = 'active',
  ACKNOWLEDGED = 'acknowledged',
  RESOLVED = 'resolved',
  DISMISSED = 'dismissed',
  EXPIRED = 'expired',
}

export enum ImpactLevel {
  MINIMAL = 'minimal',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  SEVERE = 'severe',
}

export enum TrendDirection {
  IMPROVING = 'improving',
  STABLE = 'stable',
  DECLINING = 'declining',
  VOLATILE = 'volatile',
}

export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum IndicatorCategory {
  TIMELINE = 'timeline',
  BUDGET = 'budget',
  QUALITY = 'quality',
  RESOURCE = 'resource',
  SCOPE = 'scope',
  STAKEHOLDER = 'stakeholder',
  COMMUNICATION = 'communication',
  TECHNOLOGY = 'technology',
}

export enum TimeUnit {
  MINUTES = 'minutes',
  HOURS = 'hours',
  DAYS = 'days',
  WEEKS = 'weeks',
  MONTHS = 'months',
}
