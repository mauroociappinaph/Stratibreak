import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
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
import {
  CriticalityLevel,
  GapCategory,
  GapStatus,
  GapType,
  ImpactLevel,
  ImpactType,
  Priority,
  RootCauseCategory,
  SeverityLevel,
} from '../database';

// Gap Validation Schemas
export class CreateGapDto {
  @IsUUID()
  projectId: string;

  @IsEnum(GapType)
  type: GapType;

  @IsEnum(GapCategory)
  category: GapCategory;

  @IsEnum(SeverityLevel)
  severity: SeverityLevel;

  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  title: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 2000)
  description: string;

  @IsString()
  @IsNotEmpty()
  currentValue: string;

  @IsString()
  @IsNotEmpty()
  targetValue: string;

  @IsNumber()
  variance: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RootCauseDto)
  @ArrayMaxSize(20)
  rootCauses: RootCauseDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectAreaDto)
  @ArrayMaxSize(10)
  affectedAreas: ProjectAreaDto[];

  @ValidateNested()
  @Type(() => ImpactDto)
  estimatedImpact: ImpactDto;

  @IsEnum(Priority)
  priority: Priority;

  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(20)
  tags: string[];
}

export class UpdateGapDto {
  @IsEnum(GapStatus)
  @IsOptional()
  status?: GapStatus;

  @IsEnum(SeverityLevel)
  @IsOptional()
  severity?: SeverityLevel;

  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;

  @IsString()
  @IsOptional()
  @Length(1, 2000)
  description?: string;

  @IsString()
  @IsOptional()
  currentValue?: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(20)
  @IsOptional()
  tags?: string[];
}

export class RootCauseDto {
  @IsEnum(RootCauseCategory)
  category: RootCauseCategory;

  @IsString()
  @IsNotEmpty()
  @Length(1, 1000)
  description: string;

  @IsNumber()
  @Min(0)
  @Max(1)
  confidence: number;

  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(10)
  evidence: string[];

  @IsNumber()
  @Min(0)
  @Max(1)
  contributionWeight: number;
}

export class ImpactDto {
  @IsEnum(ImpactType)
  type: ImpactType;

  @IsEnum(ImpactLevel)
  level: ImpactLevel;

  @IsString()
  @IsNotEmpty()
  @Length(1, 1000)
  description: string;

  @IsNumber()
  @IsOptional()
  quantitativeValue?: number;

  @IsString()
  @IsOptional()
  @Length(1, 50)
  unit?: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  timeframe: string;

  @IsArray()
  @IsUUID(undefined, { each: true })
  @ArrayMaxSize(50)
  affectedStakeholders: string[];
}

export class ProjectAreaDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 1000)
  description: string;

  @IsUUID()
  @IsOptional()
  owner?: string;

  @IsEnum(CriticalityLevel)
  criticality: CriticalityLevel;
}
