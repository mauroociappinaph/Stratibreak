// Gap Analysis Database Entity Types
export interface GapEntity {
  id: string;
  projectId: string;
  type: GapType;
  category: GapCategory;
  severity: SeverityLevel;
  title: string;
  description: string;
  currentValue: string;
  targetValue: string;
  variance: number;
  rootCauses: RootCause[];
  affectedAreas: ProjectArea[];
  estimatedImpact: Impact;
  identifiedAt: Date;
  identifiedBy: string;
  resolvedAt?: Date;
  resolvedBy?: string;
  status: GapStatus;
  priority: Priority;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface RootCause {
  id: string;
  gapId: string;
  category: RootCauseCategory;
  description: string;
  confidence: number;
  evidence: string[];
  contributionWeight: number;
}

export interface Impact {
  id: string;
  gapId: string;
  type: ImpactType;
  level: ImpactLevel;
  description: string;
  quantitativeValue?: number;
  unit?: string;
  timeframe: string;
  affectedStakeholders: string[];
}

export interface ProjectArea {
  id: string;
  name: string;
  description: string;
  owner?: string;
  criticality: CriticalityLevel;
}

// Gap-related enums
export enum GapType {
  RESOURCE = 'resource',
  PROCESS = 'process',
  COMMUNICATION = 'communication',
  TECHNOLOGY = 'technology',
  CULTURE = 'culture',
  TIMELINE = 'timeline',
  QUALITY = 'quality',
  BUDGET = 'budget',
  SKILL = 'skill',
  GOVERNANCE = 'governance',
}

export enum GapCategory {
  OPERATIONAL = 'operational',
  STRATEGIC = 'strategic',
  TACTICAL = 'tactical',
  TECHNICAL = 'technical',
  ORGANIZATIONAL = 'organizational',
}

export enum GapStatus {
  IDENTIFIED = 'identified',
  ANALYZING = 'analyzing',
  PLANNING = 'planning',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
  DEFERRED = 'deferred',
}

export enum RootCauseCategory {
  PEOPLE = 'people',
  PROCESS = 'process',
  TECHNOLOGY = 'technology',
  ENVIRONMENT = 'environment',
  MANAGEMENT = 'management',
  EXTERNAL = 'external',
}

export enum ImpactType {
  TIMELINE = 'timeline',
  BUDGET = 'budget',
  QUALITY = 'quality',
  SCOPE = 'scope',
  TEAM_MORALE = 'team_morale',
  CUSTOMER_SATISFACTION = 'customer_satisfaction',
  REPUTATION = 'reputation',
}

export enum ImpactLevel {
  NEGLIGIBLE = 'negligible',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  SEVERE = 'severe',
}

export enum CriticalityLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

// Common enums used across gap analysis
export enum SeverityLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}
