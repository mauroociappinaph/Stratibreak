import { Test, TestingModule } from '@nestjs/testing';
import { EarlyWarningService } from '../services/early-warning.service';
import { PredictionsService } from '../services/predictions.service';
import { PredictiveService } from '../services/predictive.service';
import { RiskCalculatorService } from '../services/risk-calculator.service';
import { PredictionsHistoryController } from './predictions-history.controller';

describe('PredictionsHistoryController', () => {
  let controller: PredictionsHistoryController;
  let predictionsService: PredictionsService;

  const mockPredictionsService = {
    getPredictionHistory: jest.fn(),
    getTrendHistory: jest.fn(),
    getPredictionAccuracyMetrics: jest.fn(),
  };

  const mockPredictiveService = {};
  const mockEarlyWarningService = {};
  const mockRiskCalculatorService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PredictionsHistoryController],
      providers: [
        {
          provide: PredictionsService,
          useValue: mockPredictionsService,
        },
        {
          provide: PredictiveService,
          useValue: mockPredictiveService,
        },
        {
          provide: EarlyWarningService,
          useValue: mockEarlyWarningService,
        },
        {
          provide: RiskCalculatorService,
          useValue: mockRiskCalculatorService,
        },
      ],
    }).compile();

    controller = module.get<PredictionsHistoryController>(
      PredictionsHistoryController
    );
    predictionsService = module.get<PredictionsService>(PredictionsService);
  });

  describe('getPredictionHistory', () => {
    it('should return prediction history for a project', async () => {
      const projectId = 'proj_123';
      const mockResponse = {
        projectId,
        timeRange: {
          startDate: '2024-01-01T00:00:00Z',
          endDate: '2024-07-31T23:59:59Z',
        },
        predictions: [
          {
            id: 'pred_1',
            projectId,
            type: 'risk_alert',
            title: 'High risk detected',
            description: 'Risk indicators suggest potential project disruption',
            probability: 0.85,
            severity: 'high',
            predictedAt: '2024-07-29T10:00:00Z',
            expectedAt: '2024-07-31T10:00:00Z',
            actualOutcome: 'confirmed',
            accuracyScore: 0.92,
          },
        ],
        summary: {
          totalPredictions: 1,
          confirmedPredictions: 1,
          falsePositives: 0,
          preventedIssues: 0,
          averageAccuracy: 0.92,
          accuracyTrend: 'improving',
        },
        generatedAt: '2024-07-31T15:30:00Z',
      };

      mockPredictionsService.getPredictionHistory.mockResolvedValue(
        mockResponse
      );

      const result = await controller.getPredictionHistory(projectId);

      expect(result).toEqual(mockResponse);
      expect(mockPredictionsService.getPredictionHistory).toHaveBeenCalledWith(
        projectId,
        undefined,
        undefined,
        undefined,
        50
      );
    });

    it('should handle query parameters correctly', async () => {
      const projectId = 'proj_123';
      const startDate = '2024-01-01T00:00:00Z';
      const endDate = '2024-07-31T23:59:59Z';
      const predictionType = 'risk_alert';
      const limit = '25';

      mockPredictionsService.getPredictionHistory.mockResolvedValue({});

      await controller.getPredictionHistory(
        projectId,
        startDate,
        endDate,
        predictionType,
        limit
      );

      expect(mockPredictionsService.getPredictionHistory).toHaveBeenCalledWith(
        projectId,
        new Date(startDate),
        new Date(endDate),
        predictionType,
        25
      );
    });
  });

  describe('getTrendHistory', () => {
    it('should return trend history for a project', async () => {
      const projectId = 'proj_123';
      const mockResponse = {
        projectId,
        timeRange: {
          startDate: '2024-01-01T00:00:00Z',
          endDate: '2024-07-31T23:59:59Z',
        },
        metrics: [
          {
            metric: 'velocity',
            unit: 'story_points',
            dataPoints: [
              {
                timestamp: '2024-07-29T00:00:00Z',
                value: 8.5,
                trend: 'declining',
                changeRate: -0.15,
                movingAverage: 8.2,
              },
            ],
            overallTrend: {
              direction: 'declining',
              strength: 0.8,
              duration: '4 weeks',
              significance: 0.92,
              volatility: 0.15,
            },
            prediction: {
              nextValue: 7.8,
              confidence: 0.85,
              timeHorizon: '1 week',
              bounds: { lower: 7.2, upper: 8.4 },
            },
          },
        ],
        insights: {
          significantTrends: 1,
          improvingMetrics: 0,
          decliningMetrics: 1,
          volatileMetrics: 0,
          overallHealthTrend: 'declining',
        },
        recommendations: ['Monitor velocity decline closely'],
        generatedAt: '2024-07-31T15:30:00Z',
      };

      mockPredictionsService.getTrendHistory.mockResolvedValue(mockResponse);

      const result = await controller.getTrendHistory(projectId);

      expect(result).toEqual(mockResponse);
      expect(mockPredictionsService.getTrendHistory).toHaveBeenCalledWith(
        projectId,
        undefined,
        undefined,
        undefined,
        'daily'
      );
    });

    it('should handle query parameters correctly', async () => {
      const projectId = 'proj_123';
      const metric = 'velocity';
      const startDate = '2024-01-01T00:00:00Z';
      const endDate = '2024-07-31T23:59:59Z';
      const granularity = 'weekly';

      mockPredictionsService.getTrendHistory.mockResolvedValue({});

      await controller.getTrendHistory(
        projectId,
        metric,
        startDate,
        endDate,
        granularity
      );

      expect(mockPredictionsService.getTrendHistory).toHaveBeenCalledWith(
        projectId,
        metric,
        new Date(startDate),
        new Date(endDate),
        granularity
      );
    });
  });

  describe('getPredictionAccuracyMetrics', () => {
    it('should return accuracy metrics for a project', async () => {
      const projectId = 'proj_123';
      const mockResponse = {
        projectId,
        period: {
          startDate: '2024-01-01T00:00:00Z',
          endDate: '2024-07-31T23:59:59Z',
        },
        overallMetrics: {
          overallAccuracy: 0.87,
          precision: 0.82,
          recall: 0.91,
          f1Score: 0.86,
          falsePositiveRate: 0.08,
          falseNegativeRate: 0.05,
        },
        byType: {
          risk_alert: {
            accuracy: 0.89,
            totalPredictions: 25,
            confirmedPredictions: 22,
          },
          trend_alert: {
            accuracy: 0.85,
            totalPredictions: 15,
            confirmedPredictions: 13,
          },
        },
        accuracyTrend: [
          { period: '2024-07-01', accuracy: 0.85, predictions: 12 },
          { period: '2024-07-08', accuracy: 0.87, predictions: 15 },
        ],
        insights: [
          'Risk alert predictions show highest accuracy at 89%',
          'Overall accuracy has improved 15% over the last month',
        ],
        calculatedAt: '2024-07-31T15:30:00Z',
      };

      mockPredictionsService.getPredictionAccuracyMetrics.mockResolvedValue(
        mockResponse
      );

      const result = await controller.getPredictionAccuracyMetrics(projectId);

      expect(result).toEqual(mockResponse);
      expect(
        mockPredictionsService.getPredictionAccuracyMetrics
      ).toHaveBeenCalledWith(projectId, undefined, undefined);
    });

    it('should handle date parameters correctly', async () => {
      const projectId = 'proj_123';
      const startDate = '2024-01-01T00:00:00Z';
      const endDate = '2024-07-31T23:59:59Z';

      mockPredictionsService.getPredictionAccuracyMetrics.mockResolvedValue({});

      await controller.getPredictionAccuracyMetrics(
        projectId,
        startDate,
        endDate
      );

      expect(
        mockPredictionsService.getPredictionAccuracyMetrics
      ).toHaveBeenCalledWith(projectId, new Date(startDate), new Date(endDate));
    });
  });
});
