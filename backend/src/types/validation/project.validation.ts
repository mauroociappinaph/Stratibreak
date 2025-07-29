import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  ValidateNested,
} from 'class-validator';
import {
  GoalStatus,
  PermissionType,
  Priority,
  ProjectStatus,
  StakeholderRole,
} from '../database';

// Basic Project DTOs
export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  name: string;

  @IsString()
  @IsOptional()
  @Length(0, 1000)
  description?: string;

  @IsEnum(ProjectStatus)
  status: ProjectStatus;

  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectGoalDto)
  @ArrayMaxSize(50)
  goals: ProjectGoalDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StakeholderDto)
  @ArrayMaxSize(100)
  stakeholders: StakeholderDto[];
}

export class UpdateProjectDto {
  @IsString()
  @IsOptional()
  @Length(1, 255)
  name?: string;

  @IsString()
  @IsOptional()
  @Length(0, 1000)
  description?: string;

  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  startDate?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  endDate?: Date;
}

export class ProjectGoalDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  title: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 1000)
  description: string;

  @IsString()
  @IsNotEmpty()
  targetValue: string;

  @IsString()
  @IsOptional()
  currentValue?: string;

  @IsEnum(Priority)
  priority: Priority;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  dueDate?: Date;

  @IsEnum(GoalStatus)
  status: GoalStatus;
}

export class StakeholderDto {
  @IsUUID()
  userId: string;

  @IsEnum(StakeholderRole)
  role: StakeholderRole;

  @IsArray()
  @IsEnum(PermissionType, { each: true })
  @ArrayMinSize(1)
  permissions: PermissionType[];
}
