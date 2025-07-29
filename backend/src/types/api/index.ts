// API Types
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  timestamp: Date;
}

export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
  timestamp: Date;
}

// Auth API Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

// Gap Analysis API Types
export interface ProjectAnalysisRequest {
  projectId: string;
  projectName: string;
  data: Record<string, unknown>;
}

export interface GapAnalysisResponse {
  projectId: string;
  gaps: Gap[];
  recommendations: Recommendation[];
  analysisTimestamp: Date;
}

export interface Gap {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  currentValue: unknown;
  targetValue: unknown;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  estimatedEffort: string;
}

// Integration API Types
export interface ConnectionRequest {
  toolType: string;
  credentials: Record<string, string>;
  configuration?: Record<string, unknown>;
}

export interface ConnectionResponse {
  connectionId: string;
  status: 'connected' | 'failed' | 'pending';
  toolType: string;
  lastSync?: Date;
}

// Prediction API Types
export interface PredictionRequest {
  projectId: string;
  historicalData: Record<string, unknown>;
  timeframe?: string;
}

export interface PredictionResponse {
  predictions: Prediction[];
  riskLevel: 'low' | 'medium' | 'high';
  confidence: number;
  generatedAt: Date;
}

export interface Prediction {
  id: string;
  type: string;
  probability: number;
  impact: 'low' | 'medium' | 'high';
  description: string;
  estimatedTimeToOccurrence: string;
}

// Notification API Types
export interface NotificationRequest {
  recipient: string;
  type: 'email' | 'in-app' | 'webhook';
  subject: string;
  message: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface NotificationResponse {
  notificationId: string;
  status: 'sent' | 'pending' | 'failed';
  recipient: string;
  sentAt?: Date;
}
