import {
  CriticalityLevel,
  GapCategory,
  GapStatus,
  GapType,
  ImpactLevel,
  ImpactType,
  Priority,
  RootCauseCategory,
  SeverityLevel,
} from '../../types/database';

/**
 * Validation helper utilities for common validation tasks
 */
export class ValidationHelper {
  // ===== BASIC VALIDATION FUNCTIONS =====

  /**
   * Validates email format
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Checks if value is not null or undefined
   */
  static isNotEmpty<T>(value: T | null | undefined): value is T {
    return value !== null && value !== undefined;
  }

  /**
   * Validates UUID format
   */
  static isValidUUID(uuid: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  /**
   * Validates string length within range
   */
  static isValidLength(value: string, min: number, max: number): boolean {
    return value.length >= min && value.length <= max;
  }

  /**
   * Validates if string contains only alphanumeric characters
   */
  static isAlphanumeric(value: string): boolean {
    const alphanumericRegex = /^[a-zA-Z0-9]+$/;
    return alphanumericRegex.test(value);
  }

  /**
   * Validates password strength
   */
  static isStrongPassword(password: string): boolean {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  }

  /**
   * Validates if array has elements
   */
  static isNonEmptyArray<T>(array: T[]): boolean {
    return Array.isArray(array) && array.length > 0;
  }

  // ===== BUSINESS DOMAIN VALIDATION FUNCTIONS =====

  /**
   * Validates if value is a valid gap type
   */
  static isValidGapType(value: string): value is GapType {
    return Object.values(GapType).includes(value as GapType);
  }

  /**
   * Validates if value is a valid gap category
   */
  static isValidGapCategory(value: string): value is GapCategory {
    return Object.values(GapCategory).includes(value as GapCategory);
  }

  /**
   * Validates if value is a valid gap status
   */
  static isValidGapStatus(value: string): value is GapStatus {
    return Object.values(GapStatus).includes(value as GapStatus);
  }

  /**
   * Validates if value is a valid severity level
   */
  static isValidSeverityLevel(value: string): value is SeverityLevel {
    return Object.values(SeverityLevel).includes(value as SeverityLevel);
  }

  /**
   * Validates if value is a valid priority level
   */
  static isValidPriority(value: string): value is Priority {
    return Object.values(Priority).includes(value as Priority);
  }

  /**
   * Validates if value is a valid root cause category
   */
  static isValidRootCauseCategory(value: string): value is RootCauseCategory {
    return Object.values(RootCauseCategory).includes(
      value as RootCauseCategory
    );
  }

  /**
   * Validates if value is a valid impact type
   */
  static isValidImpactType(value: string): value is ImpactType {
    return Object.values(ImpactType).includes(value as ImpactType);
  }

  /**
   * Validates if value is a valid impact level
   */
  static isValidImpactLevel(value: string): value is ImpactLevel {
    return Object.values(ImpactLevel).includes(value as ImpactLevel);
  }

  /**
   * Validates if value is a valid criticality level
   */
  static isValidCriticalityLevel(value: string): value is CriticalityLevel {
    return Object.values(CriticalityLevel).includes(value as CriticalityLevel);
  }

  // ===== NUMERIC VALIDATION FUNCTIONS =====

  /**
   * Validates if number is within range (inclusive)
   */
  static isInRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max;
  }

  /**
   * Validates if number is a valid percentage (0-100)
   */
  static isValidPercentage(value: number): boolean {
    return this.isInRange(value, 0, 100);
  }

  /**
   * Validates if number is a valid confidence score (0-1)
   */
  static isValidConfidence(value: number): boolean {
    return this.isInRange(value, 0, 1);
  }

  /**
   * Validates if number is positive
   */
  static isPositive(value: number): boolean {
    return value > 0;
  }

  /**
   * Validates if number is non-negative
   */
  static isNonNegative(value: number): boolean {
    return value >= 0;
  }

  // ===== DATE VALIDATION FUNCTIONS =====

  /**
   * Validates if date is in the future
   */
  static isFutureDate(date: Date): boolean {
    return date > new Date();
  }

  /**
   * Validates if date is in the past
   */
  static isPastDate(date: Date): boolean {
    return date < new Date();
  }

  /**
   * Validates if start date is before end date
   */
  static isValidDateRange(startDate: Date, endDate: Date): boolean {
    return startDate < endDate;
  }

  /**
   * Validates if date is within a specific range
   */
  static isDateInRange(date: Date, startDate: Date, endDate: Date): boolean {
    return date >= startDate && date <= endDate;
  }

  // ===== OBJECT VALIDATION FUNCTIONS =====

  /**
   * Validates if object has required properties
   */
  static hasRequiredProperties<T extends Record<string, unknown>>(
    obj: T,
    requiredProps: (keyof T)[]
  ): boolean {
    return requiredProps.every(prop => this.isNotEmpty(obj[prop]));
  }

  /**
   * Validates if all array elements are unique
   */
  static hasUniqueElements<T>(array: T[]): boolean {
    return new Set(array).size === array.length;
  }

  /**
   * Validates if string is a valid JSON
   */
  static isValidJSON(value: string): boolean {
    try {
      JSON.parse(value);
      return true;
    } catch {
      return false;
    }
  }

  // ===== BUSINESS LOGIC VALIDATION FUNCTIONS =====

  /**
   * Validates if gap variance is reasonable (not extreme)
   */
  static isReasonableVariance(variance: number): boolean {
    // Variance should be between -1000% and +1000%
    return this.isInRange(variance, -10, 10);
  }

  /**
   * Validates if contribution weight is valid for root cause analysis
   */
  static isValidContributionWeight(weight: number): boolean {
    return this.isInRange(weight, 0, 1);
  }

  /**
   * Validates if tags array contains valid tag format
   */
  static areValidTags(tags: string[]): boolean {
    if (!Array.isArray(tags)) return false;

    return tags.every(tag => {
      // Tags should be 1-50 characters, alphanumeric with hyphens and underscores
      const tagRegex = /^[a-zA-Z0-9_-]{1,50}$/;
      return tagRegex.test(tag);
    });
  }

  /**
   * Validates if evidence array contains meaningful evidence
   */
  static isValidEvidence(evidence: string[]): boolean {
    if (!this.isNonEmptyArray(evidence)) return false;

    return evidence.every(item => {
      // Each evidence item should be at least 10 characters
      return typeof item === 'string' && item.trim().length >= 10;
    });
  }

  /**
   * Validates if affected stakeholders list is reasonable
   */
  static areValidStakeholders(stakeholders: string[]): boolean {
    if (!Array.isArray(stakeholders)) return false;

    return stakeholders.every(stakeholder => {
      // Stakeholder should be a valid email or name (3-100 characters)
      return (
        typeof stakeholder === 'string' &&
        (this.isValidEmail(stakeholder) ||
          this.isValidLength(stakeholder, 3, 100))
      );
    });
  }
}
