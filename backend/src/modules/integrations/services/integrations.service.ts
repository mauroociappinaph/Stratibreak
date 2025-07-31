import type { ConnectionResponse } from '@/types/api';
import type {
  IIntegrationService,
  RecoveryAction,
  ServiceIntegrationError,
  SyncResult,
  ValidationResult,
} from '@/types/services';
import { Injectable } from '@nestjs/common';
import {
  ConnectionResponseDto,
  CreateIntegrationDto,
  UpdateIntegrationDto,
} from '../dto';
import { IntegrationEntity } from '../entities';
import { ConnectionManagementService } from './connection-management.service';
import { IntegrationCrudService } from './integration-crud.service';
import { IntegrationTestingService } from './integration-testing.service';
import { IntegrationsCoreService } from './integrations-core.service';

@Injectable()
export class IntegrationsService implements IIntegrationService {
  constructor(
    private readonly coreService: IntegrationsCoreService,
    private readonly crudService: IntegrationCrudService,
    private readonly connectionService: ConnectionManagementService,
    private readonly testingService: IntegrationTestingService
  ) {}

  // Delegate core integration functionality to the core service
  async connectToTool(
    toolType: string,
    credentials: Record<string, string>
  ): Promise<ConnectionResponse> {
    return this.coreService.connectToTool(toolType, credentials);
  }

  async syncData(connectionId: string): Promise<SyncResult> {
    return this.coreService.syncData(connectionId);
  }

  async handleIntegrationFailure(
    error: ServiceIntegrationError
  ): Promise<RecoveryAction> {
    return this.coreService.handleIntegrationFailure(error);
  }

  async validateDataConsistency(
    localData: unknown,
    externalData: unknown
  ): Promise<ValidationResult> {
    return this.coreService.validateDataConsistency(localData, externalData);
  }

  // Delegate CRUD operations to specialized service
  async create(
    createIntegrationDto: CreateIntegrationDto
  ): Promise<IntegrationEntity> {
    return this.crudService.create(createIntegrationDto);
  }

  async findAll(projectId?: string): Promise<IntegrationEntity[]> {
    return this.crudService.findAll(projectId);
  }

  async findOne(id: string): Promise<IntegrationEntity> {
    return this.crudService.findOne(id);
  }

  async update(
    id: string,
    updateIntegrationDto: UpdateIntegrationDto
  ): Promise<IntegrationEntity> {
    return this.crudService.update(id, updateIntegrationDto);
  }

  async remove(id: string): Promise<void> {
    return this.crudService.remove(id);
  }

  async testConnection(
    id: string
  ): Promise<{ success: boolean; message: string }> {
    const integration = await this.crudService.findOne(id);

    try {
      return this.testingService.testConnection(
        integration.type,
        integration.config || {}
      );
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async findByTypeAndProject(
    type: string,
    projectId: string
  ): Promise<IntegrationEntity[]> {
    return this.crudService.findByTypeAndProject(type, projectId);
  }

  // Delegate connection management to specialized service
  async getAllConnections(filters: {
    status?: string;
    toolType?: string;
    projectId?: string;
  }): Promise<ConnectionResponseDto[]> {
    return this.connectionService.getAllConnections(filters);
  }

  async getConnection(connectionId: string): Promise<ConnectionResponseDto> {
    return this.connectionService.getConnection(connectionId);
  }

  async updateConnectionStatus(
    connectionId: string,
    status: string,
    reason?: string
  ): Promise<ConnectionResponseDto> {
    return this.connectionService.updateConnectionStatus(
      connectionId,
      status,
      reason
    );
  }

  async disconnectTool(connectionId: string): Promise<void> {
    return this.connectionService.disconnectTool(connectionId);
  }

  async reconnectTool(connectionId: string): Promise<ConnectionResponseDto> {
    return this.connectionService.reconnectTool(connectionId);
  }

  async getConnectionHealth(connectionId: string): Promise<{
    connectionId: string;
    status: string;
    lastChecked: Date;
    responseTime: number;
    message: string;
    details?: Record<string, unknown>;
  }> {
    return this.connectionService.getConnectionHealth(connectionId);
  }

  async updateConnectionConfiguration(
    connectionId: string,
    configUpdate: {
      syncFrequency?: number;
      dataMapping?: unknown[];
      filters?: Record<string, unknown>;
    }
  ): Promise<ConnectionResponseDto> {
    return this.connectionService.updateConnectionConfiguration(
      connectionId,
      configUpdate
    );
  }

  async getSyncHistory(
    connectionId: string,
    options: { limit: number; offset: number }
  ): Promise<{
    connectionId: string;
    history: Array<{
      syncId: string;
      startedAt: Date;
      completedAt: Date;
      status: string;
      recordsProcessed: number;
      recordsCreated: number;
      recordsUpdated: number;
      recordsSkipped: number;
      errors: Array<{ message: string; recordId?: string }>;
    }>;
    totalCount: number;
  }> {
    return this.connectionService.getSyncHistory(connectionId, options);
  }
}
