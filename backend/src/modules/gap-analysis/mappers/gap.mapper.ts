import { Injectable } from '@nestjs/common';
import { Gap } from '@prisma/client';
import {
  GapStatus,
  GapType,
  SeverityLevel,
} from '../dto/create-gap-analysis.dto';
import { GapAnalysisEntity } from '../entities';

@Injectable()
export class GapMapper {
  public prismaToEntity(gap: Gap): GapAnalysisEntity {
    return {
      id: gap.id,
      projectId: gap.projectId,
      title: gap.title,
      description: gap.description,
      type: gap.type as GapType,
      severity: gap.severity as SeverityLevel,
      status: gap.status as GapStatus,
      userId: gap.userId,
      identifiedAt: gap.identifiedAt,
      createdAt: gap.createdAt,
      updatedAt: gap.updatedAt,
    };
  }
}
