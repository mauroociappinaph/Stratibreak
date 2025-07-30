// Import shared types to avoid duplication
import type { ToolConnection } from './integration.types';
import type {
  QualityState,
  ResourceState,
  RiskState,
  TimelineState,
} from './state.types';

// Project-related Database Entity Types
export interface ProjectEntity {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  startDate: Date;
  endDate: Date;
  goals: ProjectGoal[];
  stakeholders: Stakeholder[];
  currentState: ProjectState;
  connectedTools: ToolConnection[];
  analysisHistory: AnalysisRecord[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectGoal {
  id: string;
  projectId: string;
  title: string;
  description: string;
  targetValue: string;
  currentValue?: string;
  priority: Priority;
  dueDate?: Date;
  status: GoalStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Stakeholder {
  id: string;
  projectId: string;
  userId: string;
  role: StakeholderRole;
  permissions: PermissionType[];
  addedAt: Date;
}

export interface ProjectState {
  id: string;
  projectId: string;
  progress: number;
  healthScore: number;
  resources: ResourceState;
  timeline: TimelineState;
  quality: QualityState;
  risks: RiskState;
  lastUpdated: Date;
}

export interface Milestone {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  targetDate: Date;
  actualDate?: Date;
  status: MilestoneStatus;
  dependencies: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AnalysisRecord {
  id: string;
  projectId: string;
  analysisType: AnalysisType;
  result: Record<string, unknown>;
  confidence: number;
  executedAt: Date;
  executedBy: string;
}

export interface ProjectData {
  project: ProjectEntity;
  currentState: ProjectState;
  goals: ProjectGoal[];
}

// Project-related enums
export enum ProjectStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  ON_HOLD = 'on_hold',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum GoalStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  BLOCKED = 'blocked',
  CANCELLED = 'cancelled',
}

export enum MilestoneStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  DELAYED = 'delayed',
  CANCELLED = 'cancelled',
}

export enum StakeholderRole {
  OWNER = 'owner',
  MANAGER = 'manager',
  CONTRIBUTOR = 'contributor',
  OBSERVER = 'observer',
}

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum PermissionType {
  READ = 'read',
  WRITE = 'write',
  DELETE = 'delete',
  ADMIN = 'admin',
  ANALYZE = 'analyze',
  PREDICT = 'predict',
  INTEGRATE = 'integrate',
}

export enum AnalysisType {
  GAP_ANALYSIS = 'gap_analysis',
  PREDICTION = 'prediction',
  RISK_ASSESSMENT = 'risk_assessment',
  PERFORMANCE = 'performance',
}
