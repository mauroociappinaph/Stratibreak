# Gap Analysis API Documentation - Updated

## Overview

The Gap Analysis API provides comprehensive project gap analysis capabilities with AI-powered insights. This documentation reflects the latest service architecture changes including the separation of concerns between services and the introduction of specialized factory and analyzer services.

## Service Architecture

### Core Services

1. **GapAnalysisService** - Main business logic for gap analysis
2. **GapRepository** - Database operations and CRUD functionality
3. **ProjectStateAnalyzerService** - Analyzes project state and identifies system-level gaps
4. **GapFactoryService** - Creates standardized gap objects from project data
5. **RecommendationService** - Generates actionable recommendations
6. **ProjectDataService** - Handles project data fetching and analysis record storage

## API Endpoints

### 1. Create Gap Analysis

**POST** `/gap-analysis`

Creates a new gap analysis record manually.

#### Request Body

```typescript
{
  projectId: string;
  title: string;
  description: string;
  type: 'resource' |
    'process' |
    'communication' |
    'technology' |
    'culture' |
    'timeline' |
    'quality' |
    'budget' |
    'skill' |
    'governance';
  severity: 'low' | 'medium' | 'high' | 'critical';
}
```

#### Response

```typescript
{
  id: string;
  projectId: string;
  title: string;
  description: string;
  type: GapType;
  severity: SeverityLevel;
  createdAt: string;
  updatedAt: string;
}
```

### 2. Get All Gap Analyses

**GET** `/gap-analysis`

Retrieves all gap analysis records across all projects.

#### Response

```typescript
GapAnalysisEntity[]
```

### 3. Get Gap Analysis by ID

**GET** `/gap-analysis/:id`

Retrieves a specific gap analysis record.

#### Parameters

- `id` (string): Unique identifier of the gap analysis

#### Response

```typescript
GapAnalysisEntity;
```

### 4. Update Gap Analysis

**PATCH** `/gap-analysis/:id`

Updates an existing gap analysis record.

#### Parameters

- `id` (string): Unique identifier of the gap analysis

#### Request Body

```typescript
{
  title?: string;
  description?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}
```

#### Response

```typescript
GapAnalysisEntity;
```

### 5. Delete Gap Analysis

**DELETE** `/gap-analysis/:id`

Permanently deletes a gap analysis record.

#### Parameters

- `id` (string): Unique identifier of the gap analysis

#### Response

- Status: 204 No Content

### 6. Perform Automated Gap Analysis

**POST** `/gap-analysis/:projectId/analyze`

Performs comprehensive AI-powered gap analysis on a project using the new service architecture.

#### Parameters

- `projectId` (string): Unique identifier of the project to analyze

#### Process Flow

1. **ProjectDataService** fetches project data
2. **ProjectStateAnalyzerService** analyzes current state vs goals
3. **GapFactoryService** creates standardized gap objects
4. **GapAnalysisService** performs comprehensive analysis
5. **RecommendationService** generates actionable recommendations
6. **ProjectDataService** stores analysis record

#### Response

```typescript
{
  projectId: string;
  analysisTimestamp: string; // ISO date
  identifiedGaps: SimpleGapDto[];
  overallConfidence: number; // 0-1
  executionTimeMs: number;
  summary: {
    totalGaps: number;
    criticalGaps: number;
    highSeverityGaps: number;
    averageConfidence: number;
  };
}
```

#### SimpleGapDto Structure

```typescript
{
  projectId: string;
  title: string;
  description: string;
  type: GapType;
  category: GapCategory;
  severity: SeverityLevel;
  status: GapStatus;
  currentValue: number | string;
  targetValue: number | string;
  impact: string;
  confidence: number; // 0-1
  userId: string;
}
```

### 7. Get Detailed Gap Analysis

**GET** `/gap-analysis/:projectId/detailed-analysis`

Retrieves comprehensive gap analysis results with detailed root cause analysis and recommendations.

#### Parameters

- `projectId` (string): Unique identifier of the project

#### Response

```typescript
{
  projectId: string;
  analysisTimestamp: string;
  identifiedGaps: CategorizedGapsDto;
  overallHealthScore: number; // 0-100
  prioritizedRecommendations: RecommendationDto[];
  executionTimeMs: number;
  confidence: number; // 0-1
}
```

#### CategorizedGapsDto Structure

