import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../common/services';
import { SeverityLevel } from '../../../types/database/gap.types';
import type {
  ProjectGoal,
  ProjectState,
} from '../../../types/database/project.types';
import { RiskLevel, TrendDirection } from '../../../types/database/state.types';
import type {
  AnalysisConfig,
  CategorizedGaps,
  Gap,
  GapAnalysisEngine,
  GapAnalysisResult,
  ProjectData,
  Recommendation,
} from '../../../types/services/gap-analysis.types';
import { CreateGapAnalysisDto, UpdateGapAnalysisDto } from '../dto';
import { GapAnalysisEntity } from '../entities';
import { GapRepository } from '../repositories/gap.repository';
import { GapMapper } from '../mappers/gap.mapper';
import { SeverityCalculatorService } from './severity-calculator.service';

@Injectable()
export class GapAnalysisService implements GapAnalysisEngine {
  private readonly logger = new Logger(GapAnalysisService.name);

  // Default analysis configuration
  private readonly defaultConfig: AnalysisConfig = {
    enablePredictiveAnalysis: true,
    confidenceThreshold: 0.7,
    severityWeights: {
      resource: 0.9,
      process: 0.8,
      communication: 0.7,
      technology: 0.8,
      culture: 0.6,
      timeline: 0.9,
      quality: 0.8,
      budget: 0.9,
      skill: 0.7,
      governance: 0.6,
    },
    includeHistoricalTrends: true,
    maxGapsPerCategory: 10,
  };

  constructor(
    private readonly prisma: PrismaService, // Keep for now for fetchProjectData
    private readonly gapRepository: GapRepository,
    private readonly gapMapper: GapMapper,
    private readonly severityCalculator: SeverityCalculatorService
  ) {}

