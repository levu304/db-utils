/**
 * Schema discovery module for PostgreSQL
 * Based on AGENTS.md requirements
 */

import { 
  type Result, 
  success, 
  failure,
  QueryError
} from '@db-utils/types';
import { PostgresConnectionManager } from './connection';
import { logger } from '@db-utils/utils';

/**
 * Database object types
 */
export type DatabaseObjectType = 'table' | 'view' | 'materialized_view' | 'sequence' | 'function' | 'procedure';

/**
 * Column information
 */
export interface ColumnInfo {
  /** Column name */
  name: string;
  
  /** Data type */
  dataType: string;
  
  /** Whether column is nullable */
  isNullable: boolean;
  
  /** Default value */
  defaultValue: string | null;
  
  /** Whether column is a primary key */
  isPrimaryKey: boolean;
  
  /** Whether column is unique */
  isUnique: boolean;
  
  /** Column ordinal position */
  ordinalPosition: number;
}

/**
 * Table information
 */
export interface TableInfo {
  /** Schema name */
  schema: string;
  
  /** Table name */
  name: string;
  
  /** Table type */
  type: DatabaseObjectType;
  
  /** Table columns */
  columns: ColumnInfo[];
  
  /** Primary key columns */
  primaryKey: string[];
  
  /** Foreign key constraints */
  foreignKeys: ForeignKeyInfo[];
  
  /** Unique constraints */
  uniqueConstraints: UniqueConstraintInfo[];
  
  /** Table comment */
  comment: string | null;
}

/**
 * Foreign key information
 */
export interface ForeignKeyInfo {
  /** Constraint name */
  constraintName: string;
  
  /** Column name */
  columnName: string;
  
  /** Referenced schema */
  referencedSchema: string;
  
  /** Referenced table */
  referencedTable: string;
  
  /** Referenced column */
  referencedColumn: string;
}

/**
 * Unique constraint information
 */
export interface UniqueConstraintInfo {
  /** Constraint name */
  constraintName: string;
  
  /** Column names */
  columnNames: string[];
}

/**
 * Database schema information
 */
export interface SchemaInfo {
  /** Database name */
  databaseName: string;
  
  /** Tables in the schema */
  tables: TableInfo[];
  
  /** Views in the schema */
  views: TableInfo[];
  
  /** Materialized views in the schema */
  materializedViews: TableInfo[];
}

/**
 * Options for schema discovery
 */
export interface SchemaDiscoveryOptions {
  /** Include system schemas */
  includeSystemSchemas?: boolean;
  
  /** Include table data statistics */
  includeStatistics?: boolean;
  
  /** Specific schemas to include */
  schemas?: string[];
  
  /** Specific tables to include */
  tables?: string[];
}

/**
 * Schema discovery service
 */
export class SchemaDiscovery {
  constructor(private readonly connectionManager: PostgresConnectionManager) {}

  /**
   * Discover the complete database schema
   * @param options - Discovery options
   * @returns Schema information or error
   */
  async discoverSchema(options: SchemaDiscoveryOptions = {}): Promise<Result<SchemaInfo, Error>> {
    try {
      logger.info('Starting schema discovery');
      
      // Get database name
      const databaseName = await this.getDatabaseName();
      
      // Get tables and views
      const tables = await this.discoverTables(options);
      const views = await this.discoverViews(options);
      const materializedViews = await this.discoverMaterializedViews(options);
      
      const schemaInfo: SchemaInfo = {
        databaseName,
        tables,
        views,
        materializedViews,
      };
      
      logger.info('Schema discovery completed successfully', { 
        tableCount: tables.length, 
        viewCount: views.length,
        materializedViewCount: materializedViews.length
      });
      
      return success(schemaInfo);
    } catch (error) {
      logger.error('Schema discovery failed', { error });
      return failure(new QueryError(
        `Schema discovery failed: ${error instanceof Error ? error.message : String(error)}`,
        'SCHEMA_DISCOVERY_ERROR'
      ));
    }
  }

  /**
   * Get the current database name
   * @returns Database name
   */
  private async getDatabaseName(): Promise<string> {
    const result = await this.connectionManager.query<{ current_database: string }>(
      'SELECT current_database()'
    );
    return result.rows[0].current_database;
  }

  /**
   * Discover tables in the database
   * @param options - Discovery options
   * @returns Array of table information
   */
  private async discoverTables(options: SchemaDiscoveryOptions): Promise<TableInfo[]> {
    const schemas = this.buildSchemaFilter(options.schemas, options.includeSystemSchemas);
    
    const query = `
      SELECT 
        t.table_schema,
        t.table_name,
        t.table_type,
        pgd.description as table_comment
      FROM information_schema.tables t
      LEFT JOIN pg_catalog.pg_class c ON c.relname = t.table_name
      LEFT JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace AND n.nspname = t.table_schema
      LEFT JOIN pg_catalog.pg_description pgd ON pgd.objoid = c.oid AND pgd.objsubid = 0
      WHERE t.table_type = 'BASE TABLE'
      ${schemas}
      ORDER BY t.table_schema, t.table_name
    `;
    
    const result = await this.connectionManager.query<{
      table_schema: string;
      table_name: string;
      table_type: string;
      table_comment: string | null;
    }>(query);
    
    const tables: TableInfo[] = [];
    for (const row of result.rows as Array<{table_schema: string, table_name: string, table_comment: string | null}>) {
      const tableInfo = await this.discoverTableDetails(
        row.table_schema, 
        row.table_name,
        row.table_comment
      );
      tables.push(tableInfo);
    }
    
    return tables;
  }

