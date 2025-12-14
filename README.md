# DB Utils

PostgreSQL Data Transfer CLI Tool

## Overview

DB Utils is a command-line interface tool for transferring data between PostgreSQL databases. It provides schema discovery, data migration, and database management capabilities.

## Features

- 🔄 **Data Transfer**: Transfer data between PostgreSQL databases
- 🔍 **Schema Discovery**: Discover and analyze database schemas
- ⚡ **Batch Processing**: Efficient batch operations with configurable sizes
- 🔐 **Secure**: Environment variable-based configuration, parameterized queries
- 📊 **Progress Tracking**: Real-time progress monitoring
- 🛡️ **Error Handling**: Robust error management with retry logic

## Installation

```bash
npm install -g @db-utils/cli
```

## Usage

### Basic Transfer

```bash
dbu transfer --from "postgres://user:pass@host:port/source_db" --to "postgres://user:pass@host:port/target_db"
```

### Advanced Options

```bash
dbu transfer \
  --from "postgres://user:pass@host:port/source_db" \
  --to "postgres://user:pass@host:port/target_db" \
  --batch-size 1000 \
  --schemas "public,app" \
  --tables "users,orders" \
  --include-system-schemas
```

## Commands

### `transfer`

Transfer data between PostgreSQL databases

Options:
- `-f, --from <url>`: Source database URL
- `-t, --to <url>`: Target database URL
- `--batch-size <number>`: Batch size for operations (default: 1000)
- `--include-system-schemas`: Include system schemas in transfer
- `--schemas <schemas>`: Comma-separated list of schemas to transfer
- `--tables <tables>`: Comma-separated list of tables to transfer

## Development

### Prerequisites

- Node.js 20+
- pnpm
- PostgreSQL 15+

### Setup

```bash
pnpm install
pnpm build
```

### Testing

```bash
pnpm test
pnpm test:coverage
```

## Architecture

DB Utils follows a monorepo architecture with the following packages:

- `@db-utils/types`: Shared types and interfaces
- `@db-utils/utils`: Utility functions and helpers
- `@db-utils/core`: Core database functionality
- `@db-utils/cli`: Command-line interface

## Security

- 🔒 All database credentials are handled via environment variables
- 🛡️ All SQL queries use parameterized statements
- 🔍 Input validation with Zod schema validation
- 📋 Connection string parsing and validation

## License

MIT
