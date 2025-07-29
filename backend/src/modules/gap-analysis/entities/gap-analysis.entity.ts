import { GapType, SeverityLevel } from '../dto/create-gap-analysis.dto';

export class GapAnalysisEntity {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  type: GapType;
  severity: SeverityLevel;
  createdAt: Date;
  updatedAt: Date;
}
