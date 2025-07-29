import { Body, Controller, Get, Post } from '@nestjs/common';
import type {
  GapAnalysisResponse,
  ProjectAnalysisRequest,
} from '../../../types';
import { GapAnalysisService } from '../services/gap-analysis.service';

@Controller('gap-analysis')
export class GapAnalysisController {
  constructor(private readonly gapAnalysisService: GapAnalysisService) {}

  // TODO: Implement gap analysis endpoints
  // This is a placeholder implementation for task 0.1.b

  @Get('health')
  getHealth(): { status: string } {
    return { status: 'ok' };
  }

  @Post('analyze')
  async analyzeProject(
    @Body() projectData: ProjectAnalysisRequest
  ): Promise<GapAnalysisResponse> {
    return this.gapAnalysisService.analyzeProject(projectData);
  }
}
