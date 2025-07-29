# Stratibreak

**AI-Powered Project Gap Analysis Tool**

A specialized SaaS solution that goes beyond traditional project management tools by focusing specifically on deep operational gap analysis using AI.

## Project Structure

This is a monorepo using PNPM workspaces with the following structure:

```
├── backend/          # NestJS backend services
├── frontend/         # Next.js 14 frontend application
├── shared/           # Shared types, constants and utilities
├── .kiro/            # Kiro IDE configuration and specs
└── package.json      # Root package.json with workspace configuration
```

## Prerequisites

- Node.js >= 18.0.0
- PNPM >= 8.0.0

## Getting Started

1. Install dependencies:
```bash
pnpm install
```

2. Set up development environment:
```bash
pnpm dev:setup
```

3. Start development servers:
```bash
pnpm dev
```

## Available Scripts

- `pnpm dev` - Start all development servers
- `pnpm build` - Build all packages
- `pnpm lint` - Lint all packages
- `pnpm lint:fix` - Fix linting issues
- `pnpm format` - Format code with Prettier
- `pnpm type-check` - Run TypeScript type checking
- `pnpm test` - Run tests
- `pnpm code-quality` - Run linting and type checking

## Development Guidelines

### Code Quality

- TypeScript strict mode is enabled
- ESLint with strict rules (no `any` types, max 300 lines per file)
- Prettier for code formatting
- Husky pre-commit hooks for quality checks

### Architecture Principles

- **Microservices**: Business logic separated into focused services
- **Shared Modules**: Common components as internal modules
- **Type Safety**: Strict TypeScript with no `any` types
- **Clean Code**: SOLID principles and DRY approach

## Technology Stack

### Backend
- **Framework**: NestJS with microservices architecture
- **Language**: TypeScript (strict mode)
- **Database**: PostgreSQL with Prisma ORM
- **Validation**: class-validator + class-transformer

### Frontend
- **Framework**: Next.js 14 with App Router
- **UI Library**: Tailwind CSS + ShadCN/UI
- **Charts**: Recharts for dashboards
- **State Management**: Zustand
- **Auth**: NextAuth.js

### AI/ML Layer
- **Language**: Python for ML components
- **Frameworks**: scikit-learn, XGBoost, HuggingFace Transformers
- **LLM**: Ollama with Llama 3.1 or Mistral

## Development Phases

- **Phase 1 - MVP**: Core gap analysis with basic rules and single integration
- **Phase 2 - Expansion**: ML predictions, multiple integrations, advanced dashboard
- **Phase 3 - Optimization**: Advanced ML models, full monitoring, enterprise scaling

## License

Private - All rights reserved
