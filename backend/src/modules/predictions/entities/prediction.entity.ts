import { PredictionStatus, PredictionType, Severity } from '@prisma/client';

/**
 * Prediction Entity
 *
 * Represents a prediction about potential future issues or opportunities in a project.
 * Core fields include probability (likelihood of occurrence) and impact (severity level).
 */
export class PredictionEntity {
  id: string;
  projectId: string;
  userId: string;
  title: string;
  description: string;
  type: PredictionType;

  /**
   * Probability of the prediction occurring
   * Float value between 0.0 (0% chance) and 1.0 (100% chance)
   * Example: 0.75 = 75% probability
   */
  probability: number;

  /**
   * Impact level if the prediction materializes
   * Uses Severity enum: LOW, MEDIUM, HIGH, CRITICAL
   * Represents the potential severity of consequences
   */
  impact: Severity;

  status: PredictionStatus;
  predictedAt: Date;
  actualAt?: Date;
  accuracy?: number;
  estimatedTimeToOccurrence?: number; // in hours
  preventionWindow?: number; // in hours
  createdAt: Date;
  updatedAt: Date;
}
