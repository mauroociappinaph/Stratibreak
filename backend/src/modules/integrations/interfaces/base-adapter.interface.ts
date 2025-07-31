/**
 * Base Integration Adapter Interface
 *
 * This interface defines the contract that all external tool integration adapters must implement.
 * It follows the Adapter Pattern to provide a consistent interface for different external tools
 * while handling tool-specific API differences internally.
 *
 * Each adapter implementation should handle:
 * - Tool-specific authentication
 * - API rate limiting and error handling
 * - Data transformation between tool format and internal format
 * - Connection health monitoring
 */

import {
  ConnectionStatus,
  HealthStatus,
  IntegrationType,
  SyncStatus,
} from '../../../types/database/integration.types';

/**
 * Base adapter interface that all integration adapters must implement
 */
export interface IBaseIntegrationAdapter {
  /**
   * The type of integration this adapter handles
   */
  readonly adapterType: IntegrationType;

  /**
   * Human-readable name of the adapter
   */
  readonly adapterName: string;

  /**
   * Version of the adapter implementation
   */
  readonly version: string;

  /**
   * Establish connection to the external tool
   * @param credentials - Tool-specific credentials
   * @returns Connection result with status and metadata
   */
  connect(credentials: AdapterCredentials): Promise<AdapterConnectionResult>;

  /**
   * Disconnect from the external tool
   * @param connectionId - Unique connection identifier
   * @returns Disconnection result
   */
  disconnect(connectionId: string): Promise<AdapterDisconnectionResult>;

  /**
   * Test the connection to verify it's working
   * @param connectionId - Unique connection identifier
   * @returns Health check result
   */
  testConnection(connectionId: string): Promise<AdapterHealthCheck>;

  /**
   * Synchronize data from the external tool
   * @param connectionId - Unique connection identifier
   * @param options - Sync configuration options
   * @returns Sync operation result
   */
  syncData(
    connectionId: string,
    options?: AdapterSyncOptions
  ): Promise<AdapterSyncResult>;

  /**
   * Push data to the external tool (for bidirectional sync)
   * @param connectionId - Unique connection identifier
   * @param data - Data to push to external tool
   * @returns Push operation result
   */
  pushData(
    connectionId: string,
    data: AdapterData[]
  ): Promise<AdapterPushResult>;

  /**
   * Validate that the provided credentials are correct and sufficient
   * @param credentials - Credentials to validate
   * @returns Validation result
   */
  validateCredentials(
    credentials: AdapterCredentials
  ): Promise<AdapterCredentialValidation>;

  /**
   * Get the current status of the connection
   * @param connectionId - Unique connection identifier
   * @returns Current connection status
   */
  getConnectionStatus(connectionId: string): Promise<ConnectionStatus>;

  /**
   * Transform external tool data to internal format
   * @param externalData - Data from external tool
   * @returns Transformed data in internal format
   */
  transformToInternal(externalData: ExternalToolData): Promise<AdapterData[]>;

  /**
   * Transform internal data to external tool format
   * @param internalData - Data in internal format
   * @returns Transformed data for external tool
   */
  transformToExternal(internalData: AdapterData[]): Promise<ExternalToolData>;

  /**
   * Handle errors that occur during adapter operations
   * @param error - Error that occurred
   * @param context - Context information about when the error occurred
   * @returns Error handling result with recovery suggestions
   */
  handleError(
    error: AdapterError,
    context: AdapterErrorContext
  ): Promise<AdapterErrorResult>;

  /**
   * Get adapter-specific configuration schema
   * @returns JSON schema for adapter configuration
   */
  getConfigurationSchema(): AdapterConfigurationSchema;

  /**
   * Get supported features for this adapter
   * @returns List of supported features
   */
  getSupportedFeatures(): AdapterFeature[];
}

/**
 * Generic credentials interface - each adapter will extend this
 */
export interface AdapterCredentials {
  [key: string]: string | number | boolean;
}

/**
 * Result of connection attempt
 */
export interface AdapterConnectionResult {
  success: boolean;
  connectionId?: string;
  status: ConnectionStatus;
  message: string;
  metadata?: Record<string, unknown>;
  expiresAt?: Date;
}

/**
 * Result of disconnection attempt
 */
