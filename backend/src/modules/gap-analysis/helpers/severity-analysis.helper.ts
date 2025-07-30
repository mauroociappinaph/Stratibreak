import { SeverityLevel } from '../../../types/database/gap.types';
import type { Gap } from '../../../types/services/gap-analysis.types';
import type { DetailedGapDto } from '../dto/detailed-gap.dto';
import type {
  SeverityAnalysisDto,
  SeverityDistributionDto,
  SeverityMetricsDto,
  SeverityRecommendationDto,
  SeverityTrendDto,
} from '../dto/severity-analysis.dto';

export class SeverityAnalysisHelper {
  static mapToSeverityAnalysisDto(
    projectId: string,
    analysisTimestamp: Date,
    allGaps: Gap[],
    confidence: number
  ): SeverityAnalysisDto {
    const start = Date.now();
    const distribution = this.calcDistribution(allGaps);
    return {
      projectId,
      analysisTimestamp,
      severityDistribution: distribution,
      severityMetrics: this.calcMetrics(allGaps),
      gapsBySeverity: this.groupBySeverity(allGaps),
      severityTrends: this.calcTrends(distribution),
      recommendations: this.getRecommendations(distribution),
      overallSeverityAssessment: this.assessOverall(distribution),
      analysisConfidence: confidence,
      executionTimeMs: Date.now() - start,
    };
  }

  private static calcDistribution(gaps: Gap[]): SeverityDistributionDto {
    return gaps.reduce(
      (acc, { severity }) => {
        const key = severity.toLowerCase() as keyof SeverityDistributionDto;
        if (key in acc && key !== 'total') {
          acc[key as keyof Omit<SeverityDistributionDto, 'total'>]++;
        }
        return acc;
      },
      { critical: 0, high: 0, medium: 0, low: 0, total: gaps.length }
    );
  }

