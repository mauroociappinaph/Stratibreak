import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { PredictionsModule } from '../src/modules/predictions/predictions.module';

describe('Predictions History Endpoints (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PredictionsModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/predictions/history/:projectId (GET)', () => {
    it('should return prediction history', () => {
      const projectId = 'test-project-123';

      return request(app.getHttpServer())
        .get(`/predictions/history/${projectId}`)
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty('projectId', projectId);
          expect(res.body).toHaveProperty('timeRange');
          expect(res.body).toHaveProperty('predictions');
          expect(res.body).toHaveProperty('summary');
          expect(res.body).toHaveProperty('generatedAt');
          expect(Array.isArray(res.body.predictions)).toBe(true);
          expect(res.body.summary).toHaveProperty('totalPredictions');
          expect(res.body.summary).toHaveProperty('averageAccuracy');
        });
    });

    it('should handle query parameters', () => {
      const projectId = 'test-project-123';
      const startDate = '2024-01-01T00:00:00Z';
      const endDate = '2024-07-31T23:59:59Z';

      return request(app.getHttpServer())
        .get(`/predictions/history/${projectId}`)
        .query({
          startDate,
          endDate,
          predictionType: 'risk_alert',
          limit: '25',
        })
        .expect(200)
        .expect(res => {
          expect(res.body.projectId).toBe(projectId);
          expect(res.body.predictions.length).toBeLessThanOrEqual(25);
        });
    });
  });

  describe('/predictions/trend-history/:projectId (GET)', () => {
    it('should return trend history', () => {
      const projectId = 'test-project-123';

      return request(app.getHttpServer())
        .get(`/predictions/trend-history/${projectId}`)
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty('projectId', projectId);
          expect(res.body).toHaveProperty('timeRange');
          expect(res.body).toHaveProperty('metrics');
          expect(res.body).toHaveProperty('insights');
          expect(res.body).toHaveProperty('recommendations');
          expect(res.body).toHaveProperty('generatedAt');
          expect(Array.isArray(res.body.metrics)).toBe(true);
          expect(Array.isArray(res.body.recommendations)).toBe(true);
        });
    });

    it('should handle metric filtering', () => {
      const projectId = 'test-project-123';

      return request(app.getHttpServer())
        .get(`/predictions/trend-history/${projectId}`)
        .query({
          metric: 'velocity',
          granularity: 'weekly',
        })
        .expect(200)
        .expect(res => {
          expect(res.body.projectId).toBe(projectId);
          // Should have only velocity metric when filtered
          const velocityMetric = res.body.metrics.find(
            (m: { metric: string }) => m.metric === 'velocity'
          );
          expect(velocityMetric).toBeDefined();
        });
    });
  });

  describe('/predictions/accuracy-metrics/:projectId (GET)', () => {
    it('should return accuracy metrics', () => {
      const projectId = 'test-project-123';

      return request(app.getHttpServer())
        .get(`/predictions/accuracy-metrics/${projectId}`)
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty('projectId', projectId);
          expect(res.body).toHaveProperty('period');
          expect(res.body).toHaveProperty('overallMetrics');
          expect(res.body).toHaveProperty('byType');
          expect(res.body).toHaveProperty('accuracyTrend');
          expect(res.body).toHaveProperty('insights');
          expect(res.body).toHaveProperty('calculatedAt');

          // Validate overall metrics structure
          expect(res.body.overallMetrics).toHaveProperty('overallAccuracy');
          expect(res.body.overallMetrics).toHaveProperty('precision');
          expect(res.body.overallMetrics).toHaveProperty('recall');
          expect(res.body.overallMetrics).toHaveProperty('f1Score');

          // Validate accuracy trend is an array
          expect(Array.isArray(res.body.accuracyTrend)).toBe(true);
          expect(Array.isArray(res.body.insights)).toBe(true);
        });
    });

    it('should handle date range parameters', () => {
      const projectId = 'test-project-123';
      const startDate = '2024-01-01T00:00:00Z';
      const endDate = '2024-07-31T23:59:59Z';

      return request(app.getHttpServer())
        .get(`/predictions/accuracy-metrics/${projectId}`)
        .query({
          startDate,
          endDate,
        })
        .expect(200)
        .expect(res => {
          expect(res.body.projectId).toBe(projectId);
          expect(res.body.period.startDate).toContain('2024-01-01');
          expect(res.body.period.endDate).toContain('2024-07-31');
        });
    });
  });
});
