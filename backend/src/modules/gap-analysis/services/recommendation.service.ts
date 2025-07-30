import { Injectable } from '@nestjs/common';
import { GapType, Severity } from '@prisma/client';
import {
  Gap,
  Recommendation,
} from '../../../types/services/gap-analysis.types';

@Injectable()
export class RecommendationService {
  generateRecommendations(gaps: Gap[]): Recommendation[] {
    return gaps.map((gap, index) => ({
      id: `rec-${index + 1}`,
      gapId: gap.id || `gap-${index + 1}`,
      title: `Address ${gap.title}`,
      description: this.generateRecommendationDescription(gap),
      priority: this.mapSeverityToPriority(gap.severity),
      estimatedEffort: this.estimateEffort(gap),
      estimatedImpact: gap.confidence ?? 0.8,
      requiredResources: this.identifyRequiredResources(gap),
      timeline: this.estimateTimeline(gap),
      dependencies: [],
    }));
  }

  private generateRecommendationDescription(gap: Gap): string {
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

  private mapSeverityToPriority(
    severity: Severity
  ): 'low' | 'medium' | 'high' | 'urgent' {
    switch (severity) {
      case Severity.CRITICAL:
        return 'urgent';
      case Severity.HIGH:
        return 'high';
      case Severity.MEDIUM:
        return 'medium';
      case Severity.LOW:
        return 'low';
      default:
        return 'medium';
    }
  }

  private estimateEffort(gap: Gap): number {
    const baseEffort: Record<Severity, number> = {
      [Severity.CRITICAL]: 40,
      [Severity.HIGH]: 24,
      [Severity.MEDIUM]: 16,
      [Severity.LOW]: 8,
    };

    // Simple complexity multiplier since we don't have rootCauses in the basic Gap model
    const complexityMultiplier =
      gap.description && gap.description.length > 100 ? 1.5 : 1.0;
    return baseEffort[gap.severity] * complexityMultiplier;
  }

  private identifyRequiredResources(gap: Gap): string[] {
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

  private estimateTimeline(gap: Gap): string {
    switch (gap.severity) {
      case Severity.CRITICAL:
        return '1-2 weeks';
      case Severity.HIGH:
        return '2-4 weeks';
      case Severity.MEDIUM:
        return '1-2 months';
      case Severity.LOW:
        return '2-3 months';
      default:
        return '1 month';
    }
  }
}
