import { Injectable, Logger } from '@nestjs/common';
import { SeverityLevel } from '../../../types/database/gap.types';
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
import { ProjectStateAnalyzerService } from './project-state-analyzer.service';
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

  constructor(
    private readonly severityCalculator: SeverityCalculatorService,
    private readonly projectStateAnalyzerService: ProjectStateAnalyzerService
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

    // Analyze each goal for gaps
    for (const goal of targets) {
      const gapData = this.projectStateAnalyzerService.analyzeGoalGap(
        current,
        goal
      );
      if (gapData) {
        gaps.push(this.convertGapDataToGap(gapData));
      }
    }

    // Analyze system-level gaps
    const systemGaps =
      this.projectStateAnalyzerService.analyzeSystemLevelGaps(current);
    for (const gapData of systemGaps) {
      gaps.push(this.convertGapDataToGap(gapData));
    }

    return gaps;
  }

  /**
   * Generates recommendations based on identified gaps
   */
  generateRecommendations(gaps: Gap[]): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // Group gaps by severity
    const criticalGaps = gaps.filter(
      g => g.severity === SeverityLevel.CRITICAL
    );
    const highGaps = gaps.filter(g => g.severity === SeverityLevel.HIGH);

    if (criticalGaps.length > 0) {
      recommendations.push({
        id: `rec-critical-${Date.now()}`,
        gapId: criticalGaps[0]?.id || 'unknown',
        title: 'Address Critical Gaps',
        description: `Immediately address ${criticalGaps.length} critical gaps to prevent project failure`,
        priority: 'urgent',
        estimatedEffort: 40,
        estimatedImpact: 0.9,
        requiredResources: ['senior developer', 'project manager'],
        timeline: '1-2 weeks',
        dependencies: [],
      });
    }

    if (highGaps.length > 0) {
      recommendations.push({
        id: `rec-high-${Date.now()}`,
        gapId: highGaps[0]?.id || 'unknown',
        title: 'Prioritize High-Severity Gaps',
        description: `Prioritize resolution of ${highGaps.length} high-severity gaps within 2 weeks`,
        priority: 'high',
        estimatedEffort: 24,
        estimatedImpact: 0.7,
        requiredResources: ['developer', 'analyst'],
        timeline: '2-4 weeks',
        dependencies: [],
      });
    }

    // Type-specific recommendations
    const resourceGaps = gaps.filter(g => g.type === 'RESOURCE');
    if (resourceGaps.length > 0) {
      recommendations.push({
        id: `rec-resource-${Date.now()}`,
        gapId: resourceGaps[0]?.id || 'unknown',
        title: 'Review Resource Allocation',
        description: `Review resource allocation - ${resourceGaps.length} resource gaps identified`,
        priority: 'medium',
        estimatedEffort: 16,
        estimatedImpact: 0.6,
        requiredResources: ['resource manager'],
        timeline: '1-2 weeks',
        dependencies: [],
      });
    }

    const processGaps = gaps.filter(g => g.type === 'PROCESS');
    if (processGaps.length > 0) {
      recommendations.push({
        id: `rec-process-${Date.now()}`,
        gapId: processGaps[0]?.id || 'unknown',
        title: 'Improve Process Documentation',
        description: `Improve process documentation and workflows - ${processGaps.length} process gaps found`,
        priority: 'medium',
        estimatedEffort: 20,
        estimatedImpact: 0.5,
        requiredResources: ['process analyst', 'documentation specialist'],
        timeline: '2-3 weeks',
        dependencies: [],
      });
    }

    return recommendations;
  }

  /**
   * Calculates overall health score based on gaps
   */
  calculateOverallHealthScore(gaps: Gap[]): number {
    if (gaps.length === 0) return 1.0;

    const severityWeights = {
      [SeverityLevel.CRITICAL]: 0.1,
      [SeverityLevel.HIGH]: 0.3,
      [SeverityLevel.MEDIUM]: 0.6,
      [SeverityLevel.LOW]: 0.9,
    };

    const totalWeight = gaps.reduce((sum, gap) => {
      return sum + (severityWeights[gap.severity] || 0.5);
    }, 0);

    return Math.max(0, Math.min(1, totalWeight / gaps.length));
  }

  /**
   * Calculates confidence in the analysis
   */
  calculateAnalysisConfidence(gaps: Gap[]): number {
    if (gaps.length === 0) return 1.0;

    const avgConfidence =
      gaps.reduce((sum, gap) => {
        return sum + (gap.confidence || 0.7);
      }, 0) / gaps.length;

    return Math.max(0, Math.min(1, avgConfidence));
  }

  /**
   * Converts GapData from analyzer service to Gap interface
   */
  private convertGapDataToGap(gapData: {
    id?: string;
    projectId: string;
    title: string;
    description: string;
    type: string;
    category: string;
    severity: SeverityLevel;
    currentValue?: number | string;
    targetValue?: unknown;
    impact?: string;
    confidence?: number;
  }): Gap {
    return {
      id: gapData.id || `gap-${Date.now()}`,
      projectId: gapData.projectId,
      title: gapData.title,
      description: gapData.description,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      type: gapData.type as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      category: gapData.category as any,
      severity: gapData.severity,
      currentValue: gapData.currentValue || 0,
      targetValue: (gapData.targetValue as string | number) || 0,
      variance: this.calculateVariance(
        gapData.currentValue,
        gapData.targetValue
      ),
      confidence: gapData.confidence || 0.7,
      rootCauses: [],
      affectedAreas: [],
      estimatedImpact: {
        id: `impact-${Date.now()}`,
        gapId: gapData.id || `gap-${Date.now()}`,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        type: 'timeline' as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        level: 'medium' as any,
        description: gapData.impact || 'Impact assessment pending',
        timeframe: '1-4 weeks',
        affectedStakeholders: ['project team'],
      },
    };
  }

  /**
   * Calculates variance between current and target values
   */
  private calculateVariance(
    current: number | string | undefined,
    target: unknown
  ): number {
    const currentNum =
      typeof current === 'number' ? current : parseFloat(String(current)) || 0;
    const targetNum =
      typeof target === 'number' ? target : parseFloat(String(target)) || 0;

    if (targetNum === 0) return currentNum === 0 ? 0 : 1;
    return Math.abs((currentNum - targetNum) / targetNum);
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
}
