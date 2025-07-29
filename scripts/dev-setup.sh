#!/bin/bash

# Development Environment Setup Script
# This script sets up the development environment for Stratibreak

set -e

echo "🚀 Setting up Stratibreak development environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    print_error "pnpm is not installed. Please install pnpm first:"
    echo "npm install -g pnpm"
    exit 1
fi

print_status "Starting database services..."
docker-compose up -d postgres redis

print_status "Waiting for database to be ready..."
sleep 10

# Wait for PostgreSQL to be ready
until docker-compose exec -T postgres pg_isready -U stratibreak_user -d stratibreak_dev; do
    print_status "Waiting for PostgreSQL..."
    sleep 2
done

print_success "Database is ready!"

print_status "Installing dependencies..."
pnpm install

print_status "Generating Prisma client..."
cd backend && pnpm db:generate

print_status "Running database migrations..."
pnpm db:migrate --name init

print_status "Seeding database with initial data..."
pnpm db:seed

print_success "Development environment setup complete!"
echo ""
print_status "Services running:"
echo "  📊 PostgreSQL: localhost:5432"
echo "  🔴 Redis: localhost:6379"
echo "  🔧 pgAdmin: http://localhost:5050 (admin@stratibreak.com / admin123)"
echo ""
print_status "To start the development servers:"
echo "  Backend: cd backend && pnpm start:dev"
echo "  Frontend: cd frontend && pnpm dev"
echo ""
print_status "To stop services:"
echo "  docker-compose down"
