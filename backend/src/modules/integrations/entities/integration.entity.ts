import { IntegrationType } from '../dto/create-integration.dto';

export class IntegrationEntity {
  id: string;
  name: string;
  type: IntegrationType;
  projectId: string;
  description?: string;
  config?: Record<string, unknown>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
