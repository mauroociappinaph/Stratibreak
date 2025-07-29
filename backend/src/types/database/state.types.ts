// State-related Database Entity Types
export interface ResourceState {
  allocated: number;
  available: number;
  utilization: number;
  budget: BudgetState;
  team: TeamState;
}

export interface BudgetState {
  allocated: number;
  spent: number;
  remaining: number;
  burnRate: number;
}

export interface TeamState {
  totalMembers: number;
  activeMembers: number;
  capacity: number;
  workload: number;
}

export interface TimelineState {
  startDate: Date;
  currentDate: Date;
  endDate: Date;
  progress: number;
  milestones: Milestone[];
  delays: number;
}

export interface QualityState {
  currentScore: number;
  defectRate: number;
  testCoverage: number;
  codeQuality: number;
  customerSatisfaction?: number;
}

export interface RiskState {
  overallRisk: RiskLevel;
  activeRisks: number;
  mitigatedRisks: number;
  riskTrend: TrendDirection;
}

export interface RiskIndicator {
  id: string;
  projectId: string;
  indicator: string;
  currentValue: number;
  threshold: number;
  trend: TrendDirection;
  weight: number;
  lastUpdated: Date;
}

// State-related enums
export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum TrendDirection {
  IMPROVING = 'improving',
  STABLE = 'stable',
  DECLINING = 'declining',
  VOLATILE = 'volatile',
}

// Import Milestone from project types to avoid duplication
import type { Milestone } from './project.types';
