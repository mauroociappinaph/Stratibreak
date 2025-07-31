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
}
