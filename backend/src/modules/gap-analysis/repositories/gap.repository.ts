import { Injectable, Logger } from '@nestjs/common';
import { Gap, Prisma } from '@prisma/client';
import { PrismaService } from '../../../common/services';
import { CreateGapAnalysisDto, UpdateGapAnalysisDto } from '../dto';

@Injectable()
export class GapRepository {
  private readonly logger = new Logger(GapRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createGapDto: CreateGapAnalysisDto): Promise<Gap> {
    try {
      const data: Prisma.GapCreateInput = {
        title: createGapDto.title,
        description: createGapDto.description || '',
        type: createGapDto.type,
        severity: createGapDto.severity,
        project: { connect: { id: createGapDto.projectId } },
        user: { connect: { id: 'system' } }, // TODO: Get from auth context
        status: 'OPEN',
      };
      return this.prisma.gap.create({ data });
    } catch (error) {
      this.logger.error('Failed to create gap:', error);
      throw error;
    }
  }

  async findAll(): Promise<Gap[]> {
    try {
      return this.prisma.gap.findMany({
        include: {
          rootCauses: true,
          affectedAreas: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      this.logger.error('Failed to find all gaps:', error);
      throw error;
    }
  }

  async findOne(id: string): Promise<Gap | null> {
    try {
      return this.prisma.gap.findUnique({
        where: { id },
        include: {
          rootCauses: true,
          affectedAreas: true,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to find gap ${id}:`, error);
      throw error;
    }
  }

  async update(id: string, updateGapDto: UpdateGapAnalysisDto): Promise<Gap> {
    try {
      const data: Prisma.GapUpdateInput = {};
      if (updateGapDto.title) data.title = updateGapDto.title;
      if (updateGapDto.description) data.description = updateGapDto.description;
      if (updateGapDto.type) data.type = updateGapDto.type;
      if (updateGapDto.severity) data.severity = updateGapDto.severity;

      return this.prisma.gap.update({
        where: { id },
        data,
        include: {
          rootCauses: true,
          affectedAreas: true,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to update gap ${id}:`, error);
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.gap.delete({ where: { id } });
      this.logger.log(`Gap ${id} removed successfully`);
    } catch (error) {
      this.logger.error(`Failed to remove gap ${id}:`, error);
      throw error;
    }
  }
}
