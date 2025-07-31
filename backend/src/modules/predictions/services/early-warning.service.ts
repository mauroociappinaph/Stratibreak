/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, Logger } from '@nestjs/common';
import { ImpactLevel, Priority } from '../../../types/database/gap.types';
import { Duration, TimeUnit } from '../../../types/database/prediction.types';
import {
  Alert,
  AlertSeverity,
  AlertType,
  ChangeType,
  HistoricalData,
  PreventiveAction,
  ProjectData,
  RiskIndicator,
  TrendData,
  TrendDirection,
} from '../../../types/services/prediction.types';

/**
 * Advanced early warning system service
 * Requirement 3.2: Generate proactive alerts with priority levels and probability
 * Requirement 3.3: Include estimated time to occurrence and impact potential
 * Requirement 3.5: Differentiate from reactive notifications with predictive context
 */
@Injectable()
export class EarlyWarningService {
  private readonly logger = new Logger(EarlyWarningService.name);

  // Warning thresholds and configuration
  private readonly WARNING_THRESHOLDS = {
    velocity: {
      critical: 0.3, // 30% below average
      high: 0.2, // 20% below average
      medium: 0.1, // 10% below average
    },
    change: {
      critical: 0.8, // 80% change magnitude
      high: 0.5, // 50% change magnitude
      medium: 0.3, // 30% change magnitude
    },
    trend: {
      critical: 0.9, // 90% trend strength
      high: 0.7, // 70% trend strength
      medium: 0.5, // 50% trend strength
    },
  };

  /**
   * Generate comprehensive early warnings based on multiple data sources
   */
  async generateComprehensiveWarnings(
    trendData: TrendData,
    historicalData?: HistoricalData,
    riskIndicators?: RiskIndicator[]
  ): Promise<Alert[]> {
    this.logger.log(
      `Generating comprehensive warnings for project ${trendData.projectId}`
    );

    const alerts: Alert[] = [];

    try {
      // Generate trend-based warnings
      const trendWarnings = this.generateTrendWarnings(trendData);
      alerts.push(...trendWarnings);

      // Generate velocity-based warnings
      const velocityWarnings = this.generateVelocityWarnings(trendData);
      alerts.push(...velocityWarnings);

      // Generate change-based warnings
      const changeWarnings = this.generateChangeWarnings(trendData);
      alerts.push(...changeWarnings);

      // Generate pattern-based warnings if historical data is available
      if (historicalData) {
        const patternWarnings = await this.generatePatternWarnings(
          trendData,
          historicalData
        );
        alerts.push(...patternWarnings);
      }

      // Generate risk-based warnings if risk indicators are available
      if (riskIndicators) {
        const riskWarnings = this.generateRiskWarnings(
          trendData,
          riskIndicators
        );
        alerts.push(...riskWarnings);
      }

      // Generate composite warnings for multiple correlated issues
      const compositeWarnings = this.generateCompositeWarnings(
        alerts,
        trendData
      );
      alerts.push(...compositeWarnings);

      // Prioritize and deduplicate alerts
      const prioritizedAlerts = this.prioritizeAndDeduplicateAlerts(alerts);

      this.logger.log(
        `Generated ${prioritizedAlerts.length} early warning alerts`
      );
      return prioritizedAlerts;
    } catch (error) {
      this.logger.error(
        `Error generating comprehensive warnings: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof Error ? error.stack : undefined
      );
      return [];
    }
  }

  /**
   * Generate predictive alerts with 72+ hour advance warning
   */
  async generatePredictiveAlerts(
    projectData: ProjectData,
    historicalData: HistoricalData
  ): Promise<Alert[]> {
    this.logger.log(
      `Generating predictive alerts for project ${projectData.projectId}`
    );

    const alerts: Alert[] = [];

    try {
      // Analyze historical patterns for predictive insights
      const patterns = this.analyzeHistoricalPatterns(historicalData);

      // Generate alerts based on pattern matching
      for (const pattern of patterns) {
        const alert = await this.generatePatternBasedAlert(
          pattern,
          projectData
        );
        if (alert) {
          alerts.push(alert);
        }
      }

      // Generate trend extrapolation alerts
      const trendAlerts = this.generateTrendExtrapolationAlerts(
        projectData,
        historicalData
      );
      alerts.push(...trendAlerts);

      // Generate seasonal/cyclical alerts
      const seasonalAlerts = this.generateSeasonalAlerts(
        projectData,
        historicalData
      );
      alerts.push(...seasonalAlerts);

      // Generate correlation-based alerts
      const correlationAlerts = this.generateCorrelationAlerts(
        projectData,
        historicalData
      );
      alerts.push(...correlationAlerts);

      this.logger.log(`Generated ${alerts.length} predictive alerts`);
      return alerts;
    } catch (error) {
      this.logger.error(
        `Error generating predictive alerts: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof Error ? error.stack : undefined
      );
      return [];
    }
  }

