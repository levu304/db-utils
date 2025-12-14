# Schema Discovery

## Overview

The schema discovery module is a core component of DB Utils that provides comprehensive database schema analysis capabilities. It allows you to introspect PostgreSQL databases and extract detailed information about tables, views, columns, constraints, and relationships.

## Features

- 🔍 **Complete Schema Analysis**: Discover all database objects including tables, views, and materialized views
- 📋 **Column Details**: Extract detailed column information including data types, constraints, and defaults
- 🔗 **Relationship Mapping**: Identify primary keys, foreign keys, and unique constraints
- 🏷️ **Metadata Extraction**: Retrieve table and column comments
- 🎯 **Filtering Options**: Filter by schemas, tables, and system objects

## Usage

### Basic Schema Discovery

```typescript
import { createConnectionManager, createSchemaDiscovery } from '@db-utils/core';

// Create connection manager
const connectionManager = createConnectionManager({
  url: 'postgres://user:pass@localhost:5432/mydb'
});

// Initialize connection
await connectionManager.initialize();

// Create schema discovery service
const schemaDiscovery = createSchemaDiscovery(connectionManager);

// Discover schema
const result = await schemaDiscovery.discoverSchema();
if (result.success) {
  console.log('Database:', result.value.databaseName);
  console.log('Tables:', result.value.tables.length);
  console.log('Views:', result.value.views.length);
}
```

### Advanced Options

```typescript
const result = await schemaDiscovery.discoverSchema({
  includeSystemSchemas: false,  // Exclude system schemas
  schemas: ['public', 'app'],    // Only specific schemas
  tables: ['users', 'orders']    // Only specific tables
});
```

## Data Structures

### SchemaInfo

```typescript
interface SchemaInfo {
  databaseName: string;
  tables: TableInfo[];
  views: TableInfo[];
  materializedViews: TableInfo[];
}
```

### TableInfo

```typescript
interface TableInfo {
  schema: string;
  name: string;
  type: 'table' | 'view' | 'materialized_view';
  columns: ColumnInfo[];
  primaryKey: string[];
  foreignKeys: ForeignKeyInfo[];
  uniqueConstraints: UniqueConstraintInfo[];
  comment: string | null;
}
```

### ColumnInfo

```typescript
interface ColumnInfo {
  name: string;
  dataType: string;
  isNullable: boolean;
  defaultValue: string | null;
  isPrimaryKey: boolean;
  isUnique: boolean;
  ordinalPosition: number;
}
```

## SQL Queries Used

The schema discovery module uses PostgreSQL's `information_schema` views and system catalogs to extract metadata:

- `information_schema.tables` - Table and view information
- `information_schema.columns` - Column details
- `information_schema.table_constraints` - Constraint information
- `information_schema.key_column_usage` - Key column mappings
- `pg_matviews` - Materialized views
- `pg_description` - Object comments

## Performance Considerations

- ⚡ Uses efficient SQL queries with proper indexing
- 📦 Results are returned as structured data objects
- 🔄 Connection pooling for concurrent operations
- ⏱️ Configurable timeouts and connection settings

## Security

- 🛡️ All queries are parameterized to prevent SQL injection
- 🔐 Connection credentials are handled securely
- 📋 Input validation for all filter options
- 🔄 Proper error handling and logging

## Example Output

```json
{
  "databaseName": "myapp",
  "tables": [
    {
      "schema": "public",
      "name": "users",
      "type": "table",
      "columns": [
        {
          "name": "id",
          "dataType": "integer",
          "isNullable": false,
          "defaultValue": "nextval('users_id_seq'::regclass)",
          "isPrimaryKey": true,
          "isUnique": true,
          "ordinalPosition": 1
        },
        {
          "name": "email",
          "dataType": "character varying",
          "isNullable": false,
          "defaultValue": null,
          "isPrimaryKey": false,
          "isUnique": true,
          "ordinalPosition": 2
        }
      ],
      "primaryKey": ["id"],
      "foreignKeys": [],
      "uniqueConstraints": [
        {
          "constraintName": "users_email_key",
          "columnNames": ["email"]
        }
      ],
      "comment": "User accounts table"
    }
  ],
  "views": [],
  "materializedViews": []
}
