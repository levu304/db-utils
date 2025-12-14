# DB Utils Design Document  
**Version:** 1.0 | **Last Updated:** 2025-01-14  

## 1. Overview  
**Objective:** PostgreSQL Data Transfer CLI  
**Core Requirements:**  
- ⚡ Node 20+, TypeScript 5+ (strict mode)  
- 🔄 Monorepo structure with dependency order: `types → utils → core → cli`  
- 🛡️ Secure parameterized queries, Zod validation, no hardcoded credentials  
- 🧪 80%+ test coverage with Vitest (TDD required)  
- 📦 pnpm package manager with workspace overrides  

---

## 2. Architecture  
### 2.1 Monorepo Structure  
```bash
packages/
├── types/     # Base types, constants, error types  
├── utils/     # Validation, config loading, logging  
├── core/      # Database connection, query execution, batch processing  
└── cli/       # Commander.js CLI interface, command orchestration  
```

### 2.2 Tech Stack  
| Layer     | Tool/Dependency                  | Reason                                            |
|-----------|----------------------------------|---------------------------------------------------|
| CLI       | Commander.js                     | Standardized command interface with `dbu` prefix  |
| ORM       | Drizzle                          | TypeScript-first SQL generation                   |
| Validation| Zod 3.22.4+                      | Strong validation for config/env                  |
| Testing   | Vitest                           | Modern, fast, full TypeScript support             |
| Build     | pnpm + Moon                      | Reduced package install size                      |

### 2.3 Dependency Flow  
```
types → utils → core → cli  
|                ↑↓        |  
└─ Error types and constants──┘  
```

---

## 3. Setup Plan  
### 3.1 Initial Configuration  
- [ ] Initialize root `package.json` with pnpm workspace  
- [ ] Configure strict TypeScript with `tsconfig.base.json`  
- [ ] Set up ESLint/Prettier for code quality  
- [ ] Configure Vitest with coverage threshold 80%  
- [ ] Initialize `.env.example` with encrypted environment variables  

### 3.2 Implementation Order  
1. **Types Package** (Week 1)  
   - Define core types, database schema interfaces, error types  
   - 100% type-safe contract for all modules  

2. **Utils Package** (Week 2)  
   - Implement env loading with Zod validation  
   - Add safe logging system with log level filtering  

3. **Core Database Engine** (Week 3-4)  
   - Build connection pooling with timeout management  
   - Implement batch transfer with streaming support  
   - Add transaction rollback and retry logic  

4. **CLI Interface** (Week 5)  
   - Commander.js command hierarchy:  
     ```bash
     dbu transfer --from "postgres://..." --to "postgres://..."  
     dbu backup --source "postgres://..." --output "/path/to/backup"  
     dbu restore --input "/path/to/backup" --target "postgres://..."  
     ```
     *Future commands will be added under the `dbu` prefix as features expand*  

---

## 4. Security  
### 4.1 Credential Management  
- 📂 Environment variables only (never in code)  
- 🔐 Validate credentials with Zod at load time  
- 🔄 Never commit `.env` files to source control  

### 4.2 SQL Safety  
- 🚫 No raw SQL string concatenation  
- ✅ Only parameterized queries using:  
  ```ts
  await db.query('SELECT * FROM users WHERE id = $1', [userId])
  ```

---

## 5. Testing Strategy  
### 5.1 Test Structure  
```
packages/{package}/test/
├── setup.ts         # Test utilities, fixtures
├── {module}.test.ts # Unit/integration tests
└── fixtures/        # Mock data files
```

### 5.2 CI/CD Requirements  
- 🔄 All commits must pass:  
  - ❌ No failing tests  
  - ❌ No ESLint errors  
  - ❌ No type-check failures  
  - ⚠️ Coverage ≥ 80%  

---

## 6. Compliance Checklist  
- [ ] All functions follow SOLID principles  
- [ ] 100% type-safe with `unknown` instead of `any`  
- [ ] Parameterized queries used exclusively  
- [ ] Zod validation for all input data  
- [ ] 80%+ test coverage with Vitest  
- [ ] No hardcoded credentials in repo  
- [ ] Result type pattern for error handling  

---

## 7. Roadmap  
**Week 1-2:** monorepo setup  
**Week 3-4:** database engine  
**Week 5:** CLI interface  
**Week 6-8:** advanced features (schema diff, parallel batches)  
**Week 9:** production release
