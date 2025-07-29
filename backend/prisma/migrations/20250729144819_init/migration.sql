-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'PROJECT_MANAGER', 'TEAM_LEADER', 'STAKEHOLDER', 'ANALYST');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'COMPLETED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "GapType" AS ENUM ('RESOURCE', 'PROCESS', 'COMMUNICATION', 'TECHNOLOGY', 'CULTURE', 'TIMELINE', 'QUALITY', 'SKILL', 'BUDGET');

-- CreateEnum
CREATE TYPE "Severity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "GapStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "PredictionType" AS ENUM ('DELAY_RISK', 'RESOURCE_SHORTAGE', 'QUALITY_ISSUE', 'BUDGET_OVERRUN', 'SCOPE_CREEP', 'TEAM_BURNOUT');

-- CreateEnum
CREATE TYPE "PredictionStatus" AS ENUM ('PENDING', 'CONFIRMED', 'FALSE_POSITIVE', 'RESOLVED');

-- CreateEnum
CREATE TYPE "IntegrationType" AS ENUM ('JIRA', 'ASANA', 'TRELLO', 'MONDAY', 'BITRIX24', 'SLACK', 'GITHUB', 'GITLAB', 'TEAMS');

-- CreateEnum
CREATE TYPE "IntegrationStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ERROR', 'SYNCING');

-- CreateEnum
CREATE TYPE "TrendDirection" AS ENUM ('UP', 'DOWN', 'STABLE', 'VOLATILE');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('VIEW_GAP_ANALYSIS', 'MODIFY_PROJECT', 'ACCESS_PREDICTION', 'EXPORT_DATA', 'CONFIGURE_INTEGRATION', 'CREATE_USER', 'UPDATE_USER', 'DELETE_USER', 'LOGIN', 'LOGOUT');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'STAKEHOLDER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "ProjectStatus" NOT NULL DEFAULT 'ACTIVE',
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gaps" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "GapType" NOT NULL,
    "severity" "Severity" NOT NULL,
    "status" "GapStatus" NOT NULL DEFAULT 'OPEN',
    "currentValue" JSONB,
    "targetValue" JSONB,
    "impact" TEXT,
    "identifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "projectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "gaps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "predictions" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "PredictionType" NOT NULL,
    "probability" DOUBLE PRECISION NOT NULL,
    "impact" "Severity" NOT NULL,
    "status" "PredictionStatus" NOT NULL DEFAULT 'PENDING',
    "predictedAt" TIMESTAMP(3) NOT NULL,
    "actualAt" TIMESTAMP(3),
    "accuracy" DOUBLE PRECISION,
    "estimatedTimeToOccurrence" INTEGER,
    "preventionWindow" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "projectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "predictions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "integrations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "IntegrationType" NOT NULL,
    "status" "IntegrationStatus" NOT NULL DEFAULT 'INACTIVE',
    "config" JSONB NOT NULL,
    "credentials" JSONB NOT NULL,
    "lastSyncAt" TIMESTAMP(3),
    "syncInterval" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "errorCount" INTEGER NOT NULL DEFAULT 0,
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "projectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "integrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenants" (
    "id" TEXT NOT NULL,
    "organizationName" TEXT NOT NULL,
    "dataEncryptionKey" TEXT NOT NULL,
    "retentionPolicyDays" INTEGER NOT NULL DEFAULT 365,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_stakeholders" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "project_stakeholders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_goals" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "targetValue" JSONB NOT NULL,
    "currentValue" JSONB,
    "dueDate" TIMESTAMP(3),
    "isAchieved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "project_goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analysis_records" (
    "id" TEXT NOT NULL,
    "analysisType" TEXT NOT NULL,
    "results" JSONB NOT NULL,
    "overallScore" DOUBLE PRECISION,
    "executionTime" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "analysis_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "root_causes" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "gapId" TEXT NOT NULL,

    CONSTRAINT "root_causes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_areas" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "impactLevel" "Severity" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "gapId" TEXT NOT NULL,

    CONSTRAINT "project_areas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "preventive_actions" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priority" "Severity" NOT NULL,
    "estimatedEffort" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "predictionId" TEXT NOT NULL,

    CONSTRAINT "preventive_actions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "risk_indicators" (
    "id" TEXT NOT NULL,
    "indicator" TEXT NOT NULL,
    "currentValue" DOUBLE PRECISION NOT NULL,
    "threshold" DOUBLE PRECISION NOT NULL,
    "trend" "TrendDirection" NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "predictionId" TEXT NOT NULL,

    CONSTRAINT "risk_indicators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sync_results" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "recordsSync" INTEGER NOT NULL DEFAULT 0,
    "errorMessage" TEXT,
    "syncDuration" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "integrationId" TEXT NOT NULL,

    CONSTRAINT "sync_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "field_mappings" (
    "id" TEXT NOT NULL,
    "externalField" TEXT NOT NULL,
    "internalField" TEXT NOT NULL,
    "transformation" TEXT,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "integrationId" TEXT NOT NULL,

    CONSTRAINT "field_mappings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "action" "AuditAction" NOT NULL,
    "resourceType" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "dataHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE INDEX "users_tenantId_idx" ON "users"("tenantId");

