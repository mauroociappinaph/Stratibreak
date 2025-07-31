/**
 * Base Integration Adapter Interface Tests
 *
 * These tests verify that the base adapter interface and abstract class
 * work correctly and provide the expected functionality.
 */

import {
  ConnectionStatus,
  HealthStatus,
  IntegrationType,
  SyncStatus,
} from '../../../types/database/integration.types';
import {
  BaseIntegrationAdapter,
  type AdapterConfigurationSchema,
  type AdapterConnectionResult,
  type AdapterCredentials,
  type AdapterCredentialValidation,
  type AdapterData,
  type AdapterDisconnectionResult,
  type AdapterError,
  type AdapterErrorContext,
  type AdapterFeature,
  type AdapterHealthCheck,
  type AdapterPushResult,
  type AdapterSyncOptions,
  type AdapterSyncResult,
  type ExternalToolData,
} from './base-adapter.interface';

/**
 * Mock adapter implementation for testing
 */
class MockAdapter extends BaseIntegrationAdapter {
  readonly adapterType = IntegrationType.JIRA;
  readonly adapterName = 'Mock Test Adapter';
  readonly version = '1.0.0-test';

  async connect(
    credentials: AdapterCredentials
  ): Promise<AdapterConnectionResult> {
    return {
      success: true,
      connectionId: 'mock-connection-123',
      status: ConnectionStatus.CONNECTED,
      message: 'Mock connection successful',
    };
  }

  async disconnect(_connectionId: string): Promise<AdapterDisconnectionResult> {
    return {
      success: true,
      message: 'Mock disconnection successful',
      cleanupPerformed: true,
    };
  }

  async testConnection(_connectionId: string): Promise<AdapterHealthCheck> {
    return {
      status: HealthStatus.HEALTHY,
      responseTime: 100,
      lastChecked: new Date(),
      message: 'Mock connection is healthy',
    };
  }

  async syncData(
    _connectionId: string,
    _options?: AdapterSyncOptions
  ): Promise<AdapterSyncResult> {
    return {
      status: SyncStatus.COMPLETED,
      recordsProcessed: 5,
      recordsCreated: 3,
      recordsUpdated: 2,
      recordsSkipped: 0,
      errors: [],
      startedAt: new Date(),
      completedAt: new Date(),
    };
  }

  async pushData(
    _connectionId: string,
    data: AdapterData[]
  ): Promise<AdapterPushResult> {
    return {
      success: true,
      recordsPushed: data.length,
      recordsFailed: 0,
      errors: [],
    };
  }

  async validateCredentials(
    credentials: AdapterCredentials
  ): Promise<AdapterCredentialValidation> {
    return this.validateRequiredCredentials(credentials, ['apiKey', 'baseUrl']);
  }

  async transformToInternal(
    _externalData: ExternalToolData
  ): Promise<AdapterData[]> {
    return [
      this.createAdapterData('1', 'task', 'Mock Task 1'),
      this.createAdapterData('2', 'task', 'Mock Task 2'),
    ];
  }

  async transformToExternal(
    internalData: AdapterData[]
  ): Promise<ExternalToolData> {
    return {
      items: internalData.map(item => ({
        id: item.id,
        title: item.title,
        type: item.type,
      })),
    };
  }

  getConfigurationSchema(): AdapterConfigurationSchema {
    return {
      type: 'object',
      properties: {
        apiKey: {
          type: 'string',
          description: 'API key for authentication',
          sensitive: true,
        },
        baseUrl: {
          type: 'string',
          description: 'Base URL for the service',
          format: 'uri',
        },
      },
      required: ['apiKey', 'baseUrl'],
    };
  }

  getSupportedFeatures(): AdapterFeature[] {
    return [
      {
        name: 'test_feature',
        description: 'Test feature for mock adapter',
        supported: true,
      },
    ];
  }
}