export interface AdapterDisconnectionResult {
  success: boolean;
  message: string;
  cleanupPerformed: boolean;
}

/**
 * Health check result
 */
export interface AdapterHealthCheck {
  status: HealthStatus;
  responseTime: number;
  lastChecked: Date;
  message: string;
  details?: Record<string, unknown>;
}

/**
 * Sync operation options
 */
export interface AdapterSyncOptions {
  /**
   * Maximum number of records to sync in one operation
   */
  batchSize?: number;

  /**
   * Only sync data modified after this date
   */
  modifiedSince?: Date;

  /**
   * Specific data types to sync
   */
  dataTypes?: string[];

  /**
   * Whether to perform incremental or full sync
   */
  incremental?: boolean;

  /**
   * Custom filters for the sync operation
   */
  filters?: Record<string, unknown>;
}

/**
 * Result of sync operation
 */
export interface AdapterSyncResult {
  status: SyncStatus;
  recordsProcessed: number;
  recordsCreated: number;
  recordsUpdated: number;
  recordsSkipped: number;
  errors: AdapterSyncError[];
  startedAt: Date;
  completedAt: Date;
  nextSyncRecommended?: Date;
  metadata?: Record<string, unknown>;
}

/**
 * Result of push operation
 */
export interface AdapterPushResult {
  success: boolean;
  recordsPushed: number;
  recordsFailed: number;
  errors: AdapterSyncError[];
  externalIds?: Record<string, string>; // Map internal ID to external ID
}

/**
 * Credential validation result
 */
export interface AdapterCredentialValidation {
  isValid: boolean;
  message: string;
  missingFields?: string[];
  suggestions?: string[];
}

/**
 * Generic data structure for adapter operations
 */
