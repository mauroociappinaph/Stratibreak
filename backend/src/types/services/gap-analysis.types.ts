import type {
  GapCategory,
  GapType,
  Impact,
  ProjectArea,
  RootCause,
  SeverityLevel,
} from '../database/gap.types';
import type {
  ProjectEntity,
  ProjectGoal,
  ProjectState,
} from '../database/project.types';

// Core analysis interfaces
export interface GapAnalysisEngine {
  analyzeProject(projectData: ProjectData): Promise<GapAnalysisResult>;
  identifyDiscrepancies(current: ProjectState, target: ProjectGoal[]): Gap[];
  categorizeGaps(gaps: Gap[]): CategorizedGaps;
  calculateGapSeverity(gap: Gap): SeverityLevel;
}

export interface ProjectData {
  project: ProjectEntity;
  currentState: ProjectState;
  goals: ProjectGoal[];
  historicalData?: HistoricalMetric[];
  externalData?: ExternalToolData[];
}

export interface Gap {
  id?: string;
  projectId: string;
  type: GapType;
  category: GapCategory;
  title: string;
  description: string;
  currentValue: number | string;
  targetValue: number | string;
  variance: number;
  severity: SeverityLevel;
  rootCauses: RootCause[];
  affectedAreas: ProjectArea[];
  estimatedImpact: Impact;
  confidence: number;
}

export interface GapAnalysisResult {
  projectId: string;
  analysisTimestamp: Date;
  identifiedGaps: CategorizedGaps;
  overallHealthScore: number;
  prioritizedRecommendations: Recommendation[];
  executionTimeMs: number;
  confidence: number;
}

export interface CategorizedGaps {
  resource: Gap[];
  process: Gap[];
  communication: Gap[];
  technology: Gap[];
  culture: Gap[];
  timeline: Gap[];
  quality: Gap[];
  budget: Gap[];
  skill: Gap[];
  governance: Gap[];
}

export interface Recommendation {
  id: string;
  gapId: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedEffort: number; // in hours
  estimatedImpact: number; // 0-1 scale
  requiredResources: string[];
  timeline: string;
  dependencies: string[];
}

export interface HistoricalMetric {
  timestamp: Date;
  metricType: string;
  value: number;
  unit: string;
}

export interface ExternalToolData {
  source: string;
  data: Record<string, unknown>;
  lastUpdated: Date;
}

// Analysis configuration
export interface AnalysisConfig {
  enablePredictiveAnalysis: boolean;
  confidenceThreshold: number;
  severityWeights: Record<GapType, number>;
  includeHistoricalTrends: boolean;
  maxGapsPerCategory: number;
}

// Gap severity calculation factors
export interface SeverityFactors {
  impactLevel: number; // 0-1
  urgency: number; // 0-1
  complexity: number; // 0-1
  resourceRequirement: number; // 0-1
  stakeholderImpact: number; // 0-1
}

// Analysis metrics for monitoring
export interface AnalysisMetrics {
  totalGapsIdentified: number;
  gapsByCategory: Record<GapCategory, number>;
  gapsBySeverity: Record<SeverityLevel, number>;
  averageConfidence: number;
  analysisAccuracy?: number; // if historical validation available
}