  /**
   * Discover views in the database
   * @param options - Discovery options
   * @returns Array of view information
   */
  private async discoverViews(options: SchemaDiscoveryOptions): Promise<TableInfo[]> {
    const schemas = this.buildSchemaFilter(options.schemas, options.includeSystemSchemas);
    
    const query = `
      SELECT 
        t.table_schema,
        t.table_name,
        t.table_type,
        pgd.description as table_comment
      FROM information_schema.tables t
      LEFT JOIN pg_catalog.pg_class c ON c.relname = t.table_name
      LEFT JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace AND n.nspname = t.table_schema
      LEFT JOIN pg_catalog.pg_description pgd ON pgd.objoid = c.oid AND pgd.objsubid = 0
      WHERE t.table_type = 'VIEW'
      ${schemas}
      ORDER BY t.table_schema, t.table_name
    `;
    
    const result = await this.connectionManager.query<{
      table_schema: string;
      table_name: string;
      table_type: string;
      table_comment: string | null;
    }>(query);
    
    const views: TableInfo[] = [];
    for (const row of result.rows as Array<{table_schema: string, table_name: string, table_comment: string | null}>) {
      const viewInfo = await this.discoverTableDetails(
        row.table_schema, 
        row.table_name,
        row.table_comment
      );
      views.push(viewInfo);
    }
    
    return views;
  }

  /**
   * Discover materialized views in the database
   * @param options - Discovery options
   * @returns Array of materialized view information
   */
  private async discoverMaterializedViews(options: SchemaDiscoveryOptions): Promise<TableInfo[]> {
    const schemas = this.buildSchemaFilter(options.schemas, options.includeSystemSchemas);
    
    const query = `
      SELECT 
        schemaname as table_schema,
        matviewname as table_name,
        'MATERIALIZED VIEW' as table_type,
        NULL as table_comment
      FROM pg_matviews
      WHERE 1=1
      ${schemas.replace(/t\.table_schema/g, 'schemaname')}
      ORDER BY schemaname, matviewname
    `;
    
    const result = await this.connectionManager.query<{
      table_schema: string;
      table_name: string;
      table_type: string;
      table_comment: string | null;
    }>(query);
    
    const materializedViews: TableInfo[] = [];
    for (const row of result.rows as Array<{table_schema: string, table_name: string, table_comment: string | null}>) {
      const viewInfo = await this.discoverTableDetails(
        row.table_schema, 
        row.table_name,
        row.table_comment
      );
      materializedViews.push(viewInfo);
    }
    
    return materializedViews;
  }

  /**
   * Discover detailed information about a specific table
   * @param schema - Schema name
   * @param tableName - Table name
   * @param comment - Table comment
   * @returns Detailed table information
   */
  private async discoverTableDetails(
    schema: string, 
    tableName: string,
    comment: string | null
  ): Promise<TableInfo> {
    // Get columns information
    const columns = await this.discoverColumns(schema, tableName);
    
    // Get primary key information
    const primaryKey = await this.discoverPrimaryKey(schema, tableName);
    
    // Get foreign key information
    const foreignKeys = await this.discoverForeignKeys(schema, tableName);
    
    // Get unique constraint information
    const uniqueConstraints = await this.discoverUniqueConstraints(schema, tableName);
    
    return {
      schema,
      name: tableName,
      type: 'table', // This will be updated based on the actual type
      columns,
      primaryKey,
      foreignKeys,
      uniqueConstraints,
      comment,
    };
  }

  /**
   * Discover columns for a specific table
   * @param schema - Schema name
   * @param tableName - Table name
   * @returns Array of column information
   */
  private async discoverColumns(schema: string, tableName: string): Promise<ColumnInfo[]> {
    const query = `
      SELECT 
        c.column_name,
        c.data_type,
        c.is_nullable = 'YES' as is_nullable,
        c.column_default as default_value,
        c.ordinal_position,
        CASE 
          WHEN tc.constraint_type = 'PRIMARY KEY' THEN true 
          ELSE false 
        END as is_primary_key,
        CASE 
          WHEN tc2.constraint_type = 'UNIQUE' THEN true 
          ELSE false 
        END as is_unique
      FROM information_schema.columns c
      LEFT JOIN information_schema.key_column_usage kcu 
        ON c.table_schema = kcu.table_schema 
        AND c.table_name = kcu.table_name 
        AND c.column_name = kcu.column_name
      LEFT JOIN information_schema.table_constraints tc 
        ON kcu.constraint_schema = tc.constraint_schema 
        AND kcu.constraint_name = tc.constraint_name 
        AND tc.constraint_type = 'PRIMARY KEY'
      LEFT JOIN information_schema.table_constraints tc2 
        ON kcu.constraint_schema = tc2.constraint_schema 
        AND kcu.constraint_name = tc2.constraint_name 
        AND tc2.constraint_type = 'UNIQUE'
      WHERE c.table_schema = $1 
        AND c.table_name = $2
      ORDER BY c.ordinal_position
    `;
    
    const result = await this.connectionManager.execute<{
      column_name: string;
      data_type: string;
      is_nullable: boolean;
      default_value: string | null;
      ordinal_position: number;
      is_primary_key: boolean;
      is_unique: boolean;
    }>(query, [schema, tableName]);
    
    return result.rows.map((row: {column_name: string, data_type: string, is_nullable: boolean, default_value: string | null, ordinal_position: number, is_primary_key: boolean, is_unique: boolean}) => ({
      name: row.column_name,
      dataType: row.data_type,
      isNullable: row.is_nullable,
      defaultValue: row.default_value,
      isPrimaryKey: row.is_primary_key,
      isUnique: row.is_unique,
      ordinalPosition: row.ordinal_position,
    }));
  }

