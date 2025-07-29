/* eslint-disable max-lines */
// Error Handling Types

// Base Error Types
export interface BaseError {
  code: string;
  message: string;
  timestamp: Date;
  requestId?: string;
  userId?: string;
  tenantId?: string;
}

export interface ValidationError extends BaseError {
  field: string;
  value: unknown;
  constraint: string;
  expectedType?: string;
}

export interface BusinessLogicError extends BaseError {
  context: Record<string, unknown>;
  recoverable: boolean;
  suggestedAction?: string;
}

export interface SystemError extends BaseError {
  service: string;
  operation: string;
  stackTrace?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

// HTTP Error Types
export interface HttpError extends BaseError {
  statusCode: number;
  path: string;
  method: string;
  headers?: Record<string, string>;
  body?: unknown;
}

export interface NotFoundError extends HttpError {
  resourceType: string;
  resourceId: string;
}

export interface UnauthorizedError extends HttpError {
  reason:
    | 'invalid_token'
    | 'expired_token'
    | 'missing_token'
    | 'insufficient_permissions';
  requiredPermissions?: string[];
}

export interface ForbiddenError extends HttpError {
  resource: string;
  action: string;
  userRole: string;
  requiredRole: string;
}

export interface ConflictError extends HttpError {
  conflictType:
    | 'duplicate_resource'
    | 'concurrent_modification'
    | 'business_rule_violation';
  conflictingResource?: string;
  conflictingValue?: unknown;
}

export interface RateLimitError extends HttpError {
  limit: number;
  remaining: number;
  resetTime: Date;
  retryAfter: number; // seconds
}

// Service-Specific Error Types
export interface GapAnalysisError extends BaseError {
  projectId: string;
  analysisType: string;
  dataQualityIssues?: DataQualityIssue[];
  missingRequirements?: string[];
}

export interface DataQualityIssue {
  field: string;
  issue: 'missing' | 'invalid' | 'inconsistent' | 'outdated';
  severity: 'warning' | 'error';
  suggestion?: string;
}

export interface PredictionError extends BaseError {
  modelId: string;
  modelVersion: string;
  inputData: Record<string, unknown>;
  confidence: number;
  fallbackUsed: boolean;
}

export interface IntegrationError extends BaseError {
  connectionId: string;
  toolType: string;
  operation: 'connect' | 'sync' | 'disconnect' | 'validate';
  externalErrorCode?: string;
  externalErrorMessage?: string;
  retryable: boolean;
  retryAfter?: number; // seconds
  maxRetries?: number;
}

export interface NotificationError extends BaseError {
  notificationId: string;
  recipient: string;
  channel: 'email' | 'in-app' | 'webhook' | 'sms';
  deliveryAttempts: number;
  lastAttemptAt: Date;
  nextRetryAt?: Date;
}

export interface AuthenticationError extends BaseError {
  authMethod: 'jwt' | 'oauth' | 'api_key';
  tokenType?: 'access' | 'refresh';
  expiresAt?: Date;
  issuer?: string;
}

export interface AuthorizationError extends BaseError {
  userId: string;
  resource: string;
  action: string;
  requiredPermissions: string[];
  userPermissions: string[];
  tenantId: string;
}

// Database Error Types
export interface DatabaseError extends BaseError {
  operation: 'create' | 'read' | 'update' | 'delete' | 'query';
  table: string;
  constraint?: string;
  query?: string;
  parameters?: Record<string, unknown>;
}

export interface ConnectionError extends DatabaseError {
  host: string;
  port: number;
  database: string;
  connectionPool: {
    active: number;
    idle: number;
    total: number;
  };
}

export interface TransactionError extends DatabaseError {
  transactionId: string;
  isolationLevel: string;
  rollbackReason: string;
  affectedTables: string[];
}

// External Service Error Types
export interface ExternalServiceError extends BaseError {
  serviceName: string;
  endpoint: string;
  httpStatus?: number;
  responseTime: number;
  retryCount: number;
  circuitBreakerState: 'closed' | 'open' | 'half-open';
}

export interface ThirdPartyAPIError extends ExternalServiceError {
  apiVersion: string;
  rateLimitRemaining?: number;
  rateLimitReset?: Date;
  quotaExceeded?: boolean;
}

// ML/AI Error Types
export interface MLModelError extends BaseError {
  modelId: string;
  modelType: 'gap_analysis' | 'prediction' | 'nlp' | 'classification';
  version: string;
  inputFeatures: string[];
  trainingDataVersion?: string;
  confidence?: number;
}

export interface ModelTrainingError extends MLModelError {
  trainingDataSize: number;
  trainingDuration: number;
  validationScore?: number;
  hyperparameters: Record<string, unknown>;
}

export interface ModelInferenceError extends MLModelError {
  inputData: Record<string, unknown>;
  preprocessingErrors?: string[];
  postprocessingErrors?: string[];
}

// Error Response Builders
export interface ErrorResponseBuilder {
  buildValidationError(errors: ValidationError[]): ErrorResponse;
  buildBusinessLogicError(error: BusinessLogicError): ErrorResponse;
  buildSystemError(error: SystemError): ErrorResponse;
  buildHttpError(error: HttpError): ErrorResponse;
  buildServiceError(error: BaseError): ErrorResponse;
}

export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    type: string;
    details?: Record<string, unknown>;
  };
  statusCode: number;
  timestamp: Date;
  requestId: string;
  path?: string;
  method?: string;
  stack?: string; // Only in development
}

