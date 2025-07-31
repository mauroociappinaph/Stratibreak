import { PredictionType, Severity } from '@prisma/client';
import { validate } from 'class-validator';
import { CreatePredictionDto } from './create-prediction.dto';

describe('CreatePredictionDto', () => {
  it('should validate a valid prediction DTO', async () => {
    // Arrange
    const dto = new CreatePredictionDto();
    dto.projectId = 'project-123';
    dto.userId = 'user-456';
    dto.title = 'Test Prediction';
    dto.description = 'This is a test prediction';
    dto.type = PredictionType.DELAY_RISK;
    dto.probability = 0.75; // Valid probability between 0.0 and 1.0
    dto.impact = Severity.HIGH; // Valid severity level
    dto.predictedAt = '2024-01-01T00:00:00Z';

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors).toHaveLength(0);
  });

  it('should reject invalid probability values', async () => {
    // Test probability > 1.0
    const dto1 = new CreatePredictionDto();
    dto1.projectId = 'project-123';
    dto1.userId = 'user-456';
    dto1.title = 'Test Prediction';
    dto1.description = 'This is a test prediction';
    dto1.type = PredictionType.DELAY_RISK;
    dto1.probability = 1.5; // Invalid: > 1.0
    dto1.impact = Severity.HIGH;
    dto1.predictedAt = '2024-01-01T00:00:00Z';

    const errors1 = await validate(dto1);
    expect(errors1.length).toBeGreaterThan(0);
    expect(errors1.some(error => error.property === 'probability')).toBe(true);

    // Test probability < 0.0
    const dto2 = new CreatePredictionDto();
    dto2.projectId = 'project-123';
    dto2.userId = 'user-456';
    dto2.title = 'Test Prediction';
    dto2.description = 'This is a test prediction';
    dto2.type = PredictionType.DELAY_RISK;
    dto2.probability = -0.1; // Invalid: < 0.0
    dto2.impact = Severity.HIGH;
    dto2.predictedAt = '2024-01-01T00:00:00Z';

    const errors2 = await validate(dto2);
    expect(errors2.length).toBeGreaterThan(0);
    expect(errors2.some(error => error.property === 'probability')).toBe(true);
  });

  it('should validate boundary probability values', async () => {
    // Test probability = 0.0 (valid boundary)
    const dto1 = new CreatePredictionDto();
    dto1.projectId = 'project-123';
    dto1.userId = 'user-456';
    dto1.title = 'Test Prediction';
    dto1.description = 'This is a test prediction';
    dto1.type = PredictionType.DELAY_RISK;
    dto1.probability = 0.0; // Valid boundary
    dto1.impact = Severity.LOW;
    dto1.predictedAt = '2024-01-01T00:00:00Z';

    const errors1 = await validate(dto1);
    expect(errors1).toHaveLength(0);

    // Test probability = 1.0 (valid boundary)
    const dto2 = new CreatePredictionDto();
    dto2.projectId = 'project-123';
    dto2.userId = 'user-456';
    dto2.title = 'Test Prediction';
    dto2.description = 'This is a test prediction';
    dto2.type = PredictionType.DELAY_RISK;
    dto2.probability = 1.0; // Valid boundary
    dto2.impact = Severity.CRITICAL;
    dto2.predictedAt = '2024-01-01T00:00:00Z';

    const errors2 = await validate(dto2);
    expect(errors2).toHaveLength(0);
  });

  it('should validate all severity levels for impact', async () => {
    const severityLevels = [
      Severity.LOW,
      Severity.MEDIUM,
      Severity.HIGH,
      Severity.CRITICAL,
    ];

    for (const severity of severityLevels) {
      const dto = new CreatePredictionDto();
      dto.projectId = 'project-123';
      dto.userId = 'user-456';
      dto.title = 'Test Prediction';
      dto.description = 'This is a test prediction';
      dto.type = PredictionType.DELAY_RISK;
      dto.probability = 0.5;
      dto.impact = severity; // Test each severity level
      dto.predictedAt = '2024-01-01T00:00:00Z';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    }
  });

  it('should validate optional fields correctly', async () => {
    // Test with optional fields
    const dto = new CreatePredictionDto();
    dto.projectId = 'project-123';
    dto.userId = 'user-456';
    dto.title = 'Test Prediction';
    dto.description = 'This is a test prediction';
    dto.type = PredictionType.DELAY_RISK;
    dto.probability = 0.75;
    dto.impact = Severity.HIGH;
    dto.predictedAt = '2024-01-01T00:00:00Z';
    dto.actualAt = '2024-01-02T00:00:00Z';
    dto.accuracy = 0.85; // Valid accuracy between 0.0 and 1.0
    dto.estimatedTimeToOccurrence = 48; // Valid positive number
    dto.preventionWindow = 24; // Valid positive number

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should reject invalid optional field values', async () => {
    // Test invalid accuracy
    const dto = new CreatePredictionDto();
    dto.projectId = 'project-123';
    dto.userId = 'user-456';
    dto.title = 'Test Prediction';
    dto.description = 'This is a test prediction';
    dto.type = PredictionType.DELAY_RISK;
    dto.probability = 0.75;
    dto.impact = Severity.HIGH;
    dto.predictedAt = '2024-01-01T00:00:00Z';
    dto.accuracy = 1.5; // Invalid: > 1.0
    dto.estimatedTimeToOccurrence = -10; // Invalid: negative

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some(error => error.property === 'accuracy')).toBe(true);
    expect(
      errors.some(error => error.property === 'estimatedTimeToOccurrence')
    ).toBe(true);
  });
});
