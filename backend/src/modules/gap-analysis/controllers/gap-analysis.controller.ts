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
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
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
  @ApiOperation({
    summary: 'Create a new gap analysis',
    description:
      'Creates a new gap analysis record for a specific project. This endpoint allows manual creation of gap analysis entries with specified type and severity.',
  })
  @ApiBody({
    type: CreateGapAnalysisDto,
    description: 'Gap analysis data to create',
    examples: {
      resourceGap: {
        summary: 'Resource Gap Example',
        description: 'Example of a resource-related gap analysis',
        value: {
          projectId: 'proj_123456789',
          title: 'Insufficient Development Resources',
          description:
            'The project lacks sufficient senior developers to meet the delivery timeline',
          type: 'resource',
          severity: 'high',
        },
      },
      processGap: {
        summary: 'Process Gap Example',
        description: 'Example of a process-related gap analysis',
        value: {
          projectId: 'proj_123456789',
          title: 'Missing Code Review Process',
          description:
            'No formal code review process is in place, leading to quality issues',
          type: 'process',
          severity: 'medium',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Gap analysis created successfully',
    type: GapAnalysisEntity,
    example: {
      id: 'gap_987654321',
      projectId: 'proj_123456789',
      title: 'Insufficient Development Resources',
      description:
        'The project lacks sufficient senior developers to meet the delivery timeline',
      type: 'resource',
      severity: 'high',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    example: {
      statusCode: 400,
      message: [
        'projectId should not be empty',
        'type must be a valid enum value',
      ],
      error: 'Bad Request',
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    example: {
      statusCode: 500,
      message: 'Internal server error',
      error: 'Internal Server Error',
    },
  })
  async create(
    @Body() createGapAnalysisDto: CreateGapAnalysisDto
  ): Promise<GapAnalysisEntity> {
    const gap = await this.gapRepository.create(createGapAnalysisDto);
    return this.gapMapper.prismaToEntity(gap);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all gap analyses',
    description:
      'Retrieves a list of all gap analysis records across all projects. Results are ordered by creation date (newest first).',
  })
  @ApiResponse({
    status: 200,
    description: 'List of gap analyses retrieved successfully',
    type: [GapAnalysisEntity],
    example: [
      {
        id: 'gap_987654321',
        projectId: 'proj_123456789',
        title: 'Insufficient Development Resources',
        description:
          'The project lacks sufficient senior developers to meet the delivery timeline',
        type: 'resource',
        severity: 'high',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
      },
      {
        id: 'gap_987654322',
        projectId: 'proj_123456790',
        title: 'Communication Breakdown',
        description: 'Poor communication between frontend and backend teams',
        type: 'communication',
        severity: 'medium',
        createdAt: '2024-01-14T15:45:00Z',
        updatedAt: '2024-01-14T15:45:00Z',
      },
    ],
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    example: {
      statusCode: 500,
      message: 'Internal server error',
      error: 'Internal Server Error',
    },
  })
  async findAll(): Promise<GapAnalysisEntity[]> {
    const gaps = await this.gapRepository.findAll();
    return gaps.map(gap => this.gapMapper.prismaToEntity(gap));
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get gap analysis by ID',
    description:
      'Retrieves a specific gap analysis record by its unique identifier.',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the gap analysis',
    example: 'gap_987654321',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Gap analysis found successfully',
    type: GapAnalysisEntity,
    example: {
      id: 'gap_987654321',
      projectId: 'proj_123456789',
      title: 'Insufficient Development Resources',
      description:
        'The project lacks sufficient senior developers to meet the delivery timeline',
      type: 'resource',
      severity: 'high',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
    },
  })
  @ApiNotFoundResponse({
    description: 'Gap analysis not found',
    example: {
      statusCode: 404,
      message: 'Gap analysis with ID gap_987654321 not found',
      error: 'Not Found',
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    example: {
      statusCode: 500,
      message: 'Internal server error',
      error: 'Internal Server Error',
    },
  })
  async findOne(@Param('id') id: string): Promise<GapAnalysisEntity> {
    const gap = await this.gapRepository.findOne(id);
    if (!gap) {
      throw new NotFoundException(`Gap analysis with ID ${id} not found`);
    }
    return this.gapMapper.prismaToEntity(gap);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update gap analysis',
    description:
      'Updates an existing gap analysis record. Only provided fields will be updated.',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the gap analysis to update',
    example: 'gap_987654321',
    type: 'string',
  })
  @ApiBody({
    type: UpdateGapAnalysisDto,
    description: 'Gap analysis data to update',
    examples: {
      updateSeverity: {
        summary: 'Update Severity',
        description: 'Example of updating only the severity level',
        value: {
          severity: 'critical',
        },
      },
      updateDescription: {
        summary: 'Update Description',
        description: 'Example of updating the description',
        value: {
          description:
            'Updated description with more details about the resource gap',
        },
      },
      fullUpdate: {
        summary: 'Full Update',
        description: 'Example of updating multiple fields',
        value: {
          title: 'Critical Resource Shortage',
          description:
            'Severe shortage of senior developers affecting multiple deliverables',
          severity: 'critical',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Gap analysis updated successfully',
    type: GapAnalysisEntity,
    example: {
      id: 'gap_987654321',
      projectId: 'proj_123456789',
      title: 'Critical Resource Shortage',
      description:
        'Severe shortage of senior developers affecting multiple deliverables',
      type: 'resource',
      severity: 'critical',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T14:20:00Z',
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    example: {
      statusCode: 400,
      message: ['severity must be a valid enum value'],
      error: 'Bad Request',
    },
  })
  @ApiNotFoundResponse({
    description: 'Gap analysis not found',
    example: {
      statusCode: 404,
      message: 'Gap analysis with ID gap_987654321 not found',
      error: 'Not Found',
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    example: {
      statusCode: 500,
      message: 'Internal server error',
      error: 'Internal Server Error',
    },
  })
  async update(
    @Param('id') id: string,
    @Body() updateGapAnalysisDto: UpdateGapAnalysisDto
  ): Promise<GapAnalysisEntity> {
    const gap = await this.gapRepository.update(id, updateGapAnalysisDto);
    return this.gapMapper.prismaToEntity(gap);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete gap analysis',
    description:
      'Permanently deletes a gap analysis record. This action cannot be undone.',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the gap analysis to delete',
    example: 'gap_987654321',
    type: 'string',
  })
  @ApiResponse({
    status: 204,
    description: 'Gap analysis deleted successfully',
  })
  @ApiNotFoundResponse({
    description: 'Gap analysis not found',
    example: {
      statusCode: 404,
      message: 'Gap analysis with ID gap_987654321 not found',
      error: 'Not Found',
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    example: {
      statusCode: 500,
      message: 'Internal server error',
      error: 'Internal Server Error',
    },
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.gapRepository.remove(id);
  }

  @Post(':projectId/analyze')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Perform automated gap analysis on project',
    description: `Performs comprehensive AI-powered gap analysis on a project. This endpoint:

    • Analyzes current project state vs. target goals
    • Identifies discrepancies across multiple dimensions (resource, process, timeline, quality, etc.)
    • Calculates severity levels using advanced algorithms
    • Generates actionable recommendations
    • Provides confidence scores for analysis results

    The analysis typically completes in under 2 seconds and includes:
    - Resource utilization gaps
    - Timeline and milestone deviations
    - Quality metric discrepancies
    - Process and communication issues
    - Budget and team capacity analysis`,
  })
  @ApiParam({
    name: 'projectId',
    description: 'Unique identifier of the project to analyze',
    example: 'proj_123456789',
    type: 'string',
  })
  @ApiResponse({
    status: 201,
    description: 'Gap analysis performed successfully',
    type: GapAnalysisResultDto,
    example: {
      projectId: 'proj_123456789',
      analysisTimestamp: '2024-01-15T10:30:00Z',
      identifiedGaps: {
        resource: [
          {
            id: 'gap_resource_001',
            projectId: 'proj_123456789',
            type: 'resource',
            category: 'operational',
            title: 'Resource Over-utilization',
            description:
              'Resources are over-utilized at 95.0% affecting team sustainability',
            currentValue: 0.95,
            targetValue: 0.8,
            variance: 0.15,
            severity: 'high',
            confidence: 0.85,
          },
        ],
        process: [],
        communication: [],
        technology: [],
        culture: [],
        timeline: [],
        quality: [],
        budget: [],
        skill: [],
        governance: [],
      },
      overallHealthScore: 75,
      prioritizedRecommendations: [],
      executionTimeMs: 1250,
      confidence: 0.87,
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid project ID or project not found',
    example: {
      statusCode: 400,
      message: 'Project proj_123456789 not found',
      error: 'Bad Request',
    },
  })
  @ApiNotFoundResponse({
    description: 'Project not found',
    example: {
      statusCode: 404,
      message: 'Project with ID proj_123456789 not found',
      error: 'Not Found',
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Analysis failed due to internal error',
    example: {
      statusCode: 500,
      message: 'Gap analysis failed for project proj_123456789',
      error: 'Internal Server Error',
    },
  })
  async performAnalysis(
    @Param('projectId') projectId: string
  ): Promise<GapAnalysisResultDto> {
    const projectData =
      await this.projectDataService.fetchProjectData(projectId);
    const result = await this.gapAnalysisService.performAnalysis(projectData);
    await this.projectDataService.storeAnalysisRecord(result);
    return ResultMapperHelper.mapToResultDto(result);
  }

  @Get(':projectId/detailed-analysis')
  @ApiOperation({
    summary: 'Get detailed gap analysis results for project',
    description: `Retrieves comprehensive gap analysis results for a project including:

    • Categorized gaps with detailed root cause analysis
    • Severity calculations with confidence scores
    • Impact assessments across multiple dimensions
    • Prioritized actionable recommendations
    • Overall project health metrics

    This endpoint provides the full analysis data structure used internally by the AI analysis engine, suitable for advanced dashboards and detailed reporting.`,
  })
  @ApiParam({
    name: 'projectId',
    description:
      'Unique identifier of the project to get detailed analysis for',
    example: 'proj_123456789',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Detailed gap analysis results retrieved successfully',
    type: GapAnalysisResultDto,
    example: {
      projectId: 'proj_123456789',
      analysisTimestamp: '2024-01-15T10:30:00Z',
      identifiedGaps: {
        resource: [
          {
            id: 'gap_resource_001',
            projectId: 'proj_123456789',
            type: 'resource',
            category: 'operational',
            title: 'Resource Over-utilization',
            description:
              'Resources are over-utilized at 95.0% affecting team sustainability',
            currentValue: 0.95,
            targetValue: 0.8,
            variance: 0.15,
            severity: 'high',
            rootCauses: [
              {
                id: 'rc_001',
                category: 'management',
                description: 'Insufficient resource planning and allocation',
                confidence: 0.8,
                evidence: [
                  'Resource utilization metrics',
                  'Team workload data',
                ],
                contributionWeight: 0.9,
              },
            ],
            affectedAreas: [
              {
                id: 'area_001',
                name: 'Team Productivity',
                description: 'Team performance and sustainability',
                criticality: 'high',
              },
            ],
            estimatedImpact: {
              id: 'impact_001',
              type: 'team_morale',
              level: 'high',
              description: 'Team burnout risk and decreased productivity',
              timeframe: 'short-term',
              affectedStakeholders: ['team-members', 'project-manager'],
            },
            confidence: 0.85,
          },
        ],
        process: [],
        communication: [],
        technology: [],
        culture: [],
        timeline: [],
        quality: [],
        budget: [],
        skill: [],
        governance: [],
      },
      overallHealthScore: 75,
      prioritizedRecommendations: [
        {
          id: 'rec_001',
          gapId: 'gap_resource_001',
          title: 'Address Resource Over-utilization',
          description:
            'Allocate additional resources or optimize current resource utilization',
          priority: 'high',
          estimatedEffort: 36,
          estimatedImpact: 0.85,
          requiredResources: [
            'Project Manager',
            'HR Manager',
            'Additional Team Members',
          ],
          timeline: '2-4 weeks',
          dependencies: [],
        },
      ],
      executionTimeMs: 1250,
      confidence: 0.87,
    },
  })
  @ApiNotFoundResponse({
    description: 'Project not found or no analysis available',
    example: {
      statusCode: 404,
      message: 'No analysis results found for project proj_123456789',
      error: 'Not Found',
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Failed to retrieve analysis results',
    example: {
      statusCode: 500,
      message: 'Failed to retrieve detailed analysis results',
      error: 'Internal Server Error',
    },
  })
  async getDetailedAnalysis(
    @Param('projectId') projectId: string
  ): Promise<GapAnalysisResultDto> {
    const projectData =
      await this.projectDataService.fetchProjectData(projectId);
    const result = await this.gapAnalysisService.performAnalysis(projectData);
    return ResultMapperHelper.mapToResultDto(result);
  }
}
