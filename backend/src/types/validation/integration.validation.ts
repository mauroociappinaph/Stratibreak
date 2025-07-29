import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import {
  BackoffStrategy,
  ConflictResolution,
  ConnectionStatus,
  ErrorType,
  FilterOperator,
  HealthStatus,
  SyncDirection,
  SyncFrequency,
  SyncStatus,
  ToolType,
} from '../database';

// Integration Validation Schemas
export class CreateIntegrationDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  name: string;

  @IsEnum(ToolType)
  toolType: ToolType;

  @ValidateNested()
  @Type(() => IntegrationConfigurationDto)
  configuration: IntegrationConfigurationDto;

  @IsObject()
  credentials: Record<string, string>;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FieldMappingDto)
  @ArrayMaxSize(100)
  dataMapping: FieldMappingDto[];

  @ValidateNested()
  @Type(() => SyncSettingsDto)
  syncSettings: SyncSettingsDto;
}

export class UpdateIntegrationDto {
  @IsString()
  @IsOptional()
  @Length(1, 255)
  name?: string;

  @IsEnum(ConnectionStatus)
  @IsOptional()
  status?: ConnectionStatus;

  @ValidateNested()
  @Type(() => IntegrationConfigurationDto)
  @IsOptional()
  configuration?: IntegrationConfigurationDto;

  @ValidateNested()
  @Type(() => SyncSettingsDto)
  @IsOptional()
  syncSettings?: SyncSettingsDto;
}

export class IntegrationConfigurationDto {
  @IsUrl()
  @IsOptional()
  baseUrl?: string;

  @IsString()
  @IsOptional()
  @Length(1, 50)
  apiVersion?: string;

  @IsInt()
  @Min(1000)
  @Max(300000)
  timeout: number;

  @IsInt()
  @Min(0)
  @Max(10)
  retryAttempts: number;

  @ValidateNested()
  @Type(() => RateLimitConfigDto)
  rateLimiting: RateLimitConfigDto;

  @IsUrl()
  @IsOptional()
  webhookUrl?: string;

  @IsObject()
  customFields: Record<string, unknown>;
}

export class SyncSettingsDto {
  @IsEnum(SyncFrequency)
  frequency: SyncFrequency;

  @IsEnum(SyncDirection)
  direction: SyncDirection;

  @IsEnum(ConflictResolution)
  conflictResolution: ConflictResolution;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DataFilterDto)
  @ArrayMaxSize(50)
  dataFilters: DataFilterDto[];

  @IsInt()
  @Min(1)
  @Max(1000)
  batchSize: number;

  @IsBoolean()
  enabled: boolean;
}

export class DataFilterDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  field: string;

  @IsEnum(FilterOperator)
  operator: FilterOperator;

  @IsString()
  @IsNotEmpty()
  value: string;

  @IsBoolean()
  active: boolean;
}

export class RateLimitConfigDto {
  @IsInt()
  @Min(1)
  @Max(10000)
  requestsPerMinute: number;

  @IsInt()
  @Min(1)
  @Max(1000)
  burstLimit: number;

  @IsEnum(BackoffStrategy)
  backoffStrategy: BackoffStrategy;
}

export class FieldMappingDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  localField: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  externalField: string;

  @IsString()
  @IsOptional()
  @Length(0, 500)
  transformation?: string;

  @IsBoolean()
  required: boolean;
}

export class HealthCheckResultDto {
  @IsEnum(HealthStatus)
  status: HealthStatus;

  @IsDate()
  @Type(() => Date)
  lastCheck: Date;

  @IsNumber()
  @Min(0)
  responseTime: number;

  @IsInt()
  @Min(0)
  errorCount: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  uptime: number;

  @IsObject()
  @IsOptional()
  details?: Record<string, unknown>;
}

export class SyncRecordDto {
  @IsDate()
  @Type(() => Date)
  startedAt: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  completedAt?: Date;

  @IsEnum(SyncStatus)
  status: SyncStatus;

  @IsInt()
  @Min(0)
  recordsProcessed: number;

  @IsInt()
  @Min(0)
  recordsCreated: number;

  @IsInt()
  @Min(0)
  recordsUpdated: number;

  @IsInt()
  @Min(0)
  recordsDeleted: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SyncErrorDto)
  @ArrayMaxSize(1000)
  errors: SyncErrorDto[];

  @IsNumber()
  @Min(0)
  duration: number;
}

export class SyncErrorDto {
  @IsEnum(ErrorType)
  errorType: ErrorType;

  @IsString()
  @IsNotEmpty()
  @Length(1, 1000)
  message: string;

  @IsObject()
  @IsOptional()
  details?: Record<string, unknown>;

  @IsString()
  @IsOptional()
  recordId?: string;

  @IsBoolean()
  retryable: boolean;

  @IsDate()
  @Type(() => Date)
  timestamp: Date;
}
