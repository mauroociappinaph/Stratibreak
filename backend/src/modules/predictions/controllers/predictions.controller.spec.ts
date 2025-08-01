import { Test, TestingModule } from '@nestjs/testing';
import {
  EarlyWarningService,
  PredictionsService,
  PredictiveService,
  RiskCalculatorService,
} from '../services';
import { PredictionsController } from './predictions.controller';

describe('PredictionsController', () => {
  let controller: PredictionsController;
  let predictiveService: PredictiveService;
  let earlyWarningService: EarlyWarningService;
  let riskCalculatorService: RiskCalculatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PredictionsController],
      providers: [
        {
          provide: PredictionsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            generatePredictions: jest.fn(),
            findByProject: jest.fn(),
          },
        },
        {
          provide: PredictiveService,
          useValue: {
            predictFutureIssues: jest.fn(),
            generateEarlyWarnings: jest.fn(),
            calculateRiskProbability: jest.fn(),
            analyzeTrends: jest.fn(),
          },
        },
        {
          provide: EarlyWarningService,
          useValue: {
            generateComprehensiveWarnings: jest.fn(),
            generatePredictiveAlerts: jest.fn(),
            generateEscalationAlerts: jest.fn(),
          },
        },
        {
          provide: RiskCalculatorService,
          useValue: {
            calculateMonteCarloRisk: jest.fn(),
            calculateDynamicThresholds: jest.fn(),
            calculateCompoundRisk: jest.fn(),
            calculateIndicatorRisk: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PredictionsController>(PredictionsController);
    predictiveService = module.get<PredictiveService>(PredictiveService);
    earlyWarningService = module.get<EarlyWarningService>(EarlyWarningService);
    riskCalculatorService = module.get<RiskCalculatorService>(
      RiskCalculatorService
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getRiskAssessment', () => {
    it('should return comprehensive risk assessment', async () => {
      const projectId = 'test-project-123';

      // Mock the predictive service response
      jest
        .spyOn(predictiveService, 'calculateRiskProbability')
        .mockReturnValue({
          overallRisk: 0.45,
          riskFactors: [
            {
              factor: 'velocity_trend',
              weight: 0.8,
              currentValue: 7.2,
              threshold: 8.5,
              trend: 'declining',
            },
          ],
          recommendations: ['Increase resource allocation by 15%'],
          confidenceLevel: 0.85,
        });

      jest.spyOn(predictiveService, 'generateEarlyWarnings').mockReturnValue([
        {
          id: 'alert_123',
          projectId,
          type: 'trend_alert' as any,
          severity: 'medium' as any,
          title: 'Velocity declining trend detected',
          description: 'Development velocity has been declining',
          probability: 0.8,
          estimatedTimeToOccurrence: { value: 48, unit: 'hours' as any },
          potentialImpact: 'medium' as any,
          preventionWindow: { value: 24, unit: 'hours' as any },
          suggestedActions: [],
          createdAt: new Date(),
          expiresAt: new Date(),
        },
      ]);

      const result = await controller.getRiskAssessment(projectId);

      expect(result).toBeDefined();
      expect(result.projectId).toBe(projectId);
      expect(result.overallRiskLevel).toBe('MEDIUM');
      expect(result.riskScore).toBe(0.45);
      expect(result.riskAssessment).toBeDefined();
      expect(result.earlyWarnings).toBeDefined();
      expect(Array.isArray(result.criticalRisks)).toBe(true);
      expect(result.analysisTimestamp).toBeDefined();
    });
  });

  describe('generatePredictiveAlerts', () => {
    it('should generate predictive alerts with 72+ hour advance warning', async () => {
      const projectId = 'test-project-123';

      jest
        .spyOn(earlyWarningService, 'generatePredictiveAlerts')
        .mockResolvedValue([
          {
            id: 'predictive_alert_123',
            projectId,
            type: 'early_warning' as any,
            severity: 'high' as any,
            title: 'Predicted resource shortage',
            description: 'Resource shortage predicted in 72 hours',
            probability: 0.85,
            estimatedTimeToOccurrence: { value: 72, unit: 'hours' as any },
            potentialImpact: 'high' as any,
            preventionWindow: { value: 48, unit: 'hours' as any },
            suggestedActions: [],
            createdAt: new Date(),
            expiresAt: new Date(),
          },
        ]);

      const result = await controller.generatePredictiveAlerts(projectId);

      expect(result).toBeDefined();
      expect(result.projectId).toBe(projectId);
      expect(result.advanceWarningHours).toBe(72);
      expect(Array.isArray(result.predictiveAlerts)).toBe(true);
      expect(result.predictiveAlerts.length).toBeGreaterThan(0);
      expect(result.analysisTimestamp).toBeDefined();
    });
  });

  describe('analyzeRiskCorrelations', () => {
    it('should analyze risk correlations between indicators', async () => {
      const requestDto = {
        projectId: 'test-project-123',
        indicators: [
          {
            indicator: 'velocity_trend',
            currentValue: 7.2,
            threshold: 8.5,
            trend: 'declining',
            weight: 0.8,
          },
          {
            indicator: 'resource_utilization',
            currentValue: 0.65,
            threshold: 0.8,
            trend: 'stable',
            weight: 0.7,
          },
        ],
      };

      jest
        .spyOn(predictiveService, 'calculateRiskProbability')
        .mockReturnValue({
          overallRisk: 0.52,
          riskFactors: [],
          recommendations: ['Monitor correlated risks simultaneously'],
          confidenceLevel: 0.8,
        });

      const result = await controller.analyzeRiskCorrelations(requestDto);

      expect(result).toBeDefined();
      expect(result.projectId).toBe(requestDto.projectId);
      expect(Array.isArray(result.individualRisks)).toBe(true);
      expect(result.compoundRisk).toBeDefined();
      expect(Array.isArray(result.correlationMatrix)).toBe(true);
      expect(Array.isArray(result.riskInteractions)).toBe(true);
      expect(Array.isArray(result.recommendations)).toBe(true);
      expect(result.analysisTimestamp).toBeDefined();
    });
  });

  describe('getEarlyWarningStatus', () => {
    it('should return current early warning status', async () => {
      const projectId = 'test-project-123';

      jest
        .spyOn(earlyWarningService, 'generateEscalationAlerts')
        .mockReturnValue([]);

      const result = await controller.getEarlyWarningStatus(projectId);

      expect(result).toBeDefined();
      expect(result.projectId).toBe(projectId);
      expect(Array.isArray(result.activeWarnings)).toBe(true);
      expect(Array.isArray(result.escalationAlerts)).toBe(true);
      expect(result.warningStatistics).toBeDefined();
      expect(result.nextReviewTime).toBeDefined();
      expect(result.analysisTimestamp).toBeDefined();
    });
  });

  describe('performMonteCarloRiskAnalysis', () => {
    it('should perform Monte Carlo risk simulation', async () => {
      const requestDto = {
        projectId: 'test-project-123',
        indicators: [
          {
            indicator: 'velocity_trend',
            currentValue: 7.2,
            threshold: 8.5,
            trend: 'declining',
            weight: 0.8,
          },
        ],
      };

      jest
        .spyOn(riskCalculatorService, 'calculateMonteCarloRisk')
        .mockResolvedValue({
          meanRisk: 0.45,
          confidenceInterval: { lower: 0.32, upper: 0.58 },
          riskDistribution: [0.3, 0.4, 0.5, 0.6, 0.7],
        });

      jest
        .spyOn(riskCalculatorService, 'calculateCompoundRisk')
        .mockReturnValue(0.52);

      const result = await controller.performMonteCarloRiskAnalysis(requestDto);

      expect(result).toBeDefined();
      expect(result.projectId).toBe(requestDto.projectId);
      expect(result.monteCarloAnalysis).toBeDefined();
      expect(result.compoundRisk).toBeDefined();
      expect(result.riskMetrics).toBeDefined();
      expect(Array.isArray(result.recommendations)).toBe(true);
      expect(result.simulationParameters).toBeDefined();
      expect(result.analysisTimestamp).toBeDefined();
    });
  });

  describe('calculateDynamicRiskThresholds', () => {
    it('should calculate dynamic risk thresholds', async () => {
      const projectId = 'test-project-123';
      const requestDto = {
        projectId,
        indicators: [
          {
            indicator: 'velocity_trend',
            currentValue: 7.2,
            threshold: 8.5,
            trend: 'declining',
            weight: 0.8,
          },
        ],
      };

      jest
        .spyOn(riskCalculatorService, 'calculateDynamicThresholds')
        .mockReturnValue({
          warning: 7.5,
          critical: 8.0,
          emergency: 8.5,
        });

      const result = await controller.calculateDynamicRiskThresholds(
        projectId,
        requestDto
      );

      expect(result).toBeDefined();
      expect(result.projectId).toBe(projectId);
      expect(Array.isArray(result.dynamicThresholds)).toBe(true);
      expect(result.thresholdAnalysis).toBeDefined();
      expect(Array.isArray(result.recommendations)).toBe(true);
      expect(result.historicalDataPeriod).toBeDefined();
      expect(result.analysisTimestamp).toBeDefined();
    });
  });
});
