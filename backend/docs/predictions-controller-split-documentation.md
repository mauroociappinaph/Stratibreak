# Predictions Controller Split Documentation

## Overview

The predictions controller has been split into three focused controllers to improve maintainability, reduce file size, and follow the Single Responsibility Principle. This change addresses the file size limit (300 lines) and improves code organization.

## Controller Architecture

### 1. PredictionsController (`/predictions`)

**Purpose**: Core CRUD operations for predictions
**File**: `backend/src/modules/predictions/controllers/predictions.controller.ts`
**Routes**: `/predictions`

#### Endpoints:

| Method | Endpoint                           | Description                      |
| ------ | ---------------------------------- | -------------------------------- |
| POST   | `/predictions`                     | Create a new prediction          |
| GET    | `/predictions`                     | Get all predictions              |
| GET    | `/predictions/:id`                 | Get prediction by ID             |
| PATCH  | `/predictions/:id`                 | Update prediction                |
| DELETE | `/predictions/:id`                 | Delete prediction                |
| POST   | `/predictions/generate/:projectId` | Generate predictions for project |
| GET    | `/predictions/project/:projectId`  | Get predictions by project       |

### 2. PredictionsAdvancedController (`/predictions/advanced`)

**Purpose**: Advanced AI-powered prediction analysis
**File**: `backend/src/modules/predictions/controllers/predictions-advanced.controller.ts`
**Routes**: `/predictions/advanced`

#### Endpoints:

| Method | Endpoint                                           | Description                   |
| ------ | -------------------------------------------------- | ----------------------------- |
| POST   | `/predictions/advanced/predict-future-issues`      | Predict future issues         |
| POST   | `/predictions/advanced/generate-early-warnings`    | Generate early warning alerts |
| POST   | `/predictions/advanced/calculate-risk-probability` | Calculate risk probability    |

### 3. PredictionsHistoryController (`/predictions/history`)

**Purpose**: Historical data and analytics
**File**: `backend/src/modules/predictions/controllers/predictions-history.controller.ts`
**Routes**: `/predictions/history`

#### Endpoints:

| Method | Endpoint                                   | Description            |
| ------ | ------------------------------------------ | ---------------------- |
| GET    | `/predictions/history/:projectId`          | Get prediction history |
| GET    | `/predictions/history/trend/:projectId`    | Get trend history      |
| GET    | `/predictions/history/accuracy/:projectId` | Get accuracy metrics   |

## Key Changes Made

### 1. Controller Splitting

**Before**: Single monolithic controller (353+ lines)
**After**: Three focused controllers (<300 lines each)

**Benefits**:

- Improved maintainability
- Better separation of concerns
- Easier testing and debugging
- Follows Single Responsibility Principle

### 2. Type Safety Improvements

**Fixed Issues**:

- Replaced `any[]` types with proper typed arrays
- Added proper enum imports (`ChangeType`, `TimeUnit`)
- Fixed optional `deadline` field handling
- Removed unused service injections

**Type Fixes**:

```typescript
// Before
deadline: action.deadline?.toISOString(),

// After
deadline: action.deadline?.toISOString() || '',
```

### 3. Response DTO Updates

**GenerateEarlyWarningsResponseDto**:

- Added `overallRiskLevel` property
- Fixed `deadline` field to be required (with empty string fallback)
- Improved type safety for all nested objects

### 4. Service Integration

**Removed**:

- Unused `RiskCalculatorService` injection from main controller
- Duplicate helper methods

**Added**:

- `calculateOverallRiskLevel` helper method
- Proper type casting for enums

## API Documentation Updates

### Advanced Prediction Endpoints

#### Predict Future Issues

**Endpoint**: `POST /predictions/advanced/predict-future-issues`

**Request Body**:

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

**Response**:

```typescript
{
  projectId: string;
  predictions: Array<{
    issueType: string;
    probability: number; // 0-1
    estimatedTimeToOccurrence: {
      value: number;
      unit: string;
    };
    potentialImpact: string;
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
      deadline: string; // ISO 8601 or empty string
    }>;
  }>;
  analysisTimestamp: string; // ISO 8601
}
```

#### Generate Early Warnings

**Endpoint**: `POST /predictions/advanced/generate-early-warnings`

