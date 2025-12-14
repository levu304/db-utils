# Dependency Management Analysis (2023-2025 Standards)

## 1. Package Manager
- **PNPM 8+** - Primary package manager
- `.npmrc` configures registry and workspace settings
- `pnpm-lock.yaml` - Lockfile for reproducible installs
- **Override requirement:** `zod ^3.22.4, pg ^8.11.3`

## 2. Monorepo Tool
Choose ONE (not multiple):
- **Moon** - Lightweight task runner with efficient caching
- **Nx** - Full-featured monorepo with plugins
- **Turborepo** - Fast, incremental builds

Monorepo structure: `packages/{types,utils,core,cli}`

## 3. TypeScript Configuration (Strict Mode Required)
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "baseUrl": ".",
    "paths": {
      "@db-utils/types/*": ["packages/types/*"],
      "@db-utils/utils/*": ["packages/utils/*"],
      "@db-utils/core/*": ["packages/core/*"],
      "@db-utils/cli/*": ["packages/cli/*"]
    }
  }
}
```

## 4. Production Dependencies

### Core Database Layer
- **pg ^8.11.3** - PostgreSQL client (EXACT version)
- **drizzle-orm** OR **kysely** - SQL query builder (NOT TypeORM, NOT Sequelize)
- **zod ^3.22.4** - Runtime validation (EXACT version)

### CLI Layer
- **commander** OR **cac** - CLI argument parsing (NOT yargs)
- **dotenv** - Environment variable management

### Utilities
- **@types/node** - Node.js type definitions

## 5. Development Dependencies

### Testing (Mandatory)
- **vitest ^1.x** - Unit testing (NOT Jest)
- **@vitest/ui** - Test UI dashboard
- **@vitest/coverage-v8** - Coverage reporting

### Code Quality
- **typescript ^5.x** - TypeScript compiler
- **eslint ^8.x** - Linting
- **prettier ^3.x** - Code formatting
- **@typescript-eslint/parser** - TypeScript ESLint support
- **@typescript-eslint/eslint-plugin** - TypeScript rules

### Build & Monorepo
- **moon** OR **nx** OR **turborepo** - Monorepo orchestration
- **ts-node** - TypeScript execution for development

## 6. Package Directory Structure
```
packages/
├── types/              # Shared type definitions
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts
│       ├── database.ts
│       └── result.ts
│
├── utils/              # Utilities (depends on: types)
│   ├── package.json
│   ├── tsconfig.json
│   ├── src/
│   └── test/
│
├── core/               # Database logic (depends on: types, utils)
│   ├── package.json
│   ├── tsconfig.json
│   ├── src/
│   └── test/
│
└── cli/                # CLI entry point (depends on: types, utils, core)
    ├── package.json
    ├── tsconfig.json
    ├── src/
    └── test/
```

## 7. Dependency Order (CRITICAL)
1. **types** - No dependencies on other packages
2. **utils** - Depends on: types
3. **core** - Depends on: types, utils
4. **cli** - Depends on: types, utils, core

**Violation = Architecture failure**

## 8. Security Requirements
- **No hardcoded credentials** - Environment variables only (validate with Zod)
- **No SQL concatenation** - Parameterized queries only
- **No `any` types** - Use `unknown` with type guards
- **Input validation** - Zod validation on all runtime inputs

## 9. Performance Configurations
- **Database connection pooling:** Max 20 connections
- **Connection timeout:** 10 seconds
- **Query timeout:** 30 seconds
- **Batch size:** Default 1000, configurable
- **Memory:** Stream large datasets, avoid loading all into memory

## 10. Pre-commit Hooks
```bash
- Run tests (all must pass)
- Run linting (no errors)
- Type-check (TypeScript strict)
- Coverage check (80% minimum)
```

## 11. Best Practices
- Keep production dependencies minimal per package
- Development dependencies in root `package.json`
- Regular `pnpm audit` for security
- Use `pnpm install --frozen-lockfile` in CI/CD
- Document all environment variables required
- Pre-commit hooks mandatory (husky recommended)
