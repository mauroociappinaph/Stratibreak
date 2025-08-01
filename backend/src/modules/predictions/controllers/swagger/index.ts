// Barrel export for all Swagger documentation
export * from './predictions-history.swagger';
export * from './predictions.swagger';

// Re-export all decorators for easy access
export {
  calculateRiskProbability,
  generateEarlyWarnings,
  predictFutureIssues,
} from './predictions.swagger';

export {
  getPredictionHistory,
  getTrendHistory,
} from './predictions-history.swagger';
