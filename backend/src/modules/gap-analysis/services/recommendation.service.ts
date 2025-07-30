import { Injectable } from '@nestjs/common';
import { Gap, SeverityLevel } from '@prisma/client';
import { Recommendation } from '../../../types/services/gap-analysis.types';

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
      estimatedImpact: gap.confidence,
      requiredResources: this.identifyRequiredResources(gap),
      timeline: this.estimateTimeline(gap),
      dependencies: [],
    }));
  }

  private generateRecommendationDescription(gap: Gap): string {
    switch (gap.type) {
      case 'resource':
        return `Allocate additional resources or optimize current resource utilization for ${gap.title}`;
      case 'timeline':
        return `Implement timeline recovery strategies and improve scheduling for ${gap.title}`;
      case 'quality':
        return `Enhance quality assurance processes and implement additional testing for ${gap.title}`;
      case 'communication':
        return `Improve communication channels and establish regular check-ins for ${gap.title}`;
      default:
        return `Implement corrective measures to address ${gap.title}`;
    }
  }

  private mapSeverityToPriority(
    severity: SeverityLevel
  ): 'low' | 'medium' | 'high' | 'urgent' {
    switch (severity) {
      case 'critical':
        return 'urgent';
      case 'high':
        return 'high';
      case 'medium':
        return 'medium';
      case 'low':
        return 'low';
      default:
        return 'medium';
    }
  }

  private estimateEffort(gap: Gap): number {
    const baseEffort = {
      critical: 40,
      high: 24,
      medium: 16,
      low: 8,
    };

    const complexityMultiplier = gap.rootCauses.length > 2 ? 1.5 : 1.0;
    return baseEffort[gap.severity] * complexityMultiplier;
  }

  private identifyRequiredResources(gap: Gap): string[] {
    const resources = ['Project Manager'];

    switch (gap.type) {
      case 'resource':
        resources.push('HR Manager', 'Additional Team Members');
        break;
      case 'technology':
        resources.push('Technical Lead', 'DevOps Engineer');
        break;
      case 'quality':
        resources.push('QA Lead', 'Testing Resources');
        break;
      case 'communication':
        resources.push('Communication Specialist', 'Stakeholder Manager');
        break;
      default:
        resources.push('Subject Matter Expert');
    }

    return resources;
  }

  private estimateTimeline(gap: Gap): string {
    switch (gap.severity) {
      case 'critical':
        return '1-2 weeks';
      case 'high':
        return '2-4 weeks';
      case 'medium':
        return '1-2 months';
      case 'low':
        return '2-3 months';
      default:
        return '1 month';
    }
  }
}
