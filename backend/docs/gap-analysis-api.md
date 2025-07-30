# Gap Analysis API Documentation

## Overview

The Gap Analysis API provides comprehensive AI-powered project gap analysis capabilities. It identifies discrepancies between current project state and target goals, calculates severity levels, and generates actionable recommendations.

## Base URL

```
/api/gap-analysis
```

## Authentication

All endpoints require valid JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### 1. Create Gap Analysis

**POST** `/gap-analysis`

Creates a new gap analysis record manually.

#### Request Body

```json
{
  "projectId": "proj_123456789",
  "title": "Insufficient Development Resources",
  "description": "The project lacks sufficient senior developers to meet the delivery timeline",
  "type": "resource",
  "severity": "high"
}
```

#### Response

```json
{
  "id": "gap_987654321",
  "projectId": "proj_123456789",
  "title": "Insufficient Development Resources",
  "description": "The project lacks sufficient senior developers to meet the delivery timeline",
  "type": "resource",
  "severity": "high",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

#### Status Codes

- `201` - Created successfully
- `400` - Invalid input data
- `500` - Internal server error

---

### 2. Get All Gap Analyses

**GET** `/gap-analysis`

Retrieves all gap analysis records across all projects.

#### Response

```json
[
  {
    "id": "gap_987654321",
    "projectId": "proj_123456789",
    "title": "Insufficient Development Resources",
    "description": "The project lacks sufficient senior developers to meet the delivery timeline",
    "type": "resource",
    "severity": "high",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
]
```

#### Status Codes

- `200` - Success
- `500` - Internal server error

---

### 3. Get Gap Analysis by ID

**GET** `/gap-analysis/{id}`

Retrieves a specific gap analysis record.

#### Parameters

- `id` (path) - Unique identifier of the gap analysis

#### Response

```json
{
  "id": "gap_987654321",
  "projectId": "proj_123456789",
  "title": "Insufficient Development Resources",
  "description": "The project lacks sufficient senior developers to meet the delivery timeline",
  "type": "resource",
  "severity": "high",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

#### Status Codes

- `200` - Success
- `404` - Gap analysis not found
- `500` - Internal server error

---

### 4. Update Gap Analysis

**PATCH** `/gap-analysis/{id}`

Updates an existing gap analysis record.

#### Parameters

- `id` (path) - Unique identifier of the gap analysis to update

#### Request Body

```json
{
  "severity": "critical",
  "description": "Updated description with more details about the resource gap"
}
```

#### Response

```json
{
  "id": "gap_987654321",
  "projectId": "proj_123456789",
  "title": "Insufficient Development Resources",
  "description": "Updated description with more details about the resource gap",
  "type": "resource",
  "severity": "critical",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T14:20:00Z"
}
```

#### Status Codes

- `200` - Updated successfully
- `400` - Invalid input data
- `404` - Gap analysis not found
- `500` - Internal server error

---

### 5. Delete Gap Analysis

**DELETE** `/gap-analysis/{id}`

Permanently deletes a gap analysis record.

#### Parameters

- `id` (path) - Unique identifier of the gap analysis to delete

#### Status Codes

- `204` - Deleted successfully
- `404` - Gap analysis not found
- `500` - Internal server error

---

### 6. Perform Automated Analysis

**POST** `/gap-analysis/{projectId}/analyze`

Performs comprehensive AI-powered gap analysis on a project using the enhanced GapFactoryService.

#### Parameters

- `projectId` (path) - Unique identifier of the project to analyze

#### Response

```json
{
  "projectId": "proj_123456789",
  "analysisTimestamp": "2024-01-15T10:30:00Z",
  "identifiedGaps": [
    {
      "projectId": "proj_123456789",
      "title": "Resource Over-utilization",
      "description": "Resources are over-utilized at 95.0% affecting team sustainability",
      "type": "RESOURCE",
      "category": "OPERATIONAL",
      "severity": "HIGH",
      "status": "OPEN",
      "currentValue": 0.95,
      "targetValue": 0.8,
      "impact": "Team burnout risk and decreased productivity",
      "confidence": 0.85,
      "userId": "system"
    },
    {
      "projectId": "proj_123456789",
      "title": "Timeline Delay Detected",
      "description": "Project is delayed by 10 days",
      "type": "TIMELINE",
      "category": "OPERATIONAL",
      "severity": "HIGH",
      "status": "OPEN",
      "currentValue": 10,
      "targetValue": 0,
      "impact": "Delayed project delivery affecting stakeholder expectations",
      "confidence": 0.9,
      "userId": "system"
    }
  ],
  "overallConfidence": 0.87,
  "executionTimeMs": 850,
  "summary": {
    "totalGaps": 2,
    "criticalGaps": 0,
    "highSeverityGaps": 2,
    "averageConfidence": 0.875
  }
}
```

#### Enhanced Analysis Features

- **Simplified Gap Structure**: Streamlined gap data model for better performance
- **Resource Analysis**: Evaluates team utilization, budget burn rate, and capacity
- **Timeline Analysis**: Identifies delays and milestone deviations
- **Quality Analysis**: Assesses defect rates and quality metrics
- **Automated Severity Calculation**: Uses advanced algorithms for severity assessment
- **Confidence Scoring**: Provides confidence levels for each identified gap

#### Gap Factory Service Enhancements

The updated GapFactoryService provides:

- **Simplified Data Model**: Reduced complexity while maintaining essential information
- **Type Safety**: Full TypeScript support with proper enum usage
- **Performance Optimization**: Faster gap creation and analysis
- **Consistent Structure**: Standardized gap data across all analysis types

#### Status Codes

- `201` - Analysis completed successfully
- `400` - Invalid project ID
- `404` - Project not found
- `500` - Analysis failed

---

### 7. Get Detailed Analysis Results

**GET** `/gap-analysis/{projectId}/detailed-analysis`

Retrieves comprehensive gap analysis results with full details.

#### Parameters

- `projectId` (path) - Unique identifier of the project

#### Response

```json
{
  "projectId": "proj_123456789",
  "analysisTimestamp": "2024-01-15T10:30:00Z",
  "identifiedGaps": {
    "resource": [
      {
        "id": "gap_resource_001",
        "projectId": "proj_123456789",
        "type": "resource",
        "category": "operational",
        "title": "Resource Over-utilization",
        "description": "Resources are over-utilized at 95.0% affecting team sustainability",
        "currentValue": 0.95,
        "targetValue": 0.8,
        "variance": 0.15,
        "severity": "high",
        "rootCauses": [
          {
            "id": "rc_001",
            "category": "management",
            "description": "Insufficient resource planning and allocation",
            "confidence": 0.8,
            "evidence": ["Resource utilization metrics", "Team workload data"],
            "contributionWeight": 0.9
          }
        ],
        "affectedAreas": [
          {
            "id": "area_001",
            "name": "Team Productivity",
            "description": "Team performance and sustainability",
            "criticality": "high"
          }
        ],
        "estimatedImpact": {
          "id": "impact_001",
          "type": "team_morale",
          "level": "high",
          "description": "Team burnout risk and decreased productivity",
          "timeframe": "short-term",
          "affectedStakeholders": ["team-members", "project-manager"]
        },
        "confidence": 0.85
      }
    ],
    "process": [],
    "communication": [],
    "technology": [],
    "culture": [],
    "timeline": [],
    "quality": [],
    "budget": [],
    "skill": [],
    "governance": []
  },
  "overallHealthScore": 75,
  "prioritizedRecommendations": [
    {
      "id": "rec_001",
      "gapId": "gap_resource_001",
      "title": "Address Resource Over-utilization",
      "description": "Allocate additional resources or optimize current resource utilization",
      "priority": "high",
      "estimatedEffort": 36,
      "estimatedImpact": 0.85,
      "requiredResources": [
        "Project Manager",
        "HR Manager",
        "Additional Team Members"
      ],
      "timeline": "2-4 weeks",
      "dependencies": []
    }
  ],
  "executionTimeMs": 1250,
  "confidence": 0.87
}
```

#### Status Codes

- `200` - Success
- `404` - Project not found or no analysis available
- `500` - Failed to retrieve analysis results

---

## Data Models

### GapType Enum

- `resource` - Resource-related gaps (staffing, budget, equipment)
- `skill` - Skill and competency gaps
- `process` - Process and workflow gaps
- `technology` - Technology and tooling gaps
- `communication` - Communication and collaboration gaps

### SeverityLevel Enum

- `low` - Minor impact, can be addressed in regular planning cycles
- `medium` - Moderate impact, should be addressed within current sprint/iteration
- `high` - Significant impact, requires immediate attention and resources
- `critical` - Severe impact, requires urgent intervention and escalation

### Analysis Categories

- `operational` - Day-to-day operational issues
- `strategic` - Long-term strategic alignment issues
- `tactical` - Short-term tactical execution issues
- `technical` - Technical implementation and architecture issues
- `organizational` - Organizational structure and culture issues

## Error Handling

All endpoints return consistent error responses:

```json
{
  "statusCode": 400,
  "message": ["Validation error messages"],
  "error": "Bad Request"
}
```

## Rate Limiting

- Standard endpoints: 100 requests per minute
- Analysis endpoints: 10 requests per minute (due to computational intensity)

## Performance Metrics

- **Analysis Response Time**: < 2 seconds for standard projects
- **Prediction Accuracy**: > 85% for early warnings
- **System Uptime**: > 99.9% availability

## Integration Notes

### Gap Factory Service Refactoring

The GapFactoryService has been significantly refactored to improve performance and maintainability:

#### Key Changes

1. **Simplified Data Model**: Replaced complex nested structures with a streamlined `GapData` interface
2. **Type Safety**: Fixed import issues and proper enum usage from `types/database/gap.types`
3. **Reduced Complexity**: Eliminated redundant nested objects while preserving essential gap information
4. **Performance Optimization**: Faster gap creation and reduced memory footprint

#### New GapData Interface

```typescript
interface GapData {
  id?: string;
  projectId: string;
  title: string;
  description: string;
  type: GapType;
  category: GapCategory;
  severity: SeverityLevel;
  status: GapStatus;
  currentValue?: number | string;
  targetValue?: number | string;
  impact?: string;
  confidence?: number;
  userId: string;
  identifiedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
```

#### Factory Methods

The service provides three main factory methods:

- `createTimelineGap(current: ProjectState)`: Detects timeline delays and deviations
- `createResourceGap(current: ProjectState)`: Identifies resource over-utilization issues
- `createQualityGap(current: ProjectState)`: Detects quality metric violations

#### Severity Calculation Logic

- **Timeline Gaps**: HIGH severity for delays > 7 days, MEDIUM otherwise
- **Resource Gaps**: CRITICAL for utilization > 95%, HIGH otherwise
- **Quality Gaps**: CRITICAL for defect rate > 10%, HIGH otherwise

### Resource State Enhancement

The recent service update includes enhanced resource state tracking:

```typescript
resources: {
  utilization: number; // 0-1 scale
  available: number; // Total available resources
  allocated: number; // Currently allocated resources
  budget: {
    allocated: number; // Total budget allocated
    spent: number; // Amount spent so far
    remaining: number; // Remaining budget
    burnRate: number; // Current burn rate per period
  }
  team: {
    totalMembers: number; // Total team size
    activeMembers: number; // Currently active members
    capacity: number; // Total capacity in hours/week
    workload: number; // Current workload in hours/week
  }
}
```

This enhancement enables more accurate resource gap detection and better recommendations for resource optimization.
