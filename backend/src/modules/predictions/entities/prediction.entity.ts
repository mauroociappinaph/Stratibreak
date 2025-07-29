import { PredictionType } from '../dto/create-prediction.dto';

export class PredictionEntity {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  type: PredictionType;
  probability: number;
  impact: number;
  createdAt: Date;
  updatedAt: Date;
}
