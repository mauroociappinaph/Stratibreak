import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  AutomatedGapAnalysisResultDto,
  CreateGapAnalysisDto,
  GapAnalysisResultDto,
  UpdateGapAnalysisDto,
} from '../dto';
import { GapAnalysisEntity } from '../entities';
import { ResultMapperHelper } from '../helpers/result-mapper.helper';
import { GapMapper } from '../mappers/gap.mapper';
import { GapRepository } from '../repositories/gap.repository';
import { GapAnalysisService } from '../services/gap-analysis.service';
import { ProjectDataService } from '../services/project-data.service';
import { SwaggerDocs } from './gap-analysis.swagger';

@ApiTags('Gap Analysis')
@Controller('gap-analysis')
export class GapAnalysisController {
  constructor(
    private readonly gapAnalysisService: GapAnalysisService,
    private readonly gapRepository: GapRepository,
    private readonly gapMapper: GapMapper,
    private readonly projectDataService: ProjectDataService
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @SwaggerDocs.create.operation
  @SwaggerDocs.create.body
  @SwaggerDocs.create.responses.success
  @SwaggerDocs.create.responses.badRequest
  @SwaggerDocs.create.responses.serverError
  async create(
    @Body() createGapAnalysisDto: CreateGapAnalysisDto
  ): Promise<GapAnalysisEntity> {
    const gap = await this.gapRepository.create(createGapAnalysisDto);
    return this.gapMapper.prismaToEntity(gap);
  }

  @Get()
  @SwaggerDocs.findAll.operation
  @SwaggerDocs.findAll.responses.success
  @SwaggerDocs.findAll.responses.serverError
  async findAll(): Promise<GapAnalysisEntity[]> {
    const gaps = await this.gapRepository.findAll();
    return gaps.map(gap => this.gapMapper.prismaToEntity(gap));
  }

  @Get(':id')
  @SwaggerDocs.findOne.operation
  @SwaggerDocs.findOne.param
  @SwaggerDocs.findOne.responses.success
  @SwaggerDocs.findOne.responses.notFound
  @SwaggerDocs.findOne.responses.serverError
  async findOne(@Param('id') id: string): Promise<GapAnalysisEntity> {
    const gap = await this.gapRepository.findOne(id);
    if (!gap) {
      throw new NotFoundException(`Gap analysis with ID ${id} not found`);
    }
    return this.gapMapper.prismaToEntity(gap);
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
    @Body() updateGapAnalysisDto: UpdateGapAnalysisDto
  ): Promise<GapAnalysisEntity> {
    const gap = await this.gapRepository.update(id, updateGapAnalysisDto);
    return this.gapMapper.prismaToEntity(gap);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @SwaggerDocs.remove.operation
  @SwaggerDocs.remove.param
  @SwaggerDocs.remove.responses.success
  @SwaggerDocs.remove.responses.notFound
  @SwaggerDocs.remove.responses.serverError
  async remove(@Param('id') id: string): Promise<void> {
    return this.gapRepository.remove(id);
  }

  @Post(':projectId/analyze')
  @HttpCode(HttpStatus.CREATED)
  @SwaggerDocs.performAnalysis.operation
  @SwaggerDocs.performAnalysis.param
  @SwaggerDocs.performAnalysis.responses.success
  @SwaggerDocs.performAnalysis.responses.badRequest
  @SwaggerDocs.performAnalysis.responses.notFound
  @SwaggerDocs.performAnalysis.responses.serverError
  async performAnalysis(
    @Param('projectId') projectId: string
  ): Promise<AutomatedGapAnalysisResultDto> {
    const projectData =
      await this.projectDataService.fetchProjectData(projectId);
    const result = await this.gapAnalysisService.performAnalysis(projectData);
    await this.projectDataService.storeAnalysisRecord(result);
    return ResultMapperHelper.mapToResultDto(result);
  }

  @Get(':projectId/detailed-analysis')
  @SwaggerDocs.getDetailedAnalysis.operation
  @SwaggerDocs.getDetailedAnalysis.param
  @SwaggerDocs.getDetailedAnalysis.responses.success
  @SwaggerDocs.getDetailedAnalysis.responses.notFound
  @SwaggerDocs.getDetailedAnalysis.responses.serverError
  async getDetailedAnalysis(
    @Param('projectId') projectId: string
  ): Promise<GapAnalysisResultDto> {
    const projectData =
      await this.projectDataService.fetchProjectData(projectId);
    const result = await this.gapAnalysisService.performAnalysis(projectData);
    return ResultMapperHelper.mapToDetailedResultDto(result);
  }
}
