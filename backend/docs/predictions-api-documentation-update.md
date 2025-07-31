# Predictions API Documentation Update

## Overview

This document outlines the comprehensive OpenAPI documentation updates for the Predictions module, including new advanced prediction endpoints, enhanced DTOs, and detailed Swagger specifications.

## Updated Files

### New Swagger Documentation Files

1. **`backend/src/modules/predictions/controllers/predictions.swagger.ts`**
   - Main Swagger documentation for advanced prediction endpoints
   - Comprehensive API operation descriptions
   - Detailed request/response schemas
   - Example payloads for complex operations

2. **`backend/src/modules/predictions/controllers/predictions-crud.swagger.ts`**
   - CRUD operations documentation
   - Standard entity management endpoints
   - Project-specific prediction operations

### Updated Controller

3. **`backend/src/modules/predictions/controllers/predictions.controller.ts`**
   - Applied Swagger decorators to all endpoints
   - Enhanced service injection for RiskCalculatorService
   - Improved type safety and documentation consistency

4. **`backend/src/modules/predictions/controllers/index.ts`**
   - Added exports for Swagger documentation modules

## API Endpoints Documentation

### CRUD Operations

#### POST /predictions

- **Summary**: Create a new prediction
- **Description**: Creates a new prediction record with specified type, probability, and impact
- **Request Body**: `CreatePredictionDto`
- **Response**: `PredictionEntity`
- **Examples**: Risk prediction, performance prediction

#### GET /predictions

- **Summary**: Get all predictions
- **Description**: Retrieves all prediction records across projects
- **Response**: `PredictionEntity[]`

#### GET /predictions/:id

- **Summary**: Get prediction by ID
- **Description**: Retrieves specific prediction with metadata and confidence scores
- **Parameters**: `id` (string) - Unique prediction identifier
- **Response**: `PredictionEntity`

#### PATCH /predictions/:id

- **Summary**: Update prediction
- **Description**: Updates existing prediction record
- **Parameters**: `id` (string) - Unique prediction identifier
- **Request Body**: `UpdatePredictionDto`
- **Response**: `PredictionEntity`
- **Examples**: Update probability, impact level, description

#### DELETE /predictions/:id

- **Summary**: Delete prediction
- **Description**: Permanently deletes prediction record
- **Parameters**: `id` (string) - Unique prediction identifier
- **Response**: 204 No Content

### Project-Specific Operations

#### POST /predictions/generate/:projectId

- **Summary**: Generate predictions for a project
- **Description**: AI-powered prediction generation with ML models
- **Parameters**: `projectId` (string) - Project identifier
- **Response**: `PredictionEntity[]`
- **Features**:
  - Historical data analysis
  - Pattern recognition
  - Confidence intervals
  - Actionable early warnings

#### GET /predictions/project/:projectId

- **Summary**: Get predictions by project
- **Description**: Retrieves all predictions for specific project
- **Parameters**: `projectId` (string) - Project identifier
- **Response**: `PredictionEntity[]`

### Advanced Prediction Endpoints

#### POST /predictions/predict-future-issues

- **Summary**: Predict future issues based on historical data
- **Description**: Advanced AI-powered prediction engine with 72+ hour advance warning
- **Request Body**: `PredictFutureIssuesDto`
- **Response**: Comprehensive prediction analysis
- **Features**:
  - Machine learning algorithms
  - Pattern identification
  - Time-to-occurrence estimation
  - Prevention strategies
  - Confidence scoring

**Request Schema**:

