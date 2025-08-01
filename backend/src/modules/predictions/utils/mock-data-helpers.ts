/**
 * Helper functions for mock data generation
 */
export class MockDataHelpers {
  static generatePredictionTitle(type: string): string {
    const titles = {
      risk_alert: [
        'High risk detected',
        'Risk threshold exceeded',
        'Critical risk identified',
      ],
      trend_alert: [
        'Trend change detected',
        'Significant trend shift',
        'Trend anomaly identified',
      ],
      early_warning: [
        'Early warning issued',
        'Potential issue detected',
        'Proactive alert generated',
      ],
      anomaly_alert: [
        'Anomaly detected',
        'Unusual pattern identified',
        'Deviation from normal',
      ],
    };
    const typeTitle = titles[type as keyof typeof titles] || [
      'Prediction generated',
    ];
    return (
      typeTitle[Math.floor(Math.random() * typeTitle.length)] ||
      'Prediction generated'
    );
  }

  static generatePredictionDescription(type: string): string {
    const descriptions = {
      risk_alert: 'Risk indicators suggest potential project disruption',
      trend_alert:
        'Metric trends indicate significant change in project trajectory',
      early_warning:
        'Early indicators suggest potential issues requiring attention',
      anomaly_alert:
        'Unusual patterns detected that may indicate underlying issues',
    };
    return (
      descriptions[type as keyof typeof descriptions] ||
      'Prediction generated based on project analysis'
    );
  }

  static generateActionsTaken(type: string, outcome: string): string[] {
    if (outcome === 'pending') return [];

    const actions = {
      risk_alert: [
        'Risk mitigation plan activated',
        'Stakeholder notification sent',
        'Resource reallocation',
      ],
      trend_alert: [
        'Trend monitoring increased',
        'Process adjustment implemented',
        'Team consultation',
      ],
      early_warning: [
        'Preventive measures implemented',
        'Monitoring frequency increased',
        'Team alert issued',
      ],
      anomaly_alert: [
        'Investigation initiated',
        'Data validation performed',
        'System check conducted',
      ],
    };

    const typeActions = actions[type as keyof typeof actions] || [
      'Standard response implemented',
    ];
    return typeActions.slice(0, 2); // Return 1-2 actions
  }

  static getIntervalMs(granularity: string): number {
    const intervals = {
      hourly: 60 * 60 * 1000,
      daily: 24 * 60 * 60 * 1000,
      weekly: 7 * 24 * 60 * 60 * 1000,
      monthly: 30 * 24 * 60 * 60 * 1000,
    };
    return intervals[granularity as keyof typeof intervals] || intervals.daily;
  }

  static getBaseValue(metric: string): number {
    const baseValues = {
      velocity: 8.5,
      resource_utilization: 0.75,
      quality_metrics: 0.85,
      timeline_progress: 0.6,
    };
    return baseValues[metric as keyof typeof baseValues] || 1.0;
  }

  static getMetricUnit(metric: string): string {
    const units = {
      velocity: 'story_points',
      resource_utilization: 'percentage',
      quality_metrics: 'percentage',
      timeline_progress: 'percentage',
    };
    return units[metric as keyof typeof units] || 'units';
  }

  static determineTrendDirection(changeRate: number): string {
    if (Math.abs(changeRate) < 0.05) return 'stable';
    if (changeRate > 0.15) return 'improving';
    if (changeRate < -0.15) return 'declining';
    return Math.abs(changeRate) > 0.1 ? 'volatile' : 'stable';
  }

  static formatDuration(timeRangeMs: number): string {
    const days = Math.floor(timeRangeMs / (24 * 60 * 60 * 1000));
    if (days < 7) return `${days} days`;
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks} weeks`;
    const months = Math.floor(days / 30);
    return `${months} months`;
  }

  static calculateVolatility(values: number[]): number {
    if (values.length < 2) return 0;

    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance =
      values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
      values.length;
    const stdDev = Math.sqrt(variance);

    return Math.round((stdDev / mean) * 100) / 100; // Coefficient of variation
  }
}
