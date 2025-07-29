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
import { CreatePredictionDto, UpdatePredictionDto } from '../dto';
import { PredictionEntity } from '../entities';
import { PredictionsService } from '../services/predictions.service';

@ApiTags('predictions')
@Controller('predictions')
export class PredictionsController {
  constructor(private readonly predictionsService: PredictionsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new prediction' })
  @ApiResponse({
    status: 201,
    description: 'Prediction created successfully',
    type: PredictionEntity,
  })
  async create(
    @Body() createPredictionDto: CreatePredictionDto
  ): Promise<PredictionEntity> {
    return this.predictionsService.create(createPredictionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all predictions' })
  @ApiResponse({
    status: 200,
    description: 'List of predictions',
    type: [PredictionEntity],
  })
  async findAll(): Promise<PredictionEntity[]> {
    return this.predictionsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get prediction by ID' })
  @ApiResponse({
    status: 200,
    description: 'Prediction found',
    type: PredictionEntity,
  })
  async findOne(@Param('id') id: string): Promise<PredictionEntity> {
    return this.predictionsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update prediction' })
  @ApiResponse({
    status: 200,
    description: 'Prediction updated successfully',
    type: PredictionEntity,
  })
  async update(
    @Param('id') id: string,
    @Body() updatePredictionDto: UpdatePredictionDto
  ): Promise<PredictionEntity> {
    return this.predictionsService.update(id, updatePredictionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete prediction' })
  @ApiResponse({
    status: 204,
    description: 'Prediction deleted successfully',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.predictionsService.remove(id);
  }

  @Post('generate/:projectId')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Generate predictions for a project' })
  @ApiResponse({
    status: 201,
    description: 'Predictions generated successfully',
    type: [PredictionEntity],
  })
  async generatePredictions(
    @Param('projectId') projectId: string
  ): Promise<PredictionEntity[]> {
    return this.predictionsService.generatePredictions(projectId);
  }

  @Get('project/:projectId')
  @ApiOperation({ summary: 'Get predictions by project' })
  @ApiResponse({
    status: 200,
    description: 'Project predictions found',
    type: [PredictionEntity],
  })
  async findByProject(
    @Param('projectId') projectId: string
  ): Promise<PredictionEntity[]> {
    return this.predictionsService.findByProject(projectId);
  }
}
