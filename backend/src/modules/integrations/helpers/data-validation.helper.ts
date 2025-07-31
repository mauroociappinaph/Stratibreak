import type { ValidationResult } from '@/types/services';
import { Logger } from '@nestjs/common';

export class DataValidationHelper {
  private readonly logger = new Logger(DataValidationHelper.name);

  async validateDataConsistency(
    localData: unknown,
    externalData: unknown
  ): Promise<ValidationResult> {
    this.logger.debug('Validating data consistency');

    try {
      const inconsistencies: string[] = [];
      let confidence = 1.0;

      // Basic validation - check if both data exist
      if (!localData && !externalData) {
        return this.createValidResult();
      }

      if (!localData || !externalData) {
        return this.createInvalidResult(['Data missing in one source'], 0.0);
      }

      // Type validation
      if (typeof localData !== typeof externalData) {
        inconsistencies.push('Data type mismatch');
        confidence *= 0.5;
      }

      // Object validation
      if (this.areBothObjects(localData, externalData)) {
        const objectValidation = this.validateObjects(
          localData as Record<string, unknown>,
          externalData as Record<string, unknown>
        );
        inconsistencies.push(...objectValidation.inconsistencies);
        confidence *= objectValidation.confidenceMultiplier;
      }

      return {
        isValid: inconsistencies.length === 0,
        inconsistencies,
        confidence: Math.max(0, confidence),
      };
    } catch (error) {
      this.logger.error('Error validating data consistency:', error);
      return this.createInvalidResult(['Validation error occurred'], 0.0);
    }
  }

  private createValidResult(): ValidationResult {
    return {
      isValid: true,
      inconsistencies: [],
      confidence: 1.0,
    };
  }

  private createInvalidResult(
    inconsistencies: string[],
    confidence: number
  ): ValidationResult {
    return {
      isValid: false,
      inconsistencies,
      confidence,
    };
  }

  private areBothObjects(localData: unknown, externalData: unknown): boolean {
    return (
      typeof localData === 'object' &&
      typeof externalData === 'object' &&
      localData !== null &&
      externalData !== null
    );
  }

  private validateObjects(
    localObj: Record<string, unknown>,
    externalObj: Record<string, unknown>
  ): { inconsistencies: string[]; confidenceMultiplier: number } {
    const inconsistencies: string[] = [];
    let confidenceMultiplier = 1.0;

    const localKeys = Object.keys(localObj);
    const externalKeys = Object.keys(externalObj);

    // Check for missing keys
    const missingInLocal = externalKeys.filter(key => !localKeys.includes(key));
    const missingInExternal = localKeys.filter(
      key => !externalKeys.includes(key)
    );

    if (missingInLocal.length > 0) {
      inconsistencies.push(
        `Keys missing in local data: ${missingInLocal.join(', ')}`
      );
      confidenceMultiplier *= 0.8;
    }

    if (missingInExternal.length > 0) {
      inconsistencies.push(
        `Keys missing in external data: ${missingInExternal.join(', ')}`
      );
      confidenceMultiplier *= 0.8;
    }

    // Check for value differences in common keys
    const commonKeys = localKeys.filter(key => externalKeys.includes(key));
    for (const key of commonKeys) {
      if (localObj[key] !== externalObj[key]) {
        inconsistencies.push(`Value mismatch for key: ${key}`);
        confidenceMultiplier *= 0.9;
      }
    }

    return { inconsistencies, confidenceMultiplier };
  }
}