  /**
   * Core gap analysis implementation - analyzes project data to identify gaps
   */
  async analyzeProject(projectData: ProjectData): Promise<GapAnalysisResult> {
    const startTime = Date.now();
    this.logger.log(
      `Starting gap analysis for project ${projectData.project.id}`
    );

    try {
      // Step 1: Identify discrepancies between current state and goals
      const identifiedGaps = this.identifyDiscrepancies(
        projectData.currentState,
        projectData.goals
      );

      // Step 2: Categorize gaps by type
      const categorizedGaps = this.categorizeGaps(identifiedGaps);

      // Step 3: Calculate severity for each gap
      const gapsWithSeverity =
        await this.calculateGapSeverities(identifiedGaps);

      // Step 4: Generate recommendations
      const recommendations = this.generateRecommendations(gapsWithSeverity);

      // Step 5: Calculate overall health score
      const overallHealthScore =
        this.calculateOverallHealthScore(gapsWithSeverity);

      // Step 6: Calculate analysis confidence
      const confidence = this.calculateAnalysisConfidence(gapsWithSeverity);

      const executionTimeMs = Date.now() - startTime;

      const result: GapAnalysisResult = {
        projectId: projectData.project.id,
        analysisTimestamp: new Date(),
        identifiedGaps: categorizedGaps,
        overallHealthScore,
        prioritizedRecommendations: recommendations,
        executionTimeMs,
        confidence,
      };

      this.logger.log(
        `Gap analysis completed for project ${projectData.project.id} in ${executionTimeMs}ms. ` +
          `Found ${identifiedGaps.length} gaps with ${confidence.toFixed(2)} confidence.`
      );

      return result;
    } catch (error) {
      this.logger.error(
        `Gap analysis failed for project ${projectData.project.id}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Identifies discrepancies between current project state and target goals
   */
  identifyDiscrepancies(current: ProjectState, targets: ProjectGoal[]): Gap[] {
    const gaps: Gap[] = [];

    // Analyze each goal against current state
    for (const goal of targets) {
      const gap = this.analyzeGoalGap(current, goal);
      if (gap) {
        gaps.push(gap);
      }
    }

    // Analyze system-level gaps
    const systemGaps = this.analyzeSystemLevelGaps(current);
    gaps.push(...systemGaps);

    return gaps;
  }

  /**
   * Categorizes gaps by their type for better organization
   */
  categorizeGaps(gaps: Gap[]): CategorizedGaps {
    const categorized: CategorizedGaps = {
      resource: [],
      process: [],
      communication: [],
      technology: [],
      culture: [],
      timeline: [],
      quality: [],
      budget: [],
      skill: [],
      governance: [],
    };

    for (const gap of gaps) {
      if (categorized[gap.type]) {
        categorized[gap.type].push(gap);
      }
    }

    // Sort each category by severity (critical first)
    Object.keys(categorized).forEach(category => {
      categorized[category as keyof CategorizedGaps].sort((a, b) => {
        const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return severityOrder[b.severity] - severityOrder[a.severity];
      });
    });

    return categorized;
  }

  /**
   * Calculates severity level for a gap based on multiple factors
   * Uses advanced severity calculation algorithms
   */
  calculateGapSeverity(gap: Gap): SeverityLevel {
    // Use the advanced severity calculator with ensemble approach
    return this.severityCalculator.calculateEnsembleSeverity(gap, {
      config: this.defaultConfig,
    });
  }

  /**
   * CRUD Operations for gap analysis entities
   */
  async create(
    createGapAnalysisDto: CreateGapAnalysisDto
  ): Promise<GapAnalysisEntity> {
    const gap = await this.gapRepository.create(createGapAnalysisDto);
    return this.gapMapper.prismaToEntity(gap);
  }

  async findAll(): Promise<GapAnalysisEntity[]> {
    const gaps = await this.gapRepository.findAll();
    return gaps.map(gap => this.gapMapper.prismaToEntity(gap));
  }

  async findOne(id: string): Promise<GapAnalysisEntity> {
    const gap = await this.gapRepository.findOne(id);
    if (!gap) {
      throw new NotFoundException(`Gap analysis with ID ${id} not found`);
    }
    return this.gapMapper.prismaToEntity(gap);
  }

  async update(
    id: string,
    updateGapAnalysisDto: UpdateGapAnalysisDto
  ): Promise<GapAnalysisEntity> {
    const gap = await this.gapRepository.update(id, updateGapAnalysisDto);
    return this.gapMapper.prismaToEntity(gap);
  }

  async remove(id: string): Promise<void> {
    await this.gapRepository.remove(id);
  }

  /**
   * Perform comprehensive analysis on a project
   */
  async performAnalysis(projectId: string): Promise<GapAnalysisEntity> {
    try {
      // Fetch project data
      const projectData = await this.fetchProjectData(projectId);

      // Perform analysis
      const analysisResult = await this.analyzeProject(projectData);

      // Store analysis record
      await this.storeAnalysisRecord(analysisResult);

      // Return the first identified gap as entity (for compatibility)
      const firstGap = Object.values(analysisResult.identifiedGaps)
        .flat()
        .find(gap => gap);

      if (!firstGap) {
        throw new Error('No gaps identified in analysis');
      }

      // Create and return gap entity
      return this.create({
        projectId: firstGap.projectId,
        title: firstGap.title,
        description: firstGap.description,
        type: firstGap.type as any,
        severity: firstGap.severity as any,
      });
    } catch (error) {
      this.logger.error(
        `Failed to perform analysis for project ${projectId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Private helper methods
   */
  private async calculateGapSeverities(gaps: Gap[]): Promise<Gap[]> {
    return gaps.map(gap => ({
      ...gap,
      severity: this.calculateGapSeverity(gap),
    }));
  }

  private analyzeGoalGap(current: ProjectState, goal: ProjectGoal): Gap | null {
    // Simple gap analysis based on goal progress
    const currentValue = this.extractCurrentValueForGoal(current, goal);
    const targetValue = this.extractTargetValue(goal);
    const variance = this.calculateVariance(currentValue, targetValue);

    if (Math.abs(variance) < 0.1) {
      return null; // No significant gap
    }

    return {
      projectId: goal.projectId,
      type: this.inferGapType(goal),
      category: this.inferGapCategory(goal),
      title: `Gap in ${goal.title}`,
      description: `Current performance does not meet target for ${goal.title}`,
      currentValue,
      targetValue,
      variance,
      severity: 'medium' as any, // Will be recalculated
      rootCauses: this.identifyRootCauses(goal, variance),
      affectedAreas: this.identifyAffectedAreas(goal),
      estimatedImpact: this.estimateImpact(goal, variance),
      confidence: 0.8,
    };
  }

  private analyzeSystemLevelGaps(current: ProjectState): Gap[] {
    const gaps: Gap[] = [];

    // Timeline gaps
    if (current.timeline && current.timeline.delays > 0) {
      gaps.push(this.createTimelineGap(current));
    }

    // Resource gaps
    if (current.resources && current.resources.utilization > 0.9) {
      gaps.push(this.createResourceGap(current));
    }

    // Quality gaps
    if (current.quality && current.quality.defectRate > 0.05) {
      gaps.push(this.createQualityGap(current));
    }

    return gaps;
  }

  private createTimelineGap(current: ProjectState): Gap {
    return {
      projectId: current.projectId,
      type: 'timeline' as any,
      category: 'operational' as any,
      title: 'Timeline Delay Detected',
      description: `Project is delayed by ${current.timeline.delays} days`,
      currentValue: current.timeline.delays,
      targetValue: 0,
      variance: current.timeline.delays,
      severity:
        current.timeline.delays > 7 ? ('high' as any) : ('medium' as any),
      rootCauses: [
        {
          id: 'timeline-rc-1',
          gapId: '',
          category: 'process' as any,
          description: 'Inefficient task scheduling and resource allocation',
          confidence: 0.7,
          evidence: ['Historical delay patterns', 'Resource utilization data'],
          contributionWeight: 0.8,
        },
      ],
      affectedAreas: [
        {
          id: 'timeline-area-1',
          name: 'Project Delivery',
          description: 'Overall project timeline and delivery schedule',
          criticality: 'high' as any,
        },
      ],
      estimatedImpact: {
        id: 'timeline-impact-1',
        gapId: '',
        type: 'timeline' as any,
        level:
          current.timeline.delays > 14 ? ('high' as any) : ('medium' as any),
        description:
          'Delayed project delivery affecting stakeholder expectations',
        timeframe: 'immediate',
        affectedStakeholders: ['project-manager', 'client', 'team'],
      },
      confidence: 0.9,
    };
  }

  private createResourceGap(current: ProjectState): Gap {
    return {
      projectId: current.projectId,
      type: 'resource' as any,
      category: 'operational' as any,
      title: 'Resource Over-utilization',
      description: `Resources are over-utilized at ${(current.resources.utilization * 100).toFixed(1)}%`,
      currentValue: current.resources.utilization,
      targetValue: 0.8,
      variance: current.resources.utilization - 0.8,
      severity:
        current.resources.utilization > 0.95
          ? ('critical' as any)
          : ('high' as any),
      rootCauses: [
        {
          id: 'resource-rc-1',
          gapId: '',
          category: 'management' as any,
          description: 'Insufficient resource planning and allocation',
          confidence: 0.8,
          evidence: ['Resource utilization metrics', 'Team workload data'],
          contributionWeight: 0.9,
        },
      ],
      affectedAreas: [
        {
          id: 'resource-area-1',
          name: 'Team Productivity',
          description: 'Team performance and sustainability',
          criticality: 'high' as any,
        },
      ],
      estimatedImpact: {
        id: 'resource-impact-1',
        gapId: '',
        type: 'team_morale' as any,
        level: 'high' as any,
        description: 'Team burnout risk and decreased productivity',
        timeframe: 'short-term',
        affectedStakeholders: ['team-members', 'project-manager'],
      },
      confidence: 0.85,
    };
  }

  private createQualityGap(current: ProjectState): Gap {
    return {
      projectId: current.projectId,
      type: 'quality' as any,
      category: 'technical' as any,
      title: 'Quality Issues Detected',
      description: `Defect rate is ${(current.quality.defectRate * 100).toFixed(1)}% above acceptable threshold`,
      currentValue: current.quality.defectRate,
      targetValue: 0.02,
      variance: current.quality.defectRate - 0.02,
      severity:
        current.quality.defectRate > 0.1
          ? ('critical' as any)
          : ('high' as any),
      rootCauses: [
        {
          id: 'quality-rc-1',
          gapId: '',
          category: 'process' as any,
          description: 'Inadequate quality assurance processes',
          confidence: 0.75,
          evidence: ['Defect tracking data', 'Code review metrics'],
          contributionWeight: 0.7,
        },
      ],
      affectedAreas: [
        {
          id: 'quality-area-1',
          name: 'Product Quality',
          description: 'Overall product quality and reliability',
          criticality: 'critical' as any,
        },
      ],
      estimatedImpact: {
        id: 'quality-impact-1',
        gapId: '',
        type: 'customer_satisfaction' as any,
        level: 'high' as any,
        description: 'Potential customer dissatisfaction and reputation damage',
        timeframe: 'medium-term',
        affectedStakeholders: ['customers', 'product-owner', 'qa-team'],
      },
      confidence: 0.8,
    };
  }

  private generateRecommendations(gaps: Gap[]): Recommendation[] {
    return gaps.map((gap, index) => ({
      id: `rec-${index + 1}`,
      gapId: gap.id || `gap-${index + 1}`,
      title: `Address ${gap.title}`,
      description: this.generateRecommendationDescription(gap),
      priority: this.mapSeverityToPriority(gap.severity),
      estimatedEffort: this.estimateEffort(gap),
      estimatedImpact: gap.confidence,
      requiredResources: this.identifyRequiredResources(gap),
      timeline: this.estimateTimeline(gap),
      dependencies: [],
    }));
  }

  private calculateOverallHealthScore(gaps: Gap[]): number {
    if (gaps.length === 0) return 100;

    const severityWeights = { critical: 0.4, high: 0.3, medium: 0.2, low: 0.1 };
    const totalWeight = gaps.reduce(
      (sum, gap) => sum + severityWeights[gap.severity],
      0
    );
    const maxPossibleWeight = gaps.length * 0.4; // If all were critical

    return Math.max(0, 100 - (totalWeight / maxPossibleWeight) * 100);
  }

  private calculateAnalysisConfidence(gaps: Gap[]): number {
    if (gaps.length === 0) return 1.0;

    const avgConfidence =
      gaps.reduce((sum, gap) => sum + gap.confidence, 0) / gaps.length;
    return Math.min(1.0, avgConfidence);
  }

  private async fetchProjectData(projectId: string): Promise<ProjectData> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: {
        goals: true,
        stakeholders: true,
      },
    });

    if (!project) {
      throw new Error(`Project ${projectId} not found`);
    }

    // Mock current state - in real implementation, this would be calculated from various sources
    const currentState: ProjectState = {
      id: `state-${projectId}`,
      projectId,
      progress: 0.6,
      healthScore: 75,
      resources: {
        utilization: 0.9,
        available: 40,
        allocated: 36,
        budget: {
          allocated: 100000,
          spent: 65000,
          remaining: 35000,
          burnRate: 8500,
        },
        team: {
          totalMembers: 8,
          activeMembers: 7,
          capacity: 320, // hours per week
          workload: 288, // current workload in hours
        },
      },
      timeline: {
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        currentDate: new Date(),
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
        progress: 0.6,
        milestones: [],
        delays: 5,
      },
      quality: {
        currentScore: 8.2,
        defectRate: 0.03,
        testCoverage: 85,
        codeQuality: 8.2,
        customerSatisfaction: 4.2,
      },
      risks: {
        overallRisk: RiskLevel.MEDIUM,
        activeRisks: 5,
        mitigatedRisks: 2,
        riskTrend: TrendDirection.STABLE,
      },
      lastUpdated: new Date(),
    };

    return {
      project: {
        id: project.id,
        tenantId: project.tenantId,
        name: project.name,
        description: project.description || '',
        status: project.status as any,
        startDate: project.startDate || new Date(),
        endDate: project.endDate || new Date(),
        goals: project.goals.map(g => ({
          ...g,
          targetValue: String(g.targetValue),
          currentValue: g.currentValue ? String(g.currentValue) : '',
          description: g.description || '',
          priority: 'medium' as const,
          status: 'in_progress' as const,
        })),
        stakeholders: project.stakeholders.map(s => ({
          id: s.id,
          projectId: s.projectId,
          userId: s.id, // Simplified mapping
          role: 'contributor' as any,
          permissions: ['read' as any],
          addedAt: s.createdAt,
        })),
        currentState,
        connectedTools: [],
        analysisHistory: [],
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      },
      currentState,
      goals: project.goals.map(g => ({
        ...g,
        targetValue: String(g.targetValue),
        currentValue: g.currentValue ? String(g.currentValue) : undefined,
        description: g.description || '',
        priority: 'medium' as any,
        status: 'in_progress' as any,
      })),
    };
  }

  private async storeAnalysisRecord(result: GapAnalysisResult): Promise<void> {
    await this.prisma.analysisRecord.create({
      data: {
        projectId: result.projectId,
        analysisType: 'gap_analysis',
        results: result as any,
        overallScore: result.overallHealthScore,
        executionTime: result.executionTimeMs,
      },
    });
  }

  private mapToEntity(gap: any): GapAnalysisEntity {
    return {
      id: gap.id,
      projectId: gap.projectId,
      title: gap.title,
      description: gap.description,
      type: gap.type,
      severity: gap.severity,
      createdAt: gap.createdAt,
      updatedAt: gap.updatedAt,
    };
  }

  // Helper methods for gap analysis
  private extractCurrentValueForGoal(
    current: ProjectState,
    goal: ProjectGoal
  ): any {
    // Extract current value based on goal type and available project state data
    const goalTitle = goal.title.toLowerCase();

    if (goalTitle.includes('progress') || goalTitle.includes('completion')) {
      return current.progress;
    }

    if (goalTitle.includes('quality') || goalTitle.includes('defect')) {
      return current.quality?.defectRate || 0;
    }

    if (goalTitle.includes('resource') || goalTitle.includes('utilization')) {
      return current.resources?.utilization || 0;
    }

    if (goalTitle.includes('timeline') || goalTitle.includes('schedule')) {
      return current.timeline?.progress || 0;
    }

    if (goalTitle.includes('health') || goalTitle.includes('score')) {
      return current.healthScore;
    }

    // Default to progress if no specific match
    return current.progress;
  }

  private extractTargetValue(goal: ProjectGoal): any {
    if (typeof goal.targetValue === 'object' && goal.targetValue !== null) {
      // Handle JSON target values
      return (
        (goal.targetValue as any).value ||
        (goal.targetValue as any).target ||
        1.0
      );
    }
    return goal.targetValue;
  }

  private calculateVariance(current: any, target: any): number {
    if (typeof current === 'number' && typeof target === 'number') {
      return (current - target) / target;
    }
    return 0;
  }

  private inferGapType(
    goal: ProjectGoal
  ): import('../../../types/database/gap.types').GapType {
    const title = goal.title.toLowerCase();
    if (title.includes('resource') || title.includes('staff'))
      return 'resource' as any;
    if (title.includes('process') || title.includes('workflow'))
      return 'process' as any;
    if (title.includes('communication')) return 'communication' as any;
    if (title.includes('technology') || title.includes('tech'))
      return 'technology' as any;
    if (title.includes('timeline') || title.includes('schedule'))
      return 'timeline' as any;
    if (title.includes('quality')) return 'quality' as any;
    if (title.includes('budget') || title.includes('cost'))
      return 'budget' as any;
    if (title.includes('skill') || title.includes('training'))
      return 'skill' as any;
    return 'process' as any; // Default
  }

  private inferGapCategory(
    goal: ProjectGoal
  ): import('../../../types/database/gap.types').GapCategory {
    const type = this.inferGapType(goal);
    switch (type) {
      case 'resource':
      case 'timeline':
      case 'quality':
        return 'operational' as any;
      case 'technology':
        return 'technical' as any;
      case 'communication':
      case 'culture':
        return 'organizational' as any;
      default:
        return 'tactical' as any;
    }
  }

  private identifyRootCauses(
    goal: ProjectGoal,
    _variance: number
  ): import('../../../types/database/gap.types').RootCause[] {
    // Simplified root cause identification
    return [
      {
        id: `rc-${goal.id}-1`,
        gapId: '',
        category: 'process' as any,
        description: `Insufficient planning for ${goal.title}`,
        confidence: 0.7,
        evidence: ['Goal variance analysis'],
        contributionWeight: 0.8,
      },
    ];
  }

  private identifyAffectedAreas(
    goal: ProjectGoal
  ): import('../../../types/database/gap.types').ProjectArea[] {
    return [
      {
        id: `area-${goal.id}-1`,
        name: goal.title,
        description: `Area affected by ${goal.title} gap`,
        criticality: 'medium' as any,
      },
    ];
  }

  private estimateImpact(
    goal: ProjectGoal,
    variance: number
  ): import('../../../types/database/gap.types').Impact {
    return {
      id: `impact-${goal.id}-1`,
      gapId: '',
      type: 'timeline' as any,
      level:
        Math.abs(variance) > 0.3 ? ('high' as unknown) : ('medium' as unknown),
      description: `Impact on ${goal.title} achievement`,
      timeframe: 'short-term',
      affectedStakeholders: ['project-manager'],
    };
  }

  private generateRecommendationDescription(gap: Gap): string {
    switch (gap.type) {
      case 'resource':
        return `Allocate additional resources or optimize current resource utilization for ${gap.title}`;
      case 'timeline':
        return `Implement timeline recovery strategies and improve scheduling for ${gap.title}`;
      case 'quality':
        return `Enhance quality assurance processes and implement additional testing for ${gap.title}`;
      case 'communication':
        return `Improve communication channels and establish regular check-ins for ${gap.title}`;
      default:
        return `Implement corrective measures to address ${gap.title}`;
    }
  }

  private mapSeverityToPriority(
    severity: import('../../../types/database/gap.types').SeverityLevel
  ): 'low' | 'medium' | 'high' | 'urgent' {
    switch (severity) {
      case 'critical':
        return 'urgent';
      case 'high':
        return 'high';
      case 'medium':
        return 'medium';
      case 'low':
        return 'low';
      default:
        return 'medium';
    }
  }

  private estimateEffort(gap: Gap): number {
    const baseEffort = {
      critical: 40,
      high: 24,
      medium: 16,
      low: 8,
    };

    const complexityMultiplier = gap.rootCauses.length > 2 ? 1.5 : 1.0;
    return baseEffort[gap.severity] * complexityMultiplier;
  }

  private identifyRequiredResources(gap: Gap): string[] {
    const resources = ['Project Manager'];

    switch (gap.type) {
      case 'resource':
        resources.push('HR Manager', 'Additional Team Members');
        break;
      case 'technology':
        resources.push('Technical Lead', 'DevOps Engineer');
        break;
      case 'quality':
        resources.push('QA Lead', 'Testing Resources');
        break;
      case 'communication':
        resources.push('Communication Specialist', 'Stakeholder Manager');
        break;
      default:
        resources.push('Subject Matter Expert');
    }

    return resources;
  }

  private estimateTimeline(gap: Gap): string {
    switch (gap.severity) {
      case 'critical':
        return '1-2 weeks';
      case 'high':
        return '2-4 weeks';
      case 'medium':
        return '1-2 months';
      case 'low':
        return '2-3 months';
      default:
        return '1 month';
    }
  }
}