```typescript
{
  resource: DetailedGapDto[];
  process: DetailedGapDto[];
  communication: DetailedGapDto[];
  technology: DetailedGapDto[];
  culture: DetailedGapDto[];
  timeline: DetailedGapDto[];
  quality: DetailedGapDto[];
  budget: DetailedGapDto[];
  skill: DetailedGapDto[];
  governance: DetailedGapDto[];
  categoryMetrics: Record<string, GapCategoryMetricsDto>;
  summary: {
    totalGaps: number;
    criticalGaps: number;
    highPriorityGaps: number;
    averageConfidence: number;
    mostAffectedCategory: string;
    leastAffectedCategory: string;
  };
}
```

#### DetailedGapDto Structure

```typescript
{
  id?: string;
  projectId: string;
  type: GapType;
  category: string;
  title: string;
  description: string;
  currentValue: number | string;
  targetValue: number | string;
  variance: number;
  severity: SeverityLevel;
  status: string;
  rootCauses: RootCauseDto[];
  affectedAreas: ProjectAreaDto[];
  estimatedImpact: ImpactDto;
  confidence: number;
  priority: string;
  tags: string[];
  identifiedAt: string;
  identifiedBy: string;
}
```

#### RecommendationDto Structure

```typescript
{
  id: string;
  gapId: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedEffort: number; // hours
  estimatedImpact: number; // 0-1
  requiredResources: string[];
  timeline: string;
  dependencies: string[];
}
```

## Service-Specific Data Structures

### ProjectStateAnalyzerService

Analyzes project state and identifies gaps through:

#### Gap Detection Methods

- `analyzeGoalGap(current: ProjectState, goal: ProjectGoal)` - Compares current state vs specific goals
- `analyzeSystemLevelGaps(current: ProjectState)` - Identifies system-wide issues

#### Gap Types Detected

- **Timeline Gaps**: Delays in project delivery
- **Resource Gaps**: Over/under-utilization of resources
- **Quality Gaps**: Defect rates above acceptable thresholds

### GapFactoryService

Creates standardized gap objects with:

#### Factory Methods

- `createTimelineGap(current: ProjectState)` - Creates timeline-related gaps
- `createResourceGap(current: ProjectState)` - Creates resource-related gaps
- `createQualityGap(current: ProjectState)` - Creates quality-related gaps

#### Severity Calculation

- **Timeline**: > 7 days delay = HIGH, otherwise MEDIUM
- **Resource**: > 95% utilization = CRITICAL, > 90% = HIGH
- **Quality**: > 10% defect rate = CRITICAL, > 5% = HIGH

### RecommendationService

Generates actionable recommendations with:

#### Recommendation Generation

- Maps gap types to specific recommendation templates
- Calculates effort estimates based on severity
- Identifies required resources by gap type
- Provides timeline estimates

#### Effort Estimation

- **Critical**: 40 hours base effort
- **High**: 24 hours base effort
- **Medium**: 16 hours base effort
- **Low**: 8 hours base effort

## Error Handling

### Common Error Responses

#### 400 Bad Request

```typescript
{
  statusCode: 400;
  message: string[];
  error: "Bad Request";
}
```

#### 404 Not Found

```typescript
{
  statusCode: 404;
  message: string;
  error: 'Not Found';
}
```

#### 500 Internal Server Error

```typescript
{
  statusCode: 500;
  message: string;
  error: 'Internal Server Error';
}
```

## Performance Characteristics

### Analysis Performance

- **Automated Analysis**: < 2 seconds typical execution time
- **Detailed Analysis**: < 3 seconds with full root cause analysis
- **Confidence Scores**: 0.8+ typical confidence levels

### Data Processing

- **Project State Analysis**: Real-time processing of current metrics
- **Gap Factory**: Standardized gap creation with consistent severity calculation
- **Recommendation Engine**: Context-aware recommendation generation

## Integration Points

### Database Layer

- **GapRepository**: Handles all CRUD operations
- **ProjectDataService**: Manages project data and analysis records
- **Prisma ORM**: Type-safe database operations

### External Services

- **ML Services**: Future integration for advanced prediction models
- **Integration APIs**: Jira, Asana, and other project management tools

## Security Considerations

### Authentication

- JWT-based authentication for all endpoints
- User context preserved in gap creation and analysis

### Authorization

- Role-based access control for gap analysis operations
- Tenant isolation for multi-tenant deployments

### Data Privacy

- Sensitive project data encrypted at rest
- Analysis results tied to specific user contexts

## Monitoring and Observability

### Metrics Tracked

- Analysis execution times
- Gap identification accuracy
- Recommendation effectiveness
- Service performance metrics

### Logging

- Structured logging for all service operations
- Error tracking and alerting
- Performance monitoring and optimization

This documentation reflects the current state of the Gap Analysis API with the new service architecture and provides comprehensive information for API consumers and developers.