// Error Codes Enum
export enum ErrorCode {
  // Validation Errors (1000-1999)
  VALIDATION_FAILED = 'VAL_001',
  REQUIRED_FIELD_MISSING = 'VAL_002',
  INVALID_FORMAT = 'VAL_003',
  INVALID_TYPE = 'VAL_004',
  VALUE_OUT_OF_RANGE = 'VAL_005',

  // Authentication Errors (2000-2999)
  INVALID_CREDENTIALS = 'AUTH_001',
  TOKEN_EXPIRED = 'AUTH_002',
  TOKEN_INVALID = 'AUTH_003',
  TOKEN_MISSING = 'AUTH_004',
  ACCOUNT_LOCKED = 'AUTH_005',
  ACCOUNT_DISABLED = 'AUTH_006',

  // Authorization Errors (3000-3999)
  INSUFFICIENT_PERMISSIONS = 'AUTHZ_001',
  RESOURCE_ACCESS_DENIED = 'AUTHZ_002',
  TENANT_ACCESS_DENIED = 'AUTHZ_003',
  ROLE_REQUIRED = 'AUTHZ_004',

  // Resource Errors (4000-4999)
  RESOURCE_NOT_FOUND = 'RES_001',
  RESOURCE_ALREADY_EXISTS = 'RES_002',
  RESOURCE_CONFLICT = 'RES_003',
  RESOURCE_LOCKED = 'RES_004',
  RESOURCE_DELETED = 'RES_005',

  // Business Logic Errors (5000-5999)
  BUSINESS_RULE_VIOLATION = 'BIZ_001',
  INVALID_STATE_TRANSITION = 'BIZ_002',
  OPERATION_NOT_ALLOWED = 'BIZ_003',
  QUOTA_EXCEEDED = 'BIZ_004',
  DEPENDENCY_VIOLATION = 'BIZ_005',

  // Integration Errors (6000-6999)
  INTEGRATION_CONNECTION_FAILED = 'INT_001',
  INTEGRATION_SYNC_FAILED = 'INT_002',
  INTEGRATION_AUTH_FAILED = 'INT_003',
  INTEGRATION_RATE_LIMITED = 'INT_004',
  INTEGRATION_DATA_INVALID = 'INT_005',
  INTEGRATION_TIMEOUT = 'INT_006',

