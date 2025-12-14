# Project Overview

## 📌 Purpose
This project implements a command-line interface (CLI) tool for transferring data between PostgreSQL databases. The core functionality is to backup data from a source PostgreSQL database (A) to a target PostgreSQL database (B) using the command:  
`db transfer --from <pg_url> --to <pg_url>`

## 🛠 Tech Stack
- **Language**: TypeScript
- **Package Manager**: Pnpm
- **Database**: PostgreSQL (using `pg` client library)
- **CLI Parsing**: `yargs` for command-line argument handling

## 📁 Project Structure
```
db_utils/
├── .gitignore
├── .moon
├── doc/              <!-- This directory -->
├── packages/         <!-- Core implementation -->
└── .npmrc
```

## ✅ Key Components
1. **CLI Entry Point**: Main script for parsing command-line arguments
2. **Database Connection**: TypeScript implementation for connecting to PostgreSQL instances
3. **Data Transfer Logic**: Core functionality for migrating data between databases
4. **Error Handling**: Robust error management for database operations
5. **Security**: Credential management via environment variables

This document serves as a high-level guide to the project architecture and implementation plan.