import { Transform, TransformFnParams } from 'class-transformer';
import { GapType, Priority, SeverityLevel } from '../../types/database';

/**
 * Data transformation helper utilities
 */
export class TransformationHelper {
  // ===== STRING TRANSFORMATION FUNCTIONS =====

  /**
   * Converts string to kebab-case
   */
  static toKebabCase(str: string): string {
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[\s_]+/g, '-')
      .toLowerCase();
  }

  /**
   * Converts string to camelCase
   */
  static toCamelCase(str: string): string {
    return str
      .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ''))
      .replace(/^[A-Z]/, char => char.toLowerCase());
  }

  /**
   * Converts string to PascalCase
   */
  static toPascalCase(str: string): string {
    return str
      .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ''))
      .replace(/^[a-z]/, char => char.toUpperCase());
  }

  /**
   * Sanitizes string by removing special characters
   */
  static sanitizeString(str: string): string {
    return str.replace(/[^\w\s-]/gi, '').trim();
  }

  /**
   * Truncates string to specified length with ellipsis
   */
  static truncateString(str: string, maxLength: number): string {
    if (str.length <= maxLength) return str;
    return `${str.substring(0, maxLength - 3)}...`;
  }

  /**
   * Normalizes string for consistent comparison
   */
  static normalizeString(str: string): string {
    return str.toLowerCase().trim().replace(/\s+/g, ' ');
  }

  // ===== OBJECT TRANSFORMATION FUNCTIONS =====

  /**
   * Converts object keys to camelCase
   */
  static objectKeysToCamelCase(
    obj: Record<string, unknown>
  ): Record<string, unknown> {
    const result: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(obj)) {
      const camelKey = this.toCamelCase(key);

      if (value && typeof value === 'object' && !Array.isArray(value)) {
        result[camelKey] = this.objectKeysToCamelCase(
          value as Record<string, unknown>
        );
      } else if (Array.isArray(value)) {
        result[camelKey] = value.map(item =>
          item && typeof item === 'object'
            ? this.objectKeysToCamelCase(item as Record<string, unknown>)
            : item
        );
      } else {
        result[camelKey] = value;
      }
    }

    return result;
  }

  /**
   * Removes null and undefined values from object
   */
  static removeNullValues(
    obj: Record<string, unknown>
  ): Record<string, unknown> {
    const result: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(obj)) {
      if (value !== null && value !== undefined) {
        if (typeof value === 'object' && !Array.isArray(value)) {
          const cleaned = this.removeNullValues(
            value as Record<string, unknown>
          );
          if (Object.keys(cleaned).length > 0) {
            result[key] = cleaned;
          }
        } else {
          result[key] = value;
        }
      }
    }

    return result;
  }

  /**
   * Deep clones an object
   */
  static deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
    if (Array.isArray(obj))
      return obj.map(item => this.deepClone(item)) as unknown as T;

    const cloned = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = this.deepClone(obj[key]);
      }
    }
    return cloned;
  }

  // ===== BUSINESS DOMAIN TRANSFORMATION FUNCTIONS =====

  /**
   * Transforms string to valid GapType enum
   */
  static toGapType(value: string): GapType | undefined {
    const normalized = this.normalizeString(value)
      .replace(/\s+/g, '_')
      .toUpperCase();
    return Object.values(GapType).find(
      type => type.toUpperCase() === normalized
    );
  }

  /**
   * Transforms string to valid SeverityLevel enum
   */
  static toSeverityLevel(value: string): SeverityLevel | undefined {
    const normalized = this.normalizeString(value).toUpperCase();
    return Object.values(SeverityLevel).find(
      level => level.toUpperCase() === normalized
    );
  }

  /**
   * Transforms string to valid Priority enum
   */
  static toPriority(value: string): Priority | undefined {
    const normalized = this.normalizeString(value).toUpperCase();
    return Object.values(Priority).find(
      priority => priority.toUpperCase() === normalized
    );
  }

  /**
   * Transforms numeric string to number with validation
   */
  static toNumber(value: string | number): number | undefined {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? undefined : parsed;
    }
    return undefined;
  }

  /**
   * Transforms string to Date with validation
   */
  static toDate(value: string | Date): Date | undefined {
    if (value instanceof Date) return value;
    if (typeof value === 'string') {
      const parsed = new Date(value);
      return isNaN(parsed.getTime()) ? undefined : parsed;
    }
    return undefined;
  }

  /**
   * Transforms array of strings to trimmed, non-empty array
   */
  static toCleanStringArray(value: string[]): string[] {
    if (!Array.isArray(value)) return [];
    return value
      .map(item => (typeof item === 'string' ? item.trim() : ''))
      .filter(item => item.length > 0);
  }

  /**
   * Transforms tags array to normalized format
   */
  static toNormalizedTags(value: string[]): string[] {
    return this.toCleanStringArray(value)
      .map(tag => this.normalizeString(tag).replace(/\s+/g, '-'))
      .filter(tag => /^[a-zA-Z0-9_-]{1,50}$/.test(tag));
  }

  // ===== NUMERIC TRANSFORMATION FUNCTIONS =====

  /**
   * Rounds number to specified decimal places
   */
  static roundToDecimals(value: number, decimals: number): number {
    return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
  }

  /**
   * Clamps number between min and max values
   */
  static clampNumber(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  /**
   * Transforms percentage to decimal (0-100 to 0-1)
   */
  static percentageToDecimal(value: number): number {
    return this.clampNumber(value / 100, 0, 1);
  }

  /**
   * Transforms decimal to percentage (0-1 to 0-100)
   */
  static decimalToPercentage(value: number): number {
    return this.clampNumber(value * 100, 0, 100);
  }
}

