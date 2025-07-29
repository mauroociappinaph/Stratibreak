# Backend Source Structure

This directory follows a modular architecture pattern with clear separation of concerns.

## Directory Structure

### `/common/`

Shared utilities and helpers used across all modules:

- `decorators/` - Custom NestJS decorators
- `filters/` - Exception filters
- `guards/` - Auth/authorization guards
- `helpers/` - Reusable utility functions
- `interceptors/` - Request/response interceptors
- `pipes/` - Validation pipes

### `/types/`

TypeScript type definitions:

- `api/` - External API types
- `database/` - Database entity types
- `services/` - Service interface types

### `/modules/`

Business logic modules following NestJS module pattern:

- `gap-analysis/` - Core gap analysis functionality
- `predictions/` - Predictive analytics
- `integrations/` - External tool integrations
- `notifications/` - Alert and notification system
- `auth/` - Authentication and authorization

Each module contains:

- `dto/` - Data Transfer Objects
- `entities/` - Database entities (Prisma)
- `services/` - Business logic
- `controllers/` - REST API endpoints
- `interfaces/` - TypeScript interfaces
- `tests/` - Module-specific tests

### `/config/`

Configuration files for different environments and services.

## Import Pattern

All directories use barrel exports (`index.ts`) for clean imports:

```typescript
// Instead of:
import { ValidationHelper } from './common/helpers/validation.helper';
import { AuthGuard } from './common/guards/auth.guard';

// Use:
import { ValidationHelper, AuthGuard } from '@/common';
```

## Module Development

When creating new functionality:

1. Add to appropriate module directory
2. Export from module's `index.ts`
3. Follow NestJS patterns and conventions
4. Include tests in module's `tests/` directory
