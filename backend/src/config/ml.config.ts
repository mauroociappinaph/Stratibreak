import { registerAs } from '@nestjs/config';

export default registerAs('ml', () => ({
  pythonServiceUrl: process.env.ML_SERVICE_URL || 'http://localhost:8000',
  pythonServiceTimeout: parseInt(process.env.ML_SERVICE_TIMEOUT || '30000', 10),
  modelPath: process.env.ML_MODEL_PATH || './models',
  predictionThreshold: parseFloat(process.env.PREDICTION_THRESHOLD || '0.85'),
  retrainingInterval: parseInt(
    process.env.RETRAINING_INTERVAL || '86400000',
    10
  ), // 24 hours
  maxPredictionHistory: parseInt(
    process.env.MAX_PREDICTION_HISTORY || '1000',
    10
  ),
  enableModelCaching: process.env.ENABLE_MODEL_CACHING !== 'false',
  batchSize: parseInt(process.env.ML_BATCH_SIZE || '100', 10),
  features: {
    gapAnalysis: process.env.ENABLE_GAP_ANALYSIS !== 'false',
    predictions: process.env.ENABLE_PREDICTIONS !== 'false',
    nlpProcessing: process.env.ENABLE_NLP !== 'false',
    rootCauseAnalysis: process.env.ENABLE_ROOT_CAUSE !== 'false',
  },
}));
