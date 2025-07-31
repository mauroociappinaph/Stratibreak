import { AnalysisSwaggerDocs } from './predictions-analysis.swagger';
import { ComprehensiveSwaggerDocs } from './predictions-comprehensive.swagger';
import { CrudSwaggerDocs } from './predictions-crud.swagger';
import { RiskSwaggerDocs } from './predictions-risk.swagger';
import { TrendsSwaggerDocs } from './predictions-trends.swagger';
import { WarningsSwaggerDocs } from './predictions-warnings.swagger';

// Swagger decorators for the controller methods
export const SwaggerDocs = {
  // Re-export CRUD operations
  ...CrudSwaggerDocs,

  // Re-export analysis operations
  ...AnalysisSwaggerDocs,

  // Re-export trend operations
  ...TrendsSwaggerDocs,

  // Re-export warning operations
  ...WarningsSwaggerDocs,

  // Re-export comprehensive operations
  ...ComprehensiveSwaggerDocs,

  // Re-export risk operations
  ...RiskSwaggerDocs,
};
