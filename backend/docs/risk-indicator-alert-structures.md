# Risk Indicator and Alert Structures Implementation

## Overview

This document describes the implementation of risk indicator and alert structures for task 6.2.c, meeting requirements 3.1, 3.2, and 3.4 from the AI Project Gap Analysis Tool specification.

## Requirements Compliance

### Requirement 3.1: Predictive Analysis (72+ hours anticipation)

- **Implementation**: `PredictiveTimeValidation` class enforces minimum 72-hour prediction horizon
- **Structure**: `estimatedTimeToOccurrence` field with validation for minimum 72 hours
- **Historical Data**: `HistoricalDataPointDto` supports trend analysis using historical patterns

### Requirement 3.2: Proactive Alerts with Priority Levels

- **Priority Levels**: Implemented `AlertSeverity` enum with required levels (low, medium, high, critical)
- **Probability**: `probability` field (0-1) for occurrence probability
- **Confidence**: `confidence` field (0-1) for prediction confidence
- **Proactive Context**: `predictiveContext` field differentiates from reactive notifications

### Requirement 3.4: Alert Prioritization

- **Priority Scoring**: `AlertPriorityScoreDto` with comprehensive scoring system
- **Impact Factor**: `impactScore` (0-1) for potential impact assessment
- **Probability Factor**: `probabilityScore` (0-1) for occurrence likelihood
- **Prevention Capacity**: `preventionCapacityScore` (0-1) for intervention capability
- **Overall Score**: Combined priority score (0-100) with reasoning explanation

## Core Structures

### 1. Risk Indicator DTOs

#### `RiskIndicatorDto`

- **Purpose**: Core risk indicator with threshold monitoring
- **Key Fields**:
  - `currentValue` and `threshold` for breach detection
  - `weight` (0-1) for prioritization importance
  - `trend` for direction analysis
  - `confidence` for measurement reliability

#### `RiskIndicatorWithHistoryDto`

- **Purpose**: Extended indicator with historical data for trend analysis
- **Key Fields**:
  - Inherits all `RiskIndicatorDto` fields
  - `historicalData` array for pattern recognition
  - `predictedTrend` for future direction confidence

### 2. Alert DTOs

#### `AlertDto` (Comprehensive)

- **Purpose**: Complete alert structure meeting all requirements
- **Key Fields**:
  - `type` and `severity` for categorization
  - `probability` and `confidence` for prediction quality
  - `estimatedTimeToOccurrence` for timing (min 72 hours)
  - `preventionWindow` for intervention opportunity
  - `suggestedActions` for preventive measures
  - `context` for rich contextual information

#### `AlertContextDto`

- **Purpose**: Rich context for alert understanding
- **Key Fields**:
  - `triggeringIndicators` - risk indicators that caused the alert
  - `historicalPatterns` - references to similar past events
  - `relatedAlerts` - connections to other active alerts
  - `rootCause` - identified underlying cause

### 3. Priority and Scoring DTOs

#### `AlertPriorityScoreDto`

- **Purpose**: Comprehensive priority calculation (Requirement 3.4)
- **Key Fields**:
  - `overallScore` (0-100) - combined priority
  - `impactScore` (0-1) - potential impact factor
  - `probabilityScore` (0-1) - likelihood factor
  - `preventionCapacityScore` (0-1) - intervention capability
  - `urgencyScore` (0-1) - time sensitivity factor
  - `reasoning` - explanation of calculation

#### `AlertSummaryDto`

- **Purpose**: Project-level alert overview
- **Key Fields**:
  - Alert counts by severity
  - Overall risk level (0-100)
  - Top priority alerts for immediate attention

## Service Interfaces

### 1. AlertService

- **Core Operations**: CRUD operations for alerts
- **Prioritization**: `calculateAlertPriority()` and `prioritizeAlerts()` (Requirement 3.4)
- **Lifecycle**: Acknowledge, resolve, dismiss operations
- **Monitoring**: Summary and cleanup operations

### 2. RiskIndicatorService

- **Management**: CRUD operations for risk indicators
- **Analysis**: Threshold breach detection and trend analysis
- **Prediction**: Future value prediction and anomaly detection (Requirement 3.1)
- **Historical**: Data point management for pattern recognition

