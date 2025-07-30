import type {
  CategorizedGaps,
  Gap,
  GapAnalysisResult,
} from '../../../types/services/gap-analysis.types';
import type {
  CategorizedGapsDto,
  DetailedGapDto,
  GapAnalysisResultDto,
  GapCategoryMetricsDto,
} from '../dto/gap-analysis-result.dto';

export class ResultMapperHelper {
  /**
   * Maps service result to DTO format
   */
  static mapToResultDto(result: GapAnalysisResult): GapAnalysisResultDto {
    const mappedGaps = this.mapCategorizedGaps(result.identifiedGaps);

    return {
      projectId: result.projectId,
      analysisTimestamp: result.analysisTimestamp,
      identifiedGaps: mappedGaps,
      overallHealthScore: result.overallHealthScore,
      prioritizedRecommendations: result.prioritizedRecommendations,
      executionTimeMs: result.executionTimeMs,
      confidence: result.confidence,
    };
  }

  private static mapCategorizedGaps(gaps: CategorizedGaps): CategorizedGapsDto {
    return {
      resource: this.mapGapsToDetailedDto(gaps.resource),
      process: this.mapGapsToDetailedDto(gaps.process),
      communication: this.mapGapsToDetailedDto(gaps.communication),
      technology: this.mapGapsToDetailedDto(gaps.technology),
      culture: this.mapGapsToDetailedDto(gaps.culture),
      timeline: this.mapGapsToDetailedDto(gaps.timeline),
      quality: this.mapGapsToDetailedDto(gaps.quality),
      budget: this.mapGapsToDetailedDto(gaps.budget),
      skill: this.mapGapsToDetailedDto(gaps.skill),
      governance: this.mapGapsToDetailedDto(gaps.governance),
      categoryMetrics: this.generateCategoryMetrics(gaps),
      summary: this.generateSummary(gaps),
    };
  }

  private static mapGapsToDetailedDto(gaps: Gap[]): DetailedGapDto[] {
    return gaps.map(gap => ({
      id: gap.id || `gap-${Date.now()}`,
      projectId: gap.projectId,
      type: gap.type,
      category: gap.category,
      title: gap.title,
      description: gap.description,
      currentValue: gap.currentValue,
      targetValue: gap.targetValue,
      variance: gap.variance,
      severity: gap.severity,
      status: 'identified',
      rootCauses:
        gap.rootCauses?.map(rc => ({
          id: rc.id,
          category: rc.category,
          description: rc.description,
          confidence: rc.confidence,
          evidence: rc.evidence,
          contributionWeight: rc.contributionWeight,
        })) || [],
      affectedAreas:
        gap.affectedAreas?.map(area => ({
          id: area.id,
          name: area.name,
          description: area.description || '',
          criticality: area.criticality,
        })) || [],
      estimatedImpact: {
        id: gap.estimatedImpact.id,
        type: gap.estimatedImpact.type,
        level: gap.estimatedImpact.level,
        description: gap.estimatedImpact.description,
        timeframe: gap.estimatedImpact.timeframe,
        affectedStakeholders: gap.estimatedImpact.affectedStakeholders,
      },
      confidence: gap.confidence,
      priority: 'medium',
      tags: [],
      identifiedAt: new Date(),
      identifiedBy: 'system',
    }));
  }

  private static generateCategoryMetrics(
    gaps: CategorizedGaps
  ): Record<string, GapCategoryMetricsDto> {
    const metrics: Record<string, GapCategoryMetricsDto> = {};

    Object.keys(gaps).forEach(category => {
      const categoryGaps = gaps[category as keyof CategorizedGaps] || [];
      metrics[category] = {
        totalCount: categoryGaps.length,
        bySeverity: this.countBySeverity(categoryGaps),
        averageConfidence: this.calculateAverageConfidence(categoryGaps),
        primaryRootCause: 'process',
        trend: 'stable',
      };
    });

    return metrics;
  }

  private static generateSummary(gaps: CategorizedGaps): {
    totalGaps: number;
    criticalGaps: number;
    highPriorityGaps: number;
    averageConfidence: number;
    mostAffectedCategory: string;
    leastAffectedCategory: string;
  } {
    const allGaps = Object.values(gaps).flat();
    const criticalGaps = allGaps.filter(g => g.severity === 'critical');
    const highGaps = allGaps.filter(g => g.severity === 'high');

    return {
      totalGaps: allGaps.length,
      criticalGaps: criticalGaps.length,
      highPriorityGaps: highGaps.length,
      averageConfidence: this.calculateAverageConfidence(allGaps),
      mostAffectedCategory: this.findMostAffectedCategory(gaps),
      leastAffectedCategory: this.findLeastAffectedCategory(gaps),
    };
  }

  private static countBySeverity(gaps: Gap[]): Record<string, number> {
    return gaps.reduce(
      (acc, gap) => {
        acc[gap.severity] = (acc[gap.severity] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
  }

  private static calculateAverageConfidence(gaps: Gap[]): number {
    if (gaps.length === 0) return 0;
    return (
      gaps.reduce((sum, gap) => sum + (gap.confidence || 0), 0) / gaps.length
    );
  }

  private static findMostAffectedCategory(gaps: CategorizedGaps): string {
    const counts = Object.entries(gaps).map(([category, gapList]) => ({
      category,
      count: gapList.length,
    }));

    return counts.reduce((max, current) =>
      current.count > max.count ? current : max
    ).category;
  }

  private static findLeastAffectedCategory(gaps: CategorizedGaps): string {
    const counts = Object.entries(gaps).map(([category, gapList]) => ({
      category,
      count: gapList.length,
    }));

    return counts.reduce((min, current) =>
      current.count < min.count ? current : min
    ).category;
  }
}
