import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import 'reflect-metadata';
import {
  CreateRiskIndicatorDto,
  HistoricalDataPointDto,
  IndicatorCategory,
  RiskIndicatorDto,
  RiskIndicatorWithHistoryDto,
  RiskLevel,
  TrendDirection,
  UpdateRiskIndicatorDto,
} from './risk-indicator.dto';

describe('Risk Indicator DTOs', () => {
  describe('RiskIndicatorDto', () => {
    it('should validate a valid risk indicator DTO', async () => {
      const validData = {
        id: 'indicator-123',
        projectId: 'project-456',
        name: 'Budget Variance',
        description: 'Tracks budget variance over time',
        category: IndicatorCategory.BUDGET,
        currentValue: 15.5,
        threshold: 10.0,
        weight: 0.8,
        trend: TrendDirection.DECLINING,
        riskLevel: RiskLevel.HIGH,
        confidence: 0.9,
        lastUpdated: '2024-01-01T00:00:00Z',
        unit: 'percentage',
        source: 'financial_system',
      };

      const dto = plainToClass(RiskIndicatorDto, validData);
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should reject invalid weight values', async () => {
      const invalidData = {
        id: 'indicator-123',
        projectId: 'project-456',
        name: 'Budget Variance',
        description: 'Tracks budget variance over time',
        category: IndicatorCategory.BUDGET,
        currentValue: 15.5,
        threshold: 10.0,
        weight: 1.5, // Invalid: > 1.0
        trend: TrendDirection.DECLINING,
        riskLevel: RiskLevel.HIGH,
        confidence: 0.9,
        lastUpdated: '2024-01-01T00:00:00Z',
      };

      const dto = plainToClass(RiskIndicatorDto, invalidData);
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(error => error.property === 'weight')).toBe(true);
    });

    it('should reject negative values', async () => {
      const invalidData = {
        id: 'indicator-123',
        projectId: 'project-456',
        name: 'Budget Variance',
        description: 'Tracks budget variance over time',
        category: IndicatorCategory.BUDGET,
        currentValue: -5.0, // Invalid: negative
        threshold: -2.0, // Invalid: negative
        weight: 0.8,
        trend: TrendDirection.DECLINING,
        riskLevel: RiskLevel.HIGH,
        confidence: 0.9,
        lastUpdated: '2024-01-01T00:00:00Z',
      };

      const dto = plainToClass(RiskIndicatorDto, invalidData);
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(error => error.property === 'currentValue')).toBe(
        true
      );
      expect(errors.some(error => error.property === 'threshold')).toBe(true);
    });
  });

  describe('CreateRiskIndicatorDto', () => {
    it('should validate a valid create risk indicator DTO', async () => {
      const validData = {
        projectId: 'project-456',
        name: 'Budget Variance',
        description: 'Tracks budget variance over time',
        category: IndicatorCategory.BUDGET,
        currentValue: 15.5,
        threshold: 10.0,
        weight: 0.8,
        unit: 'percentage',
        source: 'financial_system',
      };

      const dto = plainToClass(CreateRiskIndicatorDto, validData);
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate without optional fields', async () => {
      const validData = {
        projectId: 'project-456',
        name: 'Budget Variance',
        description: 'Tracks budget variance over time',
        category: IndicatorCategory.BUDGET,
        currentValue: 15.5,
        threshold: 10.0,
        weight: 0.8,
      };

      const dto = plainToClass(CreateRiskIndicatorDto, validData);
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });

  describe('UpdateRiskIndicatorDto', () => {
    it('should validate partial updates', async () => {
      const validData = {
        currentValue: 20.0,
        trend: TrendDirection.IMPROVING,
      };

      const dto = plainToClass(UpdateRiskIndicatorDto, validData);
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate empty updates', async () => {
      const validData = {};

      const dto = plainToClass(UpdateRiskIndicatorDto, validData);
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });

  describe('HistoricalDataPointDto', () => {
    it('should validate a valid historical data point', async () => {
      const validData = {
        timestamp: '2024-01-01T00:00:00Z',
        value: 15.5,
        context: 'Monthly budget review',
      };

      const dto = plainToClass(HistoricalDataPointDto, validData);
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate without optional context', async () => {
      const validData = {
        timestamp: '2024-01-01T00:00:00Z',
        value: 15.5,
      };

      const dto = plainToClass(HistoricalDataPointDto, validData);
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });

  describe('RiskIndicatorWithHistoryDto', () => {
    it('should validate risk indicator with historical data', async () => {
      const validData = {
        id: 'indicator-123',
        projectId: 'project-456',
        name: 'Budget Variance',
        description: 'Tracks budget variance over time',
        category: IndicatorCategory.BUDGET,
        currentValue: 15.5,
        threshold: 10.0,
        weight: 0.8,
        trend: TrendDirection.DECLINING,
        riskLevel: RiskLevel.HIGH,
        confidence: 0.9,
        lastUpdated: '2024-01-01T00:00:00Z',
        historicalData: [
          {
            timestamp: '2024-01-01T00:00:00Z',
            value: 15.5,
            context: 'Monthly review',
          },
          {
            timestamp: '2023-12-01T00:00:00Z',
            value: 12.0,
          },
        ],
        predictedTrend: 0.75,
      };

      const dto = plainToClass(RiskIndicatorWithHistoryDto, validData);
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });

  describe('Enums', () => {
    it('should validate all trend directions', () => {
      const trends = [
        TrendDirection.IMPROVING,
        TrendDirection.STABLE,
        TrendDirection.DECLINING,
        TrendDirection.VOLATILE,
      ];

      trends.forEach(trend => {
        expect(Object.values(TrendDirection)).toContain(trend);
      });
    });

    it('should validate all risk levels', () => {
      const levels = [
        RiskLevel.LOW,
        RiskLevel.MEDIUM,
        RiskLevel.HIGH,
        RiskLevel.CRITICAL,
      ];

      levels.forEach(level => {
        expect(Object.values(RiskLevel)).toContain(level);
      });
    });

    it('should validate all indicator categories', () => {
      const categories = [
        IndicatorCategory.TIMELINE,
        IndicatorCategory.BUDGET,
        IndicatorCategory.QUALITY,
        IndicatorCategory.RESOURCE,
        IndicatorCategory.SCOPE,
        IndicatorCategory.STAKEHOLDER,
        IndicatorCategory.COMMUNICATION,
        IndicatorCategory.TECHNOLOGY,
      ];

      categories.forEach(category => {
        expect(Object.values(IndicatorCategory)).toContain(category);
      });
    });
  });
});
