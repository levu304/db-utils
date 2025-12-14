# Transfer data between databases
db transfer --from "postgres://user:pass@host:port/db" --to "postgres://user:pass@host:port/db"
```

## 📦 Publishing
1. Configure `package.json` for npm registry
2. Run `npm publish` to publish CLI package
3. Verify CLI works in different environments

## 📜 License
See `LICENSE.md` for project licensing details

## 🧑‍🤝‍🧑 Contributing
See `contributing.md` for guidelines on how to contribute

## 📁 Project Structure
```
db_utils/
├── .gitignore
├── .moon
├── doc/              <!-- This directory -->
├── packages/         <!-- Core implementation -->
└── .npmrc
```

## 🌐 Dependencies
- [TypeScript](https://www.typescriptlang.org/)
- [PNPM](https://pnpm.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Moon](https://github.com/moonrepo/moon) (Monorepo tool)
``` 
