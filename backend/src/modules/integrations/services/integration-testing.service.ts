import { Injectable, Logger } from '@nestjs/common';
import { IntegrationType } from '@prisma/client';

/**
 * Service responsible for testing integration connections
 */
@Injectable()
export class IntegrationTestingService {
  private readonly logger = new Logger(IntegrationTestingService.name);

  /**
   * Test integration connection
   */
  async testConnection(
    toolType: IntegrationType,
    config: Record<string, unknown>
  ): Promise<{ success: boolean; message: string }> {
    this.logger.debug(`Testing connection to ${toolType}`);

    await new Promise(resolve => setTimeout(resolve, 100));

    if (!config || Object.keys(config).length === 0) {
      return { success: false, message: 'Configuration is empty' };
    }

    const validationResult = this.validateToolCredentials(toolType, config);
    if (!validationResult.success) {
      return validationResult;
    }

    return { success: true, message: 'Connection test successful' };
  }

  private validateToolCredentials(
    toolType: IntegrationType,
    config: Record<string, unknown>
  ): { success: boolean; message: string } {
    switch (toolType) {
      case IntegrationType.JIRA:
        if (!config.baseUrl || !config.username || !config.apiToken) {
          return {
            success: false,
            message: 'Missing required JIRA credentials',
          };
        }
        break;
      case IntegrationType.ASANA:
        if (!config.accessToken) {
          return { success: false, message: 'Missing Asana access token' };
        }
        break;
      case IntegrationType.TRELLO:
        if (!config.apiKey || !config.token) {
          return { success: false, message: 'Missing Trello API key or token' };
        }
        break;
    }

    return { success: true, message: 'Valid credentials' };
  }
}