-- CreateIndex
CREATE INDEX "users_email_tenantId_idx" ON "users"("email", "tenantId");

-- CreateIndex
CREATE INDEX "users_role_tenantId_idx" ON "users"("role", "tenantId");

-- CreateIndex
CREATE INDEX "users_isActive_tenantId_idx" ON "users"("isActive", "tenantId");

-- CreateIndex
CREATE INDEX "users_createdAt_idx" ON "users"("createdAt");

-- CreateIndex
CREATE INDEX "projects_tenantId_idx" ON "projects"("tenantId");

-- CreateIndex
CREATE INDEX "projects_userId_tenantId_idx" ON "projects"("userId", "tenantId");

-- CreateIndex
CREATE INDEX "projects_status_tenantId_idx" ON "projects"("status", "tenantId");

-- CreateIndex
CREATE INDEX "projects_startDate_endDate_idx" ON "projects"("startDate", "endDate");

-- CreateIndex
CREATE INDEX "projects_createdAt_idx" ON "projects"("createdAt");

-- CreateIndex
CREATE INDEX "projects_name_tenantId_idx" ON "projects"("name", "tenantId");

-- CreateIndex
CREATE INDEX "gaps_projectId_idx" ON "gaps"("projectId");

-- CreateIndex
CREATE INDEX "gaps_userId_idx" ON "gaps"("userId");

-- CreateIndex
CREATE INDEX "gaps_type_severity_idx" ON "gaps"("type", "severity");

-- CreateIndex
CREATE INDEX "gaps_status_projectId_idx" ON "gaps"("status", "projectId");

-- CreateIndex
CREATE INDEX "gaps_identifiedAt_idx" ON "gaps"("identifiedAt");

-- CreateIndex
CREATE INDEX "gaps_createdAt_idx" ON "gaps"("createdAt");

-- CreateIndex
CREATE INDEX "predictions_projectId_idx" ON "predictions"("projectId");

-- CreateIndex
CREATE INDEX "predictions_userId_idx" ON "predictions"("userId");

-- CreateIndex
CREATE INDEX "predictions_type_status_idx" ON "predictions"("type", "status");

-- CreateIndex
CREATE INDEX "predictions_probability_impact_idx" ON "predictions"("probability", "impact");

-- CreateIndex
CREATE INDEX "predictions_predictedAt_idx" ON "predictions"("predictedAt");

-- CreateIndex
CREATE INDEX "predictions_status_predictedAt_idx" ON "predictions"("status", "predictedAt");

-- CreateIndex
CREATE INDEX "predictions_createdAt_idx" ON "predictions"("createdAt");

-- CreateIndex
CREATE INDEX "integrations_projectId_idx" ON "integrations"("projectId");

-- CreateIndex
CREATE INDEX "integrations_userId_idx" ON "integrations"("userId");

-- CreateIndex
CREATE INDEX "integrations_type_status_idx" ON "integrations"("type", "status");

-- CreateIndex
CREATE INDEX "integrations_isActive_status_idx" ON "integrations"("isActive", "status");

-- CreateIndex
CREATE INDEX "integrations_lastSyncAt_idx" ON "integrations"("lastSyncAt");

