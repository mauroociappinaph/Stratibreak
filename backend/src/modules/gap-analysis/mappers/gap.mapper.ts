import { Injectable } from '@nestjs/common';
import { Gap } from '@prisma/client';
import { GapAnalysisEntity } from '../entities';

@Injectable()
export class GapMapper {
  public prismaToEntity(gap: Gap): GapAnalysisEntity {
    return {
      id: gap.id,
      projectId: gap.projectId,
      title: gap.title,
      description: gap.description,
      type: gap.type as any, // To be fixed later
      severity: gap.severity as any, // To be fixed later
      createdAt: gap.createdAt,
      updatedAt: gap.updatedAt,
    };
  }
}
