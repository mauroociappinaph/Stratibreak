import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  GapCategory,
  GapType,
  ImpactLevel,
  ImpactType,
  SeverityLevel,
} from '../../../types/database/gap.types';
import {
  GoalStatus,
  Priority,
  ProjectState,
  ProjectStatus,
} from '../../../types/database/project.types';
import { RiskLevel, TrendDirection } from '../../../types/database/state.types';
import { GapMapper } from '../mappers/gap.mapper';
import { GapRepository } from '../repositories/gap.repository';
import { GapAnalysisService } from '../services/gap-analysis.service';
import { ProjectDataService } from '../services/project-data.service';
import { GapAnalysisController } from './gap-analysis.controller';

describe('GapAnalysisController', () => {
  let controller: GapAnalysisController;
  let gapAnalysisService: jest.Mocked<GapAnalysisService>;
  let projectDataService: jest.Mocked<ProjectDataService>;

  const mockProjectData = {
    project: {
      id: 'test-project-id',
      tenantId: 'tenant-1',
      name: 'Test Project',
      description: 'Test project description',
      status: ProjectStatus.ACTIVE,
      startDate: new Date(),
      endDate: new Date(),
      goals: [],
      stakeholders: [],
      currentState: {
        progress: 0.5,
        healthScore: 0.8,
        resources: { utilization: 0.7 },
        timeline: { progress: 0.6, delays: 0 },
        quality: { defectRate: 0.02 },
      } as ProjectState,
      connectedTools: [],
      analysisHistory: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    currentState: {
      id: 'state-test-project-id',
      projectId: 'test-project-id',
      progress: 0.5,
      healthScore: 0.7,
      resources: {
        utilization: 0.8,
        available: 10,
        allocated: 8,
        budget: {
          allocated: 100000,
          spent: 50000,
          remaining: 50000,
          burnRate: 5000,
        },
        team: {
          totalMembers: 8,
          activeMembers: 7,
          capacity: 0.8,
          workload: 0.75,
        },
      },
      timeline: {
        startDate: new Date(),
        currentDate: new Date(),
        endDate: new Date(),
        progress: 0.6,
        milestones: [],
        delays: 0,
      },
      quality: {
        currentScore: 75,
        defectRate: 0.02,
        testCoverage: 0.8,
        codeQuality: 80,
        customerSatisfaction: 4.2,
      },
      risks: {
        overallRisk: RiskLevel.MEDIUM,
        activeRisks: 2,
        mitigatedRisks: 1,
        riskTrend: TrendDirection.STABLE,
      },
      lastUpdated: new Date(),
    },
    goals: [
      {
        id: 'goal-1',
        projectId: 'test-project-id',
        title: 'Complete project on time',
        description: 'Complete the project within the specified timeline',
        targetValue: '1.0',
        currentValue: '0.8',
        priority: Priority.MEDIUM,
        status: GoalStatus.IN_PROGRESS,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  };

  const mockGapAnalysisResult = {
    projectId: 'test-project-id',
    analysisTimestamp: new Date(),
    identifiedGaps: {
      resource: [],
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
    overallHealthScore: 0.8,
    prioritizedRecommendations: [],
    executionTimeMs: 100,
    confidence: 0.85,
  };

  beforeEach(async () => {
    const mockGapAnalysisService = {
      performAnalysis: jest.fn(),
    };

    const mockProjectDataService = {
      fetchProjectData: jest.fn(),
      storeAnalysisRecord: jest.fn(),
    };

    const mockGapRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const mockGapMapper = {
      prismaToEntity: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [GapAnalysisController],
      providers: [
        { provide: GapAnalysisService, useValue: mockGapAnalysisService },
        { provide: ProjectDataService, useValue: mockProjectDataService },
        { provide: GapRepository, useValue: mockGapRepository },
        { provide: GapMapper, useValue: mockGapMapper },
      ],
    }).compile();

    controller = module.get<GapAnalysisController>(GapAnalysisController);
    gapAnalysisService = module.get(GapAnalysisService);
    projectDataService = module.get(ProjectDataService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getCategorization', () => {
    it('should return categorized gaps for a project', async () => {
      // Arrange
      const projectId = 'test-project-id';
      projectDataService.fetchProjectData.mockResolvedValue(mockProjectData);
      gapAnalysisService.performAnalysis.mockResolvedValue(
        mockGapAnalysisResult
      );

      // Act
      const result = await controller.getCategorization(projectId);

      // Assert
      expect(projectDataService.fetchProjectData).toHaveBeenCalledWith(
        projectId
      );
      expect(gapAnalysisService.performAnalysis).toHaveBeenCalledWith(
        mockProjectData
      );
      expect(result).toBeDefined();
      expect(result).toHaveProperty('resource');
      expect(result).toHaveProperty('process');
      expect(result).toHaveProperty('communication');
      expect(result).toHaveProperty('technology');
      expect(result).toHaveProperty('culture');
      expect(result).toHaveProperty('timeline');
      expect(result).toHaveProperty('quality');
      expect(result).toHaveProperty('budget');
      expect(result).toHaveProperty('skill');
      expect(result).toHaveProperty('governance');
      expect(result).toHaveProperty('categoryMetrics');
      expect(result).toHaveProperty('summary');
    });

    it('should handle project not found', async () => {
      // Arrange
      const projectId = 'non-existent-project';
      projectDataService.fetchProjectData.mockRejectedValue(
        new NotFoundException('Project not found')
      );

      // Act & Assert
      await expect(controller.getCategorization(projectId)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('getSeverityAnalysis', () => {
    it('should return severity analysis for a project', async () => {
      // Arrange
      const projectId = 'test-project-id';
      const mockGapAnalysisResultWithGaps = {
        ...mockGapAnalysisResult,
        identifiedGaps: {
          ...mockGapAnalysisResult.identifiedGaps,
          resource: [
            {
              id: 'gap-1',
              projectId: 'test-project-id',
              title: 'Resource Gap',
              description: 'Test resource gap',
              type: GapType.RESOURCE,
              category: GapCategory.OPERATIONAL,
              severity: SeverityLevel.HIGH,
              currentValue: 0.9,
              targetValue: 0.8,
              variance: 0.1,
              confidence: 0.8,
              rootCauses: [],
              affectedAreas: [],
              estimatedImpact: {
                id: 'impact-1',
                gapId: 'gap-1',
                type: ImpactType.TIMELINE,
                level: ImpactLevel.MEDIUM,
                description: 'Impact on timeline',
                timeframe: '1-2 weeks',
                affectedStakeholders: ['team'],
              },
            },
          ],
        },
      };

      projectDataService.fetchProjectData.mockResolvedValue(mockProjectData);
      gapAnalysisService.performAnalysis.mockResolvedValue(
        mockGapAnalysisResultWithGaps
      );

      // Act
      const result = await controller.getSeverityAnalysis(projectId);

      // Assert
      expect(projectDataService.fetchProjectData).toHaveBeenCalledWith(
        projectId
      );
      expect(gapAnalysisService.performAnalysis).toHaveBeenCalledWith(
        mockProjectData
      );
      expect(result).toBeDefined();
      expect(result).toHaveProperty('projectId', projectId);
      expect(result).toHaveProperty('severityDistribution');
      expect(result).toHaveProperty('severityMetrics');
      expect(result).toHaveProperty('gapsBySeverity');
      expect(result).toHaveProperty('severityTrends');
      expect(result).toHaveProperty('recommendations');
      expect(result).toHaveProperty('overallSeverityAssessment');
      expect(result).toHaveProperty('analysisConfidence');
      expect(result).toHaveProperty('executionTimeMs');
    });

    it('should handle project not found', async () => {
      // Arrange
      const projectId = 'non-existent-project';
      projectDataService.fetchProjectData.mockRejectedValue(
        new NotFoundException('Project not found')
      );

      // Act & Assert
      await expect(controller.getSeverityAnalysis(projectId)).rejects.toThrow(
        NotFoundException
      );
    });
  });
});