  /**
   * Generate alerts with prevention window and suggested actions
   */
  generatePreventiveAlerts(
    currentIssues: string[],
    trendData: TrendData,
    preventionWindow: Duration = { value: 72, unit: TimeUnit.HOURS }
  ): Alert[] {
    this.logger.log(
      `Generating preventive alerts for ${currentIssues.length} issues`
    );

    const alerts: Alert[] = [];

    for (const issue of currentIssues) {
      const alert = this.createPreventiveAlert(
        issue,
        trendData,
        preventionWindow
      );
      if (alert) {
        alerts.push(alert);
      }
    }

    return alerts;
  }

  /**
   * Generate escalation alerts for unaddressed warnings
   */
  generateEscalationAlerts(
    existingAlerts: Alert[],
    escalationThreshold: Duration = { value: 24, unit: TimeUnit.HOURS }
  ): Alert[] {
    this.logger.log(`Checking ${existingAlerts.length} alerts for escalation`);

    const escalationAlerts: Alert[] = [];
    const now = new Date();

    for (const alert of existingAlerts) {
      const alertAge = now.getTime() - alert.createdAt.getTime();
      const thresholdMs = this.durationToMilliseconds(escalationThreshold);

      if (alertAge > thresholdMs && alert.severity !== AlertSeverity.CRITICAL) {
        const escalatedAlert = this.createEscalationAlert(alert);
        escalationAlerts.push(escalatedAlert);
      }
    }

    this.logger.log(`Generated ${escalationAlerts.length} escalation alerts`);
    return escalationAlerts;
  }

  // Private helper methods

  private generateTrendWarnings(trendData: TrendData): Alert[] {
    const warnings: Alert[] = [];

    for (const metric of trendData.currentMetrics) {
      if (metric.trend === TrendDirection.DECLINING) {
        const severity = this.assessTrendSeverity(Math.abs(metric.changeRate));

        if (severity !== AlertSeverity.LOW) {
          warnings.push({
            id: `trend_warning_${Date.now()}_${metric.name}`,
            projectId: trendData.projectId,
            type: AlertType.TREND_ALERT,
            severity,
            title: `Declining trend detected in ${metric.name}`,
            description: `${metric.name} has been declining at ${(metric.changeRate * 100).toFixed(1)}% rate`,
            probability: Math.min(0.95, Math.abs(metric.changeRate) + 0.4),
            estimatedTimeToOccurrence: this.calculateTimeToImpact(
              metric.changeRate
            ),
            potentialImpact: this.assessTrendImpact(metric.changeRate),
            preventionWindow: { value: 48, unit: TimeUnit.HOURS },
            suggestedActions: this.generateTrendActions(metric),
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000),
          });
        }
      }
    }

