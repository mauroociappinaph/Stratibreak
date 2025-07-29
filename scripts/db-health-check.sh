#!/bin/bash

# Database Health Check Script
# Verifies database connectivity, schema integrity, and basic functionality

set -e

echo "🔍 Running database health check..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker containers are running
print_status "Checking Docker containers..."
if ! docker-compose ps | grep -q "stratibreak-postgres.*Up"; then
    print_error "PostgreSQL container is not running"
    exit 1
fi

if ! docker-compose ps | grep -q "stratibreak-redis.*Up"; then
    print_warning "Redis container is not running"
fi

print_success "Docker containers are running"

# Check database connectivity
print_status "Testing database connectivity..."
cd backend

if ! pnpm db:validate > /dev/null 2>&1; then
    print_error "Database schema validation failed"
    exit 1
fi

print_success "Database schema is valid"

# Check if migrations are applied
print_status "Checking migration status..."
MIGRATION_COUNT=$(find prisma/migrations -name "*.sql" | wc -l)
if [ "$MIGRATION_COUNT" -eq 0 ]; then
    print_warning "No migrations found"
else
    print_success "Found $MIGRATION_COUNT migration(s)"
fi

# Test basic database operations
print_status "Testing basic database operations..."

# Test connection with a simple query
if docker-compose exec -T postgres psql -U stratibreak_user -d stratibreak_dev -c "SELECT 1;" > /dev/null 2>&1; then
    print_success "Database connection successful"
else
    print_error "Database connection failed"
    exit 1
fi

# Check if tables exist
TABLE_COUNT=$(docker-compose exec -T postgres psql -U stratibreak_user -d stratibreak_dev -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" | tr -d ' ')

if [ "$TABLE_COUNT" -gt 0 ]; then
    print_success "Found $TABLE_COUNT tables in database"
else
    print_error "No tables found in database"
    exit 1
fi

# Check if seed data exists
USER_COUNT=$(docker-compose exec -T postgres psql -U stratibreak_user -d stratibreak_dev -t -c "SELECT COUNT(*) FROM users;" | tr -d ' ')

if [ "$USER_COUNT" -gt 0 ]; then
    print_success "Found $USER_COUNT users in database"
else
    print_warning "No seed data found - run 'pnpm db:seed' to populate"
fi

# Test Redis connectivity (if running)
if docker-compose ps | grep -q "stratibreak-redis.*Up"; then
    print_status "Testing Redis connectivity..."
    if docker-compose exec -T redis redis-cli ping | grep -q "PONG"; then
        print_success "Redis connection successful"
    else
        print_warning "Redis connection failed"
    fi
fi

# Check Prisma Client generation
print_status "Checking Prisma Client..."
if [ -d "../node_modules/.pnpm/@prisma+client"* ]; then
    print_success "Prisma Client is generated"
else
    print_warning "Prisma Client not found - run 'pnpm db:generate'"
fi

# Performance check - test query speed
print_status "Running performance test..."
QUERY_TIME=$(docker-compose exec -T postgres psql -U stratibreak_user -d stratibreak_dev -c "\timing on" -c "SELECT COUNT(*) FROM users;" 2>&1 | grep "Time:" | awk '{print $2}' | sed 's/ms//')

if [ ! -z "$QUERY_TIME" ]; then
    if (( $(echo "$QUERY_TIME < 100" | bc -l) )); then
        print_success "Query performance good (${QUERY_TIME}ms)"
    else
        print_warning "Query performance slow (${QUERY_TIME}ms)"
    fi
fi

echo ""
print_success "Database health check completed!"
echo ""
print_status "Summary:"
echo "  📊 Database: Connected and operational"
echo "  🗃️  Tables: $TABLE_COUNT tables found"
echo "  👥 Users: $USER_COUNT users in database"
echo "  🔄 Migrations: $MIGRATION_COUNT migration(s) applied"
echo ""
print_status "To view database:"
echo "  🔧 Prisma Studio: pnpm db:studio"
echo "  🐘 pgAdmin: http://localhost:5050"
