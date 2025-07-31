import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  ConnectionResponseDto,
  ConnectToolDto,
  CreateIntegrationDto,
  SyncResultDto,
  TestConnectionResponseDto,
  UpdateIntegrationDto,
} from '../dto';
import { IntegrationEntity } from '../entities';
import { IntegrationsService } from '../services/integrations.service';
import { SwaggerDocs } from './integrations.swagger';

@ApiTags('integrations')
@Controller('integrations')
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @SwaggerDocs.create.operation
  @SwaggerDocs.create.body
  @SwaggerDocs.create.responses.success
  @SwaggerDocs.create.responses.badRequest
  @SwaggerDocs.create.responses.serverError
  async create(
    @Body() createIntegrationDto: CreateIntegrationDto
  ): Promise<IntegrationEntity> {
    return this.integrationsService.create(createIntegrationDto);
  }

  @Get()
  @SwaggerDocs.findAll.operation
  @SwaggerDocs.findAll.query
  @SwaggerDocs.findAll.responses.success
  @SwaggerDocs.findAll.responses.serverError
  async findAll(
    @Query('projectId') projectId?: string
  ): Promise<IntegrationEntity[]> {
    return this.integrationsService.findAll(projectId);
  }

  @Get(':id')
  @SwaggerDocs.findOne.operation
  @SwaggerDocs.findOne.param
  @SwaggerDocs.findOne.responses.success
  @SwaggerDocs.findOne.responses.notFound
  @SwaggerDocs.findOne.responses.serverError
  async findOne(@Param('id') id: string): Promise<IntegrationEntity> {
    return this.integrationsService.findOne(id);
  }

  @Patch(':id')
  @SwaggerDocs.update.operation
  @SwaggerDocs.update.param
  @SwaggerDocs.update.body
  @SwaggerDocs.update.responses.success
  @SwaggerDocs.update.responses.badRequest
  @SwaggerDocs.update.responses.notFound
  @SwaggerDocs.update.responses.serverError
  async update(
    @Param('id') id: string,
    @Body() updateIntegrationDto: UpdateIntegrationDto
  ): Promise<IntegrationEntity> {
    return this.integrationsService.update(id, updateIntegrationDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @SwaggerDocs.remove.operation
  @SwaggerDocs.remove.param
  @SwaggerDocs.remove.responses.success
  @SwaggerDocs.remove.responses.notFound
  @SwaggerDocs.remove.responses.serverError
  async remove(@Param('id') id: string): Promise<void> {
    return this.integrationsService.remove(id);
  }

  @Post(':id/test')
  @HttpCode(HttpStatus.OK)
  @SwaggerDocs.testConnection.operation
  @SwaggerDocs.testConnection.param
  @SwaggerDocs.testConnection.responses.success
  @SwaggerDocs.testConnection.responses.notFound
  @SwaggerDocs.testConnection.responses.serverError
  async testConnection(
    @Param('id') id: string
  ): Promise<TestConnectionResponseDto> {
    return this.integrationsService.testConnection(id);
  }

  @Post('connect')
  @HttpCode(HttpStatus.CREATED)
  @SwaggerDocs.connectTool.operation
  @SwaggerDocs.connectTool.body
  @SwaggerDocs.connectTool.responses.success
  @SwaggerDocs.connectTool.responses.badRequest
  @SwaggerDocs.connectTool.responses.serverError
  async connectTool(
    @Body() connectToolDto: ConnectToolDto
  ): Promise<ConnectionResponseDto> {
    const result = await this.integrationsService.connectToTool(
      connectToolDto.toolType,
      connectToolDto.credentials
    );

    // Map the service response to DTO
    return {
      connectionId: result.connectionId,
      status: result.status,
      toolType: result.toolType,
      name: result.name,
      lastSync: result.lastSync || new Date(),
      nextSync: result.nextSync || new Date(),
      syncStatus: result.syncStatus,
      recordsCount: result.recordsCount,
      configuration: {
        syncFrequency: result.configuration.syncFrequency,
        dataMapping: result.configuration.dataMapping,
        filters: result.configuration.filters as Record<string, unknown>,
      },
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  @Post(':connectionId/sync')
  @HttpCode(HttpStatus.OK)
  @SwaggerDocs.syncData.operation
  @SwaggerDocs.syncData.param
  @SwaggerDocs.syncData.responses.success
  @SwaggerDocs.syncData.responses.notFound
  @SwaggerDocs.syncData.responses.serverError
  async syncData(
    @Param('connectionId') connectionId: string
  ): Promise<SyncResultDto> {
    return this.integrationsService.syncData(connectionId);
  }

  @Get('type/:type/project/:projectId')
  @SwaggerDocs.findByTypeAndProject.operation
  @SwaggerDocs.findByTypeAndProject.param.type
  @SwaggerDocs.findByTypeAndProject.param.projectId
  @SwaggerDocs.findByTypeAndProject.responses.success
  @SwaggerDocs.findByTypeAndProject.responses.badRequest
  @SwaggerDocs.findByTypeAndProject.responses.serverError
  async findByTypeAndProject(
    @Param('type') type: string,
    @Param('projectId') projectId: string
  ): Promise<IntegrationEntity[]> {
    return this.integrationsService.findByTypeAndProject(type, projectId);
  }

  // Connection Management Endpoints

  @Get('connections')
  @SwaggerDocs.getAllConnections.operation
  @SwaggerDocs.getAllConnections.responses.success
  @SwaggerDocs.getAllConnections.responses.serverError
  async getAllConnections(
    @Query('status') status?: string,
    @Query('toolType') toolType?: string,
    @Query('projectId') projectId?: string
  ): Promise<ConnectionResponseDto[]> {
    const filters: { status?: string; toolType?: string; projectId?: string } =
      {};
    if (status) filters.status = status;
    if (toolType) filters.toolType = toolType;
    if (projectId) filters.projectId = projectId;

    return this.integrationsService.getAllConnections(filters);
  }

  @Get('connections/:connectionId')
  @SwaggerDocs.getConnection.operation
  @SwaggerDocs.getConnection.param
  @SwaggerDocs.getConnection.responses.success
  @SwaggerDocs.getConnection.responses.notFound
  @SwaggerDocs.getConnection.responses.serverError
  async getConnection(
    @Param('connectionId') connectionId: string
  ): Promise<ConnectionResponseDto> {
    return this.integrationsService.getConnection(connectionId);
  }

  @Put('connections/:connectionId/status')
  @HttpCode(HttpStatus.OK)
  @SwaggerDocs.updateConnectionStatus.operation
  @SwaggerDocs.updateConnectionStatus.param
  @SwaggerDocs.updateConnectionStatus.body
  @SwaggerDocs.updateConnectionStatus.responses.success
  @SwaggerDocs.updateConnectionStatus.responses.notFound
  @SwaggerDocs.updateConnectionStatus.responses.serverError
  async updateConnectionStatus(
    @Param('connectionId') connectionId: string,
    @Body() statusUpdate: { status: string; reason?: string }
  ): Promise<ConnectionResponseDto> {
    return this.integrationsService.updateConnectionStatus(
      connectionId,
      statusUpdate.status,
      statusUpdate.reason
    );
  }

  @Delete('connections/:connectionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @SwaggerDocs.disconnectTool.operation
  @SwaggerDocs.disconnectTool.param
  @SwaggerDocs.disconnectTool.responses.success
  @SwaggerDocs.disconnectTool.responses.notFound
  @SwaggerDocs.disconnectTool.responses.serverError
  async disconnectTool(
    @Param('connectionId') connectionId: string
  ): Promise<void> {
    return this.integrationsService.disconnectTool(connectionId);
  }

  @Post('connections/:connectionId/reconnect')
  @HttpCode(HttpStatus.OK)
  @SwaggerDocs.reconnectTool.operation
  @SwaggerDocs.reconnectTool.param
  @SwaggerDocs.reconnectTool.responses.success
  @SwaggerDocs.reconnectTool.responses.notFound
  @SwaggerDocs.reconnectTool.responses.serverError
  async reconnectTool(
    @Param('connectionId') connectionId: string
  ): Promise<ConnectionResponseDto> {
    return this.integrationsService.reconnectTool(connectionId);
  }

  @Get('connections/:connectionId/health')
  @SwaggerDocs.getConnectionHealth.operation
  @SwaggerDocs.getConnectionHealth.param
  @SwaggerDocs.getConnectionHealth.responses.success
  @SwaggerDocs.getConnectionHealth.responses.notFound
  @SwaggerDocs.getConnectionHealth.responses.serverError
  async getConnectionHealth(
    @Param('connectionId') connectionId: string
  ): Promise<{
    connectionId: string;
    status: string;
    lastChecked: Date;
    responseTime: number;
    message: string;
    details?: Record<string, unknown>;
  }> {
    return this.integrationsService.getConnectionHealth(connectionId);
  }

  @Put('connections/:connectionId/configuration')
  @HttpCode(HttpStatus.OK)
  @SwaggerDocs.updateConnectionConfig.operation
  @SwaggerDocs.updateConnectionConfig.param
  @SwaggerDocs.updateConnectionConfig.body
  @SwaggerDocs.updateConnectionConfig.responses.success
  @SwaggerDocs.updateConnectionConfig.responses.notFound
  @SwaggerDocs.updateConnectionConfig.responses.serverError
  async updateConnectionConfiguration(
    @Param('connectionId') connectionId: string,
    @Body()
    configUpdate: {
      syncFrequency?: number;
      dataMapping?: unknown[];
      filters?: Record<string, unknown>;
    }
  ): Promise<ConnectionResponseDto> {
    return this.integrationsService.updateConnectionConfiguration(
      connectionId,
      configUpdate
    );
  }

  @Get('connections/:connectionId/sync-history')
  @SwaggerDocs.getSyncHistory.operation
  @SwaggerDocs.getSyncHistory.param
  @SwaggerDocs.getSyncHistory.responses.success
  @SwaggerDocs.getSyncHistory.responses.notFound
  @SwaggerDocs.getSyncHistory.responses.serverError
  async getSyncHistory(
    @Param('connectionId') connectionId: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number
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
    return this.integrationsService.getSyncHistory(connectionId, {
      limit: limit || 10,
      offset: offset || 0,
    });
  }
}
