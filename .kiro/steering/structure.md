# Project Structure & Organization

## Repository Layout

This is a monorepo using PNPM workspaces with clear separation between backend services, frontend application, and shared components.

```
├── .kiro/                          # Kiro IDE configuration
│   ├── specs/                      # Project specifications
│   └── steering/                   # AI assistant guidance rules
├── .vscode/                        # VSCode configuration
├── backend/                        # NestJS backend services
│   ├── src/
│   │   ├── common/                 # Shared utilities and helpers
│   │   │   ├── decorators/         # Custom NestJS decorators
│   │   │   ├── filters/            # Exception filters
│   │   │   ├── guards/             # Auth/authorization guards
│   │   │   ├── helpers/            # Reusable utility functions
│   │   │   ├── interceptors/       # Request/response interceptors
│   │   │   ├── pipes/              # Validation pipes
│   │   │   └── index.ts            # Barrel exports
│   │   ├── types/                  # TypeScript type definitions
│   │   │   ├── api/                # External API types
│   │   │   ├── database/           # Database entity types
│   │   │   ├── services/           # Service interface types
│   │   │   └── index.ts            # Barrel exports
│   │   ├── modules/                # Business logic modules
│   │   │   ├── gap-analysis/       # Core gap analysis module
│   │   │   ├── predictions/        # Predictive analytics module
│   │   │   ├── integrations/       # External tool integrations
│   │   │   ├── notifications/      # Alert and notification system
│   │   │   └── auth/               # Authentication module
│   │   ├── config/                 # Configuration files
│   │   └── main.ts                 # Application entry point
│   ├── prisma/                     # Database schema and migrations
│   ├── test/                       # Test files
│   └── package.json
├── frontend/                       # Next.js frontend application
│   ├── src/
│   │   ├── app/                    # Next.js 14 App Router
│   │   ├── components/             # Reusable UI components
│   │   │   ├── ui/                 # ShadCN/UI base components
│   │   │   ├── charts/             # Recharts visualizations
│   │   │   ├── forms/              # Form components
│   │   │   └── layout/             # Layout components
│   │   ├── lib/                    # Frontend utilities
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── stores/                 # Zustand state stores
│   │   └── types/                  # Frontend-specific types
│   ├── public/                     # Static assets
│   └── package.json
├── ml-services/                    # Python ML/AI services
│   ├── src/
│   │   ├── models/                 # ML model implementations
│   │   ├── pipelines/              # Data processing pipelines
│   │   ├── api/                    # FastAPI endpoints
│   │   └── utils/                  # ML utilities
│   ├── requirements.txt
│   └── Dockerfile
├── shared/                         # Shared code between services
│   ├── types/                      # Common TypeScript types
│   ├── constants/                  # Shared constants
│   └── utils/                      # Cross-service utilities
└── docker-compose.yml              # Development environment
```

## Module Organization Principles

### Backend Modules

Each NestJS module follows a consistent structure:

```
module-name/
├── dto/                    # Data Transfer Objects
├── entities/               # Database entities (Prisma)
├── services/               # Business logic
├── controllers/            # REST API endpoints
├── interfaces/             # TypeScript interfaces
├── tests/                  # Module-specific tests
└── module-name.module.ts   # NestJS module definition
```

### Frontend Components

Components are organized by functionality and reusability:

```
components/
├── ui/                     # Base UI components (buttons, inputs)
├── charts/                 # Data visualization components
├── forms/                  # Form-specific components
├── layout/                 # Page layout components
├── features/               # Feature-specific components
│   ├── gap-analysis/       # Gap analysis dashboard
│   ├── predictions/        # Predictive analytics views
│   └── integrations/       # Integration management
└── common/                 # Shared utility components
```

## Key Architectural Patterns

### Barrel Exports

All modules use index.ts files for clean imports:

```typescript
// src/common/index.ts
export * from "./decorators";
export * from "./helpers";
export * from "./guards";

// Usage in other modules
import { ValidationHelper, AuthGuard } from "@/common";
```

### Type-Safe Database Layer

- Prisma ORM provides type-safe database access
- Database entities are automatically typed
- Migrations are version-controlled in `prisma/migrations/`

### Service Layer Pattern

- Business logic is encapsulated in services
- Controllers are thin and handle only HTTP concerns
- Services are easily testable and reusable

### Integration Adapter Pattern

- Each external tool integration implements a common interface
- Adapters handle tool-specific API differences
- Consistent data transformation across all integrations

## Development Workflow

### File Naming Conventions

- **Services**: `*.service.ts`
- **Controllers**: `*.controller.ts`
- **DTOs**: `*.dto.ts`
- **Entities**: `*.entity.ts`
- **Types**: `*.types.ts`
- **Tests**: `*.spec.ts` or `*.test.ts`

### Import Organization

1. Node.js built-in modules
2. Third-party packages
3. Internal modules (using path aliases)
4. Relative imports

### Code Organization Rules

- Maximum 300 lines per file
- Maximum complexity of 10 per function
- Maximum nesting depth of 4
- No `any` types allowed
- All functions must have explicit return types

## Configuration Management

### Environment Variables

- Development: `.env.development`
- Testing: `.env.test`
- Production: Environment-specific configuration
- Secrets managed through secure vaults in production

### Feature Flags

- Phase-based feature rollout
- A/B testing capabilities for ML models
- Gradual feature enablement

## Testing Structure

### Backend Testing

```
test/
├── unit/                   # Unit tests for services
├── integration/            # API integration tests
├── e2e/                    # End-to-end tests
└── fixtures/               # Test data and mocks
```

### Frontend Testing

```
__tests__/
├── components/             # Component unit tests
├── pages/                  # Page integration tests
├── utils/                  # Utility function tests
└── __mocks__/              # Mock implementations
```

## Documentation Standards

- All public APIs documented with JSDoc
- README files in each major directory
- Architecture Decision Records (ADRs) for major decisions
- API documentation auto-generated from OpenAPI specs
