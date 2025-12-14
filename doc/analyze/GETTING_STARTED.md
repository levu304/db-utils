# Getting Started

**Status:** ✅ Ready for Development

## 3 Critical Decisions

Before starting, choose one option for each:

### 1. Monorepo Tool
- [ ] Moon (recommended - fast, simple)
- [ ] Nx (full-featured)
- [ ] Turborepo (incremental builds)

### 2. CLI Framework
- [ ] Commander.js (recommended)
- [ ] CAC (lighter)

### 3. Database ORM
- [ ] Drizzle (recommended)
- [ ] Kysely

## Next Steps

1. **Review [AGENTS.md](AGENTS.md)** - Mandatory requirements
2. **Review [doc/tech-stack.md](doc/tech-stack.md)** - Technology choices
3. **Review [doc/dependencies.md](doc/dependencies.md)** - Dependencies & structure
4. **Review [plans/implementation_plan.md](plans/implementation_plan.md)** - Timeline & tasks
5. **Review [doc/roadmap.md](doc/roadmap.md)** - Development roadmap

## Week 1-2 Setup

```
├── Initialize root package.json
├── Create pnpm-workspace.yaml
├── Configure TypeScript (strict mode)
├── Set up Vitest
├── Configure ESLint + Prettier
├── Initialize monorepo structure:
│   ├── packages/types/
│   ├── packages/utils/
│   ├── packages/core/
│   └── packages/cli/
├── Set up pre-commit hooks
└── First git commit
```

See detailed checklist in [PRE_DEVELOPMENT_CHECKLIST.md](PRE_DEVELOPMENT_CHECKLIST.md)

## Key Requirements (Non-Negotiable)

- ✅ Node 20+, TypeScript 5+ (strict)
- ✅ Vitest (not Jest)
- ✅ Zod 3.22.4+ validation
- ✅ 80% test coverage minimum
- ✅ No `any` types
- ✅ Parameterized SQL queries only
- ✅ No hardcoded credentials
- ✅ Result type for error handling
- ✅ SOLID principles

See [AGENTS.md](AGENTS.md) for all requirements.

## Questions?

- **Architecture?** → [doc/dependencies.md](doc/dependencies.md)
- **Tech Stack?** → [doc/tech-stack.md](doc/tech-stack.md)
- **Timeline?** → [plans/implementation_plan.md](plans/implementation_plan.md)
- **Setup?** → [PRE_DEVELOPMENT_CHECKLIST.md](PRE_DEVELOPMENT_CHECKLIST.md)
- **Roadmap?** → [doc/roadmap.md](doc/roadmap.md)
