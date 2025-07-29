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
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateIntegrationDto, UpdateIntegrationDto } from '../dto';
import { IntegrationEntity } from '../entities';
import { IntegrationsService } from '../services/integrations.service';

@ApiTags('integrations')
@Controller('integrations')
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new integration' })
  @ApiResponse({
    status: 201,
    description: 'Integration created successfully',
    type: IntegrationEntity,
  })
  async create(
    @Body() createIntegrationDto: CreateIntegrationDto
  ): Promise<IntegrationEntity> {
    return this.integrationsService.create(createIntegrationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all integrations' })
  @ApiResponse({
    status: 200,
    description: 'List of integrations',
    type: [IntegrationEntity],
  })
  @ApiQuery({ name: 'projectId', required: false, type: String })
  async findAll(
    @Query('projectId') projectId?: string
  ): Promise<IntegrationEntity[]> {
    return this.integrationsService.findAll(projectId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get integration by ID' })
  @ApiResponse({
    status: 200,
    description: 'Integration found',
    type: IntegrationEntity,
  })
  async findOne(@Param('id') id: string): Promise<IntegrationEntity> {
    return this.integrationsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update integration' })
  @ApiResponse({
    status: 200,
    description: 'Integration updated successfully',
    type: IntegrationEntity,
  })
  async update(
    @Param('id') id: string,
    @Body() updateIntegrationDto: UpdateIntegrationDto
  ): Promise<IntegrationEntity> {
    return this.integrationsService.update(id, updateIntegrationDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete integration' })
  @ApiResponse({
    status: 204,
    description: 'Integration deleted successfully',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.integrationsService.remove(id);
  }

  @Post(':id/test')
  @ApiOperation({ summary: 'Test integration connection' })
  @ApiResponse({
    status: 200,
    description: 'Integration test result',
  })
  async testConnection(
    @Param('id') id: string
  ): Promise<{ success: boolean; message: string }> {
    return this.integrationsService.testConnection(id);
  }
}
