// Database Entity Types
export interface ProjectEntity {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserEntity {
  id: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GapEntity {
  id: string;
  projectId: string;
  type: GapType;
  severity: SeverityLevel;
  description: string;
  currentValue: string;
  targetValue: string;
  identifiedAt: Date;
  resolvedAt?: Date;
}

export interface IntegrationEntity {
  id: string;
  tenantId: string;
  toolType: ToolType;
  connectionId: string;
  status: ConnectionStatus;
  credentials: Record<string, string>;
  lastSync?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PredictionEntity {
  id: string;
  projectId: string;
  type: string;
  probability: number;
  impact: ImpactLevel;
  description: string;
  estimatedTimeToOccurrence: string;
  createdAt: Date;
  resolvedAt?: Date;
}

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

// Enums
export enum ProjectStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ON_HOLD = 'on_hold',
  CANCELLED = 'cancelled',
}

export enum UserRole {
  ADMIN = 'admin',
  PROJECT_MANAGER = 'project_manager',
  TEAM_LEADER = 'team_leader',
  STAKEHOLDER = 'stakeholder',
  ANALYST = 'analyst',
}

export enum GapType {
  RESOURCE = 'resource',
  PROCESS = 'process',
  COMMUNICATION = 'communication',
  TECHNOLOGY = 'technology',
  CULTURE = 'culture',
  TIMELINE = 'timeline',
  QUALITY = 'quality',
}

export enum SeverityLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum ToolType {
  JIRA = 'jira',
  ASANA = 'asana',
  TRELLO = 'trello',
  MONDAY = 'monday',
  BITRIX24 = 'bitrix24',
}

export enum ConnectionStatus {
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  ERROR = 'error',
  PENDING = 'pending',
}

export enum ImpactLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum NotificationType {
  EMAIL = 'email',
  IN_APP = 'in-app',
  WEBHOOK = 'webhook',
}

export enum NotificationStatus {
  PENDING = 'pending',
  SENT = 'sent',
  FAILED = 'failed',
  DELIVERED = 'delivered',
}
