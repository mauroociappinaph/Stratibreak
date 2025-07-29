import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { NotificationStatus, NotificationType, Priority } from '../database';

// Notification Validation Schemas
export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  recipient: string;

  @IsEnum(NotificationType)
  type: NotificationType;

  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  subject: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 5000)
  message: string;

  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>;
}

export class UpdateNotificationDto {
  @IsEnum(NotificationStatus)
  @IsOptional()
  status?: NotificationStatus;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  sentAt?: Date;
}

export class NotificationFiltersDto {
  @IsEnum(NotificationType)
  @IsOptional()
  type?: NotificationType;

  @IsEnum(NotificationStatus)
  @IsOptional()
  status?: NotificationStatus;

  @ValidateNested()
  @Type(() => DateRangeDto)
  @IsOptional()
  dateRange?: DateRangeDto;
}

export class DateRangeDto {
  @IsDate()
  @Type(() => Date)
  start: Date;

  @IsDate()
  @Type(() => Date)
  end: Date;
}
