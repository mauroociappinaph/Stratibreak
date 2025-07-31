# Integrations API Swagger Documentation Update

## Overview

Updated the OpenAPI documentation for the integrations module to properly reflect all endpoints, including the PUT endpoints that use the `Put` decorator imported in the controller.

## Changes Made

### 1. File Structure Reorganization

- **Created**: `backend/src/modules/integrations/controllers/swagger/advanced.swagger.ts`
- **Updated**: `backend/src/modules/integrations/controllers/integrations.swagger.ts`
- **Updated**: `backend/src/modules/integrations/controllers/swagger/index.ts`

### 2. Documentation Split

The large swagger documentation file was split to improve maintainability:

- **Main file**: Contains core integration operations (connect, sync, findByTypeAndProject)
- **Advanced file**: Contains connection management operations (getAllConnections, updateConnectionStatus, etc.)

### 3. PUT Endpoints Documentation

The following PUT endpoints are fully documented:

#### PUT `/connections/:connectionId/status`

- **Purpose**: Update connection status
- **Parameters**: connectionId (path parameter)
- **Body**: `{ status: string, reason?: string }`
- **Responses**: 200 (success), 404 (not found), 500 (server error)

#### PUT `/connections/:connectionId/configuration`

- **Purpose**: Update connection configuration
- **Parameters**: connectionId (path parameter)
- **Body**: `{ syncFrequency?: number, dataMapping?: unknown[], filters?: Record<string, unknown> }`
- **Responses**: 200 (success), 404 (not found), 500 (server error)

### 4. Complete Endpoint Coverage

All controller endpoints are now properly documented:

#### Basic CRUD Operations

- `POST /` - Create integration
- `GET /` - Find all integrations
- `GET /:id` - Find one integration
- `PATCH /:id` - Update integration
- `DELETE /:id` - Remove integration

#### Integration Operations

- `POST /:id/test` - Test connection
- `POST /connect` - Connect to external tool
- `POST /:connectionId/sync` - Sync data from integration
- `GET /type/:type/project/:projectId` - Find integrations by type and project

#### Connection Management

- `GET /connections` - Get all connections
- `GET /connections/:connectionId` - Get connection details
- `PUT /connections/:connectionId/status` - Update connection status
- `DELETE /connections/:connectionId` - Disconnect tool
- `POST /connections/:connectionId/reconnect` - Reconnect tool
- `GET /connections/:connectionId/health` - Get connection health
- `PUT /connections/:connectionId/configuration` - Update connection configuration
- `GET /connections/:connectionId/sync-history` - Get sync history

## Documentation Features

### Comprehensive Descriptions

Each endpoint includes:

- Clear summary and detailed description
- Parameter definitions with examples
- Request body schemas with examples
- Response schemas for all status codes
- Error handling documentation

### Examples and Use Cases

- Tool-specific connection examples (Jira, Asana, Trello)
- Real-world parameter values
- Error response examples
- Status code explanations

### Type Safety

- All DTOs properly referenced
- Enum values documented
- Schema validation included
- Response type definitions

## File Size Optimization

The main swagger file was reduced from 512 lines to under 150 lines by:

- Extracting advanced documentation to separate file
- Using spread operator to include advanced docs
- Maintaining clean imports and exports
- Following single responsibility principle

## Integration with Controller

The swagger documentation is properly integrated with the controller using decorators:

- `@SwaggerDocs.operation` for endpoint descriptions
- `@SwaggerDocs.param` for parameter documentation
- `@SwaggerDocs.body` for request body schemas
- `@SwaggerDocs.responses.*` for response documentation

## Validation

- TypeScript compilation successful
- All imports resolved correctly
- Documentation structure validated
- Controller-documentation mapping verified

This update ensures that the integrations API has comprehensive, maintainable, and accurate OpenAPI documentation that reflects all available endpoints and their proper usage.
