import { Injectable } from '@nestjs/common';
import { Gap } from '@prisma/client';

import type { ProjectState } from '../../../types/database/project.types';

@Injectable()
export class GapFactoryService {
  createTimelineGap(current: ProjectState): Gap {
    return {
      projectId: current.projectId,
      type: 'timeline' as any,
      category: 'operational' as any,
      title: 'Timeline Delay Detected',
      description: `Project is delayed by ${current.timeline.delays} days`,
      currentValue: current.timeline.delays,
      targetValue: 0,

      severity:
        current.timeline.delays > 7 ? ('high' as any) : ('medium' as any),
      rootCauses: [
        {
          id: 'timeline-rc-1',
          gapId: '',
          category: 'process' as any,
          description: 'Inefficient task scheduling and resource allocation',
          confidence: 0.7,
          evidence: ['Historical delay patterns', 'Resource utilization data'],
          contributionWeight: 0.8,
        },
      ],
      affectedAreas: [
        {
          id: 'timeline-area-1',
          name: 'Project Delivery',
          description: 'Overall project timeline and delivery schedule',
          criticality: 'high' as any,
        },
      ],
      estimatedImpact: {
        id: 'timeline-impact-1',
        gapId: '',
        type: 'timeline' as any,
        level:
          current.timeline.delays > 14 ? ('high' as any) : ('medium' as any),
        description:
          'Delayed project delivery affecting stakeholder expectations',
        timeframe: 'immediate',
        affectedStakeholders: ['project-manager', 'client', 'team'],
      },
      confidence: 0.9,
    };
  }

  createResourceGap(current: ProjectState): Gap {
    return {
      projectId: current.projectId,
      type: 'resource' as any,
      category: 'operational' as any,
      title: 'Resource Over-utilization',
      description: `Resources are over-utilized at ${(current.resources.utilization * 100).toFixed(1)}%`,
      currentValue: current.resources.utilization,
      targetValue: 0.8,

      severity:
        current.resources.utilization > 0.95
          ? ('critical' as any)
          : ('high' as any),
      rootCauses: [
        {
          id: 'resource-rc-1',
          gapId: '',
          category: 'management' as any,
          description: 'Insufficient resource planning and allocation',
          confidence: 0.8,
          evidence: ['Resource utilization metrics', 'Team workload data'],
          contributionWeight: 0.9,
        },
      ],
      affectedAreas: [
        {
          id: 'resource-area-1',
          name: 'Team Productivity',
          description: 'Team performance and sustainability',
          criticality: 'high' as any,
        },
      ],
      estimatedImpact: {
        id: 'resource-impact-1',
        gapId: '',
        type: 'team_morale' as any,
        level: 'high' as any,
        description: 'Team burnout risk and decreased productivity',
        timeframe: 'short-term',
        affectedStakeholders: ['team-members', 'project-manager'],
      },
      confidence: 0.85,
    };
  }

  createQualityGap(current: ProjectState): Gap {
    return {
      projectId: current.projectId,
      type: 'quality' as any,
      category: 'technical' as any,
      title: 'Quality Issues Detected',
      description: `Defect rate is ${(current.quality.defectRate * 100).toFixed(1)}% above acceptable threshold`,
      currentValue: current.quality.defectRate,
      targetValue: 0.02,
      variance: current.quality.defectRate - 0.02,
      severity:
        current.quality.defectRate > 0.1
          ? ('critical' as any)
          : ('high' as any),
      rootCauses: [
        {
          id: 'quality-rc-1',
          gapId: '',
          category: 'process' as any,
          description: 'Inadequate quality assurance processes',
          confidence: 0.75,
          evidence: ['Defect tracking data', 'Code review metrics'],
          contributionWeight: 0.7,
        },
      ],
      affectedAreas: [
        {
          id: 'quality-area-1',
          name: 'Product Quality',
          description: 'Overall product quality and reliability',
          criticality: 'critical' as any,
        },
      ],
      estimatedImpact: {
        id: 'quality-impact-1',
        gapId: '',
        type: 'customer_satisfaction' as any,
        level: 'high' as any,
        description: 'Potential customer dissatisfaction and reputation damage',
        timeframe: 'medium-term',
        affectedStakeholders: ['customers', 'product-owner', 'qa-team'],
      },
      confidence: 0.8,
    };
  }
}
