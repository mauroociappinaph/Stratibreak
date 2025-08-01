# Predictions History API Documentation

## Overview

The Predictions History API provides comprehensive endpoints for analyzing historical prediction data, trend analysis, and accuracy metrics. These endpoints support the requirement for tracking prediction accuracy and historical performance (Requirement 3.5).

## Endpoints

### 1. Get Prediction History

**Endpoint:** `GET /predictions/history/:projectId`

**Description:** Retrieves historical predictions with accuracy metrics and outcomes for a specific project.

**Parameters:**

- `projectId` (path, required): Project identifier
- `startDate` (query, optional): Start date for history range (ISO 8601)
- `endDate` (query, optional): End date for history range (ISO 8601)
- `predictionType` (query, optional): Filter by prediction type (`early_warning`, `risk_alert`, `trend_alert`, `anomaly_alert`)
- `limit` (query, optional): Maximum number of records (1-1000, default: 50)

**Response Schema:**

```json
{
  "projectId": "proj_123456789",
  "timeRange": {
    "startDate": "2024-01-01T00:00:00Z",
    "endDate": "2024-07-31T23:59:59Z"
  },
  "predictions": [
    {
      "id": "pred_123456789",
      "projectId": "proj_123456789",
      "type": "risk_alert",
      "title": "High risk detected",
      "description": "Risk indicators suggest potential project disruption",
      "probability": 0.85,
      "severity": "high",
      "predictedAt": "2024-07-29T10:00:00Z",
      "expectedAt": "2024-07-31T10:00:00Z",
      "actualOutcome": "confirmed",
      "verifiedAt": "2024-07-31T12:00:00Z",
      "accuracyScore": 0.92,
      "actionsTaken": ["Increased monitoring", "Resource reallocation"]
    }
  ],
  "summary": {
    "totalPredictions": 45,
    "confirmedPredictions": 38,
    "falsePositives": 4,
    "preventedIssues": 3,
    "averageAccuracy": 0.87,
    "accuracyTrend": "improving"
  },
  "generatedAt": "2024-07-31T15:30:00Z"
}
```

**Use Cases:**

- Track prediction accuracy over time
- Analyze false positive rates
- Review prevented issues and their impact
- Generate accuracy reports for stakeholders

### 2. Get Trend History

**Endpoint:** `GET /predictions/trend-history/:projectId`

**Description:** Analyzes historical trends and provides predictions for project metrics (Requirement 3.1).

**Parameters:**

- `projectId` (path, required): Project identifier
- `metric` (query, optional): Specific metric to analyze (`velocity`, `resource_utilization`, `quality_metrics`, `timeline_progress`)
- `startDate` (query, optional): Start date for analysis (ISO 8601)
- `endDate` (query, optional): End date for analysis (ISO 8601)
- `granularity` (query, optional): Time granularity (`hourly`, `daily`, `weekly`, `monthly`, default: `daily`)

**Response Schema:**

```json
{
  "projectId": "proj_123456789",
  "timeRange": {
    "startDate": "2024-01-01T00:00:00Z",
    "endDate": "2024-07-31T23:59:59Z"
  },
  "metrics": [
    {
      "metric": "velocity",
      "unit": "story_points",
      "dataPoints": [
        {
          "timestamp": "2024-07-29T00:00:00Z",
          "value": 8.5,
          "trend": "declining",
          "changeRate": -0.15,
          "movingAverage": 8.2
        }
      ],
      "overallTrend": {
        "direction": "declining",
        "strength": 0.8,
        "duration": "4 weeks",
        "significance": 0.92,
        "volatility": 0.15
      },
      "prediction": {
        "nextValue": 7.8,
        "confidence": 0.85,
        "timeHorizon": "1 week",
        "bounds": {
          "lower": 7.2,
          "upper": 8.4
        }
      }
    }
  ],
  "insights": {
    "significantTrends": 3,
    "improvingMetrics": 2,
    "decliningMetrics": 1,
    "volatileMetrics": 0,
    "overallHealthTrend": "stable"
  },
  "recommendations": [
    "Monitor velocity decline closely",
    "Consider resource reallocation",
    "Investigate quality metric improvements"
  ],
  "generatedAt": "2024-07-31T15:30:00Z"
}
```

