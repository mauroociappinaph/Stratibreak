import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { AutomatedGapAnalysisResultDto, GapAnalysisResultDto } from '../dto';
import { CrudSwaggerDocs } from './gap-analysis-crud.swagger';

// Swagger decorators for the controller methods
export const SwaggerDocs = {
  // Re-export CRUD operations
  ...CrudSwaggerDocs,

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

  getCategorization: {
    operation: ApiOperation({
      summary: 'Get categorized gaps for project',
      description: `Retrieves gaps organized by category for a project including:
      • Gaps grouped by type (resource, process, communication, etc.)
      • Category-specific metrics and statistics
      • Severity distribution within each category
      • Trends and patterns across categories
      • Summary statistics for quick overview`,
    }),
    param: ApiParam({
      name: 'projectId',
      description:
        'Unique identifier of the project to get categorized gaps for',
      example: 'proj_123456789',
      type: 'string',
    }),
    responses: {
      success: ApiResponse({
        status: 200,
        description: 'Categorized gaps retrieved successfully',
        schema: {
          type: 'object',
          properties: {
            resource: {
              type: 'array',
              items: { $ref: '#/components/schemas/DetailedGapDto' },
            },
            process: {
              type: 'array',
              items: { $ref: '#/components/schemas/DetailedGapDto' },
            },
            communication: {
              type: 'array',
              items: { $ref: '#/components/schemas/DetailedGapDto' },
            },
            technology: {
              type: 'array',
              items: { $ref: '#/components/schemas/DetailedGapDto' },
            },
            culture: {
              type: 'array',
              items: { $ref: '#/components/schemas/DetailedGapDto' },
            },
            timeline: {
              type: 'array',
              items: { $ref: '#/components/schemas/DetailedGapDto' },
            },
            quality: {
              type: 'array',
              items: { $ref: '#/components/schemas/DetailedGapDto' },
            },
            budget: {
              type: 'array',
              items: { $ref: '#/components/schemas/DetailedGapDto' },
            },
            skill: {
              type: 'array',
              items: { $ref: '#/components/schemas/DetailedGapDto' },
            },
            governance: {
              type: 'array',
              items: { $ref: '#/components/schemas/DetailedGapDto' },
            },
            categoryMetrics: {
              type: 'object',
              additionalProperties: {
                $ref: '#/components/schemas/GapCategoryMetricsDto',
              },
            },
            summary: {
              type: 'object',
              properties: {
                totalGaps: { type: 'number' },
                criticalGaps: { type: 'number' },
                highPriorityGaps: { type: 'number' },
                averageConfidence: { type: 'number' },
                mostAffectedCategory: { type: 'string' },
                leastAffectedCategory: { type: 'string' },
              },
            },
          },
        },
      }),
      notFound: ApiNotFoundResponse({
        description: 'Project not found or no gaps available',
      }),
      serverError: ApiInternalServerErrorResponse({
        description: 'Failed to retrieve categorized gaps',
      }),
    },
  },

  getSeverityAnalysis: {
    operation: ApiOperation({
      summary: 'Get severity analysis for project gaps',
      description:
        'Performs comprehensive severity analysis on project gaps with distribution, trends, and recommendations',
    }),
    param: ApiParam({
      name: 'projectId',
      description: 'Unique identifier of the project to analyze severity for',
      example: 'proj_123456789',
      type: 'string',
    }),
    responses: {
      success: ApiResponse({
        status: 200,
        description: 'Severity analysis completed successfully',
      }),
      notFound: ApiNotFoundResponse({
        description:
          'Project not found or no gaps available for severity analysis',
      }),
      serverError: ApiInternalServerErrorResponse({
        description: 'Failed to perform severity analysis',
      }),
    },
  },
};
