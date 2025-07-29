// Integration-related Database Entity Types
export interface IntegrationEntity {
  id: string;
  tenantId: string;
  name: string;
  type: IntegrationType;
  status: IntegrationStatus;
  config: IntegrationConfiguration;
  credentials: EncryptedCredentials;
  syncSettings: SyncSettings;
  healthCheck: HealthCheckResult;
  isActive: boolean;
  projectId?: string;
  userId: string;
  lastSync?: Date;
  nextSync?: Date;
  syncHistory: SyncRecord[];
  errorLog: IntegrationError[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ToolConnection {
  id: string;
  projectId: string;
  integrationId: string;
  toolType: ToolType;
  connectionId: string;
  status: ConnectionStatus;
  dataMapping: FieldMapping[];
  lastSync?: Date;
  syncFrequency: SyncFrequency;
  createdAt: Date;
  updatedAt: Date;
}

export interface FieldMapping {
  localField: string;
  externalField: string;
  transformation?: string;
  required: boolean;
}

export interface IntegrationError {
  id: string;
  integrationId: string;
  errorType: string;
  message: string;
  stackTrace?: string;
  timestamp: Date;
  resolved: boolean;
  retryCount: number;
}

// Integration-related enums
export enum IntegrationType {
  JIRA = 'jira',
  ASANA = 'asana',
  TRELLO = 'trello',
  MONDAY = 'monday',
  BITRIX24 = 'bitrix24',
  GITHUB = 'github',
  GITLAB = 'gitlab',
  SLACK = 'slack',
  TEAMS = 'teams',
}

export enum IntegrationStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ERROR = 'error',
  SYNCING = 'syncing',
  PAUSED = 'paused',
}

export enum ToolType {
  PROJECT_MANAGEMENT = 'project_management',
  VERSION_CONTROL = 'version_control',
  COMMUNICATION = 'communication',
  DOCUMENTATION = 'documentation',
  TESTING = 'testing',
  DEPLOYMENT = 'deployment',
}

export enum ConnectionStatus {
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  ERROR = 'error',
  SYNCING = 'syncing',
  PENDING = 'pending',
}

export enum SyncFrequency {
  REAL_TIME = 'real_time',
  EVERY_5_MINUTES = 'every_5_minutes',
  EVERY_15_MINUTES = 'every_15_minutes',
  EVERY_30_MINUTES = 'every_30_minutes',
  HOURLY = 'hourly',
  DAILY = 'daily',
}

// Additional integration-related interfaces and enums
export interface IntegrationConfiguration {
  baseUrl?: string;
  apiVersion?: string;
  timeout: number;
  retryAttempts: number;
  rateLimiting: RateLimitConfig;
  webhookUrl?: string;
  customFields: Record<string, unknown>;
}

export interface EncryptedCredentials {
  encryptedData: string;
  keyId: string;
  algorithm: string;
  createdAt: Date;
  expiresAt?: Date;
}

export interface SyncSettings {
  frequency: SyncFrequency;
  direction: SyncDirection;
  conflictResolution: ConflictResolution;
  dataFilters: DataFilter[];
  batchSize: number;
  enabled: boolean;
}

export interface DataFilter {
  field: string;
  operator: FilterOperator;
  value: string;
  active: boolean;
}

export interface RateLimitConfig {
  requestsPerMinute: number;
  burstLimit: number;
  backoffStrategy: BackoffStrategy;
}

export interface HealthCheckResult {
  status: HealthStatus;
  lastCheck: Date;
  responseTime: number;
  errorCount: number;
  uptime: number;
  details?: Record<string, unknown>;
}

export interface SyncRecord {
  id: string;
  integrationId: string;
  startedAt: Date;
  completedAt?: Date;
  status: SyncStatus;
  recordsProcessed: number;
  recordsCreated: number;
  recordsUpdated: number;
  recordsDeleted: number;
  errors: SyncError[];
  duration: number;
}

export interface SyncError {
  id: string;
  syncRecordId: string;
  errorType: ErrorType;
  message: string;
  details?: Record<string, unknown>;
  recordId?: string;
  retryable: boolean;
  timestamp: Date;
}

export enum SyncDirection {
  BIDIRECTIONAL = 'bidirectional',
  INBOUND = 'inbound',
  OUTBOUND = 'outbound',
}

export enum ConflictResolution {
  EXTERNAL_WINS = 'external_wins',
  LOCAL_WINS = 'local_wins',
  MANUAL = 'manual',
  TIMESTAMP = 'timestamp',
}

export enum FilterOperator {
  EQUALS = 'equals',
  NOT_EQUALS = 'not_equals',
  CONTAINS = 'contains',
  NOT_CONTAINS = 'not_contains',
  STARTS_WITH = 'starts_with',
  ENDS_WITH = 'ends_with',
  GREATER_THAN = 'greater_than',
  LESS_THAN = 'less_than',
  IN = 'in',
  NOT_IN = 'not_in',
}

export enum BackoffStrategy {
  LINEAR = 'linear',
  EXPONENTIAL = 'exponential',
  FIXED = 'fixed',
}

export enum HealthStatus {
  HEALTHY = 'healthy',
  DEGRADED = 'degraded',
  UNHEALTHY = 'unhealthy',
  UNKNOWN = 'unknown',
}

export enum SyncStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export enum ErrorType {
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  NETWORK = 'network',
  TIMEOUT = 'timeout',
  RATE_LIMIT = 'rate_limit',
  VALIDATION = 'validation',
  DATA_FORMAT = 'data_format',
  BUSINESS_LOGIC = 'business_logic',
  SYSTEM = 'system',
  UNKNOWN = 'unknown',
}
