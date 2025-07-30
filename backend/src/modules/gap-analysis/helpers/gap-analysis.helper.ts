import {
  CriticalityLevel,
  GapCategory,
  GapType,
  Impact,
  ImpactLevel,
  ImpactType,
  ProjectArea,
  RootCause,
  RootCauseCategory,
  SeverityLevel,
} from '../../../types/database/gap.types';
import type {
  ProjectGoal,
  ProjectState,
} from '../../../types/database/project.types';
import type { Gap } from '../../../types/services/gap-analysis.types';

export class GapAnalysisHelper {
  /**
   * Extracts current value for a specific goal from project state
   */
  static extractCurrentValueForGoal(
    current: ProjectState,
    goal: ProjectGoal
  ): number {
    const goalTitle = goal.title.toLowerCase();

    const valueMap = {
      progress: () => current.progress,
      quality: () => current.quality?.defectRate || 0,
      resource: () => current.resources?.utilization || 0,
      timeline: () => current.timeline?.progress || 0,
      health: () => current.healthScore,
    };

    const matchedKey = Object.keys(valueMap).find(key =>
      goalTitle.includes(key)
    );
    return matchedKey
      ? valueMap[matchedKey as keyof typeof valueMap]()
      : current.progress;
  }

  /**
   * Extracts target value from goal definition
   */
  static extractTargetValue(goal: ProjectGoal): number {
    if (typeof goal.targetValue === 'object' && goal.targetValue !== null) {
      const targetObj = goal.targetValue as Record<string, unknown>;
      return (targetObj.value as number) || (targetObj.target as number) || 1.0;
    }
    return typeof goal.targetValue === 'number'
      ? goal.targetValue
      : parseFloat(String(goal.targetValue)) || 1.0;
  }

  /**
   * Calculates variance between current and target values
   */
  static calculateVariance(current: number, target: number): number {
    if (target === 0) {
      return current === 0 ? 0 : 1; // Avoid infinity
    }
    return (current - target) / target;
  }

  /**
   * Infers gap type from goal characteristics
   */
  static inferGapType(goal: ProjectGoal): GapType {
    const title = goal.title.toLowerCase();
    const typeMap: Record<string, GapType> = {
      resource: GapType.RESOURCE,
      process: GapType.PROCESS,
      communication: GapType.COMMUNICATION,
      technology: GapType.TECHNOLOGY,
      timeline: GapType.TIMELINE,
      quality: GapType.QUALITY,
      budget: GapType.BUDGET,
      skill: GapType.SKILL,
    };

    for (const [key, gapType] of Object.entries(typeMap)) {
      if (title.includes(key)) {
        return gapType;
      }
    }
    return GapType.PROCESS;
  }

  /**
   * Infers gap category from gap type
   */
  static inferGapCategory(goal: ProjectGoal): GapCategory {
    const type = this.inferGapType(goal);
    const categoryMap: Record<GapType, GapCategory> = {
      [GapType.RESOURCE]: GapCategory.OPERATIONAL,
      [GapType.TIMELINE]: GapCategory.OPERATIONAL,
      [GapType.QUALITY]: GapCategory.OPERATIONAL,
      [GapType.TECHNOLOGY]: GapCategory.TECHNICAL,
      [GapType.COMMUNICATION]: GapCategory.ORGANIZATIONAL,
      [GapType.CULTURE]: GapCategory.ORGANIZATIONAL,
      [GapType.PROCESS]: GapCategory.TACTICAL,
      [GapType.BUDGET]: GapCategory.TACTICAL,
      [GapType.SKILL]: GapCategory.TACTICAL,
    };

    return categoryMap[type] || GapCategory.TACTICAL;
  }

  /**
   * Identifies root causes for a gap
   */
  static identifyRootCauses(goal: ProjectGoal): RootCause[] {
    return [
      {
        id: `rc-${goal.id}-1`,
        gapId: '',
        category: RootCauseCategory.PROCESS,
        description: `Insufficient planning for ${goal.title}`,
        confidence: 0.7,
        evidence: ['Goal variance analysis'],
        contributionWeight: 0.8,
      },
    ];
  }

