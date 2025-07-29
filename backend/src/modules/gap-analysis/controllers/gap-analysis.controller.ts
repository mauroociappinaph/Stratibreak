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
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateGapAnalysisDto, UpdateGapAnalysisDto } from '../dto';
import { GapAnalysisEntity } from '../entities';
import { GapAnalysisService } from '../services/gap-analysis.service';

@ApiTags('gap-analysis')
@Controller('gap-analysis')
export class GapAnalysisController {
  constructor(private readonly gapAnalysisService: GapAnalysisService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new gap analysis' })
  @ApiResponse({
    status: 201,
    description: 'Gap analysis created successfully',
    type: GapAnalysisEntity,
  })
  async create(
    @Body() createGapAnalysisDto: CreateGapAnalysisDto
  ): Promise<GapAnalysisEntity> {
    return this.gapAnalysisService.create(createGapAnalysisDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all gap analyses' })
  @ApiResponse({
    status: 200,
    description: 'List of gap analyses',
    type: [GapAnalysisEntity],
  })
  async findAll(): Promise<GapAnalysisEntity[]> {
    return this.gapAnalysisService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get gap analysis by ID' })
  @ApiResponse({
    status: 200,
    description: 'Gap analysis found',
    type: GapAnalysisEntity,
  })
  async findOne(@Param('id') id: string): Promise<GapAnalysisEntity> {
    return this.gapAnalysisService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update gap analysis' })
  @ApiResponse({
    status: 200,
    description: 'Gap analysis updated successfully',
    type: GapAnalysisEntity,
  })
  async update(
    @Param('id') id: string,
    @Body() updateGapAnalysisDto: UpdateGapAnalysisDto
  ): Promise<GapAnalysisEntity> {
    return this.gapAnalysisService.update(id, updateGapAnalysisDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete gap analysis' })
  @ApiResponse({
    status: 204,
    description: 'Gap analysis deleted successfully',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.gapAnalysisService.remove(id);
  }

  @Post(':projectId/analyze')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Perform gap analysis on project' })
  @ApiResponse({
    status: 201,
    description: 'Gap analysis performed successfully',
    type: GapAnalysisEntity,
  })
  async performAnalysis(
    @Param('projectId') projectId: string
  ): Promise<GapAnalysisEntity> {
    return this.gapAnalysisService.performAnalysis(projectId);
  }
}
