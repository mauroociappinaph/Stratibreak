import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../common/services/prisma.service';
import { CreateIntegrationDto, IntegrationType } from '../dto';
import { IntegrationsCoreService } from './integrations-core.service';
import { IntegrationsService } from './integrations.service';

describe('IntegrationsService', () => {
  let service: IntegrationsService;

  const mockPrismaService = {
    integration: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    syncResult: {
      create: jest.fn(),
    },
  };

  const mockCoreService = {
    connectToTool: jest.fn().mockResolvedValue({
      connectionId: 'test-connection-id',
      status: 'connected',
      toolType: 'jira',
      name: 'Test Connection',
      syncStatus: 'idle',
      recordsCount: 0,
      configuration: { syncFrequency: 15, dataMapping: [], filters: {} },
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    syncData: jest.fn().mockResolvedValue({
      connectionId: 'test-connection-id',
      status: 'success',
      recordsProcessed: 10,
      errors: [],
      lastSync: new Date(),
    }),
    handleIntegrationFailure: jest.fn().mockResolvedValue({
      action: 'manual_intervention',
    }),
    validateDataConsistency: jest.fn().mockResolvedValue({
      isValid: true,
      inconsistencies: [],
      confidence: 1.0,
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IntegrationsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: IntegrationsCoreService,
          useValue: mockCoreService,
        },
      ],
    }).compile();

    service = module.get<IntegrationsService>(IntegrationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('connectToTool', () => {
    it('should successfully connect to a valid tool', async () => {
      const result = await service.connectToTool('jira', {
        baseUrl: 'https://test.atlassian.net',
        username: 'test@example.com',
        apiToken: 'test-token',
      });

      expect(result.status).toBe('connected');
      expect(result.toolType).toBe('jira');
      expect(result.connectionId).toBeDefined();
    });

    it('should fail to connect to invalid tool type', async () => {
      mockCoreService.connectToTool.mockResolvedValueOnce({
        connectionId: '',
        status: 'failed',
        toolType: 'invalid-tool',
        name: 'invalid-tool',
        syncStatus: 'error',
        recordsCount: 0,
        configuration: { syncFrequency: 15, dataMapping: [], filters: {} },
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.connectToTool('invalid-tool', {});

      expect(result.status).toBe('failed');
      expect(result.connectionId).toBe('');
    });

    it('should fail to connect with missing credentials', async () => {
      mockCoreService.connectToTool.mockResolvedValueOnce({
        connectionId: '',
        status: 'failed',
        toolType: 'jira',
        name: 'jira',
        syncStatus: 'error',
        recordsCount: 0,
        configuration: { syncFrequency: 15, dataMapping: [], filters: {} },
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.connectToTool('jira', {});

      expect(result.status).toBe('failed');
      expect(result.connectionId).toBe('');
    });
  });

  describe('syncData', () => {
    it('should return error for non-existent connection', async () => {
      mockCoreService.syncData.mockResolvedValueOnce({
        connectionId: 'non-existent-id',
        status: 'failed',
        recordsProcessed: 0,
        errors: ['Connection not found'],
        lastSync: new Date(),
      });

      const result = await service.syncData('non-existent-id');

      expect(result.status).toBe('failed');
      expect(result.errors).toContain('Connection not found');
    });
  });

  describe('handleIntegrationFailure', () => {
    it('should return manual intervention for authentication errors', async () => {
      const error = {
        connectionId: 'test-id',
        errorType: 'authentication' as const,
        message: 'Auth failed',
        timestamp: new Date(),
        retryable: false,
      };

      mockCoreService.handleIntegrationFailure.mockResolvedValue({
        action: 'manual_intervention',
      });

      const result = await service.handleIntegrationFailure(error);

      expect(result.action).toBe('manual_intervention');
    });

    it('should return retry for network errors', async () => {
      const error = {
        connectionId: 'test-id',
        errorType: 'network' as const,
        message: 'Network timeout',
        timestamp: new Date(),
        retryable: true,
      };

      mockCoreService.handleIntegrationFailure.mockResolvedValue({
        action: 'retry',
        delay: 30000,
        maxRetries: 3,
      });

      const result = await service.handleIntegrationFailure(error);

      expect(result.action).toBe('retry');
      expect(result.delay).toBe(30000);
      expect(result.maxRetries).toBe(3);
    });
  });

  describe('validateDataConsistency', () => {
    it('should return valid for identical data', async () => {
      const data = { id: '1', name: 'test' };
      const result = await service.validateDataConsistency(data, data);

      expect(result.isValid).toBe(true);
      expect(result.confidence).toBe(1.0);
    });

    it('should return invalid for different data', async () => {
      const localData = { id: '1', name: 'test1' };
      const externalData = { id: '1', name: 'test2' };

      mockCoreService.validateDataConsistency.mockResolvedValueOnce({
        isValid: false,
        inconsistencies: ['Value mismatch for key: name'],
        confidence: 0.9,
      });

      const result = await service.validateDataConsistency(
        localData,
        externalData
      );

      expect(result.isValid).toBe(false);
      expect(result.confidence).toBeLessThan(1.0);
    });

    it('should handle null data gracefully', async () => {
      const result = await service.validateDataConsistency(null, null);

      expect(result.isValid).toBe(true);
      expect(result.confidence).toBe(1.0);
    });
  });

  describe('create', () => {
    it('should create a new integration', async () => {
      const createDto: CreateIntegrationDto = {
        name: 'Test Integration',
        type: IntegrationType.JIRA,
        projectId: 'project-1',
        description: 'Test description',
        config: { baseUrl: 'https://test.com' },
      };

      const mockIntegration = {
        id: 'integration-1',
        ...createDto,
        type: 'JIRA',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.integration.create.mockResolvedValue(mockIntegration);

      const result = await service.create(createDto);

      expect(result.id).toBe('integration-1');
      expect(result.name).toBe('Test Integration');
      expect(mockPrismaService.integration.create).toHaveBeenCalled();
    });
  });
});
