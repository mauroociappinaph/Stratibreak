import { Test, TestingModule } from '@nestjs/testing';
import { ConnectionResponseDto } from '../dto';
import { IntegrationsService } from '../services/integrations.service';
import { IntegrationsController } from './integrations.controller';

describe('IntegrationsController', () => {
  let controller: IntegrationsController;
  let service: IntegrationsService;

  const mockIntegrationsService = {
    getAllConnections: jest.fn(),
    getConnection: jest.fn(),
    updateConnectionStatus: jest.fn(),
    disconnectTool: jest.fn(),
    reconnectTool: jest.fn(),
    getConnectionHealth: jest.fn(),
    updateConnectionConfiguration: jest.fn(),
    getSyncHistory: jest.fn(),
    // Existing methods
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    testConnection: jest.fn(),
    connectToTool: jest.fn(),
    syncData: jest.fn(),
    findByTypeAndProject: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IntegrationsController],
      providers: [
        {
          provide: IntegrationsService,
          useValue: mockIntegrationsService,
        },
      ],
    }).compile();

    controller = module.get<IntegrationsController>(IntegrationsController);
    service = module.get<IntegrationsService>(IntegrationsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Connection Management', () => {
    describe('getAllConnections', () => {
      it('should return all connections with filters', async () => {
        const mockConnections: ConnectionResponseDto[] = [
          {
            connectionId: 'test-connection-1',
            status: 'connected',
            toolType: 'JIRA',
            name: 'Test Jira Connection',
            lastSync: new Date(),
            nextSync: new Date(),
            syncStatus: 'idle',
            recordsCount: 10,
            configuration: {
              syncFrequency: 15,
              dataMapping: [],
              filters: {},
            },
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ];

        mockIntegrationsService.getAllConnections.mockResolvedValue(
          mockConnections
        );

        const result = await controller.getAllConnections(
          'connected',
          'JIRA',
          'project-1'
        );

        expect(service.getAllConnections).toHaveBeenCalledWith({
          status: 'connected',
          toolType: 'JIRA',
          projectId: 'project-1',
        });
        expect(result).toEqual(mockConnections);
      });

      it('should handle empty filters', async () => {
        const mockConnections: ConnectionResponseDto[] = [];
        mockIntegrationsService.getAllConnections.mockResolvedValue(
          mockConnections
        );

        const result = await controller.getAllConnections();

        expect(service.getAllConnections).toHaveBeenCalledWith({});
        expect(result).toEqual(mockConnections);
      });
    });

    describe('getConnection', () => {
      it('should return a specific connection', async () => {
        const mockConnection: ConnectionResponseDto = {
          connectionId: 'test-connection-1',
          status: 'connected',
          toolType: 'JIRA',
          name: 'Test Jira Connection',
          lastSync: new Date(),
          nextSync: new Date(),
          syncStatus: 'idle',
          recordsCount: 10,
          configuration: {
            syncFrequency: 15,
            dataMapping: [],
            filters: {},
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        mockIntegrationsService.getConnection.mockResolvedValue(mockConnection);

        const result = await controller.getConnection('test-connection-1');

        expect(service.getConnection).toHaveBeenCalledWith('test-connection-1');
        expect(result).toEqual(mockConnection);
      });
    });

    describe('updateConnectionStatus', () => {
      it('should update connection status', async () => {
        const mockConnection: ConnectionResponseDto = {
          connectionId: 'test-connection-1',
          status: 'disconnected',
          toolType: 'JIRA',
          name: 'Test Jira Connection',
          lastSync: new Date(),
          nextSync: new Date(),
          syncStatus: 'idle',
          recordsCount: 10,
          configuration: {
            syncFrequency: 15,
            dataMapping: [],
            filters: {},
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        mockIntegrationsService.updateConnectionStatus.mockResolvedValue(
          mockConnection
        );

        const result = await controller.updateConnectionStatus(
          'test-connection-1',
          {
            status: 'disconnected',
            reason: 'Manual disconnection',
          }
        );

        expect(service.updateConnectionStatus).toHaveBeenCalledWith(
          'test-connection-1',
          'disconnected',
          'Manual disconnection'
        );
        expect(result).toEqual(mockConnection);
      });
    });

    describe('disconnectTool', () => {
      it('should disconnect a tool', async () => {
        mockIntegrationsService.disconnectTool.mockResolvedValue(undefined);

        await controller.disconnectTool('test-connection-1');

        expect(service.disconnectTool).toHaveBeenCalledWith(
          'test-connection-1'
        );
      });
    });

    describe('reconnectTool', () => {
      it('should reconnect a tool', async () => {
        const mockConnection: ConnectionResponseDto = {
          connectionId: 'test-connection-1',
          status: 'connected',
          toolType: 'JIRA',
          name: 'Test Jira Connection',
          lastSync: new Date(),
          nextSync: new Date(),
          syncStatus: 'idle',
          recordsCount: 10,
          configuration: {
            syncFrequency: 15,
            dataMapping: [],
            filters: {},
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        mockIntegrationsService.reconnectTool.mockResolvedValue(mockConnection);

        const result = await controller.reconnectTool('test-connection-1');

        expect(service.reconnectTool).toHaveBeenCalledWith('test-connection-1');
        expect(result).toEqual(mockConnection);
      });
    });

    describe('getConnectionHealth', () => {
      it('should return connection health', async () => {
        const mockHealth = {
          connectionId: 'test-connection-1',
          status: 'healthy',
          lastChecked: new Date(),
          responseTime: 250,
          message: 'Connection is healthy',
        };

        mockIntegrationsService.getConnectionHealth.mockResolvedValue(
          mockHealth
        );

        const result =
          await controller.getConnectionHealth('test-connection-1');

        expect(service.getConnectionHealth).toHaveBeenCalledWith(
          'test-connection-1'
        );
        expect(result).toEqual(mockHealth);
      });
    });

    describe('updateConnectionConfiguration', () => {
      it('should update connection configuration', async () => {
        const mockConnection: ConnectionResponseDto = {
          connectionId: 'test-connection-1',
          status: 'connected',
          toolType: 'JIRA',
          name: 'Test Jira Connection',
          lastSync: new Date(),
          nextSync: new Date(),
          syncStatus: 'idle',
          recordsCount: 10,
          configuration: {
            syncFrequency: 30,
            dataMapping: [],
            filters: { status: 'open' },
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        mockIntegrationsService.updateConnectionConfiguration.mockResolvedValue(
          mockConnection
        );

        const configUpdate = {
          syncFrequency: 30,
          filters: { status: 'open' },
        };

        const result = await controller.updateConnectionConfiguration(
          'test-connection-1',
          configUpdate
        );

        expect(service.updateConnectionConfiguration).toHaveBeenCalledWith(
          'test-connection-1',
          configUpdate
        );
        expect(result).toEqual(mockConnection);
      });
    });

    describe('getSyncHistory', () => {
      it('should return sync history', async () => {
        const mockHistory = {
          connectionId: 'test-connection-1',
          history: [
            {
              syncId: 'sync-1',
              startedAt: new Date(),
              completedAt: new Date(),
              status: 'success',
              recordsProcessed: 10,
              recordsCreated: 5,
              recordsUpdated: 3,
              recordsSkipped: 2,
              errors: [],
            },
          ],
          totalCount: 1,
        };

        mockIntegrationsService.getSyncHistory.mockResolvedValue(mockHistory);

        const result = await controller.getSyncHistory(
          'test-connection-1',
          10,
          0
        );

        expect(service.getSyncHistory).toHaveBeenCalledWith(
          'test-connection-1',
          {
            limit: 10,
            offset: 0,
          }
        );
        expect(result).toEqual(mockHistory);
      });
    });
  });
});
