import { Injectable } from '@nestjs/common';
import {
  GapCategory,
  GapStatus,
  GapType,
  SeverityLevel,
} from '../../../types/database/gap.types';
import type {
  ProjectGoal,
  ProjectState,
} from '../../../types/database/project.types';

interface GapData {
  id?: string;
  projectId: string;
  title: string;
  description: string;
  type: GapType;
  category: GapCategory;
  severity: SeverityLevel;
  status: GapStatus;
  currentValue?: number | string;
  targetValue?: unknown;
  impact?: string;
  confidence?: number;
  userId: string;
  identifiedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable()
export class ProjectStateAnalyzerService {
  analyzeGoalGap(current: ProjectState, goal: ProjectGoal): GapData | null {
    // Simple gap analysis based on goal progress
    const currentValue = this.extractCurrentValueForGoal(current, goal);
    const targetValue = this.extractTargetValue(goal);
    const variance = this.calculateVariance(currentValue, targetValue);

    if (Math.abs(variance) < 0.1) {
      return null; // No significant gap
    }

    return {
      projectId: goal.projectId,
      type: this.inferGapType(goal),
      category: this.inferGapCategory(goal),
      title: `Gap in ${goal.title}`,
      description: `Current performance does not meet target for ${goal.title}`,
      currentValue,
      targetValue,
      severity: SeverityLevel.MEDIUM, // Will be recalculated
      status: GapStatus.OPEN,
      impact: `Performance gap in ${goal.title}`,
      confidence: 0.8,
      userId: 'system',
    };
  }

  analyzeSystemLevelGaps(current: ProjectState): GapData[] {
    const gaps: GapData[] = [];

    // Timeline gaps
    if (current.timeline && current.timeline.delays > 0) {
      gaps.push({
        projectId: current.projectId,
        type: GapType.TIMELINE,
        category: GapCategory.OPERATIONAL,
        title: 'Timeline Delay Detected',
        description: `Project is delayed by ${current.timeline.delays} days`,
        currentValue: current.timeline.delays,
        targetValue: 0,
        severity: SeverityLevel.MEDIUM,
        status: GapStatus.OPEN,
        impact: 'Project delivery delays',
        confidence: 0.8,
        userId: 'system',
      });
    }

    // Resource gaps
    if (current.resources && current.resources.utilization > 0.9) {
      gaps.push({
        projectId: current.projectId,
        type: GapType.RESOURCE,
        category: GapCategory.OPERATIONAL,
        title: 'Resource Over-utilization',
        description: `Resources are over-utilized at ${(current.resources.utilization * 100).toFixed(1)}%`,
        currentValue: current.resources.utilization,
        targetValue: 0.8,
        severity: SeverityLevel.MEDIUM,
        status: GapStatus.OPEN,
        impact: 'Team burnout risk',
        confidence: 0.8,
        userId: 'system',
      });
    }

    // Quality gaps
    if (current.quality && current.quality.defectRate > 0.05) {
      gaps.push({
        projectId: current.projectId,
        type: GapType.QUALITY,
        category: GapCategory.TECHNICAL,
        title: 'Quality Issues Detected',
        description: `Defect rate is ${(current.quality.defectRate * 100).toFixed(1)}% above acceptable threshold`,
        currentValue: current.quality.defectRate,
        targetValue: 0.02,
        severity: SeverityLevel.MEDIUM,
        status: GapStatus.OPEN,
        impact: 'Product quality concerns',
        confidence: 0.8,
        userId: 'system',
      });
    }

    return gaps;
  }

  private extractCurrentValueForGoal(
    current: ProjectState,
    goal: ProjectGoal
  ): number {
    const goalTitle = goal.title.toLowerCase();

    const valueExtractors = [
      { keywords: ['progress', 'completion'], value: current.progress || 0 },
      {
        keywords: ['quality', 'defect'],
        value: current.quality?.defectRate || 0,
      },
      {
        keywords: ['resource', 'utilization'],
        value: current.resources?.utilization || 0,
      },
      {
        keywords: ['timeline', 'schedule'],
        value: current.timeline?.progress || 0,
      },
      { keywords: ['health', 'score'], value: current.healthScore || 0 },
    ];

    for (const extractor of valueExtractors) {
      if (extractor.keywords.some(keyword => goalTitle.includes(keyword))) {
        return extractor.value;
      }
    }

    return current.progress || 0;
  }

  private extractTargetValue(goal: ProjectGoal): number {
    if (typeof goal.targetValue === 'object' && goal.targetValue !== null) {
      const targetObj = goal.targetValue as Record<string, unknown>;
      return Number(targetObj.value || targetObj.target || 1.0);
    }
    return Number(goal.targetValue) || 1.0;
  }

  private calculateVariance(current: number, target: number): number {
    if (target === 0) {
      return current === 0 ? 0 : Infinity;
    }
    return (current - target) / target;
  }

  private inferGapType(goal: ProjectGoal): GapType {
    const title = goal.title.toLowerCase();

    const typeMapping = [
      { keywords: ['resource', 'staff'], type: GapType.RESOURCE },
      { keywords: ['process', 'workflow'], type: GapType.PROCESS },
      { keywords: ['communication'], type: GapType.COMMUNICATION },
      { keywords: ['technology', 'tech'], type: GapType.TECHNOLOGY },
      { keywords: ['timeline', 'schedule'], type: GapType.TIMELINE },
      { keywords: ['quality'], type: GapType.QUALITY },
      { keywords: ['budget', 'cost'], type: GapType.BUDGET },
      { keywords: ['skill', 'training'], type: GapType.SKILL },
    ];

    for (const mapping of typeMapping) {
      if (mapping.keywords.some(keyword => title.includes(keyword))) {
        return mapping.type;
      }
    }

    return GapType.PROCESS; // Default
  }

  private inferGapCategory(goal: ProjectGoal): GapCategory {
    const type = this.inferGapType(goal);
    switch (type) {
      case GapType.RESOURCE:
      case GapType.TIMELINE:
      case GapType.QUALITY:
        return GapCategory.OPERATIONAL;
      case GapType.TECHNOLOGY:
        return GapCategory.TECHNICAL;
      case GapType.COMMUNICATION:
      case GapType.CULTURE:
        return GapCategory.ORGANIZATIONAL;
      default:
        return GapCategory.TACTICAL;
    }
  }
}
