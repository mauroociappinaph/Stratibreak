-- Database initialization script
-- This script runs when the PostgreSQL container starts for the first time

-- Create extensions that might be useful
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- Set timezone
SET timezone = 'UTC';

-- Create additional indexes for performance (if needed)
-- These will be created by Prisma migrations, but can be added here for reference

-- Log the initialization
DO $$
BEGIN
    RAISE NOTICE 'Database initialized successfully for Stratibreak development environment';
END $$;