  /**
   * Discover primary key for a specific table
   * @param schema - Schema name
   * @param tableName - Table name
   * @returns Array of primary key column names
   */
  private async discoverPrimaryKey(schema: string, tableName: string): Promise<string[]> {
    const query = `
      SELECT kcu.column_name
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu 
        ON tc.constraint_schema = kcu.constraint_schema
        AND tc.constraint_name = kcu.constraint_name
      WHERE tc.constraint_type = 'PRIMARY KEY'
        AND tc.table_schema = $1
        AND tc.table_name = $2
      ORDER BY kcu.ordinal_position
    `;
    
    const result = await this.connectionManager.execute<{
      column_name: string;
    }>(query, [schema, tableName]);
    
    return result.rows.map(row => row.column_name);
  }

  /**
   * Discover foreign keys for a specific table
   * @param schema - Schema name
   * @param tableName - Table name
   * @returns Array of foreign key information
   */
  private async discoverForeignKeys(schema: string, tableName: string): Promise<ForeignKeyInfo[]> {
    const query = `
      SELECT 
        tc.constraint_name,
        kcu.column_name,
        ccu.table_schema as referenced_schema,
        ccu.table_name as referenced_table,
        ccu.column_name as referenced_column
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu 
        ON tc.constraint_schema = kcu.constraint_schema
        AND tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage ccu 
        ON ccu.constraint_schema = tc.constraint_schema
        AND ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_schema = $1
        AND tc.table_name = $2
    `;
    
    const result = await this.connectionManager.execute<{
      constraint_name: string;
      column_name: string;
      referenced_schema: string;
      referenced_table: string;
      referenced_column: string;
    }>(query, [schema, tableName]);
    
    return result.rows.map(row => ({
      constraintName: row.constraint_name,
      columnName: row.column_name,
      referencedSchema: row.referenced_schema,
      referencedTable: row.referenced_table,
      referencedColumn: row.referenced_column,
    }));
  }

  /**
   * Discover unique constraints for a specific table
   * @param schema - Schema name
   * @param tableName - Table name
   * @returns Array of unique constraint information
   */
  private async discoverUniqueConstraints(schema: string, tableName: string): Promise<UniqueConstraintInfo[]> {
    const query = `
      SELECT 
        tc.constraint_name,
        ARRAY_AGG(kcu.column_name ORDER BY kcu.ordinal_position) as column_names
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu 
        ON tc.constraint_schema = kcu.constraint_schema
        AND tc.constraint_name = kcu.constraint_name
      WHERE tc.constraint_type = 'UNIQUE'
        AND tc.table_schema = $1
        AND tc.table_name = $2
      GROUP BY tc.constraint_name
    `;
    
    const result = await this.connectionManager.execute<{
      constraint_name: string;
      column_names: string[];
    }>(query, [schema, tableName]);
    
    return result.rows.map(row => ({
      constraintName: row.constraint_name,
      columnNames: row.column_names,
    }));
  }

  /**
   * Build schema filter for queries
   * @param schemas - Specific schemas to include
   * @param includeSystemSchemas - Whether to include system schemas
   * @returns SQL filter string
   */
  private buildSchemaFilter(schemas?: string[], includeSystemSchemas?: boolean): string {
    const filters: string[] = [];
    
    if (!includeSystemSchemas) {
      filters.push("AND t.table_schema NOT IN ('information_schema', 'pg_catalog', 'pg_toast')");
    }
    
    if (schemas && schemas.length > 0) {
      const schemaList = schemas.map(s => `'${s}'`).join(', ');
      filters.push(`AND t.table_schema IN (${schemaList})`);
    }
    
    return filters.join(' ');
  }
}

/**
 * Create a new schema discovery service
 * @param connectionManager - PostgreSQL connection manager
 * @returns SchemaDiscovery instance
 */
export function createSchemaDiscovery(connectionManager: PostgresConnectionManager): SchemaDiscovery {
  return new SchemaDiscovery(connectionManager);
}
