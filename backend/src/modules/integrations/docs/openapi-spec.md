# Integrations API OpenAPI Specification

## Overview

The Integrations API provides comprehensive functionality for managing external tool integrations within the AI-Powered Project Gap Analysis system. This API supports connecting to various project management and collaboration tools, synchronizing data, and maintaining integration health.

## Base Information

- **Base URL**: `/api/integrations`
- **API Version**: 1.0.0
- **Content Type**: `application/json`

## Supported Integration Types

- **JIRA**: Atlassian Jira project management
- **ASANA**: Asana task and project management
- **TRELLO**: Trello board-based project management
- **MONDAY**: Monday.com work management platform
- **BITRIX24**: Bitrix24 collaboration platform

## Authentication

All endpoints require valid authentication tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your-token>
```

## Endpoints

### 1. Create Integration

**POST** `/integrations`

Creates a new integration configuration for connecting to external tools.

#### Request Body

```json
{
  "name": "Main Jira Instance",
  "type": "JIRA",
  "projectId": "proj_123456789",
  "description": "Primary Jira instance for project management",
  "config": {
    "baseUrl": "https://company.atlassian.net",
    "timeout": 30000,
    "retryAttempts": 3
  }
}
```

#### Response (201 Created)

```json
{
  "id": "int_987654321",
  "name": "Main Jira Instance",
  "type": "JIRA",
  "projectId": "proj_123456789",
  "description": "Primary Jira instance for project management",
  "config": {
    "baseUrl": "https://company.atlassian.net",
    "timeout": 30000,
    "retryAttempts": 3
  },
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

### 2. Get All Integrations

**GET** `/integrations?projectId={projectId}`

Retrieves all integration configurations, optionally filtered by project.

#### Query Parameters

- `projectId` (optional): Filter integrations by project ID

#### Response (200 OK)

```json
[
  {
    "id": "int_987654321",
    "name": "Main Jira Instance",
    "type": "JIRA",
    "projectId": "proj_123456789",
    "description": "Primary Jira instance for project management",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
]
```

### 3. Get Integration by ID

**GET** `/integrations/{id}`

Retrieves a specific integration by its unique identifier.

#### Path Parameters

- `id`: Unique identifier of the integration

#### Response (200 OK)

```json
{
  "id": "int_987654321",
  "name": "Main Jira Instance",
  "type": "JIRA",
  "projectId": "proj_123456789",
  "description": "Primary Jira instance for project management",
  "config": {
    "baseUrl": "https://company.atlassian.net",
    "timeout": 30000,
    "retryAttempts": 3
  },
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

### 4. Update Integration

**PATCH** `/integrations/{id}`

Updates an existing integration configuration (partial updates supported).

#### Path Parameters

- `id`: Unique identifier of the integration to update

#### Request Body

```json
{
  "name": "Updated Jira Instance Name",
  "config": {
    "baseUrl": "https://newcompany.atlassian.net",
    "timeout": 45000,
    "retryAttempts": 5
  }
}
```

#### Response (200 OK)

```json
{
  "id": "int_987654321",
  "name": "Updated Jira Instance Name",
  "type": "JIRA",
  "projectId": "proj_123456789",
  "description": "Primary Jira instance for project management",
  "config": {
    "baseUrl": "https://newcompany.atlassian.net",
    "timeout": 45000,
    "retryAttempts": 5
  },
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T11:00:00Z"
}
```

### 5. Delete Integration

**DELETE** `/integrations/{id}`

Permanently deletes an integration configuration.

#### Path Parameters

- `id`: Unique identifier of the integration to delete

#### Response (204 No Content)

No response body.

### 6. Test Integration Connection

**POST** `/integrations/{id}/test`

Tests the connection to an external tool using the integration configuration.

#### Path Parameters

- `id`: Unique identifier of the integration to test

#### Response (200 OK)

```json
{
  "success": true,
  "message": "Connection test successful"
}
```

#### Error Response (200 OK)

```json
{
  "success": false,
  "message": "Missing required JIRA credentials"
}
```

### 7. Connect to External Tool

**POST** `/integrations/connect`

Establishes a connection to an external tool with credentials.

#### Request Body

```json
{
  "toolType": "JIRA",
  "credentials": {
    "baseUrl": "https://company.atlassian.net",
    "username": "user@company.com",
    "apiToken": "ATATT3xFfGF0..."
  }
}
```

#### Response (201 Created)

```json
{
  "connectionId": "jira_1640995200000_abc123",
  "status": "connected",
  "toolType": "JIRA",
  "message": "Connection established successfully",
  "lastSync": "2024-01-15T10:30:00Z"
}
```

### 8. Sync Data from Integration

**POST** `/integrations/{connectionId}/sync`

Synchronizes data from an external tool integration.

#### Path Parameters

- `connectionId`: Unique identifier of the connection to sync

#### Response (200 OK)

```json
{
  "connectionId": "jira_1640995200000_abc123",
  "status": "success",
  "recordsProcessed": 42,
  "errors": [],
  "lastSync": "2024-01-15T10:35:00Z"
}
```

### 9. Find Integrations by Type and Project

**GET** `/integrations/type/{type}/project/{projectId}`

Retrieves integrations filtered by tool type and project.

#### Path Parameters

- `type`: Integration tool type (JIRA, ASANA, TRELLO, MONDAY, BITRIX24)
- `projectId`: Project ID to filter integrations for

#### Response (200 OK)

```json
[
  {
    "id": "int_987654321",
    "name": "Main Jira Instance",
    "type": "JIRA",
    "projectId": "proj_123456789",
    "description": "Primary Jira instance for project management",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
]
```

## Error Responses

### 400 Bad Request

```json
{
  "error": "Validation failed",
  "message": ["name should not be empty", "type must be a valid enum value"],
  "statusCode": 400
}
```

### 404 Not Found

```json
{
  "error": "Integration not found",
  "message": "Integration with ID int_987654321 not found",
  "statusCode": 404
}
```

### 500 Internal Server Error

```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred",
  "statusCode": 500
}
```

## Data Models

### IntegrationEntity

```typescript
{
  id: string;                    // Unique identifier
  name: string;                  // Integration name
  type: IntegrationType;         // Tool type enum
  projectId: string;             // Associated project ID
  description?: string;          // Optional description
  config?: Record<string, any>;  // Configuration settings
  isActive: boolean;             // Active status
  createdAt: Date;              // Creation timestamp
  updatedAt: Date;              // Last update timestamp
}
```

### ConnectionResponse

```typescript
{
  connectionId: string;          // Unique connection identifier
  status: ConnectionStatus;      // Connection status enum
  toolType: string;             // Type of connected tool
  message: string;              // Status message
  lastSync?: Date;              // Last sync timestamp
}
```

### SyncResult

```typescript
{
  connectionId: string;          // Connection identifier
  status: SyncStatus;           // Sync status enum
  recordsProcessed: number;     // Number of records processed
  errors: string[];             // List of errors
  lastSync: Date;               // Sync completion timestamp
}
```

## Integration Configuration Examples

### Jira Configuration

```json
{
  "baseUrl": "https://company.atlassian.net",
  "timeout": 30000,
  "retryAttempts": 3,
  "rateLimiting": {
    "requestsPerMinute": 100,
    "burstLimit": 10
  }
}
```

### Asana Configuration

```json
{
  "timeout": 30000,
  "retryAttempts": 3,
  "rateLimiting": {
    "requestsPerMinute": 150,
    "burstLimit": 15
  }
}
```

### Trello Configuration

```json
{
  "timeout": 30000,
  "retryAttempts": 3,
  "rateLimiting": {
    "requestsPerMinute": 300,
    "burstLimit": 30
  }
}
```

## Rate Limiting

All endpoints are subject to rate limiting:

- **Standard endpoints**: 100 requests per minute
- **Sync endpoints**: 10 requests per minute
- **Connection test endpoints**: 20 requests per minute

Rate limit headers are included in responses:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995260
```

## Webhooks

The system supports webhooks for real-time integration events:

- **Connection established**: Triggered when a new connection is created
- **Sync completed**: Triggered when data synchronization completes
- **Connection error**: Triggered when connection issues occur
- **Data inconsistency**: Triggered when data validation fails

Webhook payloads include event type, timestamp, and relevant data.

## Security Considerations

- All credentials are encrypted at rest using AES-256 encryption
- API tokens are validated and refreshed automatically when possible
- Connection attempts are logged for security monitoring
- Failed authentication attempts trigger security alerts
- All API calls are logged with request/response details (excluding sensitive data)

## Monitoring and Health Checks

The system performs automatic health checks every 5 minutes:

- Connection status verification
- API endpoint availability testing
- Credential validation
- Sync performance monitoring
- Error rate tracking

Health check results are available through the connection status endpoints and system monitoring dashboards.
