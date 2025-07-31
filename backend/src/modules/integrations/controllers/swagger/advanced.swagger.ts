import { ConnectionLifecycleSwaggerDocs } from './connection-lifecycle.swagger';
import { ConnectionManagementSwaggerDocs } from './connection-management.swagger';
import { ConnectionMonitoringSwaggerDocs } from './connection-monitoring.swagger';

/**
 * Advanced Swagger documentation combining all connection-related endpoints
 *
 * Service Architecture Overview:
 * The integrations module follows a service delegation pattern where the main IntegrationsService
 * orchestrates operations by delegating to specialized services:
 *
 * IntegrationsService (Main Orchestrator)
 * ├── IntegrationsCoreService (Core integration logic)
 * ├── IntegrationCrudService (CRUD operations)
 * ├── ConnectionManagementService (Connection management)
 * └── IntegrationTestingService (Connection testing)
 *
 * Documentation Structure:
 * - ConnectionManagementSwaggerDocs: Connection status and configuration operations
 * - ConnectionMonitoringSwaggerDocs: Health monitoring and performance tracking
 * - ConnectionLifecycleSwaggerDocs: Connection lifecycle operations (connect/disconnect/reconnect)
 *
 * Service Responsibilities:
 * - IntegrationsService: API request coordination and response formatting
 * - IntegrationsCoreService: Tool connectivity, data sync, and failure handling
 * - ConnectionManagementService: Connection status, health monitoring, configuration updates
 * - IntegrationCrudService: Database operations and entity management
 * - IntegrationTestingService: Connection validation and credential testing
 *
 * This architecture provides:
 * - Clear separation of concerns
 * - Improved maintainability and testability
 * - Consistent error handling across operations
 * - Scalable service composition
 */
export const AdvancedSwaggerDocs = {
  ...ConnectionManagementSwaggerDocs,
  ...ConnectionMonitoringSwaggerDocs,
  ...ConnectionLifecycleSwaggerDocs,
};
