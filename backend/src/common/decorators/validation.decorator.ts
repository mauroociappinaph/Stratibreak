import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ValidationHelper } from '../helpers/validation.helper';

// ===== CUSTOM VALIDATION CONSTRAINTS =====

@ValidatorConstraint({ name: 'isValidGapType', async: false })
export class IsValidGapTypeConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    return typeof value === 'string' && ValidationHelper.isValidGapType(value);
  }

  defaultMessage(): string {
    return 'Gap type must be a valid GapType enum value';
  }
}

@ValidatorConstraint({ name: 'isValidSeverityLevel', async: false })
export class IsValidSeverityLevelConstraint
  implements ValidatorConstraintInterface
{
  validate(value: unknown): boolean {
    return (
      typeof value === 'string' && ValidationHelper.isValidSeverityLevel(value)
    );
  }

  defaultMessage(): string {
    return 'Severity level must be a valid SeverityLevel enum value';
  }
}

@ValidatorConstraint({ name: 'isValidPriority', async: false })
export class IsValidPriorityConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    return typeof value === 'string' && ValidationHelper.isValidPriority(value);
  }

  defaultMessage(): string {
    return 'Priority must be a valid Priority enum value';
  }
}

@ValidatorConstraint({ name: 'isValidConfidence', async: false })
export class IsValidConfidenceConstraint
  implements ValidatorConstraintInterface
{
  validate(value: unknown): boolean {
    return (
      typeof value === 'number' && ValidationHelper.isValidConfidence(value)
    );
  }

  defaultMessage(): string {
    return 'Confidence must be a number between 0 and 1';
  }
}

@ValidatorConstraint({ name: 'isValidPercentage', async: false })
export class IsValidPercentageConstraint
  implements ValidatorConstraintInterface
{
  validate(value: unknown): boolean {
    return (
      typeof value === 'number' && ValidationHelper.isValidPercentage(value)
    );
  }

  defaultMessage(): string {
    return 'Value must be a percentage between 0 and 100';
  }
}

@ValidatorConstraint({ name: 'isReasonableVariance', async: false })
export class IsReasonableVarianceConstraint
  implements ValidatorConstraintInterface
{
  validate(value: unknown): boolean {
    return (
      typeof value === 'number' && ValidationHelper.isReasonableVariance(value)
    );
  }

  defaultMessage(): string {
    return 'Variance must be reasonable (between -1000% and +1000%)';
  }
}

@ValidatorConstraint({ name: 'isValidContributionWeight', async: false })
export class IsValidContributionWeightConstraint
  implements ValidatorConstraintInterface
{
  validate(value: unknown): boolean {
    return (
      typeof value === 'number' &&
      ValidationHelper.isValidContributionWeight(value)
    );
  }

  defaultMessage(): string {
    return 'Contribution weight must be between 0 and 1';
  }
}

@ValidatorConstraint({ name: 'areValidTags', async: false })
export class AreValidTagsConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    return Array.isArray(value) && ValidationHelper.areValidTags(value);
  }

  defaultMessage(): string {
    return 'Tags must be an array of valid tag strings (1-50 characters, alphanumeric with hyphens and underscores)';
  }
}

@ValidatorConstraint({ name: 'isValidEvidence', async: false })
export class IsValidEvidenceConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    return Array.isArray(value) && ValidationHelper.isValidEvidence(value);
  }

  defaultMessage(): string {
    return 'Evidence must be an array of meaningful evidence strings (at least 10 characters each)';
  }
}

@ValidatorConstraint({ name: 'areValidStakeholders', async: false })
export class AreValidStakeholdersConstraint
  implements ValidatorConstraintInterface
{
  validate(value: unknown): boolean {
    return Array.isArray(value) && ValidationHelper.areValidStakeholders(value);
  }

  defaultMessage(): string {
    return 'Stakeholders must be an array of valid emails or names (3-100 characters)';
  }
}

@ValidatorConstraint({ name: 'isValidDateRange', async: false })
export class IsValidDateRangeConstraint
  implements ValidatorConstraintInterface
{
  validate(value: unknown, args: ValidationArguments): boolean {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as Record<string, unknown>)[
      relatedPropertyName
    ];

    if (!(value instanceof Date) || !(relatedValue instanceof Date)) {
      return false;
    }

    return ValidationHelper.isValidDateRange(value, relatedValue);
  }

  defaultMessage(args: ValidationArguments): string {
    const [relatedPropertyName] = args.constraints;
    return `${args.property} must be before ${relatedPropertyName}`;
  }
}

// ===== CUSTOM VALIDATION DECORATORS =====

/**
 * Validates that the value is a valid GapType enum
 */
export function IsValidGapType(
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return function (object: object, propertyName: string | symbol) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName as string,
      options: validationOptions || {},
      constraints: [],
      validator: IsValidGapTypeConstraint,
    });
  };
}

/**
 * Validates that the value is a valid SeverityLevel enum
 */
export function IsValidSeverityLevel(
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return function (object: object, propertyName: string | symbol) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName as string,
      options: validationOptions || {},
      constraints: [],
      validator: IsValidSeverityLevelConstraint,
    });
  };
}

/**
 * Validates that the value is a valid Priority enum
 */
export function IsValidPriority(
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return function (object: object, propertyName: string | symbol) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName as string,
      options: validationOptions || {},
      constraints: [],
      validator: IsValidPriorityConstraint,
    });
  };
}

/**
 * Validates that the value is a valid confidence score (0-1)
 */
export function IsValidConfidence(
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return function (object: object, propertyName: string | symbol) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName as string,
      options: validationOptions || {},
      constraints: [],
      validator: IsValidConfidenceConstraint,
    });
  };
}

/**
 * Validates that the value is a valid percentage (0-100)
 */
export function IsValidPercentage(
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return function (object: object, propertyName: string | symbol) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName as string,
      options: validationOptions || {},
      constraints: [],
      validator: IsValidPercentageConstraint,
    });
  };
}

/**
 * Validates that the variance is reasonable (-1000% to +1000%)
 */
export function IsReasonableVariance(
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return function (object: object, propertyName: string | symbol) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName as string,
      options: validationOptions || {},
      constraints: [],
      validator: IsReasonableVarianceConstraint,
    });
  };
}

/**
 * Validates that the contribution weight is valid (0-1)
 */
export function IsValidContributionWeight(
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return function (object: object, propertyName: string | symbol) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName as string,
      options: validationOptions || {},
      constraints: [],
      validator: IsValidContributionWeightConstraint,
    });
  };
}

/**
 * Validates that the tags array contains valid tags
 */
export function AreValidTags(
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return function (object: object, propertyName: string | symbol) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName as string,
      options: validationOptions || {},
      constraints: [],
      validator: AreValidTagsConstraint,
    });
  };
}

/**
 * Validates that the evidence array contains meaningful evidence
 */
export function IsValidEvidence(
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return function (object: object, propertyName: string | symbol) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName as string,
      options: validationOptions || {},
      constraints: [],
      validator: IsValidEvidenceConstraint,
    });
  };
}

/**
 * Validates that the stakeholders array contains valid stakeholders
 */
export function AreValidStakeholders(
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return function (object: object, propertyName: string | symbol) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName as string,
      options: validationOptions || {},
      constraints: [],
      validator: AreValidStakeholdersConstraint,
    });
  };
}

/**
 * Validates that the current date property is before another date property
 * @param property The name of the property to compare against
 */
export function IsDateBefore(
  property: string,
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return function (object: object, propertyName: string | symbol) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName as string,
      options: validationOptions || {},
      constraints: [property],
      validator: IsValidDateRangeConstraint,
    });
  };
}
