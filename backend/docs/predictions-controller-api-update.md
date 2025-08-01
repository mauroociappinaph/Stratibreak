# Predictions Controller API Update

## Overview

The predictions controller has been significantly refactored to improve maintainability, type safety, and API documentation. The main changes include controller splitting, proper response DTOs, and comprehensive OpenAPI documentation.

## Key Changes

### 1. Controller Splitting

The monolithic predictions controller has been split into three focused controllers:

#### **PredictionsController** (`/predictions`)

- Core CRUD operations for predictions
- Basic prediction generation endpoints
- Future issues prediction
- Early warnings generation
- Risk probability calculation

#### **PredictionsAdvancedController** (`/predictions/advanced`)

- Monte Carlo risk analysis
- Advanced statistical calculations
- Complex risk modeling

#### **PredictionsHistoryController** (`/predictions/history`)

- Prediction history retrieval
- Trend analysis history
- Accuracy metrics and performance tracking

### 2. New Response DTOs

Created proper response DTOs with comprehensive validation and documentation:

#### **PredictFutureIssuesResponseDto**

```typescript
{
  projectId: string;
  predictions: PredictionResponseDto[];
  analysisTimestamp: string;
}
```

#### **GenerateEarlyWarningsResponseDto**

```typescript
{
  projectId: string;
  alerts: AlertResponseDto[];
  analysisTimestamp: string;
}
```

#### **CalculateRiskProbabilityResponseDto**

```typescript
{
  projectId: string;
  riskAssessment: RiskAssessmentResponseDto;
  analysisTimestamp: string;
}
```

### 3. Type Safety Improvements

- Replaced `any[]` and `unknown[]` with proper typed arrays
- Added proper enum types for trend directions and change types
- Fixed TypeScript compilation errors
- Improved type inference throughout the codebase

### 4. Enhanced OpenAPI Documentation

#### **Comprehensive Examples**

Each endpoint now includes detailed examples with realistic data:

```typescript
// Example for predict-future-issues endpoint
{
  projectId: 'proj_123456789',
  timeRange: {
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2024-07-31T23:59:59Z'
  },
  metrics: [
    {
      name: 'velocity',
      values: [
        { timestamp: '2024-07-29T00:00:00Z', value: 15 }
      ],
      unit: 'story_points'
    }
  ],
  // ... additional data
}
```

#### **Detailed Descriptions**

- Each endpoint includes comprehensive descriptions
- Use cases and benefits clearly explained
- Parameter requirements and constraints documented
- Response structure fully specified

#### **Error Handling Documentation**

- 400 Bad Request responses for invalid data
- 500 Internal Server Error responses for system failures
- Specific error scenarios documented

## API Endpoints

### Core Predictions (`/predictions`)

| Method | Endpoint                                  | Description                      |
| ------ | ----------------------------------------- | -------------------------------- |
| POST   | `/predictions`                            | Create a new prediction          |
| GET    | `/predictions`                            | Get all predictions              |
| GET    | `/predictions/:id`                        | Get prediction by ID             |
| PATCH  | `/predictions/:id`                        | Update prediction                |
| DELETE | `/predictions/:id`                        | Delete prediction                |
| POST   | `/predictions/generate/:projectId`        | Generate predictions for project |
| GET    | `/predictions/project/:projectId`         | Get predictions by project       |
| POST   | `/predictions/predict-future-issues`      | **Predict future issues**        |
| POST   | `/predictions/generate-early-warnings`    | **Generate early warnings**      |
| POST   | `/predictions/calculate-risk-probability` | **Calculate risk probability**   |

### Advanced Analytics (`/predictions/advanced`)

| Method | Endpoint                                          | Description            |
| ------ | ------------------------------------------------- | ---------------------- |
| POST   | `/predictions/advanced/monte-carlo-risk-analysis` | Monte Carlo simulation |

### History & Metrics (`/predictions/history`)

| Method | Endpoint                                   | Description            |
| ------ | ------------------------------------------ | ---------------------- |
| GET    | `/predictions/history/:projectId`          | Get prediction history |
| GET    | `/predictions/history/trend/:projectId`    | Get trend history      |
| GET    | `/predictions/history/accuracy/:projectId` | Get accuracy metrics   |

## Request/Response Examples

### Predict Future Issues

**Request:**

