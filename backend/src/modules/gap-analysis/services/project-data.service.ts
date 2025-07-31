import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../common/services';
import type {
  Milestone,
  ProjectData,
  ProjectGoal,
  ProjectState,
  Stakeholder,
} from '../../../types/database/project.types';
import {
  GoalStatus,
  PermissionType,
  Priority,
  ProjectStatus,
  StakeholderRole,
} from '../../../types/database/project.types';
import { RiskLevel, TrendDirection } from '../../../types/database/state.types';
import type { GapAnalysisResult } from '../../../types/services/gap-analysis.types';

// Define types for Prisma query results
type ProjectGoalRecord = {
  id: string;
  title: string;
  description?: string | null;
  targetValue: unknown;
  currentValue?: unknown;
  dueDate?: Date | null;
  isAchieved: boolean;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
};

type ProjectStakeholderRecord = {
  id: string;
  name: string;
  email: string;
  role: string;
  projectId: string;
  createdAt?: Date;
};

type ProjectWithRelations = {
  id: string;
  tenantId: string;
  name: string;
  description?: string | null;
  status: string;
  startDate?: Date | null;
  endDate?: Date | null;
  goals: ProjectGoalRecord[];
  stakeholders: ProjectStakeholderRecord[];
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class ProjectDataService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Fetches comprehensive project data for analysis
   */
  async fetchProjectData(projectId: string): Promise<ProjectData> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: {
        goals: true,
        stakeholders: true,
      },
    });

    if (!project) {
      throw new NotFoundException(`Project ${projectId} not found`);
    }

    // Create current state using available Prisma fields with defaults
    const currentState: ProjectState = {
      id: `state-${projectId}`,
      projectId,
      progress: this.getNumericValue(project, 'progress', 0),
      healthScore: this.getNumericValue(project, 'healthScore', 50),
      resources: {
        utilization: this.getNumericValue(project, 'resourceUtilization', 0.7),
        available: this.getIntValue(project, 'availableResources', 10),
        allocated: this.getIntValue(project, 'allocatedResources', 8),
        budget: {
          allocated: this.getNumericValue(project, 'budgetAllocated', 100000),
          spent: this.getNumericValue(project, 'budgetSpent', 50000),
          remaining: this.getNumericValue(project, 'budgetRemaining', 50000),
          burnRate: this.getNumericValue(project, 'budgetBurnRate', 5000),
        },
        team: {
          totalMembers: this.getIntValue(project, 'totalTeamMembers', 8),
          activeMembers: this.getIntValue(project, 'activeTeamMembers', 7),
          capacity: this.getNumericValue(project, 'teamCapacity', 0.8),
          workload: this.getNumericValue(project, 'teamWorkload', 0.75),
        },
      },
      timeline: {
        startDate: project.startDate || new Date(),
        currentDate: new Date(),
        endDate: project.endDate || new Date(),
        progress: this.getNumericValue(project, 'timelineProgress', 0.6),
        milestones: this.getJsonValue(project, 'milestones', []) as Milestone[],
        delays: this.getIntValue(project, 'timelineDelays', 0),
      },
      quality: {
        currentScore: this.getNumericValue(project, 'qualityScore', 75),
        defectRate: this.getNumericValue(project, 'defectRate', 0.05),
        testCoverage: this.getNumericValue(project, 'testCoverage', 0.8),
        codeQuality: this.getNumericValue(project, 'codeQuality', 80),
        customerSatisfaction: this.getNumericValue(
          project,
          'customerSatisfaction',
          4.2
        ),
      },
      risks: {
        overallRisk: this.getEnumValue(
          project,
          'overallRisk',
          RiskLevel.MEDIUM
        ),
        activeRisks: this.getIntValue(project, 'activeRisks', 2),
        mitigatedRisks: this.getIntValue(project, 'mitigatedRisks', 1),
        riskTrend: this.getEnumValue(
          project,
          'riskTrend',
          TrendDirection.STABLE
        ),
      },
      lastUpdated: new Date(),
    };

    return this.buildProjectData(project, currentState);
  }

  /**
   * Stores analysis record in database
   */
  async storeAnalysisRecord(result: GapAnalysisResult): Promise<void> {
    await this.prisma.analysisRecord.create({
      data: {
        projectId: result.projectId,
        analysisType: 'gap_analysis',
        results: JSON.parse(JSON.stringify(result)),
        overallScore: result.overallHealthScore,
        executionTime: result.executionTimeMs,
      },
    });
  }

  private buildProjectData(
    project: ProjectWithRelations,
    currentState: ProjectState
  ): ProjectData {
    return {
      project: {
        id: project.id,
        tenantId: project.tenantId,
        name: project.name,
        description: project.description ?? '',
        status: project.status as ProjectStatus,
        startDate: project.startDate || new Date(),
        endDate: project.endDate || new Date(),
        goals: (project.goals || []).map(g => this.mapGoal(g)),
        stakeholders: (project.stakeholders || []).map(s =>
          this.mapStakeholder(s)
        ),
        currentState,
        connectedTools: [],
        analysisHistory: [],
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      },
      currentState,
      goals: (project.goals || []).map(g => this.mapGoal(g)),
    };
  }

  private mapGoal(g: ProjectGoalRecord): ProjectGoal {
    const baseGoal = {
      id: g.id,
      projectId: g.projectId,
      title: g.title,
      description: g.description ?? '',
      targetValue: String(g.targetValue),
      currentValue: g.currentValue ? String(g.currentValue) : '',
      priority: Priority.MEDIUM,
      status: GoalStatus.IN_PROGRESS,
      createdAt: g.createdAt,
      updatedAt: g.updatedAt,
    };

    // Use conditional return to handle optional dueDate properly
    if (g.dueDate) {
      return { ...baseGoal, dueDate: g.dueDate };
    }
    return baseGoal;
  }

  private mapStakeholder(s: ProjectStakeholderRecord): Stakeholder {
    return {
      id: s.id,
      projectId: s.projectId,
      userId: s.id,
      role: StakeholderRole.CONTRIBUTOR,
      permissions: [PermissionType.READ],
      addedAt: s.createdAt || new Date(),
    };
  }

  // Helper methods for safe property access
  private getNumericValue(
    obj: Record<string, unknown>,
    key: string,
    defaultValue: number
  ): number {
    return typeof obj[key] === 'number' ? obj[key] : defaultValue;
  }

  private getIntValue(
    obj: Record<string, unknown>,
    key: string,
    defaultValue: number
  ): number {
    return typeof obj[key] === 'number' ? Math.floor(obj[key]) : defaultValue;
  }

  private getJsonValue(
    obj: Record<string, unknown>,
    key: string,
    defaultValue: unknown
  ): unknown {
    return obj[key] || defaultValue;
  }

  private getEnumValue<T>(
    obj: Record<string, unknown>,
    key: string,
    defaultValue: T
  ): T {
    return (obj[key] as T) || defaultValue;
  }
}
