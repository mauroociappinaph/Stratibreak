# Technology Stack & Development Guidelines

## Core Technologies

### Backend

- **Language**: TypeScript (strict mode)
- **Package Manager**: PNPM (faster than npm, consistent across all environments)
- **Framework**: NestJS with microservices architecture
- **Database**: PostgreSQL with Prisma ORM (type-safe)
- **API Gateway**: NGINX with rate limiting and auth modules
- **Validation**: class-validator + class-transformer

### AI/ML Layer

- **Language**: Python for ML components
- **ML Frameworks**: scikit-learn, XGBoost, HuggingFace Transformers, spaCy
- **LLM**: Ollama with Llama 3.1 or Mistral (local/free)
- **ML Pipeline**: MLflow for experiment tracking
- **Communication**: FastAPI + gRPC for NestJS-Python interface

### Frontend

- **Framework**: Next.js 14 with App Router
- **UI Library**: Tailwind CSS + ShadCN/UI
- **Charts**: Recharts for interactive dashboards
- **State Management**: Zustand (lightweight)
- **Auth**: NextAuth.js + OAuth
- **Data Fetching**: TanStack Query

### Infrastructure

- **Containerization**: Docker with multi-stage builds
- **Orchestration**: Kubernetes (k3s for development)
- **Cache**: Redis for sessions and distributed caching
- **Message Queue**: BullMQ (Redis-based) for async processing
- **Monitoring**: Prometheus + Grafana, ELK Stack, Jaeger tracing

## Development Commands

### Setup & Installation

```bash
# Install dependencies
pnpm install

# Setup development environment
pnpm dev:setup

# Start development servers
pnpm dev
```

### Code Quality

```bash
# Lint and format code
pnpm lint
pnpm lint:fix
pnpm format

# Type checking
pnpm type-check

# Check for unused exports and circular dependencies
pnpm unused
pnpm circular

# Run all quality checks
pnpm code-quality
```

### Testing

```bash
# Run unit tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Run integration tests
pnpm test:integration

# Run e2e tests
pnpm test:e2e
```

### Build & Deploy

```bash
# Build for production
pnpm build

# Start production server
pnpm start

# Build Docker images
pnpm docker:build

# Deploy to staging/production
pnpm deploy:staging
pnpm deploy:prod
```

## Programming Paradigms

### Functional Programming First

- **Prefer functional over OOP**: Use pure functions, immutability, and composition
- **Immutable Data**: Use readonly types and immutable data structures
- **Pure Functions**: Functions should be predictable with no side effects
- **Function Composition**: Build complex logic by composing simple functions
- **Higher-Order Functions**: Leverage map, filter, reduce, and custom HOFs
- **Avoid Classes**: Use functions and modules instead of classes when possible
- **State Management**: Prefer functional state updates over mutable state

### TypeScript Functional Patterns

- Use `const` assertions and `readonly` modifiers
- Leverage utility types like `Partial`, `Pick`, `Omit`
- Prefer function declarations and arrow functions over class methods
- Use discriminated unions instead of inheritance
- Implement algebraic data types with union types

## Architecture Principles

### Code Organization

- **Microservices**: Business logic separated into focused services
- **Shared Modules**: Common AI/ML components as internal modules for low latency
- **Barrel Exports**: Centralized imports using index.ts files
- **Type Safety**: Strict TypeScript with no `any` types allowed

### Integration Strategy

- **Horizontal Layer**: Complement existing tools, don't replace them
- **API-First**: All integrations through well-defined APIs
- **Fault Tolerance**: Graceful degradation when external services fail
- **Real-time Sync**: Webhooks + polling for data consistency

### Performance Requirements

- **Response Time**: <2 seconds for gap analysis
- **Prediction Accuracy**: >85% for early warnings
- **System Uptime**: >99.9% availability
- **Data Freshness**: <5 minutes lag for real-time metrics

## Development Phases

### Phase 1 - MVP

- Core gap analysis with basic rules
- Single integration (Jira)
- Simple dashboard with essential visualizations
- Basic authentication and roles

### Phase 2 - Expansion

- ML-powered predictions
- Multiple integrations (Asana, Trello, Monday.com, Bitrix24)
- Advanced dashboard with customizable widgets
- Real-time notifications and alerts

### Phase 3 - Optimization

- Advanced ML models with auto-retraining
- Full monitoring and observability stack
- Enterprise security and compliance
- Horizontal scaling with Kubernetes
