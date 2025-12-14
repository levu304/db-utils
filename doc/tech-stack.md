# Technology Stack (2023-2025)

## Runtime & Package Manager
- **Node.js 20+** - Runtime environment with modern features
- **Pnpm 8+** - Fast, efficient package manager for workspace management

## Core Dependencies
- **TypeScript 5+** - Strict mode mandatory (noUnusedLocals, noImplicitReturns, etc.)
- **PostgreSQL 15+** - Relational database with advanced features
- **Drizzle or Kysely** - Modern SQL query builders with TypeScript support
- **Zod 3.22.4+** - Runtime validation and type inference

## CLI & Utilities
- **Commander.js or CAC** - Modern CLI argument parsing (NOT yargs)
- **dotenv** - Environment variable management for credentials

## Testing & Quality
- **Vitest** - Fast unit testing framework (NOT Jest)
- **TypeScript strict mode** - Enforced no `any` types
- **80% code coverage minimum** - TDD-driven development

## Monorepo Management
- **Moon, Nx, or Turborepo** - Workspace orchestration and build optimization
- **Path aliases:** `@db-utils/types/*`, `@db-utils/utils/*`, `@db-utils/core/*`, `@db-utils/cli/*`

## Development Tools
- **VS Code** with TypeScript support
- **Git** for version control
- **ESLint + Prettier** - Code quality and formatting
- **Pre-commit hooks** - Automated test/lint/type-check validation

## Architecture Standards
- **Monorepo structure:** `packages/{types,utils,core,cli}`
- **Dependency order:** types → utils → core → cli
- **Error Handling:** Result type pattern with custom error classes
- **Security:** Parameterized queries only, no string concatenation
- **SOLID Principles:** All 5 principles mandatory