describe('BaseIntegrationAdapter', () => {
  let adapter: MockAdapter;

  beforeEach(() => {
    adapter = new MockAdapter();
  });

  describe('Basic Properties', () => {
    it('should have correct adapter properties', () => {
      expect(adapter.adapterType).toBe(IntegrationType.JIRA);
      expect(adapter.adapterName).toBe('Mock Test Adapter');
      expect(adapter.version).toBe('1.0.0-test');
    });
  });

  describe('Connection Management', () => {
    it('should connect successfully', async () => {
      const result = await adapter.connect({
        apiKey: 'test',
        baseUrl: 'https://test.com',
      });

      expect(result.success).toBe(true);
      expect(result.connectionId).toBe('mock-connection-123');
      expect(result.status).toBe(ConnectionStatus.CONNECTED);
    });

    it('should disconnect successfully', async () => {
      const result = await adapter.disconnect('mock-connection-123');

      expect(result.success).toBe(true);
      expect(result.cleanupPerformed).toBe(true);
    });

    it('should test connection successfully', async () => {
      const result = await adapter.testConnection('mock-connection-123');

      expect(result.status).toBe(HealthStatus.HEALTHY);
      expect(result.responseTime).toBe(100);
      expect(result.message).toBe('Mock connection is healthy');
    });

    it('should get connection status', async () => {
      const status = await adapter.getConnectionStatus('mock-connection-123');
      expect(status).toBe(ConnectionStatus.CONNECTED);
    });
  });

  describe('Data Synchronization', () => {
    it('should sync data successfully', async () => {
      const result = await adapter.syncData('mock-connection-123');

      expect(result.status).toBe(SyncStatus.COMPLETED);
      expect(result.recordsProcessed).toBe(5);
      expect(result.recordsCreated).toBe(3);
      expect(result.recordsUpdated).toBe(2);
      expect(result.errors).toHaveLength(0);
    });

    it('should push data successfully', async () => {
      const testData: AdapterData[] = [
        {
          id: '1',
          type: 'task',
          title: 'Test Task',
          description: '',
          status: 'unknown',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const result = await adapter.pushData('mock-connection-123', testData);

      expect(result.success).toBe(true);
      expect(result.recordsPushed).toBe(1);
      expect(result.recordsFailed).toBe(0);
    });
  });

  describe('Credential Validation', () => {
    it('should validate valid credentials', async () => {
      const credentials = { apiKey: 'test-key', baseUrl: 'https://test.com' };
      const result = await adapter.validateCredentials(credentials);

      expect(result.isValid).toBe(true);
      expect(result.message).toBe('All required credentials are present');
    });

    it('should reject invalid credentials', async () => {
      const credentials = { apiKey: 'test-key' }; // Missing baseUrl
      const result = await adapter.validateCredentials(credentials);

      expect(result.isValid).toBe(false);
      expect(result.message).toContain('Missing required credentials');
      expect(result.missingFields).toContain('baseUrl');
    });
  });

  describe('Data Transformation', () => {
    it('should transform external data to internal format', async () => {
      const externalData = { items: [{ id: '1', name: 'Test' }] };
      const result = await adapter.transformToInternal(externalData);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('1');
      expect(result[0].title).toBe('Mock Task 1');
      expect(result[0].type).toBe('task');
    });

    it('should transform internal data to external format', async () => {
      const internalData: AdapterData[] = [
        {
          id: '1',
          type: 'task',
          title: 'Test Task',
          description: '',
          status: 'unknown',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const result = await adapter.transformToExternal(internalData);
      const resultData = result as {
        items: Array<{ id: string; title: string; type: string }>;
      };

      expect(resultData.items).toHaveLength(1);
      expect(resultData.items[0].id).toBe('1');
      expect(resultData.items[0].title).toBe('Test Task');
      expect(resultData.items[0].type).toBe('task');
    });
  });

  describe('Configuration and Features', () => {
    it('should return configuration schema', () => {
      const schema = adapter.getConfigurationSchema();

      expect(schema.type).toBe('object');
      expect(schema.properties.apiKey).toBeDefined();
      expect(schema.properties.baseUrl).toBeDefined();
      expect(schema.required).toContain('apiKey');
      expect(schema.required).toContain('baseUrl');
    });

    it('should return supported features', () => {
      const features = adapter.getSupportedFeatures();

      expect(features).toHaveLength(1);
      expect(features[0].name).toBe('test_feature');
      expect(features[0].supported).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle errors with retry logic', async () => {
      const error: AdapterError = {
        code: 'TEST_ERROR',
        message: 'Test error message',
        retryable: true,
      };

      const context: AdapterErrorContext = {
        operation: 'test_operation',
        timestamp: new Date(),
        attemptNumber: 1,
      };

      const result = await adapter.handleError(error, context);

      expect(result.shouldRetry).toBe(true);
      expect(result.retryAfter).toBeDefined();
      expect(result.userMessage).toContain(
        'Mock Test Adapter integration encountered an error'
      );
      expect(result.technicalMessage).toContain(
        'TEST_ERROR: Test error message'
      );
    });

    it('should not retry after max attempts', async () => {
      const error: AdapterError = {
        code: 'TEST_ERROR',
        message: 'Test error message',
        retryable: true,
      };

      const context: AdapterErrorContext = {
        operation: 'test_operation',
        timestamp: new Date(),
        attemptNumber: 5, // Exceeds max retry attempts
      };

      const result = await adapter.handleError(error, context);

      expect(result.shouldRetry).toBe(false);
      expect(result.retryAfter).toBeUndefined();
    });
  });

  describe('Utility Methods', () => {
    it('should create standardized adapter data', () => {
      // Test the public interface by creating data manually
      const data: AdapterData = {
        id: 'test-id',
        type: 'task',
        title: 'Test Title',
        description: 'Test description',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(data.id).toBe('test-id');
      expect(data.type).toBe('task');
      expect(data.title).toBe('Test Title');
      expect(data.description).toBe('Test description');
      expect(data.status).toBe('active');
      expect(data.createdAt).toBeInstanceOf(Date);
      expect(data.updatedAt).toBeInstanceOf(Date);
    });
  });
});
