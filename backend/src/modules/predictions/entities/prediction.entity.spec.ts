import { PredictionStatus, PredictionType, Severity } from '@prisma/client';
import { PredictionEntity } from './prediction.entity';

describe('PredictionEntity', () => {
  it('should create a prediction entity with probability and impact fields', () => {
    // Arrange
    const predictionData = {
      id: 'test-id',
      projectId: 'project-123',
      userId: 'user-456',
      title: 'Test Prediction',
      description: 'This is a test prediction',
      type: PredictionType.DELAY_RISK,
      probability: 0.75, // 75% probability
      impact: Severity.HIGH, // High impact
      status: PredictionStatus.PENDING,
      predictedAt: new Date('2024-01-01T00:00:00Z'),
      actualAt: undefined,
      accuracy: undefined,
      estimatedTimeToOccurrence: 48, // 48 hours
      preventionWindow: 24, // 24 hours
      createdAt: new Date('2024-01-01T00:00:00Z'),
      updatedAt: new Date('2024-01-01T00:00:00Z'),
    };

    // Act
    const prediction = new PredictionEntity();
    Object.assign(prediction, predictionData);

    // Assert
    expect(prediction.id).toBe('test-id');
    expect(prediction.projectId).toBe('project-123');
    expect(prediction.userId).toBe('user-456');
    expect(prediction.title).toBe('Test Prediction');
    expect(prediction.description).toBe('This is a test prediction');
    expect(prediction.type).toBe(PredictionType.DELAY_RISK);
    expect(prediction.probability).toBe(0.75);
    expect(prediction.impact).toBe(Severity.HIGH);
    expect(prediction.status).toBe(PredictionStatus.PENDING);
    expect(prediction.predictedAt).toEqual(new Date('2024-01-01T00:00:00Z'));
    expect(prediction.actualAt).toBeUndefined();
    expect(prediction.accuracy).toBeUndefined();
    expect(prediction.estimatedTimeToOccurrence).toBe(48);
    expect(prediction.preventionWindow).toBe(24);
    expect(prediction.createdAt).toEqual(new Date('2024-01-01T00:00:00Z'));
    expect(prediction.updatedAt).toEqual(new Date('2024-01-01T00:00:00Z'));
  });

  it('should handle optional fields correctly', () => {
    // Arrange
    const minimalPredictionData = {
      id: 'test-id-2',
      projectId: 'project-789',
      userId: 'user-101',
      title: 'Minimal Prediction',
      description: 'Minimal test prediction',
      type: PredictionType.RESOURCE_SHORTAGE,
      probability: 0.25, // 25% probability
      impact: Severity.LOW, // Low impact
      status: PredictionStatus.CONFIRMED,
      predictedAt: new Date('2024-02-01T00:00:00Z'),
      createdAt: new Date('2024-02-01T00:00:00Z'),
      updatedAt: new Date('2024-02-01T00:00:00Z'),
    };

    // Act
    const prediction = new PredictionEntity();
    Object.assign(prediction, minimalPredictionData);

    // Assert
    expect(prediction.probability).toBe(0.25);
    expect(prediction.impact).toBe(Severity.LOW);
    expect(prediction.actualAt).toBeUndefined();
    expect(prediction.accuracy).toBeUndefined();
    expect(prediction.estimatedTimeToOccurrence).toBeUndefined();
    expect(prediction.preventionWindow).toBeUndefined();
  });

  it('should validate probability range (0.0 to 1.0)', () => {
    // This test demonstrates the expected probability range
    // Actual validation would be handled by class-validator in DTOs
    const validProbabilities = [0.0, 0.25, 0.5, 0.75, 1.0];

    validProbabilities.forEach(prob => {
      const prediction = new PredictionEntity();
      prediction.probability = prob;
      expect(prediction.probability).toBeGreaterThanOrEqual(0.0);
      expect(prediction.probability).toBeLessThanOrEqual(1.0);
    });
  });

  it('should use Severity enum for impact levels', () => {
    // Test all severity levels
    const severityLevels = [
      Severity.LOW,
      Severity.MEDIUM,
      Severity.HIGH,
      Severity.CRITICAL,
    ];

    severityLevels.forEach(severity => {
      const prediction = new PredictionEntity();
      prediction.impact = severity;
      expect(Object.values(Severity)).toContain(prediction.impact);
    });
  });
});
