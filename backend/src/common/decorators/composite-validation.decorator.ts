import { registerDecorator, ValidationOptions } from 'class-validator';
import { ValidationHelper } from '../helpers/validation.helper';

// ===== COMPOSITE VALIDATION DECORATORS =====

/**
 * Validates that a gap entity has all required fields with proper business logic
 */
export function IsValidGapEntity(
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return function (object: object, propertyName: string | symbol) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName as string,
      options: validationOptions || {},
      constraints: [],
      validator: {
        validate(value: unknown): boolean {
          if (!value || typeof value !== 'object') return false;

          const gapEntity = value as Record<string, unknown>;

          // Check required properties exist
          const requiredProps = [
            'type',
            'severity',
            'title',
            'description',
            'currentValue',
            'targetValue',
          ];
          if (!ValidationHelper.hasRequiredProperties(gapEntity, requiredProps))
            return false;

          // Validate business logic
          if (!ValidationHelper.isValidGapType(gapEntity.type as string))
            return false;
          if (
            !ValidationHelper.isValidSeverityLevel(gapEntity.severity as string)
          )
            return false;
          if (
            !ValidationHelper.isValidLength(gapEntity.title as string, 5, 200)
          )
            return false;
          if (
            !ValidationHelper.isValidLength(
              gapEntity.description as string,
              10,
              1000
            )
          )
            return false;

          return true;
        },
        defaultMessage(): string {
          return 'Gap entity must have valid type, severity, title, and description';
        },
      },
    });
  };
}

/**
 * Validates that a root cause has proper structure and business logic
 */
export function IsValidRootCause(
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return function (object: object, propertyName: string | symbol) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName as string,
      options: validationOptions || {},
      constraints: [],
      validator: {
        validate(value: unknown): boolean {
          if (!value || typeof value !== 'object') return false;

          const rootCause = value as Record<string, unknown>;

          // Check required properties
          const requiredProps = [
            'category',
            'description',
            'confidence',
            'contributionWeight',
          ];
          if (!ValidationHelper.hasRequiredProperties(rootCause, requiredProps))
            return false;

          // Validate business logic
          if (
            !ValidationHelper.isValidRootCauseCategory(
              rootCause.category as string
            )
          )
            return false;
          if (
            !ValidationHelper.isValidLength(
              rootCause.description as string,
              10,
              500
            )
          )
            return false;
          if (
            !ValidationHelper.isValidConfidence(rootCause.confidence as number)
          )
            return false;
          if (
            !ValidationHelper.isValidContributionWeight(
              rootCause.contributionWeight as number
            )
          )
            return false;

          return true;
        },
        defaultMessage(): string {
          return 'Root cause must have valid category, description, confidence, and contribution weight';
        },
      },
    });
  };
}