**Use Cases:**

- Identify long-term performance trends
- Predict future metric values
- Generate proactive recommendations
- Monitor project health indicators

### 3. Get Prediction Accuracy Metrics

**Endpoint:** `GET /predictions/accuracy-metrics/:projectId`

**Description:** Provides comprehensive accuracy analysis for prediction models (Requirement 3.2).

**Parameters:**

- `projectId` (path, required): Project identifier
- `startDate` (query, optional): Start date for accuracy analysis (ISO 8601)
- `endDate` (query, optional): End date for accuracy analysis (ISO 8601)

**Response Schema:**

```json
{
  "projectId": "proj_123456789",
  "period": {
    "startDate": "2024-01-01T00:00:00Z",
    "endDate": "2024-07-31T23:59:59Z"
  },
  "overallMetrics": {
    "overallAccuracy": 0.87,
    "precision": 0.82,
    "recall": 0.91,
    "f1Score": 0.86,
    "falsePositiveRate": 0.08,
    "falseNegativeRate": 0.05
  },
  "byType": {
    "risk_alert": {
      "accuracy": 0.89,
      "totalPredictions": 25,
      "confirmedPredictions": 22
    },
    "trend_alert": {
      "accuracy": 0.85,
      "totalPredictions": 15,
      "confirmedPredictions": 13
    }
  },
  "accuracyTrend": [
    {
      "period": "2024-07-01",
      "accuracy": 0.85,
      "predictions": 12
    },
    {
      "period": "2024-07-08",
      "accuracy": 0.87,
      "predictions": 15
    }
  ],
  "insights": [
    "Risk alert predictions show highest accuracy at 89%",
    "Overall accuracy has improved 15% over the last month",
    "False positive rate is within acceptable range"
  ],
  "calculatedAt": "2024-07-31T15:30:00Z"
}
```

**Use Cases:**

- Monitor prediction model performance
- Compare accuracy across prediction types
- Track accuracy improvements over time
- Generate model performance reports

## Implementation Details

### Service Layer

The `PredictionsService` implements three main methods:

1. **`getPredictionHistory()`**: Retrieves and analyzes historical prediction data
2. **`getTrendHistory()`**: Performs trend analysis on project metrics
3. **`getPredictionAccuracyMetrics()`**: Calculates comprehensive accuracy metrics

### Mock Data Generation

For development and testing, the system uses `MockDataGenerator` to create realistic prediction data:

- **Prediction History**: Generates varied prediction types with realistic outcomes
- **Trend Data**: Creates time-series data with configurable trends and volatility
- **Accuracy Metrics**: Simulates model performance with statistical variations

### Analytics Engine

The `PredictionAnalytics` class provides:

- **Summary Statistics**: Calculates prediction success rates and trends
- **Trend Insights**: Analyzes metric patterns and significance
- **Recommendations**: Generates actionable insights based on data analysis

## Error Handling

All endpoints include comprehensive error handling:

- **400 Bad Request**: Invalid parameters or date ranges
- **404 Not Found**: Project not found
- **500 Internal Server Error**: Service unavailable or processing errors

## Performance Considerations

- **Caching**: Historical data is cached for improved response times
- **Pagination**: Large datasets are paginated to prevent memory issues
- **Async Processing**: Complex analytics run asynchronously when possible

## Security

- **Authentication**: All endpoints require valid JWT tokens
- **Authorization**: Users can only access data for their authorized projects
- **Rate Limiting**: API calls are rate-limited to prevent abuse

## Testing

The API includes comprehensive test coverage:

- **Unit Tests**: Service layer logic and data processing
- **Integration Tests**: End-to-end API functionality
- **E2E Tests**: Complete user workflows and edge cases

## Future Enhancements

- **Real-time Updates**: WebSocket support for live prediction updates
- **Advanced Analytics**: Machine learning model performance tracking
- **Custom Metrics**: User-defined metrics and trend analysis
- **Export Capabilities**: CSV/PDF export for reports and analysis
