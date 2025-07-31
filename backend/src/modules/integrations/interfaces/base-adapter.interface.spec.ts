/**
 * Base Integration Adapter Interface Tests - Core Functionality
 *
 * These tests verify the core functionality of the base adapter interface.
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

describe('BaseIntegrationAdapter - Core Functionality', () => {
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
});
