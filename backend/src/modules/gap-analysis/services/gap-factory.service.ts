import { Injectable } from '@nestjs/common';
import {
  GapCategory,
  GapStatus,
  GapType,
  SeverityLevel,
} from '../../../types/database/gap.types';
import type { ProjectState } from '../../../types/database/project.types';

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
  targetValue?: number | string;
  impact?: string;
  confidence?: number;
  userId: string;
  identifiedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable()
export class GapFactoryService {
  createTimelineGap(current: ProjectState): GapData {
    return {
      projectId: current.projectId,
      type: GapType.TIMELINE,
      category: GapCategory.OPERATIONAL,
      title: 'Timeline Delay Detected',
      description: `Project is delayed by ${current.timeline.delays} days`,
      currentValue: current.timeline.delays,
      targetValue: 0,
      severity:
        current.timeline.delays > 7 ? SeverityLevel.HIGH : SeverityLevel.MEDIUM,
      status: GapStatus.OPEN,
      impact: 'Delayed project delivery affecting stakeholder expectations',
      confidence: 0.9,
      userId: 'system',
    };
  }

  createResourceGap(current: ProjectState): GapData {
    return {
      projectId: current.projectId,
      type: GapType.RESOURCE,
      category: GapCategory.OPERATIONAL,
      title: 'Resource Over-utilization',
      description: `Resources are over-utilized at ${(current.resources.utilization * 100).toFixed(1)}%`,
      currentValue: current.resources.utilization,
      targetValue: 0.8,
      severity:
        current.resources.utilization > 0.95
          ? SeverityLevel.CRITICAL
          : SeverityLevel.HIGH,
      status: GapStatus.OPEN,
      impact: 'Team burnout risk and decreased productivity',
      confidence: 0.85,
      userId: 'system',
    };
  }

  createQualityGap(current: ProjectState): GapData {
    return {
      projectId: current.projectId,
      type: GapType.QUALITY,
      category: GapCategory.TECHNICAL,
      title: 'Quality Issues Detected',
      description: `Defect rate is ${(current.quality.defectRate * 100).toFixed(1)}% above acceptable threshold`,
      currentValue: current.quality.defectRate,
      targetValue: 0.02,
      severity:
        current.quality.defectRate > 0.1
          ? SeverityLevel.CRITICAL
          : SeverityLevel.HIGH,
      status: GapStatus.OPEN,
      impact: 'Potential customer dissatisfaction and reputation damage',
      confidence: 0.8,
      userId: 'system',
    };
  }
}
