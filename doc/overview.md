# Project Overview

## 📌 Purpose
This project implements a command-line interface (CLI) tool for transferring data between PostgreSQL databases. The core functionality is to backup data from a source PostgreSQL database (A) to a target PostgreSQL database (B) using the command:  
`db transfer --from <pg_url> --to <pg_url>`

## 🛠 Tech Stack (2023-2025 Standards)
- **Language**: TypeScript 5+ (strict mode mandatory)
- **Runtime**: Node 20+
- **Package Manager**: Pnpm
- **Monorepo**: Moon/Nx/Turborepo
- **Database**: PostgreSQL 15+ with Drizzle/Kysely ORM
- **CLI**: Commander.js or CAC (NOT yargs)
- **Validation**: Zod 3.22.4+
- **Testing**: Vitest (NOT Jest)

## 📁 Project Structure
```
db_utils/
├── .gitignore
├── .npmrc
├── package.json          <!-- Root workspace config -->
├── pnpm-workspace.yaml   <!-- Pnpm monorepo definition -->
├── tsconfig.json         <!-- Shared TypeScript config (strict mode) -->
├── vitest.config.ts      <!-- Vitest configuration -->
├── .eslintrc.js          <!-- ESLint configuration -->
├── .prettierrc.json      <!-- Prettier configuration -->
├── doc/                  <!-- Documentation -->
├── packages/             <!-- Monorepo packages -->
│   ├── types/            <!-- Shared types (no dependencies) -->
│   ├── utils/            <!-- Utilities (depends: types) -->
│   ├── core/             <!-- Database logic (depends: types, utils) -->
│   └── cli/              <!-- CLI entry point (depends: types, utils, core) -->
└── plans/                <!-- Implementation plans -->
```

## ✅ Key Components
1. **CLI Entry Point**: Main script for parsing command-line arguments
2. **Database Connection**: TypeScript implementation for connecting to PostgreSQL instances
3. **Data Transfer Logic**: Core functionality for migrating data between databases
4. **Error Handling**: Robust error management for database operations
5. **Security**: Credential management via environment variables

This document serves as a high-level guide to the project architecture and implementation plan.