**Request Body**:

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

**Response**:

```typescript
{
  projectId: string;
  overallRiskLevel: 'low' | 'medium' | 'high' | 'critical';
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
      deadline: string; // ISO 8601 or empty string
    }>;
    createdAt: string; // ISO 8601
    expiresAt: string; // ISO 8601
  }>;
  analysisTimestamp: string; // ISO 8601
}
```

#### Calculate Risk Probability

**Endpoint**: `POST /predictions/advanced/calculate-risk-probability`

**Request Body**:

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

**Response**:

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

### Route Changes

**Advanced Endpoints Moved**:

- `POST /predictions/predict-future-issues` → `POST /predictions/advanced/predict-future-issues`
- `POST /predictions/generate-early-warnings` → `POST /predictions/advanced/generate-early-warnings`
- `POST /predictions/calculate-risk-probability` → `POST /predictions/advanced/calculate-risk-probability`

**History Endpoints Remain**:

- `GET /predictions/history/:projectId` (unchanged)
- `GET /predictions/history/trend/:projectId` (unchanged)
- `GET /predictions/history/accuracy/:projectId` (unchanged)

### Response Changes

**GenerateEarlyWarningsResponseDto**:

- Added required `overallRiskLevel` field
- `deadline` field now returns empty string instead of `null` when not set

## Migration Guide

### For API Consumers

1. **Update endpoint URLs** for advanced prediction features:

   ```typescript
   // Before
   POST / predictions / predict - future - issues;

   // After
   POST / predictions / advanced / predict - future - issues;
   ```

2. **Handle new response fields**:

   ```typescript
   // New field in early warnings response
   interface EarlyWarningsResponse {
     overallRiskLevel: string; // NEW
     // ... existing fields
   }
   ```

3. **Update deadline handling**:

   ```typescript
   // Before: deadline could be null
   if (action.deadline) { ... }

   // After: deadline is always string (empty if not set)
   if (action.deadline && action.deadline !== '') { ... }
   ```

### For Developers

1. **Import new controllers**:

   ```typescript
   import {
     PredictionsController,
     PredictionsAdvancedController,
     PredictionsHistoryController,
   } from './controllers';
   ```

2. **Update module registration**:

   ```typescript
   @Module({
     controllers: [
       PredictionsController,
       PredictionsAdvancedController,
       PredictionsHistoryController,
     ],
     // ...
   })
   ```

3. **Update test imports**:
   ```typescript
   import { PredictionsAdvancedController } from './predictions-advanced.controller';
   ```

## Testing Impact

### Unit Tests

- **Split test files** to match controller split
- **Update imports** for new controller classes
- **Add tests** for new helper methods

### Integration Tests

- **Update endpoint URLs** in test cases
- **Add tests** for new response fields
- **Verify** all existing functionality still works

### E2E Tests

- **Update API calls** to use new endpoint URLs
- **Test** controller separation doesn't break workflows
- **Verify** response format changes

## Performance Impact

### Improvements

- **Faster loading**: Smaller controller files load faster
- **Better memory usage**: Only load needed controllers
- **Improved caching**: Smaller files cache better

### Considerations

- **Additional HTTP routes**: Slightly more routing overhead
- **Module complexity**: More controllers to manage

## Future Enhancements

1. **Rate Limiting**: Add different limits per controller type
2. **Caching**: Implement controller-specific caching strategies
3. **Monitoring**: Add controller-level metrics
4. **Documentation**: Auto-generate API docs per controller
5. **Versioning**: Support API versioning per controller

## Related Files

- `backend/src/modules/predictions/controllers/predictions.controller.ts`
- `backend/src/modules/predictions/controllers/predictions-advanced.controller.ts`
- `backend/src/modules/predictions/controllers/predictions-history.controller.ts`
- `backend/src/modules/predictions/predictions.module.ts`
- `backend/src/modules/predictions/dto/generate-early-warnings-response.dto.ts`

## Support

For questions about the controller split:

1. Check the individual controller files for specific endpoint documentation
2. Review the updated OpenAPI specifications
3. Run the test suite to verify integration
4. Consult the migration guide for breaking changes

This split improves code maintainability while preserving all existing functionality with minimal breaking changes.
