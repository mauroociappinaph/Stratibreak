#!/bin/bash

# Development Environment Reset Script
# This script resets the development environment

set -e

echo "🔄 Resetting Stratibreak development environment..."

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

# Confirm reset
read -p "⚠️  This will delete all data and reset the database. Continue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_status "Reset cancelled."
    exit 0
fi

print_status "Stopping all services..."
docker-compose down -v

print_status "Removing Docker volumes..."
docker volume prune -f

print_status "Cleaning up generated files..."
cd backend
rm -rf node_modules/.prisma
rm -rf prisma/migrations

print_status "Regenerating Prisma client..."
pnpm db:generate

print_status "Starting services..."
cd ..
docker-compose up -d postgres redis

print_status "Waiting for database to be ready..."
sleep 10

until docker-compose exec -T postgres pg_isready -U stratibreak_user -d stratibreak_dev; do
    print_status "Waiting for PostgreSQL..."
    sleep 2
done

print_status "Running fresh migrations..."
cd backend && pnpm db:migrate --name init

print_status "Seeding database..."
pnpm db:seed

print_success "Development environment reset complete!"
echo ""
print_status "Services are now running with fresh data."
