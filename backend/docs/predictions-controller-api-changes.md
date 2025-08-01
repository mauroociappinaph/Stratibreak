# Predictions Controller API Changes Summary

## Overview

The predictions controller has been refactored to improve type safety and maintainability. The main change was replacing `any[]` with `unknown[]` for better type safety in the `predictFutureIssues` endpoint response.

## Key Changes Made

### 1. Type Safety Improvement

**File:** `backend/src/modules/predictions/controllers/predictions.controller.ts`

**Change:** Line 149 - Updated return type from `any[]` to `unknown[]`

```typescript
// Before
predictions: any[];

// After
predictions: unknown[];
```

**Impact:** This change improves type safety by being more explicit about the unknown nature of the predictions array content, while maintaining backward compatibility.

### 2. Controller Structure

The controller has been organized into three main sections:

#### **Core CRUD Operations**

- `POST /predictions` - Create a new prediction
- `GET /predictions` - Get all predictions
- `GET /predictions/:id` - Get prediction by ID
- `PATCH /predictions/:id` - Update prediction
- `DELETE /predictions/:id` - Delete prediction
- `POST /predictions/generate/:projectId` - Generate predictions for project
- `GET /predictions/project/:projectId` - Get predictions by project

#### **Advanced Prediction Endpoints**

- `POST /predictions/predict-future-issues` - Predict future issues based on historical data
- `POST /predictions/generate-early-warnings` - Generate early warning alerts
- `POST /predictions/calculate-risk-probability` - Calculate risk probability

#### **Removed Endpoints**

The following endpoints were moved to separate controllers:

- Monte Carlo risk analysis → `PredictionsAdvancedController`
- Prediction history endpoints → `PredictionsHistoryController`

## API Documentation Updates

### Predict Future Issues Endpoint

**Endpoint:** `POST /predictions/predict-future-issues`

**Request Body:**

```typescript
{
  projectId: string;
  timeRange: {
    startDate: string; // ISO 8601
    endDate: string; // ISO 8601
  }
  metrics: Array<{
    name: string;
    values: Array<{
      timestamp: string; // ISO 8601
      value: number;
    }>;
    unit: string;
  }>;
  events: Array<{
    timestamp: string; // ISO 8601
    type: string;
    description: string;
    impact: 'low' | 'medium' | 'high' | 'critical';
  }>;
  patterns: Array<{
    patternType: string;
    frequency: number;
    confidence: number;
    description: string;
  }>;
}
```

**Response:**

```typescript
{
  projectId: string;
  predictions: unknown[]; // Changed from any[]
  analysisTimestamp: string; // ISO 8601
}
```

### Generate Early Warnings Endpoint

**Endpoint:** `POST /predictions/generate-early-warnings`

**Request Body:**

```typescript
{
  projectId: string;
  currentMetrics: Array<{
    name: string;
    currentValue: number;
    previousValue: number;
    changeRate: number;
    trend: 'improving' | 'stable' | 'declining' | 'volatile';
    unit: string;
  }>;
  recentChanges: Array<{
    metric: string;
    changeType: 'gradual' | 'sudden' | 'accelerating' | 'decelerating';
    magnitude: number;
    timeframe: {
      value: number;
      unit: 'minutes' | 'hours' | 'days' | 'weeks' | 'months';
    };
    significance: number;
  }>;
  velocityIndicators: Array<{
    name: string;
    currentVelocity: number;
    averageVelocity: number;
    trend: 'improving' | 'stable' | 'declining' | 'volatile';
    predictedVelocity: number;
  }>;
}
```

**Response:**

```typescript
{
  projectId: string;
  alerts: Array<{
    id: string;
    projectId: string;
    type: 'early_warning' | 'risk_alert' | 'trend_alert' | 'anomaly_alert';
    severity: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    description: string;
    probability: number; // 0-1
    estimatedTimeToOccurrence: {
      value: number;
      unit: string;
    };
    potentialImpact: 'low' | 'medium' | 'high' | 'critical';
    preventionWindow: {
      value: number;
      unit: string;
    };
    suggestedActions: Array<{
      id: string;
      title: string;
      description: string;
      priority: string;
      estimatedEffort: string;
      requiredResources: string[];
      expectedImpact: string;
    }>;
    createdAt: string; // ISO 8601
    expiresAt: string; // ISO 8601
  }>;
  analysisTimestamp: string; // ISO 8601
}
```

### Calculate Risk Probability Endpoint

**Endpoint:** `POST /predictions/calculate-risk-probability`

**Request Body:**

```typescript
{
  projectId: string;
  indicators: Array<{
    indicator: string;
    currentValue: number;
    threshold: number;
    trend: 'improving' | 'stable' | 'declining' | 'volatile';
    weight: number; // 0-1
  }>;
}
```

**Response:**

```typescript
{
  projectId: string;
  riskAssessment: {
    overallRisk: number; // 0-1
    riskFactors: Array<{
      factor: string;
      weight: number;
      currentValue: number;
      threshold: number;
      trend: string;
    }>;
    recommendations: string[];
    confidenceLevel: number; // 0-1
  };
  analysisTimestamp: string; // ISO 8601
}
```

## Breaking Changes

### None

The type change from `any[]` to `unknown[]` is not a breaking change as it maintains the same runtime behavior while improving compile-time type safety.

## Migration Notes

### For API Consumers

- No changes required - all endpoints maintain the same request/response structure
- Response types are now more strictly typed for better development experience

### For Developers

- Import statements may need updates if using the separated controllers
- Type assertions may be needed when working with the `unknown[]` predictions array

## Testing Impact

- All existing API tests should continue to pass
- Type checking is now more strict, which may catch potential runtime errors at compile time
- Integration tests remain unchanged as API contracts are preserved

## Future Improvements

1. **Proper Response DTOs**: Replace `unknown[]` with properly typed response DTOs
2. **Controller Separation**: Complete the separation of concerns by moving advanced features to dedicated controllers
3. **Enhanced Validation**: Add more comprehensive input validation for complex nested objects
4. **Error Handling**: Improve error responses with more specific error codes and messages

## Related Files

- `backend/src/modules/predictions/controllers/predictions.controller.ts` - Main controller file
- `backend/src/modules/predictions/dto/` - Request/response DTOs
- `backend/src/modules/predictions/services/` - Business logic services
- `backend/docs/predictions-controller-refactoring.md` - Previous refactoring documentation