### 3. EarlyWarningService

- **Early Warnings**: Generate alerts 72+ hours ahead (Requirement 3.1)
- **Proactive Alerts**: Context-rich predictive notifications (Requirement 3.2)
- **Prevention**: Enrichment with preventive actions and context
- **Monitoring**: Continuous risk indicator monitoring

## Database Entities

### Alert-related Entities

- `AlertEntity` - Core alert storage
- `PreventiveActionEntity` - Suggested preventive actions
- `AlertContextEntity` - Rich contextual information
- `AlertPriorityScoreEntity` - Priority calculation storage

### Risk Indicator Entities

- `RiskIndicatorEntity` - Core indicator storage
- `HistoricalDataPointEntity` - Time-series data for trends

## Validation and Compliance

### Validation Classes

- `ComprehensiveAlertValidation` - Ensures all requirements are met
- `AlertPriorityValidation` - Validates priority levels (Requirement 3.2)
- `AlertTimingValidation` - Ensures 72+ hour prediction (Requirement 3.1)
- `AlertPrioritizationValidation` - Validates scoring system (Requirement 3.4)

### Runtime Validation Functions

- `validateAlertMeetsRequirements()` - Comprehensive requirement checking
- `validateRiskIndicatorSupportsAlerts()` - Indicator validation for alert generation

## Key Features

### 1. Predictive Capabilities (Requirement 3.1)

- Minimum 72-hour prediction horizon enforced
- Historical data integration for pattern recognition
- Trend analysis with confidence scoring
- Future value prediction with uncertainty bounds

### 2. Priority System (Requirement 3.2)

- Four-level severity system (low, medium, high, critical)
- Probability scoring (0-1) for occurrence likelihood
- Confidence scoring (0-1) for prediction reliability
- Contextual differentiation from reactive notifications

### 3. Prioritization Framework (Requirement 3.4)

- Multi-factor scoring system
- Impact potential assessment
- Prevention capacity evaluation
- Urgency calculation based on timing
- Transparent reasoning for priority decisions

## Integration Points

### With Gap Analysis Module

- Risk indicators can be derived from gap analysis results
- Alerts can reference specific gaps and their severity

### With Predictions Module

- Leverages existing prediction infrastructure
- Extends prediction capabilities with structured alerting

### With Integrations Module

- Risk indicators can be populated from external tool data
- Alerts can trigger notifications through integrated channels

## Usage Examples

### Creating a Risk Indicator

```typescript
const indicator: CreateRiskIndicatorDto = {
  projectId: 'proj-123',
  name: 'Budget Utilization Rate',
  description: 'Percentage of budget consumed vs timeline progress',
  category: IndicatorCategory.BUDGET,
  currentValue: 0.85,
  threshold: 0.8,
  weight: 0.9,
  unit: 'percentage',
};
```

### Generating an Alert

```typescript
const alert: CreateAlertDto = {
  projectId: 'proj-123',
  type: AlertType.RISK,
  severity: AlertSeverity.HIGH,
  title: 'Budget Overrun Risk',
  description: 'Project is consuming budget faster than progress indicates',
  probability: 0.78,
  estimatedTimeToOccurrence: { value: 96, unit: 'hours' }, // 4 days ahead
  potentialImpact: ImpactLevel.HIGH,
  preventionWindow: { value: 72, unit: 'hours' },
  suggestedActions: [
    /* preventive actions */
  ],
  context: {
    triggeringIndicators: [indicator],
    rootCause: 'Resource allocation inefficiency',
  },
  expiresAt: '2024-02-15T10:00:00Z',
};
```

## Conclusion

The implemented risk indicator and alert structures fully comply with requirements 3.1, 3.2, and 3.4, providing:

1. **Predictive capabilities** with minimum 72-hour anticipation
2. **Structured priority system** with probability and confidence scoring
3. **Comprehensive prioritization framework** with multi-factor analysis
4. **Rich contextual information** for informed decision-making
5. **Extensible architecture** for future enhancements

The structures are type-safe, validated, and ready for integration with the broader AI Project Gap Analysis Tool ecosystem.
