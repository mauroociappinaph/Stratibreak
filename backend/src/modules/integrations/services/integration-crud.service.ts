import { PrismaService } from '@/common/services';
import { Injectable, Logger } from '@nestjs/common';
import { IntegrationType } from '@prisma/client';
import { CreateIntegrationDto, UpdateIntegrationDto } from '../dto';
import { IntegrationType as DtoIntegrationType } from '../dto/create-integration.dto';
import { IntegrationEntity } from '../entities';

/**
 * Service responsible for basic CRUD operations on integrations
 */
@Injectable()
export class IntegrationCrudService {
  private readonly logger = new Logger(IntegrationCrudService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new integration
   */
  async create(
    createIntegrationDto: CreateIntegrationDto
  ): Promise<IntegrationEntity> {
    this.logger.log(
      `Creating integration: ${createIntegrationDto.name} (${createIntegrationDto.type})`
    );

    try {
      const defaultTenant = await this.ensureDefaultTenant();
      const systemUser = await this.ensureSystemUser(defaultTenant.id);

      if (createIntegrationDto.projectId?.trim()) {
        await this.ensureTestProject(
          createIntegrationDto.projectId,
          systemUser.id,
          defaultTenant.id
        );
      }

      const integration = await this.prisma.integration.create({
        data: {
          name: createIntegrationDto.name,
          type: this.mapDtoTypeToDbType(createIntegrationDto.type),
          status: 'INACTIVE',
          config: (createIntegrationDto.config as unknown) || {},
          credentials: {},
          projectId: createIntegrationDto.projectId,
          userId: systemUser.id,
        },
      });

      return this.mapToEntity(integration);
    } catch (error) {
      this.logger.error('Failed to create integration:', error);
      throw error;
    }
  }

  /**
   * Find all integrations
   */
  async findAll(projectId?: string): Promise<IntegrationEntity[]> {
    const whereClause = projectId ? { projectId } : {};

    const integrations = await this.prisma.integration.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });

    return integrations.map(integration => this.mapToEntity(integration));
  }

  /**
   * Find integration by ID
   */
  async findOne(id: string): Promise<IntegrationEntity> {
    const integration = await this.prisma.integration.findUnique({
      where: { id },
    });

    if (!integration) {
      throw new Error(`Integration with ID ${id} not found`);
    }

    return this.mapToEntity(integration);
  }

  /**
   * Update integration
   */
  async update(
    id: string,
    updateIntegrationDto: UpdateIntegrationDto
  ): Promise<IntegrationEntity> {
    try {
      const updateData: Record<string, unknown> = {
        ...updateIntegrationDto,
        updatedAt: new Date(),
      };

      const integration = await this.prisma.integration.update({
        where: { id },
        data: updateData,
      });

      return this.mapToEntity(integration);
    } catch (error: unknown) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 'P2025'
      ) {
        throw new Error(`Integration with ID ${id} not found`);
      }
      throw error;
    }
  }

  /**
   * Remove integration
   */
  async remove(id: string): Promise<void> {
    try {
      await this.prisma.integration.delete({
        where: { id },
      });
    } catch (error: unknown) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 'P2025'
      ) {
        throw new Error(`Integration with ID ${id} not found`);
      }
      throw error;
    }
  }

  /**
   * Get integration by type and project
   */
  async findByTypeAndProject(
    type: string,
    projectId: string
  ): Promise<IntegrationEntity[]> {
    const integrations = await this.prisma.integration.findMany({
      where: {
        type: type as IntegrationType,
        projectId,
      },
    });

    return integrations.map(integration => this.mapToEntity(integration));
  }

  // Private helper methods
  private async ensureDefaultTenant(): Promise<{ id: string }> {
    let defaultTenant = await this.prisma.tenant.findUnique({
      where: { id: 'default-tenant' },
    });

    if (!defaultTenant) {
      defaultTenant = await this.prisma.tenant.create({
        data: {
          id: 'default-tenant',
          organizationName: 'Test Organization',
          dataEncryptionKey: 'test-key',
        },
      });
    }

    return defaultTenant;
  }

  private async ensureSystemUser(tenantId: string): Promise<{ id: string }> {
    let systemUser = await this.prisma.user.findUnique({
      where: { email: 'system@test.com' },
    });

    if (!systemUser) {
      systemUser = await this.prisma.user.create({
        data: {
          email: 'system@test.com',
          username: 'system',
          password: 'test-password',
          firstName: 'System',
          lastName: 'User',
          role: 'ADMIN',
          tenantId,
        },
      });
    }

    return systemUser;
  }

  private async ensureTestProject(
    projectId: string,
    userId: string,
    tenantId: string
  ): Promise<void> {
    const existingProject = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!existingProject) {
      await this.prisma.project.create({
        data: {
          id: projectId,
          name: 'Test Project',
          description: 'Test project for integration testing',
          status: 'ACTIVE',
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          userId,
          tenantId,
        },
      });
    }
  }

  private mapDtoTypeToDbType(dtoType: DtoIntegrationType): IntegrationType {
    const typeMapping: Record<DtoIntegrationType, IntegrationType> = {
      [DtoIntegrationType.JIRA]: IntegrationType.JIRA,
      [DtoIntegrationType.ASANA]: IntegrationType.ASANA,
      [DtoIntegrationType.TRELLO]: IntegrationType.TRELLO,
      [DtoIntegrationType.MONDAY]: IntegrationType.MONDAY,
      [DtoIntegrationType.BITRIX24]: IntegrationType.BITRIX24,
    };

    return typeMapping[dtoType] || IntegrationType.JIRA;
  }

  private mapToEntity(integration: Record<string, unknown>): IntegrationEntity {
    return {
      id: integration.id as string,
      name: integration.name as string,
      type: integration.type as IntegrationType,
      projectId: integration.projectId as string,
      description: integration.description as string,
      config: integration.config as Record<string, unknown>,
      isActive: integration.isActive as boolean,
      createdAt: integration.createdAt as Date,
      updatedAt: integration.updatedAt as Date,
    };
  }
}
