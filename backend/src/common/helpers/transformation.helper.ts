/**
 * Data transformation helper utilities
 */
export class TransformationHelper {
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
    return str.substring(0, maxLength - 3) + '...';
  }

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
}
