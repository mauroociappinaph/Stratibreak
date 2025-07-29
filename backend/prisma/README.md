# Database Schema & Migrations

This directory contains the Prisma schema and database migrations for Stratibreak.

## Schema Overview

The database is designed with multitenancy in mind, supporting multiple organizations with complete data isolation.

### Core Entities

- **Tenant**: Organization-level isolation with encryption keys
- **User**: System users with role-based access control
- **Project**: Main project entities with stakeholder management
- **Gap**: Identified gaps with root cause analysis
- **Prediction**: AI-powered predictive analytics
- **Integration**: External tool integrations with encrypted credentials

### Key Features

- **Multitenancy**: Complete tenant isolation with cascade deletes
- **Audit Logging**: Comprehensive audit trail for compliance
- **Performance Optimized**: Strategic indexing for fast queries
- **Security**: Encrypted credentials and data protection
- **Flexibility**: JSON fields for dynamic data structures

## Migration History

### 20250729144819_init

- Initial database schema creation
- All core tables with relationships
- Comprehensive indexing strategy
- Enum types for consistent data
- Foreign key constraints with cascade deletes

## Working with Migrations

### Creating New Migrations

```bash
# After modifying schema.prisma
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
# Reset with fresh seed data
pnpm db:reset
```

## Schema Validation

The schema is automatically validated on each migration:

```bash
pnpm db:validate
```

## Seed Data

The seed file creates:

- Demo tenant organization
- Sample users with different roles
- Example projects with gaps and predictions
- Integration configurations

### Default Users

| Role            | Email                   | Password   | Description          |
| --------------- | ----------------------- | ---------- | -------------------- |
| ADMIN           | admin@stratibreak.com   | admin123   | System administrator |
| PROJECT_MANAGER | manager@stratibreak.com | manager123 | Project manager      |
| STAKEHOLDER     | user@stratibreak.com    | user123    | Regular user         |

## Performance Considerations

### Indexing Strategy

- **Tenant-based**: All queries filtered by tenantId
- **Composite indexes**: Multi-column indexes for common queries
- **Time-based**: Indexes on createdAt, updatedAt for sorting
- **Status-based**: Indexes on status fields for filtering

### Query Optimization

- Use tenant-scoped queries for all operations
- Leverage composite indexes for complex filters
- Use pagination for large result sets
- Consider read replicas for analytics queries

## Security Features

### Data Isolation

- Tenant-based row-level security
- Cascade deletes prevent orphaned data
- Encrypted credentials for integrations

### Audit Trail

- All user actions logged
- IP address and user agent tracking
- Resource-level audit logging
- Compliance-ready audit structure

## Backup & Recovery

### Development

```bash
# Backup
pg_dump stratibreak_dev > backup.sql

# Restore
psql stratibreak_dev < backup.sql
```

### Production

Use automated backup solutions with:

- Point-in-time recovery
- Encrypted backups
- Cross-region replication
- Regular backup testing

## Troubleshooting

### Common Issues

1. **Migration Conflicts**

   ```bash
   # Reset and reapply
   pnpm db:migrate:reset
   ```

2. **Schema Drift**

   ```bash
   # Push schema without migration
   pnpm db:push
   ```

3. **Seed Failures**
   ```bash
   # Check for existing data conflicts
   # Update seed.ts with proper upsert logic
   ```

### Database Connection Issues

1. Verify PostgreSQL is running
2. Check connection string in .env
3. Ensure database exists
4. Verify user permissions

## Best Practices

### Schema Changes

1. Always create migrations for schema changes
2. Test migrations on development data
3. Review generated SQL before applying
4. Use descriptive migration names
5. Document breaking changes

### Data Modeling

1. Use appropriate data types
2. Add indexes for query patterns
3. Consider JSON fields for flexible data
4. Use enums for constrained values
5. Plan for data growth and archiving

### Security

1. Never store plain text credentials
2. Use tenant isolation consistently
3. Implement proper access controls
4. Regular security audits
5. Monitor for suspicious activity
