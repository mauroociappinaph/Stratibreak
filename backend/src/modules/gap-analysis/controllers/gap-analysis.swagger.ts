import {
  ApiBadRequestResponse,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { AutomatedGapAnalysisResultDto, GapAnalysisResultDto } from '../dto';
import { GapAnalysisEntity } from '../entities';

// Swagger decorators for the controller methods
export const SwaggerDocs = {
  create: {
    operation: ApiOperation({
      summary: 'Create a new gap analysis',
      description:
        'Creates a new gap analysis record for a specific project. This endpoint allows manual creation of gap analysis entries with specified type and severity.',
    }),
    body: ApiBody({
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
    }),
    responses: {
      success: ApiResponse({
        status: 201,
        description: 'Gap analysis created successfully',
        type: GapAnalysisEntity,
      }),
      badRequest: ApiBadRequestResponse({
        description: 'Invalid input data',
      }),
      serverError: ApiInternalServerErrorResponse({
        description: 'Internal server error',
      }),
    },
  },

  findAll: {
    operation: ApiOperation({
      summary: 'Get all gap analyses',
      description:
        'Retrieves a list of all gap analysis records across all projects. Results are ordered by creation date (newest first).',
    }),
    responses: {
      success: ApiResponse({
        status: 200,
        description: 'List of gap analyses retrieved successfully',
        type: [GapAnalysisEntity],
      }),
      serverError: ApiInternalServerErrorResponse({
        description: 'Internal server error',
      }),
    },
  },

  findOne: {
    operation: ApiOperation({
      summary: 'Get gap analysis by ID',
      description:
        'Retrieves a specific gap analysis record by its unique identifier.',
    }),
    param: ApiParam({
      name: 'id',
      description: 'Unique identifier of the gap analysis',
      example: 'gap_987654321',
      type: 'string',
    }),
    responses: {
      success: ApiResponse({
        status: 200,
        description: 'Gap analysis found successfully',
        type: GapAnalysisEntity,
      }),
      notFound: ApiNotFoundResponse({
        description: 'Gap analysis not found',
      }),
      serverError: ApiInternalServerErrorResponse({
        description: 'Internal server error',
      }),
    },
  },

  update: {
    operation: ApiOperation({
      summary: 'Update gap analysis',
      description:
        'Updates an existing gap analysis record. Only provided fields will be updated.',
    }),
    param: ApiParam({
      name: 'id',
      description: 'Unique identifier of the gap analysis to update',
      example: 'gap_987654321',
      type: 'string',
    }),
    body: ApiBody({
      description: 'Gap analysis data to update',
      examples: {
        updateSeverity: {
          summary: 'Update Severity',
          description: 'Example of updating only the severity level',
          value: { severity: 'critical' },
        },
        updateDescription: {
          summary: 'Update Description',
          description: 'Example of updating the description',
          value: {
            description:
              'Updated description with more details about the resource gap',
          },
        },
      },
    }),
    responses: {
      success: ApiResponse({
        status: 200,
        description: 'Gap analysis updated successfully',
        type: GapAnalysisEntity,
      }),
      badRequest: ApiBadRequestResponse({
        description: 'Invalid input data',
      }),
      notFound: ApiNotFoundResponse({
        description: 'Gap analysis not found',
      }),
      serverError: ApiInternalServerErrorResponse({
        description: 'Internal server error',
      }),
    },
  },

  remove: {
    operation: ApiOperation({
      summary: 'Delete gap analysis',
      description:
        'Permanently deletes a gap analysis record. This action cannot be undone.',
    }),
    param: ApiParam({
      name: 'id',
      description: 'Unique identifier of the gap analysis to delete',
      example: 'gap_987654321',
      type: 'string',
    }),
    responses: {
      success: ApiResponse({
        status: 204,
        description: 'Gap analysis deleted successfully',
      }),
      notFound: ApiNotFoundResponse({
        description: 'Gap analysis not found',
      }),
      serverError: ApiInternalServerErrorResponse({
        description: 'Internal server error',
      }),
    },
  },

  performAnalysis: {
    operation: ApiOperation({
      summary: 'Perform automated gap analysis on project',
      description: `Performs comprehensive AI-powered gap analysis on a project. This endpoint:
      • Analyzes current project state vs. target goals
      • Identifies discrepancies across multiple dimensions
      • Calculates severity levels using advanced algorithms
      • Generates actionable recommendations
      • Provides confidence scores for analysis results`,
    }),
    param: ApiParam({
      name: 'projectId',
      description: 'Unique identifier of the project to analyze',
      example: 'proj_123456789',
      type: 'string',
    }),
    responses: {
      success: ApiResponse({
        status: 201,
        description: 'Gap analysis performed successfully',
        type: AutomatedGapAnalysisResultDto,
      }),
      badRequest: ApiBadRequestResponse({
        description: 'Invalid project ID or project not found',
      }),
      notFound: ApiNotFoundResponse({
        description: 'Project not found',
      }),
      serverError: ApiInternalServerErrorResponse({
        description: 'Analysis failed due to internal error',
      }),
    },
  },

  getDetailedAnalysis: {
    operation: ApiOperation({
      summary: 'Get detailed gap analysis results for project',
      description: `Retrieves comprehensive gap analysis results for a project including:
      • Categorized gaps with detailed root cause analysis
      • Severity calculations with confidence scores
      • Impact assessments across multiple dimensions
      • Prioritized actionable recommendations
      • Overall project health metrics`,
    }),
    param: ApiParam({
      name: 'projectId',
      description:
        'Unique identifier of the project to get detailed analysis for',
      example: 'proj_123456789',
      type: 'string',
    }),
    responses: {
      success: ApiResponse({
        status: 200,
        description: 'Detailed gap analysis results retrieved successfully',
        type: GapAnalysisResultDto,
      }),
      notFound: ApiNotFoundResponse({
        description: 'Project not found or no analysis available',
      }),
      serverError: ApiInternalServerErrorResponse({
        description: 'Failed to retrieve analysis results',
      }),
    },
  },
};
