// Re-export from modular Swagger files
export {
  calculateRiskProbability,
  generateEarlyWarnings,
  predictFutureIssues,
} from './swagger/predictions.swagger';

// Import for use in the object
import {
  calculateRiskProbability as calcRiskProb,
  generateEarlyWarnings as genEarlyWarnings,
  predictFutureIssues as predFutureIssues,
} from './swagger/predictions.swagger';

// Maintain backward compatibility
export const UpdatedPredictionsSwaggerDocs = {
  predictFutureIssues: predFutureIssues,
  generateEarlyWarnings: genEarlyWarnings,
  calculateRiskProbability: calcRiskProb,
};