```typescript
{
  projectId: string;
  timeRange: {
    startDate: string;
    endDate: string;
  }
  metrics: Array<{
    name: string;
    values: Array<{
      timestamp: string;
      value: number;
    }>;
    unit: string;
  }>;
  events: Array<{
    timestamp: string;
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

#### POST /predictions/generate-early-warnings

- **Summary**: Generate early warning alerts
- **Description**: Proactive alert system based on current trends
- **Request Body**: `GenerateEarlyWarningsDto`
- **Response**: Early warning alerts with prevention windows
- **Features**:
  - Real-time trend analysis
  - Velocity indicators
  - Priority-based alerts
  - Actionable recommendations

**Request Schema**:

```typescript
{
  projectId: string;
  currentMetrics: Array<{
    name: string;
    currentValue: number;
    previousValue: number;
    changeRate: number;
    trend: string;
    unit: string;
  }>;
  recentChanges: Array<{
    metric: string;
    changeType: string;
    magnitude: number;
    timeframe: { value: number; unit: string };
    significance: number;
  }>;
  velocityIndicators: Array<{
    name: string;
    currentVelocity: number;
    averageVelocity: number;
    trend: string;
    predictedVelocity: number;
  }>;
}
```

#### POST /predictions/calculate-risk-probability

- **Summary**: Calculate risk probability based on indicators
- **Description**: Comprehensive risk assessment with weighted indicators
- **Request Body**: `CalculateRiskProbabilityDto`
- **Response**: `CalculateRiskProbabilityResponseDto`
- **Features**:
  - Multi-factor risk analysis
  - Weighted importance scoring
  - Confidence levels
  - Mitigation recommendations

**Request Schema**:

```typescript
{
  projectId: string;
  indicators: Array<{
    indicator: string;
    currentValue: number;
    threshold: number;
    trend: string;
    weight: number;
  }>;
}
```

#### GET /predictions/risk-assessment/:projectId

- **Summary**: Get comprehensive risk assessment for project
- **Description**: Detailed risk analysis with trends and recommendations
- **Parameters**: `projectId` (string) - Project identifier
- **Response**: Risk assessment with overall score and critical risks
- **Features**:
  - Overall risk level calculation
  - Critical risk identification
  - Prioritized recommendations
  - Review scheduling

#### GET /predictions/trend-analysis/:projectId

- **Summary**: Get trend analysis for project
- **Description**: Comprehensive trend analysis with predictions
- **Parameters**: `projectId` (string) - Project identifier
- **Response**: Trend analysis with predictions and recommendations
- **Features**:
  - Historical trend identification
  - Future value predictions
  - Confidence intervals
  - Statistical significance
  - Actionable recommendations

#### POST /predictions/comprehensive-warnings

- **Summary**: Generate comprehensive early warnings
- **Description**: Advanced warning system with correlation analysis
- **Request Body**: `GenerateEarlyWarningsDto`
- **Response**: Comprehensive warnings with detailed context
- **Features**:
  - Multi-dimensional risk analysis
  - Data correlation across metrics
  - Machine learning pattern recognition
  - Advanced prevention strategies

## Response Schemas

### Standard Responses

All endpoints include standardized error responses:

- **400 Bad Request**: Invalid input data
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server processing error

### Success Response Examples

#### Future Issues Prediction Response

```json
{
  "projectId": "proj_123456789",
  "predictions": [
    {
      "issueType": "resource_shortage",
      "probability": 0.85,
      "estimatedTimeToOccurrence": {
        "value": 5,
        "unit": "days"
      },
      "potentialImpact": "high",
      "preventionWindow": {
        "value": 3,
        "unit": "days"
      },
      "suggestedActions": [
        {
          "id": "action_001",
          "title": "Hire additional developer",
          "description": "Bring in a senior developer to maintain velocity",
          "priority": "high",
          "estimatedEffort": "2-3 weeks",
          "requiredResources": ["HR team", "Budget approval"],
          "expectedImpact": "Maintains current velocity"
        }
      ]
    }
  ],
  "analysisTimestamp": "2024-07-31T15:30:00Z"
}
```

#### Risk Assessment Response

```json
{
  "projectId": "proj_123456789",
  "overallRiskLevel": "MEDIUM",
  "riskScore": 0.45,
  "criticalRisks": [
    "Resource allocation below optimal levels",
    "Timeline compression detected"
  ],
  "recommendations": [
    "Increase resource allocation by 15%",
    "Review timeline constraints with stakeholders",
    "Implement additional monitoring for critical path items"
  ],
  "nextReviewDate": "2024-08-07T15:30:00Z",
  "analysisTimestamp": "2024-07-31T15:30:00Z"
}
```

## Documentation Features

### Comprehensive Examples

- Real-world request/response examples
- Multiple scenario demonstrations
- Edge case handling

### Detailed Descriptions

- Business context for each endpoint
- Technical implementation details
- Use case explanations

### Type Safety

- Full TypeScript integration
- Validated request/response schemas
- Enum value specifications

### Error Handling

- Standardized error responses
- Detailed error descriptions
- Troubleshooting guidance

## Integration Notes

### Service Dependencies

- `PredictionsService`: Core CRUD operations
- `PredictiveService`: Advanced prediction algorithms
- `EarlyWarningService`: Alert generation
- `RiskCalculatorService`: Risk assessment calculations

### DTO Validation

- Class-validator decorators
- Type transformation
- Nested object validation
- Array validation with custom types

### OpenAPI Compliance

- OpenAPI 3.0 specification
- Swagger UI integration
- Auto-generated client libraries
- API testing capabilities

## Benefits

1. **Developer Experience**: Clear, comprehensive API documentation
2. **Type Safety**: Full TypeScript integration with validation
3. **Testing**: Built-in examples for API testing
4. **Client Generation**: Auto-generated client libraries
5. **Maintenance**: Consistent documentation patterns
6. **Onboarding**: Easy understanding of complex prediction APIs

## Next Steps

1. **Testing**: Validate all endpoints with provided examples
2. **Client Integration**: Generate client libraries for frontend
3. **Monitoring**: Implement API usage analytics
4. **Versioning**: Plan for API version management
5. **Performance**: Monitor response times for complex predictions

This documentation update ensures that the Predictions API is fully documented, type-safe, and ready for production use with comprehensive examples and detailed specifications.
