# Development Environment Setup

This guide will help you set up the development environment for Stratibreak.

## Prerequisites

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0
- **Docker** and **Docker Compose**
- **Git**

## Quick Start

### 1. Clone and Setup

```bash
git clone <repository-url>
cd stratibreak
pnpm dev:setup
```

This will:

- Start PostgreSQL and Redis containers
- Install all dependencies
- Generate Prisma client
- Run database migrations
- Seed the database with initial data

### 2. Start Development Servers

```bash
# Start backend (NestJS)
cd backend && pnpm start:dev

# Start frontend (Next.js) - in another terminal
cd frontend && pnpm dev
```

## Manual Setup

If you prefer to set up manually:

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Start Database Services

```bash
pnpm dev:services
```

### 3. Setup Database

```bash
# Generate Prisma client
pnpm db:generate

# Run migrations
pnpm db:migrate --name init

# Seed database
pnpm db:seed
```

## Available Scripts

### Root Level Scripts

- `pnpm dev:setup` - Complete development environment setup
- `pnpm dev:reset` - Reset development environment (⚠️ deletes all data)
- `pnpm dev:services` - Start database services only
- `pnpm dev:services:stop` - Stop database services
- `pnpm dev:services:logs` - View service logs

### Database Scripts

- `pnpm db:generate` - Generate Prisma client
- `pnpm db:migrate` - Create and apply new migration
- `pnpm db:push` - Push schema changes without migration
- `pnpm db:seed` - Seed database with initial data
- `pnpm db:studio` - Open Prisma Studio
- `pnpm db:reset` - Reset database and reseed

### Code Quality Scripts

- `pnpm lint` - Run ESLint on all packages
- `pnpm lint:fix` - Fix ESLint issues
- `pnpm format` - Format code with Prettier
- `pnpm type-check` - Run TypeScript type checking
- `pnpm code-quality` - Run all quality checks

## Services

### PostgreSQL Database

- **Host**: localhost:5432
- **Database**: stratibreak_dev
- **Username**: stratibreak_user
- **Password**: stratibreak_pass

### Redis Cache

- **Host**: localhost:6379
- **Database**: 0

### pgAdmin (Optional)

- **URL**: http://localhost:5050
- **Email**: admin@stratibreak.com
- **Password**: admin123

To enable pgAdmin:

```bash
docker-compose --profile tools up -d pgadmin
```

## Environment Variables

Copy the example environment files:

```bash
cp backend/.env.example backend/.env.development
```

The development environment is pre-configured with sensible defaults.

## Database Migrations

### Creating a New Migration

```bash
cd backend
pnpm db:migrate --name "description-of-changes"
```

### Applying Migrations

```bash
# Development
pnpm db:migrate

# Production
pnpm db:migrate:deploy
```

### Resetting Database

```bash
# Reset with confirmation
pnpm dev:reset

# Force reset (backend only)
cd backend && pnpm db:reset
```

## Troubleshooting

### Database Connection Issues

1. Ensure Docker is running
2. Check if services are up: `docker-compose ps`
3. View logs: `pnpm dev:services:logs`
4. Restart services: `pnpm dev:services:stop && pnpm dev:services`

### Port Conflicts

If you have port conflicts, you can modify the ports in `docker-compose.yml`:

```yaml
services:
  postgres:
    ports:
      - '5433:5432' # Change to different port
```

Don't forget to update the `DATABASE_URL` in your `.env` file accordingly.

### Prisma Issues

```bash
# Regenerate Prisma client
pnpm db:generate

# Reset Prisma completely
rm -rf backend/node_modules/.prisma
pnpm db:generate
```

## Development Workflow

1. **Start with clean environment**: `pnpm dev:setup`
2. **Make schema changes**: Edit `backend/prisma/schema.prisma`
3. **Create migration**: `pnpm db:migrate --name "your-change"`
4. **Update seed data**: Edit `backend/prisma/seed.ts` if needed
5. **Test changes**: Run your application and tests
6. **Commit changes**: Follow the git workflow guidelines

## Testing

```bash
# Run all tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Run integration tests
pnpm test:integration
```

## Production Considerations

- Use `pnpm db:migrate:deploy` for production migrations
- Set proper environment variables for production
- Use connection pooling for database connections
- Enable SSL for database connections in production
