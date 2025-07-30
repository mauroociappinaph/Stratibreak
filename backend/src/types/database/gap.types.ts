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
  RESOURCE = 'RESOURCE',
  PROCESS = 'PROCESS',
  COMMUNICATION = 'COMMUNICATION',
  TECHNOLOGY = 'TECHNOLOGY',
  CULTURE = 'CULTURE',
  TIMELINE = 'TIMELINE',
  QUALITY = 'QUALITY',
  BUDGET = 'BUDGET',
  SKILL = 'SKILL',
}

export enum GapCategory {
  OPERATIONAL = 'OPERATIONAL',
  STRATEGIC = 'STRATEGIC',
  TACTICAL = 'TACTICAL',
  TECHNICAL = 'TECHNICAL',
  ORGANIZATIONAL = 'ORGANIZATIONAL',
}

export enum GapStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
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
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}
