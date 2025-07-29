import { Body, Controller, Post } from '@nestjs/common';
import { IntegrationsService } from '../services/integrations.service';

@Controller('integrations')
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) {}

  // TODO: Implement integration endpoints
  // This is a placeholder implementation for task 0.1.b

  @Post('connect')
  async connectTool(
    @Body() connectionData: ConnectionRequest
  ): Promise<ConnectionResponse> {
    return this.integrationsService.connectTool(
      connectionData.toolType,
      connectionData.credentials
    );
  }
}
