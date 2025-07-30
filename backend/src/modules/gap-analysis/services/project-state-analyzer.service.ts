import { Injectable } from '@nestjs/common';
import { Gap } from '@prisma/client';
import type {
  ProjectGoal,
  ProjectState,
} from '../../../types/database/project.types';
import { GapCategory, GapType } from '../../../types/database/gap.types';

@Injectable()
export class ProjectStateAnalyzerService {
  analyzeGoalGap(current: ProjectState, goal: ProjectGoal): Gap | null {
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
      variance,
      severity: 'medium' as any, // Will be recalculated
      rootCauses: this.identifyRootCauses(goal, variance),
      affectedAreas: this.identifyAffectedAreas(goal),
      estimatedImpact: this.estimateImpact(goal, variance),
      confidence: 0.8,
    };
  }

  analyzeSystemLevelGaps(current: ProjectState): Gap[] {
    const gaps: Gap[] = [];

    // Timeline gaps
    if (current.timeline && current.timeline.delays > 0) {
      // Assuming createTimelineGap is handled by GapFactoryService
      // For now, we'll keep a placeholder or expect it to be injected
      // This method will need to be refactored to use GapFactoryService
      // For now, returning a simplified mock gap
      gaps.push({
        projectId: current.projectId,
        type: 'timeline' as any,
        category: 'operational' as any,
        title: 'Timeline Delay Detected',
        description: `Project is delayed by ${current.timeline.delays} days`,
        currentValue: current.timeline.delays,
        targetValue: 0,
        variance: current.timeline.delays,
        severity: 'medium' as any,
        rootCauses: [],
        affectedAreas: [],
        estimatedImpact: null,
        confidence: 0.8,
      });
    }

    // Resource gaps
    if (current.resources && current.resources.utilization > 0.9) {
      // Assuming createResourceGap is handled by GapFactoryService
      gaps.push({
        projectId: current.projectId,
        type: 'resource' as any,
        category: 'operational' as any,
        title: 'Resource Over-utilization',
        description: `Resources are over-utilized at ${(current.resources.utilization * 100).toFixed(1)}%`,
        currentValue: current.resources.utilization,
        targetValue: 0.8,
        variance: current.resources.utilization - 0.8,
        severity: 'medium' as any,
        rootCauses: [],
        affectedAreas: [],
        estimatedImpact: null,
        confidence: 0.8,
      });
    }

    // Quality gaps
    if (current.quality && current.quality.defectRate > 0.05) {
      // Assuming createQualityGap is handled by GapFactoryService
      gaps.push({
        projectId: current.projectId,
        type: 'quality' as any,
        category: 'technical' as any,
        title: 'Quality Issues Detected',
        description: `Defect rate is ${(current.quality.defectRate * 100).toFixed(1)}% above acceptable threshold`,
        currentValue: current.quality.defectRate,
        targetValue: 0.02,
        variance: current.quality.defectRate - 0.02,
        severity: 'medium' as any,
        rootCauses: [],
        affectedAreas: [],
        estimatedImpact: null,
        confidence: 0.8,
      });
    }

    return gaps;
  }

  private extractCurrentValueForGoal(
    current: ProjectState,
    goal: ProjectGoal
  ): any {
    // Extract current value based on goal type and available project state data
    const goalTitle = goal.title.toLowerCase();

    if (goalTitle.includes('progress') || goalTitle.includes('completion')) {
      return current.progress;
    }

    if (goalTitle.includes('quality') || goalTitle.includes('defect')) {
      return current.quality?.defectRate || 0;
    }

    if (goalTitle.includes('resource') || goalTitle.includes('utilization')) {
      return current.resources?.utilization || 0;
    }

    if (goalTitle.includes('timeline') || goalTitle.includes('schedule')) {
      return current.timeline?.progress || 0;
    }

    if (goalTitle.includes('health') || goalTitle.includes('score')) {
      return current.healthScore;
    }

    // Default to progress if no specific match
    return current.progress;
  }

  private extractTargetValue(goal: ProjectGoal): any {
    if (typeof goal.targetValue === 'object' && goal.targetValue !== null) {
      // Handle JSON target values
      return (
        (goal.targetValue as any).value ||
        (goal.targetValue as any).target ||
        1.0
      );
    }
    return goal.targetValue;
  }

  private calculateVariance(current: any, target: any): number {
    if (typeof current === 'number' && typeof target === 'number') {
      if (target === 0) {
        return current === 0 ? 0 : Infinity;
      }
      return (current - target) / target;
    }
    return 0;
  }

  private inferGapType(goal: ProjectGoal): GapType {
    const title = goal.title.toLowerCase();
    if (title.includes('resource') || title.includes('staff'))
      return GapType.RESOURCE;
    if (title.includes('process') || title.includes('workflow'))
      return GapType.PROCESS;
    if (title.includes('communication')) return GapType.COMMUNICATION;
    if (title.includes('technology') || title.includes('tech'))
      return GapType.TECHNOLOGY;
    if (title.includes('timeline') || title.includes('schedule'))
      return GapType.TIMELINE;
    if (title.includes('quality')) return GapType.QUALITY;
    if (title.includes('budget') || title.includes('cost'))
      return GapType.BUDGET;
    if (title.includes('skill') || title.includes('training'))
      return GapType.SKILL;
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

  private identifyRootCauses(
    goal: ProjectGoal,
    _variance: number
  ): import('../../../types/database/gap.types').RootCause[] {
    // Simplified root cause identification
    return [
      {
        id: `rc-${goal.id}-1`,
        gapId: '',
        category: 'process' as any,
        description: `Insufficient planning for ${goal.title}`,
        confidence: 0.7,
        evidence: ['Goal variance analysis'],
        contributionWeight: 0.8,
      },
    ];
  }

  private identifyAffectedAreas(
    goal: ProjectGoal
  ): import('../../../types/database/gap.types').ProjectArea[] {
    return [
      {
        id: `area-${goal.id}-1`,
        name: goal.title,
        description: `Area affected by ${goal.title} gap`,
        criticality: 'medium' as any,
      },
    ];
  }

  private estimateImpact(
    goal: ProjectGoal,
    variance: number
  ): import('../../../types/database/gap.types').Impact {
    return {
      id: `impact-${goal.id}-1`,
      gapId: '',
      type: 'timeline' as any,
      level: Math.abs(variance) > 0.3 ? ('high' as any) : ('medium' as unknown),
      description: `Impact on ${goal.title} achievement`,
      timeframe: 'short-term',
      affectedStakeholders: ['project-manager'],
    };
  }
}