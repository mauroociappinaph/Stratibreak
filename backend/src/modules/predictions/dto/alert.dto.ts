import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { RiskIndicatorDto } from './risk-indicator.dto';

export enum AlertType {
  RISK = 'risk',
  OPPORTUNITY = 'opportunity',
  ANOMALY = 'anomaly',
  THRESHOLD_BREACH = 'threshold_breach',
  TREND_CHANGE = 'trend_change',
  PREDICTION = 'prediction',
}

export enum AlertSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum AlertStatus {
  ACTIVE = 'active',
  ACKNOWLEDGED = 'acknowledged',
  RESOLVED = 'resolved',
  DISMISSED = 'dismissed',
  EXPIRED = 'expired',
}

export enum ImpactLevel {
  MINIMAL = 'minimal',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  SEVERE = 'severe',
}

export class DurationDto {
  @IsNumber()
  @Min(0)
  value: number;

  @IsEnum(['minutes', 'hours', 'days', 'weeks', 'months'])
  unit: 'minutes' | 'hours' | 'days' | 'weeks' | 'months';
}

export class PreventiveActionDto {
  @IsString()
  id: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(AlertSeverity)
  priority: AlertSeverity;

  @IsString()
  estimatedEffort: string;

  @IsArray()
  @IsString({ each: true })
  requiredResources: string[];

  @IsString()
  expectedImpact: string;

  @IsOptional()
  @IsDateString()
  deadline?: string;

  @IsNumber()
  @Min(0)
  @Max(1)
  effectiveness: number; // Expected effectiveness of this action (0-1)
}

export class AlertContextDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RiskIndicatorDto)
  triggeringIndicators: RiskIndicatorDto[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  historicalPatterns?: string[]; // References to similar historical patterns

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  relatedAlerts?: string[]; // IDs of related active alerts

  @IsOptional()
  @IsString()
  rootCause?: string; // Identified root cause if available
}

export class AlertDto {
  @IsString()
  id: string;

  @IsString()
  projectId: string;

  @IsEnum(AlertType)
  type: AlertType;

  @IsEnum(AlertSeverity)
  severity: AlertSeverity;

  @IsEnum(AlertStatus)
  status: AlertStatus;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  @Max(1)
  probability: number; // Probability of occurrence (0-1)

  @IsNumber()
  @Min(0)
  @Max(1)
  confidence: number; // Confidence in the prediction (0-1)

  @ValidateNested()
  @Type(() => DurationDto)
  estimatedTimeToOccurrence: DurationDto;

  @IsEnum(ImpactLevel)
  potentialImpact: ImpactLevel;

  @ValidateNested()
  @Type(() => DurationDto)
  preventionWindow: DurationDto; // Time window for prevention

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PreventiveActionDto)
  suggestedActions: PreventiveActionDto[];

  @ValidateNested()
  @Type(() => AlertContextDto)
  context: AlertContextDto;

  @IsDateString()
  createdAt: string;

  @IsDateString()
  expiresAt: string;

  @IsOptional()
  @IsDateString()
  acknowledgedAt?: string;

  @IsOptional()
  @IsString()
  acknowledgedBy?: string;

  @IsOptional()
  @IsDateString()
  resolvedAt?: string;

  @IsOptional()
  @IsString()
  resolvedBy?: string;

  @IsOptional()
  @IsString()
  resolutionNotes?: string;
}

export class AlertPriorityScoreDto {
  @IsString()
  alertId: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  overallScore: number; // Combined priority score (0-100)

  @IsNumber()
  @Min(0)
  @Max(1)
  impactScore: number; // Impact component (0-1)

  @IsNumber()
  @Min(0)
  @Max(1)
  probabilityScore: number; // Probability component (0-1)

  @IsNumber()
  @Min(0)
  @Max(1)
  preventionCapacityScore: number; // Prevention capacity component (0-1)

  @IsNumber()
  @Min(0)
  @Max(1)
  urgencyScore: number; // Time urgency component (0-1)

  @IsString()
  reasoning: string; // Explanation of the priority calculation
}

export class CreateAlertDto {
  @IsString()
  projectId: string;

  @IsEnum(AlertType)
  type: AlertType;

  @IsEnum(AlertSeverity)
  severity: AlertSeverity;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  @Max(1)
  probability: number;

  @ValidateNested()
  @Type(() => DurationDto)
  estimatedTimeToOccurrence: DurationDto;

  @IsEnum(ImpactLevel)
  potentialImpact: ImpactLevel;

  @ValidateNested()
  @Type(() => DurationDto)
  preventionWindow: DurationDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PreventiveActionDto)
  suggestedActions: PreventiveActionDto[];

  @ValidateNested()
  @Type(() => AlertContextDto)
  context: AlertContextDto;

  @IsDateString()
  expiresAt: string;
}

export class UpdateAlertDto {
  @IsOptional()
  @IsEnum(AlertStatus)
  status?: AlertStatus;

  @IsOptional()
  @IsString()
  acknowledgedBy?: string;

  @IsOptional()
  @IsString()
  resolvedBy?: string;

  @IsOptional()
  @IsString()
  resolutionNotes?: string;
}

export class AlertSummaryDto {
  @IsString()
  projectId: string;

  @IsNumber()
  totalAlerts: number;

  @IsNumber()
  activeAlerts: number;

  @IsNumber()
  criticalAlerts: number;

  @IsNumber()
  highPriorityAlerts: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  overallRiskLevel: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AlertDto)
  topPriorityAlerts: AlertDto[]; // Top 5 highest priority alerts

  @IsDateString()
  lastUpdated: string;
}
