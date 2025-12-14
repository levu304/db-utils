
# DB Utils - Agent Requirements

**Version:** 1.0.0 | **Last Updated:** 2025-01-14

---

## 🚨 Mandatory Requirements for All Output

### 1. Technology Stack (2023-2025 only)
- **Runtime:** Node 20+, Bun
- **CLI:** Commander, CAC
- **Database:** PostgreSQL 15+, Drizzle, Kysely
- **Validation:** Zod, Valibot
- **Testing:** Vitest (not Jest)
- **Package Manager:** pnpm
- **Monorepo:** Moon, Nx, Turborepo
- **NO LEGACY:** Sequelize, TypeORM, Jest, Webpack

### 2. Architecture
- **Monorepo:** `packages/{cli,core,types,utils}`
- **Dependency order:** types → utils → core → cli
- **Path aliases:** `@db-utils/types/*`, `@db-utils/utils/*`
- **Overrides:** zod ^3.22.4, pg ^8.11.3

### 3. Code Standards
- **TypeScript:** Strict mode required (noUnusedLocals, noImplicitReturns, etc.)
- **Types:** Never use `any` - use `unknown` with type guards
- **Validation:** Zod for all runtime validation
- **Testing:** 80% coverage minimum, TDD required, Vitest only
- **SOLID:** All 5 principles mandatory
- **Error Handling:** Result type pattern, custom error classes, retry logic
- **Imports:** Node built-ins → external → internal → local → styles

### 4. Naming Conventions
- **Files:** `kebab-case.ts`, `PascalCase.ts` for classes
- **Variables:** `camelCase`
- **Constants:** `UPPER_SNAKE_CASE`
- **Functions:** `verbNoun()` - `getUserById()`, `validateInput()`
- **Types:** `PascalCase` - `type User`, `interface Config`
- **Classes:** `PascalCase` - `class TransferEngine`
- **Enums:** `PascalCase` - `enum Status`

### 5. Security (Non-Negotiable)
- **Credentials:** Environment variables only, never hardcoded
- **SQL:** Parameterized queries only, no string concatenation
- **Validation:** Zod validate all inputs
- **Connection Strings:** Parse and validate

### 6. Database Patterns
- **Connection Pooling:** Max 20 connections, proper timeout config
- **Batch Operations:** Not individual queries (avoid N+1)
- **Streaming:** For large datasets
- **Schema Discovery:** Use information_schema
- **Transactions:** Proper error handling with rollback

### 7. Performance
- **Indexes:** For frequently queried columns
- **Batch Size:** Configurable, default 1000
- **Memory:** Stream large datasets, avoid loading all into memory
- **Query Optimization:** Use EXPLAIN ANALYZE

### 8. Git Workflow
- **Branches:** `feat/`, `fix/`, `docs/`, `refactor/`, `test/`, `chore/`
- **Commits:** `<type>: <description>` - `feat: add schema discovery`
- **Pre-commit:** test, lint, type-check, coverage (all must pass)
- **Review:** Minimum 2 reviewers required

---

## Output Templates

### Issue Template
```markdown
## Tech Requirements
- [ ] Node 20+, Zod, Vitest
- [ ] TypeScript strict mode
- [ ] 80% test coverage

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2

## Testing Strategy
- [ ] Unit tests
- [ ] Integration tests
- [ ] Edge cases

## Security Checklist
- [ ] No hardcoded credentials
- [ ] Parameterized queries
- [ ] Input validation
```

### Plan Template
```markdown
## Implementation
1. Architecture approach
2. Database patterns
3. Error handling strategy

## Checklist
- [ ] SOLID principles
- [ ] No `any` types
- [ ] Zod validation
- [ ] 80% coverage
- [ ] Performance considered
- [ ] Security reviewed
```

### Code Review Checklist
```markdown
- [ ] Architecture follows monorepo patterns
- [ ] TypeScript strict mode passes
- [ ] Tests cover edge cases
- [ ] Error handling comprehensive
- [ ] Performance optimized
- [ ] Security best practices
- [ ] SOLID principles followed
- [ ] Documentation updated
```

---

## Zero-Tolerance Rules

1. **No `any` types** → Use `unknown` with validation
2. **No SQL string concatenation** → Parameterized queries only
3. **No hardcoded credentials** → Environment variables required
4. **No legacy dependencies** → Modern stack only (2023+)
5. **No untested code** → 80% coverage minimum
6. **No SOLID violations** → Principles must be followed
7. **No unvalidated inputs** → Zod validation required
8. **No poor error handling** → Result type pattern required

**Violations = PR blocked**

---

## Quick Reference

### Result Type Pattern
```typescript
type Result<T, E = Error> =
  | { success: true; value: T }
  | { success: false; error: E };
```

### Parameterized Query
```typescript
// ✅ Safe
await db.query('SELECT * FROM users WHERE id = $1', [userId]);

// ❌ Vulnerable
await db.query(`SELECT * FROM users WHERE id = ${userId}`);
```

### Zod Validation
```typescript
const schema = z.object({
  host: z.string().min(1),
  port: z.number().min(1).max(65535)
});
type Config = z.infer<typeof schema>;
```

---

**Keep it comprehensive. Follow the rules. No exceptions.**
