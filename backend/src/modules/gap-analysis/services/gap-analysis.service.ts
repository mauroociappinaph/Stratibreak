import { Injectable, Logger } from '@nestjs/common';
import {
  CriticalityLevel,
  GapCategory,
  GapType,
  ImpactLevel,
  ImpactType,
  RootCauseCategory,
  SeverityLevel,
} from '../../../types/database/gap.types';
import type {
  ProjectGoal,
  ProjectState,
} from '../../../types/database/project.types';
import type {
  AnalysisConfig,
  CategorizedGaps,
  Gap,
  GapAnalysisEngine,
  GapAnalysisResult,
  ProjectData,
  Recommendation,
} from '../../../types/services/gap-analysis.types';
import { GapAnalysisHelper } from '../helpers/gap-analysis.helper';
import { SeverityCalculatorService } from './severity-calculator.service';

@Injectable()
export class GapAnalysisService implements GapAnalysisEngine {
  private readonly logger = new Logger(GapAnalysisService.name);

  // Default analysis configuration
  private readonly defaultConfig: AnalysisConfig = {
    enablePredictiveAnalysis: true,
    confidenceThreshold: 0.7,
    severityWeights: {
      RESOURCE: 0.9,
      PROCESS: 0.8,
      COMMUNICATION: 0.7,
      TECHNOLOGY: 0.8,
      CULTURE: 0.6,
      TIMELINE: 0.9,
      QUALITY: 0.8,
      BUDGET: 0.9,
      SKILL: 0.7,
    },
    includeHistoricalTrends: true,
    maxGapsPerCategory: 10,
  };

  constructor(private readonly severityCalculator: SeverityCalculatorService) {}

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
   * Analyzes a specific goal against current state to identify gaps
   */
  private analyzeGoalGap(current: ProjectState, goal: ProjectGoal): Gap | null {
    const currentValue = GapAnalysisHelper.extractCurrentValueForGoal(
      current,
      goal
    );
    const targetValue = GapAnalysisHelper.extractTargetValue(goal);
    const variance = GapAnalysisHelper.calculateVariance(
      currentValue,
      targetValue
    );

    // Only create gap if variance is significant
    if (Math.abs(variance) < 0.1) {
      return null;
    }

    return {
      id: `gap-${goal.id}`,
      projectId: goal.projectId,
      type: GapAnalysisHelper.inferGapType(goal),
      category: GapAnalysisHelper.inferGapCategory(goal),
      title: `Gap in ${goal.title}`,
      description: `Current: ${currentValue}, Target: ${targetValue}, Variance: ${variance.toFixed(2)}`,
      currentValue,
      targetValue,
      variance,
      severity: SeverityLevel.MEDIUM, // Will be calculated later
      rootCauses: GapAnalysisHelper.identifyRootCauses(goal),
      affectedAreas: GapAnalysisHelper.identifyAffectedAreas(goal),
      estimatedImpact: GapAnalysisHelper.estimateImpact(goal, variance),
      confidence: 0.8,
    };
  }

  /**
   * Analyzes system-level gaps not tied to specific goals
   */
  private analyzeSystemLevelGaps(current: ProjectState): Gap[] {
    const gaps: Gap[] = [];

    // Resource utilization gap
    if (current.resources?.utilization && current.resources.utilization > 0.9) {
      gaps.push({
        id: `gap-resource-util-${Date.now()}`,
        projectId: current.projectId,
        type: GapType.RESOURCE,
        category: GapCategory.OPERATIONAL,
        title: 'Resource Over-utilization',
        description: `Resources are over-utilized at ${(current.resources.utilization * 100).toFixed(1)}% affecting team sustainability`,
        currentValue: current.resources.utilization,
        targetValue: 0.8,
        variance: current.resources.utilization - 0.8,
        severity: SeverityLevel.HIGH,
        rootCauses: [
          {
            id: `rc-${Date.now()}`,
            gapId: '',
            category: RootCauseCategory.MANAGEMENT,
            description: 'Insufficient resource planning and allocation',
            confidence: 0.8,
            evidence: ['Resource utilization metrics', 'Team workload data'],
            contributionWeight: 0.9,
          },
        ],
        affectedAreas: [
          {
            id: `area-${Date.now()}`,
            name: 'Team Productivity',
            description: 'Team performance and sustainability',
            criticality: CriticalityLevel.HIGH,
          },
        ],
        estimatedImpact: {
          id: `impact-${Date.now()}`,
          gapId: '',
          type: ImpactType.TEAM_MORALE,
          level: ImpactLevel.HIGH,
          description: 'Team burnout risk and decreased productivity',
          timeframe: 'short-term',
          affectedStakeholders: ['team-members', 'project-manager'],
        },
        confidence: 0.85,
      });
    }

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
      const typeKey = gap.type.toLowerCase() as keyof CategorizedGaps;
      if (categorized[typeKey]) {
        categorized[typeKey].push(gap);
      }
    }

    // Sort each category by severity (critical first)
    Object.keys(categorized).forEach(category => {
      const severityOrderArray: SeverityLevel[] = [
        SeverityLevel.LOW,
        SeverityLevel.MEDIUM,
        SeverityLevel.HIGH,
        SeverityLevel.CRITICAL,
      ];
      categorized[category as keyof CategorizedGaps].sort((a, b) => {
        return (
          severityOrderArray.indexOf(b.severity) -
          severityOrderArray.indexOf(a.severity)
        );
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
   * Perform comprehensive analysis on a project
   * Returns analysis result without persisting to database
   */
  async performAnalysis(projectData: ProjectData): Promise<GapAnalysisResult> {
    try {
      // Perform analysis
      const analysisResult = await this.analyzeProject(projectData);

      return analysisResult;
    } catch (error) {
      this.logger.error(
        `Failed to perform analysis for project ${projectData.project.id}:`,
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

  private generateRecommendations(gaps: Gap[]): Recommendation[] {
    return gaps.map((gap, index) => ({
      id: `rec-${index + 1}`,
      gapId: gap.id || `gap-${index + 1}`,
      title: `Address ${gap.title}`,
      description: GapAnalysisHelper.generateRecommendationDescription(gap),
      priority: GapAnalysisHelper.mapSeverityToPriority(gap.severity),
      estimatedEffort: GapAnalysisHelper.estimateEffort(gap),
      estimatedImpact: gap.confidence,
      requiredResources: GapAnalysisHelper.identifyRequiredResources(gap),
      timeline: GapAnalysisHelper.estimateTimeline(gap),
      dependencies: [],
    }));
  }

  private calculateOverallHealthScore(gaps: Gap[]): number {
    if (gaps.length === 0) return 100;

    const severityWeights = { CRITICAL: 0.4, HIGH: 0.3, MEDIUM: 0.2, LOW: 0.1 };
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
}
