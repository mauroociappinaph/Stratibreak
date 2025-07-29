import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { MilestoneStatus, RiskLevel, TrendDirection } from '../database';

// Project State DTOs
export class ProjectStateDto {
  @IsNumber()
  @Min(0)
  @Max(100)
  progress: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  healthScore: number;

  @ValidateNested()
  @Type(() => ResourceStateDto)
  resources: ResourceStateDto;

  @ValidateNested()
  @Type(() => TimelineStateDto)
  timeline: TimelineStateDto;

  @ValidateNested()
  @Type(() => QualityStateDto)
  quality: QualityStateDto;

  @ValidateNested()
  @Type(() => RiskStateDto)
  risks: RiskStateDto;
}

export class ResourceStateDto {
  @IsNumber()
  @Min(0)
  allocated: number;

  @IsNumber()
  @Min(0)
  available: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  utilization: number;

  @ValidateNested()
  @Type(() => BudgetStateDto)
  budget: BudgetStateDto;

  @ValidateNested()
  @Type(() => TeamStateDto)
  team: TeamStateDto;
}

export class BudgetStateDto {
  @IsNumber()
  @Min(0)
  allocated: number;

  @IsNumber()
  @Min(0)
  spent: number;

  @IsNumber()
  @Min(0)
  remaining: number;

  @IsNumber()
  @Min(0)
  burnRate: number;
}

export class TeamStateDto {
  @IsInt()
  @Min(1)
  totalMembers: number;

  @IsInt()
  @Min(0)
  activeMembers: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  capacity: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  workload: number;
}

export class TimelineStateDto {
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  currentDate: Date;

  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @IsNumber()
  @Min(0)
  @Max(100)
  progress: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MilestoneDto)
  @ArrayMaxSize(100)
  milestones: MilestoneDto[];

  @IsInt()
  @Min(0)
  delays: number;
}

export class QualityStateDto {
  @IsNumber()
  @Min(0)
  @Max(100)
  currentScore: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  defectRate: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  testCoverage: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  codeQuality: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  customerSatisfaction?: number;
}

export class RiskStateDto {
  @IsEnum(RiskLevel)
  overallRisk: RiskLevel;

  @IsInt()
  @Min(0)
  activeRisks: number;

  @IsInt()
  @Min(0)
  mitigatedRisks: number;

  @IsEnum(TrendDirection)
  riskTrend: TrendDirection;
}

export class MilestoneDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  name: string;

  @IsString()
  @IsOptional()
  @Length(0, 1000)
  description?: string;

  @IsDate()
  @Type(() => Date)
  targetDate: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  actualDate?: Date;

  @IsEnum(MilestoneStatus)
  status: MilestoneStatus;

  @IsArray()
  @IsUUID(undefined, { each: true })
  @ArrayMaxSize(50)
  dependencies: string[];
}