  /**
   * Identifies affected project areas
   */
  static identifyAffectedAreas(goal: ProjectGoal): ProjectArea[] {
    return [
      {
        id: `area-${goal.id}-1`,
        name: goal.title,
        description: `Area affected by ${goal.title} gap`,
        criticality: CriticalityLevel.MEDIUM,
      },
    ];
  }

  /**
   * Estimates impact of a gap
   */
  static estimateImpact(goal: ProjectGoal, variance: number): Impact {
    return {
      id: `impact-${goal.id}-1`,
      gapId: '',
      type: ImpactType.TIMELINE,
      level: Math.abs(variance) > 0.3 ? ImpactLevel.HIGH : ImpactLevel.MEDIUM,
      description: `Impact on ${goal.title} achievement`,
      timeframe: 'short-term',
      affectedStakeholders: ['project-manager'],
    };
  }

  /**
   * Generates recommendation description based on gap type
   */
  static generateRecommendationDescription(gap: Gap): string {
    switch (gap.type) {
      case GapType.RESOURCE:
        return `Allocate additional resources or optimize current resource utilization for ${gap.title}`;
      case GapType.TIMELINE:
        return `Implement timeline recovery strategies and improve scheduling for ${gap.title}`;
      case GapType.QUALITY:
        return `Enhance quality assurance processes and implement additional testing for ${gap.title}`;
      case GapType.COMMUNICATION:
        return `Improve communication channels and establish regular check-ins for ${gap.title}`;
      default:
        return `Implement corrective measures to address ${gap.title}`;
    }
  }

  /**
   * Maps severity level to priority
   */
  static mapSeverityToPriority(
    severity: SeverityLevel
  ): 'low' | 'medium' | 'high' | 'urgent' {
    switch (severity) {
      case SeverityLevel.CRITICAL:
        return 'urgent';
      case SeverityLevel.HIGH:
        return 'high';
      case SeverityLevel.MEDIUM:
        return 'medium';
      case SeverityLevel.LOW:
        return 'low';
      default:
        return 'medium';
    }
  }

  /**
   * Estimates effort required to address a gap
   */
  static estimateEffort(gap: Gap): number {
    const baseEffort = {
      [SeverityLevel.CRITICAL]: 40,
      [SeverityLevel.HIGH]: 24,
      [SeverityLevel.MEDIUM]: 16,
      [SeverityLevel.LOW]: 8,
    };

    const complexityMultiplier = gap.rootCauses.length > 2 ? 1.5 : 1.0;
    return baseEffort[gap.severity] * complexityMultiplier;
  }

  /**
   * Identifies required resources for addressing a gap
   */
  static identifyRequiredResources(gap: Gap): string[] {
    const resources = ['Project Manager'];

    switch (gap.type) {
      case GapType.RESOURCE:
        resources.push('HR Manager', 'Additional Team Members');
        break;
      case GapType.TECHNOLOGY:
        resources.push('Technical Lead', 'DevOps Engineer');
        break;
      case GapType.QUALITY:
        resources.push('QA Lead', 'Testing Resources');
        break;
      case GapType.COMMUNICATION:
        resources.push('Communication Specialist', 'Stakeholder Manager');
        break;
      default:
        resources.push('Subject Matter Expert');
    }

    return resources;
  }

  /**
   * Estimates timeline for addressing a gap
   */
  static estimateTimeline(gap: Gap): string {
    switch (gap.severity) {
      case SeverityLevel.CRITICAL:
        return '1-2 weeks';
      case SeverityLevel.HIGH:
        return '2-4 weeks';
      case SeverityLevel.MEDIUM:
        return '1-2 months';
      case SeverityLevel.LOW:
        return '2-3 months';
      default:
        return '1 month';
    }
  }
}
