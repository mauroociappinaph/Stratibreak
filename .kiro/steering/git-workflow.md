---
inclusion: always
---

# Git Workflow & Branch Strategy

## Branch Structure

### 🚀 `main` - Production Branch

- Contains stable, tested code ready for production
- Only updated with releases and hotfixes
- Protected branch - requires PR reviews
- Used for production deployments

### 🔧 `dev` - Development Branch

- **Primary development branch** - base for all new features
- Integration branch for ongoing development
- Continuous integration and testing
- Merge target for completed features

### 🌿 Feature Branches

- Created from `dev` for specific tasks/features
- Named descriptively (e.g., `feature/auth-module`, `task/1.2.b-prisma-setup`)
- Short-lived - merged back to `dev` when complete
- Deleted after successful merge

## Development Workflow

### For New Features/Tasks:

1. **Start from dev**: `git checkout dev && git pull origin dev`
2. **Create feature branch**: `git checkout -b feature/task-name`
3. **Develop and commit**: Regular commits with descriptive messages
4. **Push feature branch**: `git push -u origin feature/task-name`
5. **Merge to dev**: `git checkout dev && git merge feature/task-name`
6. **Push dev**: `git push origin dev`
7. **Clean up**: `git branch -d feature/task-name` (optional)

### For Releases:

1. **Test dev thoroughly**: Ensure all features work together
2. **Merge to main**: `git checkout main && git merge dev`
3. **Tag release**: `git tag -a v1.0.0 -m "Release v1.0.0"`
4. **Push main**: `git push origin main --tags`

## Commit Message Convention

Use conventional commits format:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

Example: `feat: implement user authentication module`

## Current Status

- **Active branch**: `dev`
- **Available branches**: `main`, `dev`, `Inicializar-aplicación-NestJS-base`
- **Next development**: Continue from `dev` branch
