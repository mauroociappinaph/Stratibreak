import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import 'reflect-metadata';
import {
  CalculateRiskProbabilityDto,
  CalculateRiskProbabilityResponseDto,
  GenerateEarlyWarningsDto,
  GenerateEarlyWarningsResponseDto,
  PredictFutureIssuesDto,
  PredictFutureIssuesResponseDto,
} from './index';

describe('Prediction DTOs', () => {
  describe('Request DTOs', () => {
    it('should validate PredictFutureIssuesDto correctly', async () => {
      const validData = {
        projectId: 'project-123',
        timeRange: {
          startDate: '2024-01-01T00:00:00Z',
          endDate: '2024-12-31T23:59:59Z',
        },
        metrics: [
          {
            name: 'velocity',
            values: [
              {
                timestamp: '2024-01-01T00:00:00Z',
                value: 10,
              },
            ],
            unit: 'points',
          },
        ],
        events: [
          {
            timestamp: '2024-01-01T00:00:00Z',
            type: 'milestone',
            description: 'Project started',
            impact: 'LOW',
          },
        ],
        patterns: [
          {
            patternType: 'seasonal',
            frequency: 0.8,
            confidence: 0.9,
            description: 'Seasonal pattern detected',
          },
        ],
      };

      const dto = plainToClass(PredictFutureIssuesDto, validData);
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate GenerateEarlyWarningsDto correctly', async () => {
      const validData = {
        projectId: 'project-123',
        currentMetrics: [
          {
            name: 'velocity',
            currentValue: 10,
            previousValue: 8,
            changeRate: 0.25,
            trend: 'improving',
            unit: 'points',
          },
        ],
        recentChanges: [
          {
            metric: 'velocity',
            changeType: 'gradual',
            magnitude: 2,
            timeframe: {
              value: 1,
              unit: 'weeks',
            },
            significance: 0.7,
          },
        ],
        velocityIndicators: [
          {
            name: 'sprint_velocity',
            currentVelocity: 10,
            averageVelocity: 8,
            trend: 'improving',
            predictedVelocity: 12,
          },
        ],
      };

      const dto = plainToClass(GenerateEarlyWarningsDto, validData);
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate CalculateRiskProbabilityDto correctly', async () => {
      const validData = {
        projectId: 'project-123',
        indicators: [
          {
            indicator: 'budget_variance',
            currentValue: 0.15,
            threshold: 0.1,
            trend: 'declining',
            weight: 0.8,
          },
        ],
      };

      const dto = plainToClass(CalculateRiskProbabilityDto, validData);
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });

  describe('Response DTOs', () => {
    it('should validate PredictFutureIssuesResponseDto correctly', async () => {
      const validData = {
        projectId: 'project-123',
        analysisTimestamp: '2024-01-01T00:00:00Z',
        predictions: [
          {
            issueType: 'budget_overrun',
            probability: 0.75,
            estimatedTimeToOccurrence: {
              value: 2,
              unit: 'weeks',
            },
            potentialImpact: 'HIGH',
            preventionWindow: {
              value: 1,
              unit: 'weeks',
            },
            suggestedActions: [
              {
                id: 'action-1',
                title: 'Review budget allocation',
                description: 'Conduct detailed budget review',
                priority: 'HIGH',
                estimatedEffort: '4 hours',
                requiredResources: ['budget_analyst', 'project_manager'],
                expectedImpact: 'Prevent budget overrun',
                deadline: '2024-01-15T00:00:00Z',
              },
            ],
          },
        ],
        confidenceLevel: 0.85,
      };

      const dto = plainToClass(PredictFutureIssuesResponseDto, validData);
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate GenerateEarlyWarningsResponseDto correctly', async () => {
      const validData = {
        projectId: 'project-123',
        analysisTimestamp: '2024-01-01T00:00:00Z',
        alerts: [
          {
            id: 'alert-1',
            projectId: 'project-123',
            type: 'risk_alert',
            severity: 'HIGH',
            title: 'Budget Risk Alert',
            description: 'Budget variance exceeding threshold',
            probability: 0.8,
            estimatedTimeToOccurrence: {
              value: 1,
              unit: 'weeks',
            },
            potentialImpact: 'HIGH',
            preventionWindow: {
              value: 3,
              unit: 'days',
            },
            suggestedActions: [
              {
                id: 'action-1',
                title: 'Budget review',
                description: 'Immediate budget review required',
                priority: 'HIGH',
                estimatedEffort: '2 hours',
                requiredResources: ['budget_analyst'],
                expectedImpact: 'Prevent budget overrun',
              },
            ],
            createdAt: '2024-01-01T00:00:00Z',
            expiresAt: '2024-01-08T00:00:00Z',
          },
        ],
        overallRiskLevel: 'high',
      };

      const dto = plainToClass(GenerateEarlyWarningsResponseDto, validData);
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate CalculateRiskProbabilityResponseDto correctly', async () => {
      const validData = {
        projectId: 'project-123',
        riskAssessment: {
          overallRisk: 0.65,
          riskFactors: [
            {
              factor: 'budget_variance',
              weight: 0.8,
              currentValue: 0.15,
              threshold: 0.1,
              trend: 'declining',
            },
          ],
          recommendations: [
            'Monitor budget closely',
            'Consider resource reallocation',
          ],
          confidenceLevel: 0.9,
        },
        analysisTimestamp: '2024-01-01T00:00:00Z',
      };

      const dto = plainToClass(CalculateRiskProbabilityResponseDto, validData);
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });
});