-- CreateIndex
CREATE INDEX "integrations_createdAt_idx" ON "integrations"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "integrations_projectId_type_key" ON "integrations"("projectId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "tenants_organizationName_key" ON "tenants"("organizationName");

-- CreateIndex
CREATE INDEX "tenants_isActive_idx" ON "tenants"("isActive");

-- CreateIndex
CREATE INDEX "tenants_createdAt_idx" ON "tenants"("createdAt");

-- CreateIndex
CREATE INDEX "project_stakeholders_projectId_idx" ON "project_stakeholders"("projectId");

-- CreateIndex
CREATE INDEX "project_stakeholders_email_idx" ON "project_stakeholders"("email");

-- CreateIndex
CREATE UNIQUE INDEX "project_stakeholders_projectId_email_key" ON "project_stakeholders"("projectId", "email");

-- CreateIndex
CREATE INDEX "project_goals_projectId_idx" ON "project_goals"("projectId");

-- CreateIndex
CREATE INDEX "project_goals_isAchieved_projectId_idx" ON "project_goals"("isAchieved", "projectId");

-- CreateIndex
CREATE INDEX "project_goals_dueDate_idx" ON "project_goals"("dueDate");

-- CreateIndex
CREATE INDEX "analysis_records_projectId_idx" ON "analysis_records"("projectId");

-- CreateIndex
CREATE INDEX "analysis_records_analysisType_projectId_idx" ON "analysis_records"("analysisType", "projectId");

-- CreateIndex
CREATE INDEX "analysis_records_createdAt_idx" ON "analysis_records"("createdAt");

-- CreateIndex
CREATE INDEX "analysis_records_overallScore_idx" ON "analysis_records"("overallScore");

-- CreateIndex
CREATE INDEX "root_causes_gapId_idx" ON "root_causes"("gapId");

-- CreateIndex
CREATE INDEX "root_causes_category_idx" ON "root_causes"("category");

-- CreateIndex
CREATE INDEX "root_causes_confidence_idx" ON "root_causes"("confidence");

-- CreateIndex
CREATE INDEX "project_areas_gapId_idx" ON "project_areas"("gapId");

-- CreateIndex
CREATE INDEX "project_areas_impactLevel_idx" ON "project_areas"("impactLevel");

-- CreateIndex
CREATE INDEX "preventive_actions_predictionId_idx" ON "preventive_actions"("predictionId");

-- CreateIndex
CREATE INDEX "preventive_actions_priority_idx" ON "preventive_actions"("priority");

-- CreateIndex
CREATE INDEX "risk_indicators_predictionId_idx" ON "risk_indicators"("predictionId");

-- CreateIndex
CREATE INDEX "risk_indicators_indicator_idx" ON "risk_indicators"("indicator");

-- CreateIndex
CREATE INDEX "risk_indicators_trend_idx" ON "risk_indicators"("trend");

-- CreateIndex
CREATE INDEX "sync_results_integrationId_idx" ON "sync_results"("integrationId");

-- CreateIndex
CREATE INDEX "sync_results_status_createdAt_idx" ON "sync_results"("status", "createdAt");

-- CreateIndex
CREATE INDEX "sync_results_createdAt_idx" ON "sync_results"("createdAt");

-- CreateIndex
CREATE INDEX "field_mappings_integrationId_idx" ON "field_mappings"("integrationId");

-- CreateIndex
CREATE INDEX "field_mappings_externalField_idx" ON "field_mappings"("externalField");

-- CreateIndex
CREATE INDEX "field_mappings_internalField_idx" ON "field_mappings"("internalField");

-- CreateIndex
CREATE UNIQUE INDEX "field_mappings_integrationId_externalField_key" ON "field_mappings"("integrationId", "externalField");

-- CreateIndex
CREATE INDEX "audit_logs_userId_idx" ON "audit_logs"("userId");

-- CreateIndex
CREATE INDEX "audit_logs_action_createdAt_idx" ON "audit_logs"("action", "createdAt");

-- CreateIndex
CREATE INDEX "audit_logs_resourceType_resourceId_idx" ON "audit_logs"("resourceType", "resourceId");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");

-- CreateIndex
CREATE INDEX "audit_logs_ipAddress_idx" ON "audit_logs"("ipAddress");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gaps" ADD CONSTRAINT "gaps_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gaps" ADD CONSTRAINT "gaps_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "predictions" ADD CONSTRAINT "predictions_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "predictions" ADD CONSTRAINT "predictions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "integrations" ADD CONSTRAINT "integrations_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "integrations" ADD CONSTRAINT "integrations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_stakeholders" ADD CONSTRAINT "project_stakeholders_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_goals" ADD CONSTRAINT "project_goals_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analysis_records" ADD CONSTRAINT "analysis_records_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "root_causes" ADD CONSTRAINT "root_causes_gapId_fkey" FOREIGN KEY ("gapId") REFERENCES "gaps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_areas" ADD CONSTRAINT "project_areas_gapId_fkey" FOREIGN KEY ("gapId") REFERENCES "gaps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "preventive_actions" ADD CONSTRAINT "preventive_actions_predictionId_fkey" FOREIGN KEY ("predictionId") REFERENCES "predictions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "risk_indicators" ADD CONSTRAINT "risk_indicators_predictionId_fkey" FOREIGN KEY ("predictionId") REFERENCES "predictions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sync_results" ADD CONSTRAINT "sync_results_integrationId_fkey" FOREIGN KEY ("integrationId") REFERENCES "integrations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "field_mappings" ADD CONSTRAINT "field_mappings_integrationId_fkey" FOREIGN KEY ("integrationId") REFERENCES "integrations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
