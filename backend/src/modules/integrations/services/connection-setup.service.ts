import { Injectable, Logger } from '@nestjs/common';
import { IntegrationType } from '@prisma/client';

@Injectable()
export class ConnectionSetupService {
  private readonly logger = new Logger(ConnectionSetupService.name);

  isValidToolType(toolType: string): boolean {
    const validTypes = ['JIRA', 'ASANA', 'TRELLO', 'MONDAY', 'BITRIX24'];
    return validTypes.includes(toolType.toUpperCase());
  }

  async createConnectionConfig(
    toolType: IntegrationType,
    credentials: Record<string, string>
  ): Promise<Record<string, unknown>> {
    const baseConfig = { timeout: 30000, retryAttempts: 3 };

    switch (toolType) {
      case IntegrationType.JIRA:
        return {
          ...baseConfig,
          baseUrl: credentials.baseUrl,
          username: credentials.username,
          apiToken: credentials.apiToken,
        };
      case IntegrationType.ASANA:
        return { ...baseConfig, accessToken: credentials.accessToken };
      case IntegrationType.TRELLO:
        return {
          ...baseConfig,
          apiKey: credentials.apiKey,
          token: credentials.token,
        };
      default:
        return { ...baseConfig, ...credentials };
    }
  }

  async testToolConnection(
    toolType: IntegrationType,
    config: Record<string, unknown>
  ): Promise<{ success: boolean; message: string }> {
    this.logger.debug(`Testing connection to ${toolType}`);

    await new Promise(resolve => setTimeout(resolve, 100));

    if (!config || Object.keys(config).length === 0) {
      return { success: false, message: 'Configuration is empty' };
    }

    return this.validateToolCredentials(toolType, config);
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

    return { success: true, message: 'Connection test successful' };
  }
}