// ===== CLASS-TRANSFORMER DECORATOR FUNCTIONS =====

/**
 * Transforms string to trimmed string
 */
export function TrimString(): PropertyDecorator {
  return Transform(({ value }: TransformFnParams) => {
    return typeof value === 'string' ? value.trim() : value;
  });
}

/**
 * Transforms string to normalized string
 */
export function NormalizeString(): PropertyDecorator {
  return Transform(({ value }: TransformFnParams) => {
    return typeof value === 'string'
      ? TransformationHelper.normalizeString(value)
      : value;
  });
}

/**
 * Transforms string to GapType enum
 */
export function ToGapType(): PropertyDecorator {
  return Transform(({ value }: TransformFnParams) => {
    return typeof value === 'string'
      ? TransformationHelper.toGapType(value)
      : value;
  });
}

/**
 * Transforms string to SeverityLevel enum
 */
export function ToSeverityLevel(): PropertyDecorator {
  return Transform(({ value }: TransformFnParams) => {
    return typeof value === 'string'
      ? TransformationHelper.toSeverityLevel(value)
      : value;
  });
}

/**
 * Transforms string to Priority enum
 */
export function ToPriority(): PropertyDecorator {
  return Transform(({ value }: TransformFnParams) => {
    return typeof value === 'string'
      ? TransformationHelper.toPriority(value)
      : value;
  });
}

/**
 * Transforms string or number to number
 */
export function ToNumber(): PropertyDecorator {
  return Transform(({ value }: TransformFnParams) => {
    return TransformationHelper.toNumber(value);
  });
}

/**
 * Transforms string or Date to Date
 */
export function ToDate(): PropertyDecorator {
  return Transform(({ value }: TransformFnParams) => {
    return TransformationHelper.toDate(value);
  });
}

/**
 * Transforms array to clean string array
 */
export function ToCleanStringArray(): PropertyDecorator {
  return Transform(({ value }: TransformFnParams) => {
    return TransformationHelper.toCleanStringArray(value);
  });
}

/**
 * Transforms array to normalized tags
 */
export function ToNormalizedTags(): PropertyDecorator {
  return Transform(({ value }: TransformFnParams) => {
    return TransformationHelper.toNormalizedTags(value);
  });
}

/**
 * Rounds number to specified decimal places
 */
export function RoundToDecimals(decimals: number): PropertyDecorator {
  return Transform(({ value }: TransformFnParams) => {
    return typeof value === 'number'
      ? TransformationHelper.roundToDecimals(value, decimals)
      : value;
  });
}

/**
 * Clamps number between min and max values
 */
export function ClampNumber(min: number, max: number): PropertyDecorator {
  return Transform(({ value }: TransformFnParams) => {
    return typeof value === 'number'
      ? TransformationHelper.clampNumber(value, min, max)
      : value;
  });
}

/**
 * Transforms percentage to decimal
 */
export function PercentageToDecimal(): PropertyDecorator {
  return Transform(({ value }: TransformFnParams) => {
    return typeof value === 'number'
      ? TransformationHelper.percentageToDecimal(value)
      : value;
  });
}

/**
 * Transforms decimal to percentage
 */
export function DecimalToPercentage(): PropertyDecorator {
  return Transform(({ value }: TransformFnParams) => {
    return typeof value === 'number'
      ? TransformationHelper.decimalToPercentage(value)
      : value;
  });
}