  private static calcMetrics(gaps: Gap[]): SeverityMetricsDto {
    if (!gaps.length)
      return {
        averageSeverityScore: 0,
        weightedSeverityScore: 0,
        severityVolatility: 0,
        escalationProbability: 0,
        dominantSeverity: SeverityLevel.LOW,
        calculationConfidence: 1,
      };

    const scores = gaps.map(g => this.score(g.severity));
    const avg = scores.reduce((a, b) => a + b) / scores.length;
    const weighted =
      gaps.reduce((sum, g, i) => {
        const score = scores[i];
        return score !== undefined ? sum + score * this.weight(g.type) : sum;
      }, 0) / gaps.length;
    const variance =
      scores.reduce((s, v) => s + (v - avg) ** 2, 0) / scores.length;
    const high = gaps.filter(
      g =>
        g.severity === SeverityLevel.HIGH ||
        g.severity === SeverityLevel.CRITICAL
    ).length;

    const counts = gaps.reduce(
      (acc, { severity }) => {
        acc[severity] = (acc[severity] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const dominant = Object.entries(counts).reduce(
      (max, [sev, count]) => (count > max.count ? { sev, count } : max),
      { sev: 'low', count: 0 }
    ).sev as SeverityLevel;

    return {
      averageSeverityScore: avg / 4,
      weightedSeverityScore: weighted / 4,
      severityVolatility: Math.sqrt(variance) / 4,
      escalationProbability: high / gaps.length,
      dominantSeverity: dominant,
      calculationConfidence: this.avgConfidence(gaps),
    };
  }

  private static groupBySeverity(
    gaps: Gap[]
  ): Record<string, DetailedGapDto[]> {
    return gaps.reduce(
      (acc, g) => {
        const key = g.severity.toLowerCase();
        acc[key] = acc[key] || [];
        acc[key].push(this.toDetailedDto(g));
        return acc;
      },
      { critical: [], high: [], medium: [], low: [] } as Record<
        string,
        DetailedGapDto[]
      >
    );
  }

  private static calcTrends(d: SeverityDistributionDto): SeverityTrendDto[] {
    const calc = (
      s: SeverityLevel,
      c: number,
      prev: number
    ): SeverityTrendDto => ({
      severity: s,
      currentCount: c,
      previousCount: prev,
      changePercentage: c > 0 ? ((c - prev) / Math.max(1, prev)) * 100 : 0,
      trend: (c > prev ? 'increasing' : c < prev ? 'decreasing' : 'stable') as
        | 'increasing'
        | 'decreasing'
        | 'stable',
    });

    return [
      calc(SeverityLevel.CRITICAL, d.critical, Math.max(0, d.critical - 1)),
      calc(SeverityLevel.HIGH, d.high, Math.max(0, d.high - 1)),
      calc(SeverityLevel.MEDIUM, d.medium, d.medium + 1),
      calc(SeverityLevel.LOW, d.low, d.low),
    ];
  }

  private static getRecommendations(
    d: SeverityDistributionDto
  ): SeverityRecommendationDto[] {
    const r: SeverityRecommendationDto[] = [];
    if (d.critical > 0)
      r.push({
        id: 'sev_rec_critical',
        targetSeverity: SeverityLevel.CRITICAL,
        action: `Immediately address ${d.critical} critical gap${d.critical > 1 ? 's' : ''}`,
        priority: 'urgent',
        expectedImpact: `Reduce critical gaps by 80%`,
        estimatedEffort: 'high',
        timeline: '1-2 weeks',
      });
    if (d.high > 2)
      r.push({
        id: 'sev_rec_high',
        targetSeverity: SeverityLevel.HIGH,
        action: `Prioritize ${d.high} high-severity gaps`,
        priority: 'high',
        expectedImpact: `Prevent escalation`,
        estimatedEffort: 'medium',
        timeline: '2-4 weeks',
      });
    if (d.medium > 5)
      r.push({
        id: 'sev_rec_medium',
        targetSeverity: SeverityLevel.MEDIUM,
        action: `Address ${d.medium} medium-severity gaps`,
        priority: 'medium',
        expectedImpact: `Prevent accumulation`,
        estimatedEffort: 'medium',
        timeline: '4-8 weeks',
      });
    return r;
  }

  private static assessOverall(
    d: SeverityDistributionDto
  ): 'low' | 'moderate' | 'high' | 'critical' {
    if (d.critical > 0) return 'critical';
    if (d.high > 2) return 'high';
    if (d.medium > 3 || d.high > 0) return 'moderate';
    return 'low';
  }

  private static score(s: SeverityLevel): number {
    return (
      {
        [SeverityLevel.CRITICAL]: 4,
        [SeverityLevel.HIGH]: 3,
        [SeverityLevel.MEDIUM]: 2,
        [SeverityLevel.LOW]: 1,
      }[s] ?? 2
    );
  }

  private static weight(type: string): number {
    return (
      {
        RESOURCE: 0.9,
        PROCESS: 0.8,
        COMMUNICATION: 0.7,
        TECHNOLOGY: 0.8,
        CULTURE: 0.6,
        TIMELINE: 0.9,
        QUALITY: 0.8,
        BUDGET: 0.9,
        SKILL: 0.7,
      }[type] ?? 0.5
    );
  }

  private static avgConfidence(gaps: Gap[]): number {
    return gaps.length === 0
      ? 0
      : gaps.reduce((s, g) => s + (g.confidence || 0), 0) / gaps.length;
  }

  private static toDetailedDto(gap: Gap): DetailedGapDto {
    return {
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
        gap.rootCauses?.map(r => ({
          id: r.id,
          category: r.category,
          description: r.description,
          confidence: r.confidence,
          evidence: r.evidence,
          contributionWeight: r.contributionWeight,
        })) || [],
      affectedAreas:
        gap.affectedAreas?.map(a => ({
          id: a.id,
          name: a.name,
          description: a.description || '',
          criticality: a.criticality,
        })) || [],
      estimatedImpact: gap.estimatedImpact,
      confidence: gap.confidence,
      priority: 'medium',
      tags: [],
      identifiedAt: new Date(),
      identifiedBy: 'system',
    };
  }
}