export interface AdapterData {
  id: string;
  type: string;
  title: string;
  description?: string;
  status: string;
  assignee?: string;
  priority?: string;
  labels?: string[];
  createdAt: Date;
  updatedAt: Date;
  externalId?: string;
  customFields?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

/**
 * External tool data (tool-specific format)
 */
export interface ExternalToolData {
  [key: string]: unknown;
}

/**
 * Sync error details
 */
export interface AdapterSyncError {
  recordId?: string;
  errorType: string;
  message: string;
  details?: Record<string, unknown>;
  retryable: boolean;
}

/**
 * Adapter error information
 */
export interface AdapterError {
  code: string;
  message: string;
  originalError?: Error;
  retryable: boolean;
  context?: Record<string, unknown>;
}

/**
 * Context information for error handling
 */
export interface AdapterErrorContext {
  operation: string;
  connectionId?: string;
  timestamp: Date;
  attemptNumber: number;
  additionalInfo?: Record<string, unknown>;
}

/**
 * Error handling result
 */
export interface AdapterErrorResult {
  shouldRetry: boolean;
  retryAfter?: number; // seconds
  fallbackAction?: string;
  userMessage: string;
  technicalMessage: string;
}

/**
 * Configuration schema for adapter
 */
export interface AdapterConfigurationSchema {
  type: 'object';
  properties: Record<string, AdapterConfigProperty>;
  required: string[];
  additionalProperties?: boolean;
}

/**
 * Configuration property definition
 */
export interface AdapterConfigProperty {
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  description: string;
  default?: unknown;
  enum?: unknown[];
  format?: string;
  sensitive?: boolean; // For credentials that should be encrypted
}

/**
 * Adapter feature capabilities
 */
export interface AdapterFeature {
  name: string;
  description: string;
  supported: boolean;
  limitations?: string[];
}

/**
 * Common adapter features
 */
export enum AdapterFeatureType {
  BIDIRECTIONAL_SYNC = 'bidirectional_sync',
  REAL_TIME_WEBHOOKS = 'real_time_webhooks',
  BULK_OPERATIONS = 'bulk_operations',
  CUSTOM_FIELDS = 'custom_fields',
  FILE_ATTACHMENTS = 'file_attachments',
  COMMENTS_SYNC = 'comments_sync',
  HISTORY_TRACKING = 'history_tracking',
  ADVANCED_FILTERING = 'advanced_filtering',
  RATE_LIMITING = 'rate_limiting',
  OAUTH_AUTHENTICATION = 'oauth_authentication',
}

/**
 * Base abstract class that provides common functionality for adapters
 * Concrete adapters can extend this class to inherit common behavior
 */
export abstract class BaseIntegrationAdapter
  implements IBaseIntegrationAdapter
{
  abstract readonly adapterType: IntegrationType;
  abstract readonly adapterName: string;
  abstract readonly version: string;

  // Abstract methods that must be implemented by concrete adapters
  abstract connect(
    credentials: AdapterCredentials
  ): Promise<AdapterConnectionResult>;
  abstract disconnect(
    connectionId: string
  ): Promise<AdapterDisconnectionResult>;
  abstract testConnection(connectionId: string): Promise<AdapterHealthCheck>;
  abstract syncData(
    connectionId: string,
    options?: AdapterSyncOptions
  ): Promise<AdapterSyncResult>;
  abstract pushData(
    connectionId: string,
    data: AdapterData[]
  ): Promise<AdapterPushResult>;
  abstract validateCredentials(
    credentials: AdapterCredentials
  ): Promise<AdapterCredentialValidation>;
  abstract transformToInternal(
    externalData: ExternalToolData
  ): Promise<AdapterData[]>;
  abstract transformToExternal(
    internalData: AdapterData[]
  ): Promise<ExternalToolData>;
  abstract getConfigurationSchema(): AdapterConfigurationSchema;
  abstract getSupportedFeatures(): AdapterFeature[];

  // Common implementations that can be overridden if needed
  async getConnectionStatus(connectionId: string): Promise<ConnectionStatus> {
    try {
      const healthCheck = await this.testConnection(connectionId);
      switch (healthCheck.status) {
        case HealthStatus.HEALTHY:
          return ConnectionStatus.CONNECTED;
        case HealthStatus.DEGRADED:
          return ConnectionStatus.CONNECTED; // Still connected but with issues
        case HealthStatus.UNHEALTHY:
        case HealthStatus.UNKNOWN:
        default:
          return ConnectionStatus.ERROR;
      }
    } catch {
      return ConnectionStatus.ERROR;
    }
  }

  async handleError(
    error: AdapterError,
    context: AdapterErrorContext
  ): Promise<AdapterErrorResult> {
    // Default error handling - can be overridden by specific adapters
    const shouldRetry = error.retryable && context.attemptNumber < 3;
    const retryAfter = shouldRetry
      ? Math.pow(2, context.attemptNumber) * 1000
      : undefined;

    const result: AdapterErrorResult = {
      shouldRetry,
      userMessage: `${this.adapterName} integration encountered an error: ${error.message}`,
      technicalMessage: `${error.code}: ${error.message} (Attempt ${context.attemptNumber})`,
    };

    if (retryAfter !== undefined) {
      result.retryAfter = retryAfter;
    }

    return result;
  }

  /**
   * Utility method to create standardized adapter data
   */
  protected createAdapterData(
    id: string,
    type: string,
    title: string,
    additionalData: Partial<AdapterData> = {}
  ): AdapterData {
    return {
      id,
      type,
      title,
      description: '',
      status: 'unknown',
      createdAt: new Date(),
      updatedAt: new Date(),
      ...additionalData,
    };
  }

  /**
   * Utility method to create standardized sync errors
   */
  protected createSyncError(
    message: string,
    errorType: string = 'sync_error',
    recordId?: string,
    retryable: boolean = true
  ): AdapterSyncError {
    const error: AdapterSyncError = {
      errorType,
      message,
      retryable,
    };

    if (recordId !== undefined) {
      error.recordId = recordId;
    }

    return error;
  }

  /**
   * Utility method to validate required credentials
   */
  protected validateRequiredCredentials(
    credentials: AdapterCredentials,
    requiredFields: string[]
  ): AdapterCredentialValidation {
    const missingFields = requiredFields.filter(field => !credentials[field]);

    if (missingFields.length > 0) {
      return {
        isValid: false,
        message: `Missing required credentials: ${missingFields.join(', ')}`,
        missingFields,
        suggestions: [`Please provide values for: ${missingFields.join(', ')}`],
      };
    }

    return {
      isValid: true,
      message: 'All required credentials are present',
    };
  }
}
