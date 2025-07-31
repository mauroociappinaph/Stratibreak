import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/common/services';

describe('External Service Integrations (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Set up validation pipe for tests
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      })
    );

    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.integration.deleteMany({});
    await app.close();
  });

  beforeEach(async () => {
    // Clean up before each test
    await prisma.integration.deleteMany({});
  });

  describe('Integration CRUD Operations', () => {
    it('should create a new integration', () => {
      return request(app.getHttpServer())
        .post('/integrations')
        .send({
          name: 'Test Jira Integration',
          type: 'JIRA',
          projectId: 'test-project-123',
          description: 'Test integration for e2e testing',
          config: {
            baseUrl: 'https://test.atlassian.net',
            timeout: 30000,
            retryAttempts: 3,
          },
        })
        .expect(201)
        .expect(res => {
          expect(res.body.id).toBeDefined();
          expect(res.body.name).toBe('Test Jira Integration');
          expect(res.body.type).toBe('JIRA');
          expect(res.body.isActive).toBe(true);
        });
    });

    it('should get all integrations', () => {
      return request(app.getHttpServer())
        .get('/integrations')
        .expect(200)
        .expect(res => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('should filter integrations by project', () => {
      return request(app.getHttpServer())
        .get('/integrations?projectId=test-project-123')
        .expect(200)
        .expect(res => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('Connection Testing', () => {
    let integrationId: string;

    beforeEach(async () => {
      const response = await request(app.getHttpServer())
        .post('/integrations')
        .send({
          name: 'Test Connection Integration',
          type: 'JIRA',
          projectId: 'test-project-123',
          config: {
            baseUrl: 'https://test.atlassian.net',
            timeout: 30000,
            retryAttempts: 3,
          },
        });
      integrationId = response.body.id;
    });

    it('should test integration connection', () => {
      return request(app.getHttpServer())
        .post(`/integrations/${integrationId}/test`)
        .expect(200)
        .expect(res => {
          expect(res.body.success).toBeDefined();
          expect(res.body.message).toBeDefined();
        });
    });

    it('should handle connection test for non-existent integration', () => {
      return request(app.getHttpServer())
        .post('/integrations/non-existent-id/test')
        .expect(404);
    });
  });

  describe('External Tool Connection', () => {
    it('should connect to Jira with valid credentials', () => {
      return request(app.getHttpServer())
        .post('/integrations/connect')
        .send({
          toolType: 'JIRA',
          credentials: {
            baseUrl: 'https://test.atlassian.net',
            username: 'test@example.com',
            apiToken: 'test-token-123',
          },
        })
        .expect(201)
        .expect(res => {
          expect(res.body.connectionId).toBeDefined();
          expect(res.body.status).toBeDefined();
          expect(res.body.toolType).toBe('JIRA');
        });
    });

    it('should connect to Asana with valid credentials', () => {
      return request(app.getHttpServer())
        .post('/integrations/connect')
        .send({
          toolType: 'ASANA',
          credentials: {
            accessToken: 'asana-access-token-123',
          },
        })
        .expect(201)
        .expect(res => {
          expect(res.body.connectionId).toBeDefined();
          expect(res.body.status).toBeDefined();
          expect(res.body.toolType).toBe('ASANA');
        });
    });

    it('should connect to Trello with valid credentials', () => {
      return request(app.getHttpServer())
        .post('/integrations/connect')
        .send({
          toolType: 'TRELLO',
          credentials: {
            apiKey: 'trello-api-key-123',
            token: 'trello-token-123',
          },
        })
        .expect(201)
        .expect(res => {
          expect(res.body.connectionId).toBeDefined();
          expect(res.body.status).toBeDefined();
          expect(res.body.toolType).toBe('TRELLO');
        });
    });

    it('should fail to connect with invalid tool type', () => {
      return request(app.getHttpServer())
        .post('/integrations/connect')
        .send({
          toolType: 'INVALID_TOOL',
          credentials: {},
        })
        .expect(201)
        .expect(res => {
          expect(res.body.status).toBe('failed');
          expect(res.body.connectionId).toBe('');
        });
    });

    it('should fail to connect with missing credentials', () => {
      return request(app.getHttpServer())
        .post('/integrations/connect')
        .send({
          toolType: 'JIRA',
          credentials: {},
        })
        .expect(201)
        .expect(res => {
          expect(res.body.status).toBe('failed');
        });
    });
  });

  describe('Data Synchronization', () => {
    let connectionId: string;

    beforeEach(async () => {
      const response = await request(app.getHttpServer())
        .post('/integrations/connect')
        .send({
          toolType: 'JIRA',
          credentials: {
            baseUrl: 'https://test.atlassian.net',
            username: 'test@example.com',
            apiToken: 'test-token-123',
          },
        });
      connectionId = response.body.connectionId;
    });

    it('should sync data from connected integration', () => {
      if (!connectionId) {
        return request(app.getHttpServer())
          .post('/integrations/test-connection-id/sync')
          .expect(200)
          .expect(res => {
            expect(res.body.status).toBe('failed');
            expect(res.body.errors).toContain('Connection not found');
          });
      }

      return request(app.getHttpServer())
        .post(`/integrations/${connectionId}/sync`)
        .expect(200)
        .expect(res => {
          expect(res.body.connectionId).toBe(connectionId);
          expect(res.body.status).toBeDefined();
          expect(res.body.recordsProcessed).toBeDefined();
          expect(Array.isArray(res.body.errors)).toBe(true);
          expect(res.body.lastSync).toBeDefined();
        });
    });

    it('should handle sync for non-existent connection', () => {
      return request(app.getHttpServer())
        .post('/integrations/non-existent-connection/sync')
        .expect(200)
        .expect(res => {
          expect(res.body.status).toBe('failed');
          expect(res.body.errors).toContain('Connection not found');
        });
    });
  });

  describe('Integration by Type and Project', () => {
    beforeEach(async () => {
      await request(app.getHttpServer())
        .post('/integrations')
        .send({
          name: 'Project Specific Jira',
          type: 'JIRA',
          projectId: 'specific-project-123',
          config: { baseUrl: 'https://specific.atlassian.net' },
        });
    });

    it('should find integrations by type and project', () => {
      return request(app.getHttpServer())
        .get('/integrations/type/JIRA/project/specific-project-123')
        .expect(200)
        .expect(res => {
          expect(Array.isArray(res.body)).toBe(true);
          res.body.forEach((integration: unknown) => {
            expect(integration.type).toBe('JIRA');
            expect(integration.projectId).toBe('specific-project-123');
          });
        });
    });

    it('should return empty array for non-existent type/project combination', () => {
      return request(app.getHttpServer())
        .get('/integrations/type/ASANA/project/non-existent-project')
        .expect(200)
        .expect(res => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBe(0);
        });
    });
  });

  describe('Error Handling and Validation', () => {
    it('should validate integration creation data', () => {
      return request(app.getHttpServer())
        .post('/integrations')
        .send({
          // Missing required fields and invalid enum
          name: '',
          type: 'INVALID_TYPE',
          projectId: '', // Empty required field
        })
        .expect(400);
    });

    it('should handle update of non-existent integration', () => {
      return request(app.getHttpServer())
        .patch('/integrations/non-existent-id')
        .send({
          name: 'Updated Name',
        })
        .expect(404);
    });

    it('should handle deletion of non-existent integration', () => {
      return request(app.getHttpServer())
        .delete('/integrations/non-existent-id')
        .expect(404);
    });
  });
});