  // Gap Analysis Errors (7000-7999)
  GAP_ANALYSIS_FAILED = 'GAP_001',
  INSUFFICIENT_DATA = 'GAP_002',
  INVALID_PROJECT_STATE = 'GAP_003',
  ANALYSIS_TIMEOUT = 'GAP_004',
  MODEL_UNAVAILABLE = 'GAP_005',

  // Prediction Errors (8000-8999)
  PREDICTION_FAILED = 'PRED_001',
  MODEL_TRAINING_FAILED = 'PRED_002',
  INSUFFICIENT_HISTORICAL_DATA = 'PRED_003',
  PREDICTION_CONFIDENCE_LOW = 'PRED_004',
  MODEL_VERSION_MISMATCH = 'PRED_005',

  // System Errors (9000-9999)
  INTERNAL_SERVER_ERROR = 'SYS_001',
  DATABASE_CONNECTION_FAILED = 'SYS_002',
  EXTERNAL_SERVICE_UNAVAILABLE = 'SYS_003',
  CONFIGURATION_ERROR = 'SYS_004',
  MEMORY_LIMIT_EXCEEDED = 'SYS_005',
  TIMEOUT_ERROR = 'SYS_006',
  CIRCUIT_BREAKER_OPEN = 'SYS_007',

  // Rate Limiting Errors (10000-10999)
  RATE_LIMIT_EXCEEDED = 'RATE_001',
  QUOTA_LIMIT_EXCEEDED = 'RATE_002',
  CONCURRENT_REQUEST_LIMIT = 'RATE_003',

  // Notification Errors (11000-11999)
  NOTIFICATION_DELIVERY_FAILED = 'NOTIF_001',
  INVALID_RECIPIENT = 'NOTIF_002',
  NOTIFICATION_TEMPLATE_ERROR = 'NOTIF_003',
  NOTIFICATION_QUOTA_EXCEEDED = 'NOTIF_004',
}

// Error Severity Levels
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

// Error Categories
export enum ErrorCategory {
  VALIDATION = 'validation',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  BUSINESS_LOGIC = 'business_logic',
  SYSTEM = 'system',
  INTEGRATION = 'integration',
  EXTERNAL_SERVICE = 'external_service',
  DATABASE = 'database',
  NETWORK = 'network',
  CONFIGURATION = 'configuration',
}

// Error Context for Logging and Monitoring
export interface ErrorContext {
  errorId: string;
  correlationId: string;
  userId?: string;
  tenantId?: string;
  sessionId?: string;
  requestId: string;
  userAgent?: string;
  ipAddress?: string;
  endpoint: string;
  method: string;
  timestamp: Date;
  environment: 'development' | 'staging' | 'production';
  version: string;
  additionalData?: Record<string, unknown>;
}

// Error Recovery Strategies
export interface ErrorRecoveryStrategy {
  errorCode: ErrorCode;
  strategy:
    | 'retry'
    | 'fallback'
    | 'circuit_breaker'
    | 'manual_intervention'
    | 'ignore';
  maxRetries?: number;
  retryDelay?: number; // milliseconds
  backoffMultiplier?: number;
  fallbackAction?: string;
  escalationThreshold?: number;
}

// Error Monitoring and Alerting
export interface ErrorAlert {
  errorCode: ErrorCode;
  severity: ErrorSeverity;
  frequency: number;
  timeWindow: number; // minutes
  threshold: number;
  alertChannels: ('email' | 'slack' | 'webhook' | 'pagerduty')[];
  escalationRules: EscalationRule[];
}

export interface EscalationRule {
  level: number;
  delay: number; // minutes
  recipients: string[];
  channels: string[];
  condition: string;
}

// Error Metrics
export interface ErrorMetrics {
  errorCode: ErrorCode;
  count: number;
  rate: number; // errors per minute
  averageResponseTime: number;
  p95ResponseTime: number;
  p99ResponseTime: number;
  affectedUsers: number;
  affectedTenants: number;
  firstOccurrence: Date;
  lastOccurrence: Date;
  trend: 'increasing' | 'decreasing' | 'stable';
}
