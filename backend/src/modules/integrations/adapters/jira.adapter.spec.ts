/**
 * Jira Adapter Unit Tests
 */

import {
  ConnectionStatus,
  HealthStatus,
} from '../../../types/database/integration.types';
import { JiraAdapter, JiraCredentials } from './jira.adapter';

describe('JiraAdapter', () => {
  let adapter: JiraAdapter;
  let mockCredentials: JiraCredentials;

  beforeEach(() => {
    adapter = new JiraAdapter();
    mockCredentials = {
      baseUrl: 'https://test-domain.atlassian.net',
      username: 'test@example.com',
      apiToken: 'test-api-token-123456789',
      projectKey: 'TEST',
    };
  });

  describe('validateCredentials', () => {
    it('should validate correct credentials', async () => {
      const result = await adapter.validateCredentials(mockCredentials);

      expect(result.isValid).toBe(true);
      expect(result.message).toContain('valid');
    });

    it('should reject credentials with missing required fields', async () => {
      const invalidCredentials = { ...mockCredentials };
      delete (invalidCredentials as Record<string, unknown>).apiToken;

      const result = await adapter.validateCredentials(invalidCredentials);

      expect(result.isValid).toBe(false);
      expect(result.message).toContain('Missing required credentials');
      expect(result.missingFields).toContain('apiToken');
    });

    it('should reject credentials with invalid base URL', async () => {
      const invalidCredentials = {
        ...mockCredentials,
        baseUrl: 'invalid-url',
      };

      const result = await adapter.validateCredentials(invalidCredentials);

      expect(result.isValid).toBe(false);
      expect(result.message).toContain('Base URL is not a valid URL');
    });

    it('should reject credentials with invalid username format', async () => {
      const invalidCredentials = {
        ...mockCredentials,
        username: 'invalid-username',
      };

      const result = await adapter.validateCredentials(invalidCredentials);

      expect(result.isValid).toBe(false);
      expect(result.message).toContain('should be an email address');
    });
  });

  describe('connect', () => {
    it('should successfully connect with valid credentials', async () => {
      const result = await adapter.connect(mockCredentials);

      expect(result.success).toBe(true);
      expect(result.status).toBe(ConnectionStatus.CONNECTED);
      expect(result.connectionId).toBeDefined();
      expect(result.metadata?.serverVersion).toBe('9.4.0');
    });

    it('should fail to connect with invalid credentials', async () => {
      jest.spyOn(adapter, 'validateCredentials').mockResolvedValue({
        isValid: false,
        message: 'Invalid credentials',
      });

      const result = await adapter.connect(mockCredentials);

      expect(result.success).toBe(false);
      expect(result.status).toBe(ConnectionStatus.ERROR);
      expect(result.message).toBe('Invalid credentials');
    });

    it('should fail to connect when server info fetch fails', async () => {
      // Test with invalid credentials to simulate server fetch failure
      const invalidCredentials = {
        ...mockCredentials,
        baseUrl: 'invalid-url',
      };

      const result = await adapter.connect(invalidCredentials);

      expect(result.success).toBe(false);
      expect(result.status).toBe(ConnectionStatus.ERROR);
    });
  });

  describe('disconnect', () => {
    it('should successfully disconnect existing connection', async () => {
      // First connect to create a connection
      const connectResult = await adapter.connect(mockCredentials);
      const connectionId = connectResult.connectionId!;

      const result = await adapter.disconnect(connectionId);

      expect(result.success).toBe(true);
      expect(result.cleanupPerformed).toBe(true);
      expect(result.message).toContain('Successfully disconnected');
    });

    it('should handle disconnecting non-existent connection', async () => {
      const result = await adapter.disconnect('non-existent-id');

      expect(result.success).toBe(true);
      expect(result.cleanupPerformed).toBe(false);
      expect(result.message).toContain('already disconnected');
    });
  });

  describe('testConnection', () => {
    it('should return healthy status for valid connection', async () => {
      // First connect to create a connection
      const connectResult = await adapter.connect(mockCredentials);
      const connectionId = connectResult.connectionId!;

      const result = await adapter.testConnection(connectionId);

      expect(result.status).toBe(HealthStatus.HEALTHY);
      expect(result.message).toBe('Jira connection is healthy');
      expect(result.details?.serverVersion).toBe('9.4.0');
    });

    it('should return unhealthy status for non-existent connection', async () => {
      const result = await adapter.testConnection('non-existent-id');

      expect(result.status).toBe(HealthStatus.UNHEALTHY);
      expect(result.message).toBe('Connection not found');
    });
  });

  describe('getSupportedFeatures', () => {
    it('should return list of supported features', () => {
      const features = adapter.getSupportedFeatures();

      expect(features).toBeInstanceOf(Array);
      expect(features.length).toBeGreaterThan(0);

      const bidirectionalSync = features.find(
        f => f.name === 'bidirectional_sync'
      );
      expect(bidirectionalSync).toBeDefined();
      expect(bidirectionalSync?.supported).toBe(true);
    });
  });

  describe('getConfigurationSchema', () => {
    it('should return valid configuration schema', () => {
      const schema = adapter.getConfigurationSchema();

      expect(schema.type).toBe('object');
      expect(schema.properties).toBeDefined();
      expect(schema.required).toContain('baseUrl');
      expect(schema.required).toContain('username');
      expect(schema.required).toContain('apiToken');

      expect(schema.properties.apiToken.sensitive).toBe(true);
    });
  });
});
