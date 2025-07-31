import { PrismaService } from '@/common/services';
import type { SyncResult } from '@/types/services';
import { Injectable, Logger } from '@nestjs/common';

/**
 * Service responsible for managing sync history and results
 */
@Injectable()
export class SyncHistoryService {
  private readonly logger = new Logger(SyncHistoryService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Store sync result in the database
   */
  async storeSyncResult(
    connectionId: string,
    syncResult: SyncResult
  ): Promise<void> {
    try {
      // Check if integration exists before storing sync result
      const integration = await this.prisma.integration.findUnique({
        where: { id: connectionId },
      });

      if (!integration) {
        this.logger.warn(
          `Cannot store sync result: Integration ${connectionId} not found`
        );
        return;
      }

      await this.prisma.syncResult.create({
        data: {
          integrationId: connectionId,
          status: syncResult.status,
          recordsSync: syncResult.recordsProcessed,
          errorMessage: syncResult.errors.join('; ') || null,
          syncDuration: 1000, // Default duration
        },
      });

      this.logger.debug(`Stored sync result for connection: ${connectionId}`);
    } catch (error) {
      this.logger.error('Failed to store sync result:', error);
    }
  }

  /**
   * Get sync history for a connection
   */
  async getSyncHistory(
    connectionId: string,
    options: { limit: number; offset: number }
  ): Promise<{
    history: Array<{
      syncId: string;
      startedAt: Date;
      completedAt: Date;
      status: string;
      recordsProcessed: number;
      recordsCreated: number;
      recordsUpdated: number;
      recordsSkipped: number;
      errors: Array<{ message: string; recordId?: string }>;
    }>;
    totalCount: number;
  }> {
    this.logger.debug(`Getting sync history for connection: ${connectionId}`);

    try {
      const syncResults = await this.prisma.syncResult.findMany({
        where: { integrationId: connectionId },
        orderBy: { createdAt: 'desc' },
        take: options.limit,
        skip: options.offset,
      });

      const totalCount = await this.prisma.syncResult.count({
        where: { integrationId: connectionId },
      });

      const history = syncResults.map(result => ({
        syncId: result.id,
        startedAt: result.createdAt,
        completedAt: new Date(
          result.createdAt.getTime() + (result.syncDuration || 1000)
        ),
        status: result.status,
        recordsProcessed: result.recordsSync || 0,
        recordsCreated: Math.floor((result.recordsSync || 0) * 0.3), // Estimated
        recordsUpdated: Math.floor((result.recordsSync || 0) * 0.6), // Estimated
        recordsSkipped: Math.floor((result.recordsSync || 0) * 0.1), // Estimated
        errors: result.errorMessage ? [{ message: result.errorMessage }] : [],
      }));

      return { history, totalCount };
    } catch (error) {
      this.logger.error(
        `Failed to get sync history for ${connectionId}:`,
        error
      );
      return { history: [], totalCount: 0 };
    }
  }

  /**
   * Get sync statistics for a connection
   */
  async getSyncStatistics(connectionId: string): Promise<{
    totalSyncs: number;
    successfulSyncs: number;
    failedSyncs: number;
    averageRecordsProcessed: number;
    lastSyncDate: Date | null;
  }> {
    try {
      const stats = await this.prisma.syncResult.aggregate({
        where: { integrationId: connectionId },
        _count: { id: true },
        _avg: { recordsSync: true },
      });

      const successfulSyncs = await this.prisma.syncResult.count({
        where: {
          integrationId: connectionId,
          status: 'success',
        },
      });

      const failedSyncs = await this.prisma.syncResult.count({
        where: {
          integrationId: connectionId,
          status: 'failed',
        },
      });

      const lastSync = await this.prisma.syncResult.findFirst({
        where: { integrationId: connectionId },
        orderBy: { createdAt: 'desc' },
        select: { createdAt: true },
      });

      return {
        totalSyncs: stats._count.id,
        successfulSyncs,
        failedSyncs,
        averageRecordsProcessed: Math.round(stats._avg.recordsSync || 0),
        lastSyncDate: lastSync?.createdAt || null,
      };
    } catch (error) {
      this.logger.error(
        `Failed to get sync statistics for ${connectionId}:`,
        error
      );
      return {
        totalSyncs: 0,
        successfulSyncs: 0,
        failedSyncs: 0,
        averageRecordsProcessed: 0,
        lastSyncDate: null,
      };
    }
  }
}
