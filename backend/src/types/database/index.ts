// Database Entity Types - Barrel Exports
// Re-export all types from separate files to maintain clean imports

// Project-related types
export * from './project.types';

// State-related types
export * from './state.types';

// Integration-related types
export * from './integration.types';

// User-related types
export * from './user.types';

// Gap Analysis types (excluding Priority to avoid conflict)
export type { GapEntity, Impact, ProjectArea, RootCause } from './gap.types';

// Export enums as values for use in decorators
export {
  CriticalityLevel,
  GapCategory,
  GapStatus,
  GapType,
  ImpactLevel,
  ImpactType,
  Priority,
  RootCauseCategory,
  SeverityLevel,
} from './gap.types';

// Prediction types
export * from './prediction.types';

// Alert types (explicit exports to avoid conflicts)
export type {
  AlertContextEntity,
  AlertEntity,
  AlertPriorityScoreEntity,
  HistoricalDataPointEntity,
  PreventiveActionEntity,
  RiskIndicatorEntity,
} from './alert.types';

export {
  AlertSeverity,
  AlertStatus,
  AlertType,
  IndicatorCategory,
} from './alert.types';

// Notification Entity
export interface NotificationEntity {
  id: string;
  tenantId: string;
  recipient: string;
  type: NotificationType;
  subject: string;
  message: string;
  status: NotificationStatus;
  sentAt?: Date;
  createdAt: Date;
}

// Notification-related enums
export enum NotificationType {
  EMAIL = 'email',
  IN_APP = 'in-app',
  WEBHOOK = 'webhook',
  SMS = 'sms',
  SLACK = 'slack',
  TEAMS = 'teams',
}

export enum NotificationStatus {
  PENDING = 'pending',
  SENT = 'sent',
  FAILED = 'failed',
  DELIVERED = 'delivered',
  READ = 'read',
}
