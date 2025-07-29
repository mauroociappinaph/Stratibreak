# Git Commit Strategy

## Commit Organization Guidelines

When making changes to the codebase, ALWAYS organize commits by logical categories rather than committing everything at once. This maintains a clean, readable Git history and makes code reviews more effective.

## Commit Categories (in order of priority)

### 1. Configuration Files

- New configuration files
- Environment setup
- Build configuration changes
- Docker/deployment configs

**Example**: `feat: add backend configuration files`

### 2. Dependencies

- Package.json updates
- Lock file changes
- New library installations
- Dependency version updates

**Example**: `chore: add required dependencies for code quality`

### 3. Infrastructure/Setup

- ESLint/Prettier configurations
- CI/CD pipeline changes
- Development tooling setup
- Project structure changes

**Example**: `refactor: configure ESLint for each package individually`

### 4. Core Implementation

- New features
- Business logic implementation
- API endpoints
- Database schemas

**Example**: `feat: implement user authentication module`

### 5. Bug Fixes

- TypeScript errors
- Linting issues
- Runtime bug fixes
- Performance improvements

**Example**: `fix: resolve TypeScript and ESLint errors`

### 6. Code Quality

- Refactoring
- Code cleanup
- ESLint disable comments for valid cases
- Type safety improvements

**Example**: `fix: disable unused-vars ESLint rule for placeholder services`

### 7. Documentation

- README updates
- Code comments
- API documentation
- Project specifications

**Example**: `docs: update project tasks and specifications`

## Commit Message Format

Use conventional commits format:

```
<type>(<scope>): <description>

<body>

<footer>
```

### Types:

- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `ci`: CI/CD changes
- `perf`: Performance improvements

## Commit Process

1. **Check git status** first: `git status`
2. **Group related files** by category
3. **Add files by category**: `git add <category-files>`
4. **Commit with descriptive message**
5. **Repeat for each category**
6. **Push all commits together**: `git push`

## Example Workflow

```bash
# 1. Configuration files
git add backend/src/config/
git commit -m "feat: add backend configuration files

- Add database.config.ts with PostgreSQL settings
- Add app.config.ts with application configuration
- Add auth.config.ts with JWT settings"

# 2. Dependencies
git add package.json pnpm-lock.yaml
git commit -m "chore: add required dependencies

- Add joi for validation
- Add ESLint TypeScript plugins"

# 3. Bug fixes
git add src/main.ts src/services/
git commit -m "fix: resolve TypeScript errors

- Fix undefined environment variable handling
- Add proper type annotations"

# 4. Push all commits
git push origin <branch-name>
```

## Benefits

- **Clear history**: Each commit has a single, clear purpose
- **Easy reviews**: Reviewers can understand changes category by category
- **Better rollbacks**: Can revert specific types of changes without affecting others
- **Professional workflow**: Follows industry best practices
- **Easier debugging**: Can identify when specific types of issues were introduced

## What NOT to do

❌ **Don't commit everything at once**:

```bash
git add .
git commit -m "fix stuff"
```

❌ **Don't mix unrelated changes**:

```bash
git add config/ src/ docs/
git commit -m "add config and fix bugs and update docs"
```

✅ **DO organize by logical groups**:

```bash
git add config/
git commit -m "feat: add configuration files"

git add src/
git commit -m "fix: resolve TypeScript errors"

git add docs/
git commit -m "docs: update API documentation"
```

## Special Cases

### Large Refactoring

Break into smaller commits:

1. Rename/move files
2. Update imports
3. Refactor logic
4. Update tests
5. Update documentation

### New Features

Break into logical steps:

1. Add types/interfaces
2. Implement core logic
3. Add API endpoints
4. Add tests
5. Update documentation

This strategy ensures maintainable, professional Git history that benefits the entire development team.