```json
POST /predictions/predict-future-issues
{
  "projectId": "proj_123456789",
  "timeRange": {
    "startDate": "2024-01-01T00:00:00Z",
    "endDate": "2024-07-31T23:59:59Z"
  },
  "metrics": [
    {
      "name": "velocity",
      "values": [
        { "timestamp": "2024-07-29T00:00:00Z", "value": 15 }
      ],
      "unit": "story_points"
    }
  ],
  "events": [],
  "patterns": []
}
```

**Response:**

```json
{
  "projectId": "proj_123456789",
  "predictions": [
    {
      "issueType": "velocity_decline",
      "probability": 0.85,
      "estimatedTimeToOccurrence": {
        "value": 72,
        "unit": "hours"
      },
      "potentialImpact": "high",
      "preventionWindow": {
        "value": 48,
        "unit": "hours"
      },
      "suggestedActions": [
        {
          "id": "action_001",
          "title": "Increase team capacity",
          "description": "Add additional resources to maintain velocity",
          "priority": "high",
          "estimatedEffort": "2-3 days",
          "requiredResources": ["Senior Developer"],
          "expectedImpact": "Maintain current velocity"
        }
      ]
    }
  ],
  "analysisTimestamp": "2024-07-31T15:30:00Z"
}
```

### Generate Early Warnings

**Request:**

```json
POST /predictions/generate-early-warnings
{
  "projectId": "proj_123456789",
  "currentMetrics": [
    {
      "name": "velocity",
      "currentValue": 15,
      "previousValue": 25,
      "changeRate": -0.4,
      "trend": "declining",
      "unit": "story_points"
    }
  ],
  "recentChanges": [],
  "velocityIndicators": []
}
```

**Response:**

```json
{
  "projectId": "proj_123456789",
  "alerts": [
    {
      "id": "alert_001",
      "projectId": "proj_123456789",
      "type": "early_warning",
      "severity": "high",
      "title": "Velocity Decline Detected",
      "description": "Team velocity has declined by 40% over the past 2 weeks",
      "probability": 0.85,
      "estimatedTimeToOccurrence": {
        "value": 72,
        "unit": "hours"
      },
      "potentialImpact": "high",
      "preventionWindow": {
        "value": 48,
        "unit": "hours"
      },
      "suggestedActions": [],
      "createdAt": "2024-07-31T15:30:00Z",
      "expiresAt": "2024-08-07T15:30:00Z"
    }
  ],
  "analysisTimestamp": "2024-07-31T15:30:00Z"
}
```

## Breaking Changes

### Controller Routes

- History endpoints moved from `/predictions/history/:projectId` to `/predictions/history/:projectId`
- Advanced analytics moved to `/predictions/advanced/*`
- No breaking changes to existing CRUD endpoints

### Response Types

- All prediction endpoints now return properly typed responses
- `any[]` types replaced with specific DTOs
- Additional metadata included in responses

## Migration Guide

### For API Consumers

1. **Update endpoint URLs** for history and advanced features
2. **Update response type handling** to use new DTO structures
3. **Review error handling** for new error response formats

### For Developers

1. **Import new controllers** in the predictions module
2. **Update tests** to use new controller classes
3. **Use new response DTOs** for type safety

## Testing

### Unit Tests

- Updated test files for new controller structure
- Added tests for new response DTOs
- Improved test coverage for type safety

### Integration Tests

- All existing API contracts maintained
- New endpoints fully tested
- Error scenarios covered

## Performance Impact

- **Improved**: Smaller controller files load faster
- **Improved**: Better type inference reduces runtime errors
- **Maintained**: No performance degradation in API responses
- **Enhanced**: Better error handling and validation

## Future Enhancements

1. **Caching**: Add Redis caching for expensive predictions
2. **Rate Limiting**: Implement rate limiting for resource-intensive endpoints
3. **Webhooks**: Add webhook support for real-time alerts
4. **Batch Processing**: Support batch prediction requests
5. **Model Versioning**: Add support for multiple ML model versions

## Documentation Links

- [OpenAPI Specification](./predictions-updated.swagger.ts)
- [Controller Refactoring Guide](./predictions-controller-refactoring.md)
- [Type Safety Improvements](../src/modules/predictions/dto/)
- [Test Coverage Report](../coverage/lcov-report/src/modules/predictions/)

## Support

For questions or issues related to these changes:

1. Check the comprehensive OpenAPI documentation
2. Review the example requests and responses
3. Consult the type definitions in the DTO files
4. Run the test suite to verify integration
