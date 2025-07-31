import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { PrismaService } from '../src/common/services';
import { GapAnalysisModule } from '../src/modules/gap-analysis/gap-analysis.module';

describe('Gap Analysis Endpoints (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [GapAnalysisModule],
    })
      .overrideProvider(PrismaService)
      .useValue({
        // Mock PrismaService methods
        gap: {
          create: jest.fn(),
          findMany: jest.fn().mockResolvedValue([]),
          findUnique: jest.fn(),
          update: jest.fn(),
          delete: jest.fn(),
        },
        project: {
          findUnique: jest.fn().mockResolvedValue({
            id: 'test-project-id',
            name: 'Test Project',
            status: 'active',
            createdAt: new Date(),
            updatedAt: new Date(),
            goals: [
              {
                id: 'goal-1',
                projectId: 'test-project-id',
                title: 'Complete project on time',
                targetValue: 1.0,
              },
            ],
            stakeholders: [
              {
                id: 'stakeholder-1',
                projectId: 'test-project-id',
                name: 'John Doe',
                role: 'Project Manager',
                email: 'john@example.com',
              },
            ],
          }),
        },
        projectGoal: {
          findMany: jest.fn().mockResolvedValue([
            {
              id: 'goal-1',
              projectId: 'test-project-id',
              title: 'Complete project on time',
              targetValue: 1.0,
            },
          ]),
        },
        projectState: {
          findUnique: jest.fn().mockResolvedValue({
            projectId: 'test-project-id',
            progress: 0.5,
            healthScore: 0.7,
            resources: { utilization: 0.8 },
            timeline: { progress: 0.6, delays: 0 },
            quality: { defectRate: 0.02 },
          }),
        },
        analysisRecord: {
          create: jest.fn(),
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/gap-analysis/:projectId/categorization (GET)', () => {
    it('should return categorized gaps for a project', () => {
      return request(app.getHttpServer())
        .get('/gap-analysis/test-project-id/categorization')
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty('resource');
          expect(res.body).toHaveProperty('process');
          expect(res.body).toHaveProperty('communication');
          expect(res.body).toHaveProperty('technology');
          expect(res.body).toHaveProperty('culture');
          expect(res.body).toHaveProperty('timeline');
          expect(res.body).toHaveProperty('quality');
          expect(res.body).toHaveProperty('budget');
          expect(res.body).toHaveProperty('skill');
          expect(res.body).toHaveProperty('governance');
          expect(res.body).toHaveProperty('categoryMetrics');
          expect(res.body).toHaveProperty('summary');

          // Verify structure of category metrics
          expect(res.body.categoryMetrics).toBeInstanceOf(Object);

          // Verify summary structure
          expect(res.body.summary).toHaveProperty('totalGaps');
          expect(res.body.summary).toHaveProperty('criticalGaps');
          expect(res.body.summary).toHaveProperty('highPriorityGaps');
          expect(res.body.summary).toHaveProperty('averageConfidence');
          expect(res.body.summary).toHaveProperty('mostAffectedCategory');
          expect(res.body.summary).toHaveProperty('leastAffectedCategory');
        });
    });

    it('should handle non-existent project', () => {
      // Mock project not found
      prismaService.project.findUnique = jest.fn().mockResolvedValue(null);

      return request(app.getHttpServer())
        .get('/gap-analysis/non-existent-project/categorization')
        .expect(404);
    });
  });

  describe('/gap-analysis/:projectId/severity-analysis (GET)', () => {
    it('should return severity analysis for a project', () => {
      return request(app.getHttpServer())
        .get('/gap-analysis/test-project-id/severity-analysis')
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty('projectId', 'test-project-id');
          expect(res.body).toHaveProperty('analysisTimestamp');
          expect(res.body).toHaveProperty('severityDistribution');
          expect(res.body).toHaveProperty('severityMetrics');
          expect(res.body).toHaveProperty('gapsBySeverity');
          expect(res.body).toHaveProperty('severityTrends');
          expect(res.body).toHaveProperty('recommendations');
          expect(res.body).toHaveProperty('overallSeverityAssessment');
          expect(res.body).toHaveProperty('analysisConfidence');
          expect(res.body).toHaveProperty('executionTimeMs');

          // Verify severity distribution structure
          expect(res.body.severityDistribution).toHaveProperty('critical');
          expect(res.body.severityDistribution).toHaveProperty('high');
          expect(res.body.severityDistribution).toHaveProperty('medium');
          expect(res.body.severityDistribution).toHaveProperty('low');
          expect(res.body.severityDistribution).toHaveProperty('total');

          // Verify severity metrics structure
          expect(res.body.severityMetrics).toHaveProperty(
            'averageSeverityScore'
          );
          expect(res.body.severityMetrics).toHaveProperty(
            'weightedSeverityScore'
          );
          expect(res.body.severityMetrics).toHaveProperty('severityVolatility');
          expect(res.body.severityMetrics).toHaveProperty(
            'escalationProbability'
          );
          expect(res.body.severityMetrics).toHaveProperty('dominantSeverity');
          expect(res.body.severityMetrics).toHaveProperty(
            'calculationConfidence'
          );

          // Verify gaps by severity structure
          expect(res.body.gapsBySeverity).toHaveProperty('critical');
          expect(res.body.gapsBySeverity).toHaveProperty('high');
          expect(res.body.gapsBySeverity).toHaveProperty('medium');
          expect(res.body.gapsBySeverity).toHaveProperty('low');

          // Verify recommendations is an array
          expect(Array.isArray(res.body.recommendations)).toBe(true);

          // Verify severity trends is an array
          expect(Array.isArray(res.body.severityTrends)).toBe(true);
        });
    });

    it('should handle non-existent project', () => {
      // Mock project not found
      prismaService.project.findUnique = jest.fn().mockResolvedValue(null);

      return request(app.getHttpServer())
        .get('/gap-analysis/non-existent-project/severity-analysis')
        .expect(404);
    });
  });
});