    return warnings;
  }

  private generateVelocityWarnings(trendData: TrendData): Alert[] {
    const warnings: Alert[] = [];

    for (const velocity of trendData.velocityIndicators) {
      const velocityRatio = velocity.currentVelocity / velocity.averageVelocity;

      if (velocityRatio < 1 - this.WARNING_THRESHOLDS.velocity.medium) {
        const severity = this.assessVelocitySeverity(velocityRatio);

        warnings.push({
          id: `velocity_warning_${Date.now()}_${velocity.name}`,
          projectId: trendData.projectId,
          type: AlertType.EARLY_WARNING,
          severity,
          title: `${velocity.name} velocity below threshold`,
          description: `${velocity.name} is at ${(velocityRatio * 100).toFixed(1)}% of average velocity`,
          probability: 0.8 + (1 - velocityRatio) * 0.15,
          estimatedTimeToOccurrence:
            this.calculateVelocityImpactTime(velocityRatio),
          potentialImpact: this.assessVelocityImpact(velocityRatio),
          preventionWindow: { value: 36, unit: TimeUnit.HOURS },
          suggestedActions: this.generateVelocityActions(velocity),
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
        });
      }
    }

    return warnings;
  }

  private generateChangeWarnings(trendData: TrendData): Alert[] {
    const warnings: Alert[] = [];

    for (const change of trendData.recentChanges) {
      if (
        change.changeType === ChangeType.SUDDEN &&
        change.magnitude > this.WARNING_THRESHOLDS.change.medium
      ) {
        const severity = this.assessChangeSeverity(change.magnitude);

        warnings.push({
          id: `change_warning_${Date.now()}_${change.metric}`,
          projectId: trendData.projectId,
          type: AlertType.ANOMALY_ALERT,
          severity,
          title: `Sudden change in ${change.metric}`,
          description: `Detected ${change.changeType} change with ${(change.magnitude * 100).toFixed(1)}% magnitude`,
          probability: change.significance,
          estimatedTimeToOccurrence: { value: 12, unit: TimeUnit.HOURS },
          potentialImpact: this.assessChangeMagnitudeImpact(change.magnitude),
          preventionWindow: { value: 6, unit: TimeUnit.HOURS },
          suggestedActions: this.generateChangeActions(change),
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        });
      }
    }

    return warnings;
  }

  private async generatePatternWarnings(
    trendData: TrendData,
    historicalData: HistoricalData
  ): Promise<Alert[]> {
    const warnings: Alert[] = [];

    // Analyze patterns for each metric
    for (const metric of trendData.currentMetrics) {
      const historicalMetric = historicalData.metrics.find(
        m => m.name === metric.name
      );
      if (!historicalMetric) continue;

      const patterns = this.detectPatterns(historicalMetric.values);

      for (const pattern of patterns) {
        if (pattern.confidence > 0.7) {
          const warning = await this.createPatternWarning(
            pattern,
            metric,
            trendData.projectId
          );
          if (warning) {
            warnings.push(warning);
          }
        }
      }
    }

    return warnings;
  }

  private generateRiskWarnings(
    trendData: TrendData,
    riskIndicators: RiskIndicator[]
  ): Alert[] {
    const warnings: Alert[] = [];

    for (const indicator of riskIndicators) {
      const riskLevel = this.calculateIndicatorRisk(indicator);

      if (riskLevel > 0.6) {
        const severity =
          riskLevel > 0.8
            ? AlertSeverity.CRITICAL
            : riskLevel > 0.7
              ? AlertSeverity.HIGH
              : AlertSeverity.MEDIUM;

        warnings.push({
          id: `risk_warning_${Date.now()}_${indicator.indicator}`,
          projectId: trendData.projectId,
          type: AlertType.RISK_ALERT,
          severity,
          title: `High risk detected in ${indicator.indicator}`,
          description: `Risk level: ${(riskLevel * 100).toFixed(1)}% for ${indicator.indicator}`,
          probability: riskLevel,
          estimatedTimeToOccurrence: this.calculateRiskImpactTime(riskLevel),
          potentialImpact: this.assessRiskImpact(riskLevel),
          preventionWindow: { value: 24, unit: TimeUnit.HOURS },
          suggestedActions: this.generateRiskActions(indicator),
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
        });
      }
    }

    return warnings;
  }

  private generateCompositeWarnings(
    alerts: Alert[],
    trendData: TrendData
  ): Alert[] {
    const compositeWarnings: Alert[] = [];

    // Group alerts by type and severity
    const criticalAlerts = alerts.filter(
      a => a.severity === AlertSeverity.CRITICAL
    );
    const highAlerts = alerts.filter(a => a.severity === AlertSeverity.HIGH);

    // Generate composite warning if multiple critical issues
    if (criticalAlerts.length >= 2) {
      compositeWarnings.push({
        id: `composite_critical_${Date.now()}`,
        projectId: trendData.projectId,
        type: AlertType.RISK_ALERT,
        severity: AlertSeverity.CRITICAL,
        title: 'Multiple critical issues detected',
        description: `${criticalAlerts.length} critical issues detected simultaneously`,
        probability: 0.95,
        estimatedTimeToOccurrence: { value: 6, unit: TimeUnit.HOURS },
        potentialImpact: ImpactLevel.SEVERE,
        preventionWindow: { value: 3, unit: TimeUnit.HOURS },
        suggestedActions: [
          {
            id: `composite_action_${Date.now()}`,
            title: 'Emergency response required',
            description:
              'Multiple critical issues require immediate coordinated response',
            priority: Priority.URGENT,
            estimatedEffort: '2-4 hours',
            requiredResources: ['Emergency Response Team', 'Senior Management'],
            expectedImpact: 'Prevent project failure',
          },
        ],
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000),
      });
    }

    // Generate composite warning if multiple high-severity issues
    if (highAlerts.length >= 3) {
      compositeWarnings.push({
        id: `composite_high_${Date.now()}`,
        projectId: trendData.projectId,
        type: AlertType.EARLY_WARNING,
        severity: AlertSeverity.HIGH,
        title: 'Multiple high-priority issues detected',
        description: `${highAlerts.length} high-priority issues may compound`,
        probability: 0.85,
        estimatedTimeToOccurrence: { value: 24, unit: TimeUnit.HOURS },
        potentialImpact: ImpactLevel.HIGH,
        preventionWindow: { value: 12, unit: TimeUnit.HOURS },
        suggestedActions: [
          {
            id: `composite_high_action_${Date.now()}`,
            title: 'Coordinate response to multiple issues',
            description:
              'Address multiple high-priority issues with coordinated approach',
            priority: Priority.HIGH,
            estimatedEffort: '4-8 hours',
            requiredResources: ['Project Manager', 'Team Leads'],
            expectedImpact: 'Prevent issue escalation',
          },
        ],
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 36 * 60 * 60 * 1000),
      });
    }

    return compositeWarnings;
  }

  private prioritizeAndDeduplicateAlerts(alerts: Alert[]): Alert[] {
    // Remove duplicate alerts based on similar content
    const uniqueAlerts = this.deduplicateAlerts(alerts);

    // Sort by severity and probability
    return uniqueAlerts.sort((a, b) => {
      const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      const severityDiff =
        severityOrder[b.severity] - severityOrder[a.severity];
      if (severityDiff !== 0) return severityDiff;
      return b.probability - a.probability;
    });
  }

  private deduplicateAlerts(alerts: Alert[]): Alert[] {
    const uniqueAlerts: Alert[] = [];
    const seenAlerts = new Set<string>();

    for (const alert of alerts) {
      const alertKey = `${alert.type}_${alert.title}_${alert.severity}`;
      if (!seenAlerts.has(alertKey)) {
        seenAlerts.add(alertKey);
        uniqueAlerts.push(alert);
      }
    }

    return uniqueAlerts;
  }

  // Additional helper methods for assessment and calculation

  private assessTrendSeverity(changeRate: number): AlertSeverity {
    if (changeRate > this.WARNING_THRESHOLDS.trend.critical)
      return AlertSeverity.CRITICAL;
    if (changeRate > this.WARNING_THRESHOLDS.trend.high)
      return AlertSeverity.HIGH;
    if (changeRate > this.WARNING_THRESHOLDS.trend.medium)
      return AlertSeverity.MEDIUM;
    return AlertSeverity.LOW;
  }

  private assessVelocitySeverity(velocityRatio: number): AlertSeverity {
    if (velocityRatio < 1 - this.WARNING_THRESHOLDS.velocity.critical)
      return AlertSeverity.CRITICAL;
    if (velocityRatio < 1 - this.WARNING_THRESHOLDS.velocity.high)
      return AlertSeverity.HIGH;
    return AlertSeverity.MEDIUM;
  }

  private assessChangeSeverity(magnitude: number): AlertSeverity {
    if (magnitude > this.WARNING_THRESHOLDS.change.critical)
      return AlertSeverity.CRITICAL;
    if (magnitude > this.WARNING_THRESHOLDS.change.high)
      return AlertSeverity.HIGH;
    return AlertSeverity.MEDIUM;
  }

  private calculateTimeToImpact(changeRate: number): Duration {
    // Estimate time until significant impact based on change rate
    const daysToImpact = Math.max(1, Math.floor(1 / Math.abs(changeRate)));
    return { value: Math.min(7, daysToImpact), unit: TimeUnit.DAYS };
  }

  private calculateVelocityImpactTime(velocityRatio: number): Duration {
    // Estimate time until velocity impact becomes critical
    const hoursToImpact = Math.max(12, Math.floor(72 * velocityRatio));
    return { value: hoursToImpact, unit: TimeUnit.HOURS };
  }

  private calculateRiskImpactTime(riskLevel: number): Duration {
    // Estimate time until risk materializes
    const hoursToImpact = Math.max(6, Math.floor(48 * (1 - riskLevel)));
    return { value: hoursToImpact, unit: TimeUnit.HOURS };
  }

  private assessTrendImpact(changeRate: number): ImpactLevel {
    const absRate = Math.abs(changeRate);
    if (absRate > 0.8) return ImpactLevel.SEVERE;
    if (absRate > 0.5) return ImpactLevel.HIGH;
    if (absRate > 0.2) return ImpactLevel.MEDIUM;
    return ImpactLevel.LOW;
  }

  private assessVelocityImpact(velocityRatio: number): ImpactLevel {
    if (velocityRatio < 0.5) return ImpactLevel.SEVERE;
    if (velocityRatio < 0.7) return ImpactLevel.HIGH;
    if (velocityRatio < 0.9) return ImpactLevel.MEDIUM;
    return ImpactLevel.LOW;
  }

  private assessChangeMagnitudeImpact(magnitude: number): ImpactLevel {
    if (magnitude > 0.9) return ImpactLevel.SEVERE;
    if (magnitude > 0.7) return ImpactLevel.HIGH;
    if (magnitude > 0.4) return ImpactLevel.MEDIUM;
    return ImpactLevel.LOW;
  }

  private assessRiskImpact(riskLevel: number): ImpactLevel {
    if (riskLevel > 0.9) return ImpactLevel.SEVERE;
    if (riskLevel > 0.7) return ImpactLevel.HIGH;
    if (riskLevel > 0.5) return ImpactLevel.MEDIUM;
    return ImpactLevel.LOW;
  }

  private generateTrendActions(metric: any): PreventiveAction[] {
    return [
      {
        id: `trend_action_${Date.now()}`,
        title: `Address declining trend in ${metric.name}`,
        description: `Investigate and address the root cause of declining ${metric.name}`,
        priority: Priority.HIGH,
        estimatedEffort: '4-6 hours',
        requiredResources: ['Team Lead', 'Data Analyst'],
        expectedImpact: 'Reverse negative trend',
      },
    ];
  }

  private generateVelocityActions(velocity: any): PreventiveAction[] {
    return [
      {
        id: `velocity_action_${Date.now()}`,
        title: `Improve ${velocity.name} velocity`,
        description: `Identify and remove blockers affecting ${velocity.name} velocity`,
        priority: Priority.HIGH,
        estimatedEffort: '2-4 hours',
        requiredResources: ['Scrum Master', 'Team Lead'],
        expectedImpact: 'Restore normal velocity',
      },
    ];
  }

  private generateChangeActions(change: any): PreventiveAction[] {
    return [
      {
        id: `change_action_${Date.now()}`,
        title: `Investigate sudden change in ${change.metric}`,
        description: `Immediate investigation of sudden change in ${change.metric}`,
        priority: Priority.URGENT,
        estimatedEffort: '1-2 hours',
        requiredResources: ['Technical Lead', 'System Administrator'],
        expectedImpact: 'Identify and mitigate anomaly',
      },
    ];
  }

  private generateRiskActions(indicator: RiskIndicator): PreventiveAction[] {
    return [
      {
        id: `risk_action_${Date.now()}`,
        title: `Mitigate risk in ${indicator.indicator}`,
        description: `Take preventive action to reduce risk in ${indicator.indicator}`,
        priority: Priority.HIGH,
        estimatedEffort: '3-6 hours',
        requiredResources: ['Risk Manager', 'Subject Matter Expert'],
        expectedImpact: 'Reduce risk probability',
      },
    ];
  }

  private calculateIndicatorRisk(indicator: RiskIndicator): number {
    const deviation =
      Math.abs(indicator.currentValue - indicator.threshold) /
      Math.abs(indicator.threshold);
    const trendMultiplier =
      indicator.trend === TrendDirection.DECLINING ? 1.2 : 1.0;
    return Math.min(1.0, deviation * trendMultiplier * indicator.weight);
  }

  private durationToMilliseconds(duration: Duration): number {
    const multipliers = {
      [TimeUnit.MINUTES]: 60 * 1000,
      [TimeUnit.HOURS]: 60 * 60 * 1000,
      [TimeUnit.DAYS]: 24 * 60 * 60 * 1000,
      [TimeUnit.WEEKS]: 7 * 24 * 60 * 60 * 1000,
      [TimeUnit.MONTHS]: 30 * 24 * 60 * 60 * 1000,
    };
    return duration.value * multipliers[duration.unit];
  }

  // Placeholder methods for advanced pattern analysis
  private analyzeHistoricalPatterns(_historicalData: HistoricalData): any[] {
    // Placeholder for pattern analysis implementation
    return [];
  }

  private async generatePatternBasedAlert(
    _pattern: any,
    _projectData: ProjectData
  ): Promise<Alert | null> {
    // Placeholder for pattern-based alert generation
    return null;
  }

  private generateTrendExtrapolationAlerts(
    _projectData: ProjectData,
    _historicalData: HistoricalData
  ): Alert[] {
    // Placeholder for trend extrapolation alerts
    return [];
  }

  private generateSeasonalAlerts(
    _projectData: ProjectData,
    _historicalData: HistoricalData
  ): Alert[] {
    // Placeholder for seasonal alerts
    return [];
  }

  private generateCorrelationAlerts(
    _projectData: ProjectData,
    _historicalData: HistoricalData
  ): Alert[] {
    // Placeholder for correlation-based alerts
    return [];
  }

  private createPreventiveAlert(
    _issue: string,
    _trendData: TrendData,
    _preventionWindow: Duration
  ): Alert | null {
    // Placeholder for preventive alert creation
    return null;
  }

  private createEscalationAlert(originalAlert: Alert): Alert {
    return {
      ...originalAlert,
      id: `escalated_${originalAlert.id}`,
      severity: AlertSeverity.CRITICAL,
      title: `ESCALATED: ${originalAlert.title}`,
      description: `Escalated alert: ${originalAlert.description}`,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000),
    };
  }

  private detectPatterns(_values: any[]): any[] {
    // Placeholder for pattern detection
    return [];
  }

  private async createPatternWarning(
    _pattern: any,
    _metric: any,
    _projectId: string
  ): Promise<Alert | null> {
    // Placeholder for pattern warning creation
    return null;
  }
}
