import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { SchemaDiscovery, createSchemaDiscovery } from '../src/schema';
import { PostgresConnectionManager } from '../src/connection';
import { 
  success, 
  failure,
  QueryError,
  type DatabaseConfig 
} from '@db-utils/types';
import { Pool } from 'pg';

// Mock pg module
vi.mock('pg', async (importOriginal) => {
  const originalModule = await importOriginal<typeof import('pg')>();

  // Need to ensure that the mocked Pool class has a prototype these tests can interact with
  class MockClient {
    release = vi.fn();
  }

  class MockPool {
    connect = vi.fn(() => Promise.resolve(new MockClient()));
    query = vi.fn(() => Promise.resolve({ rows: [], rowCount: 0 }));
    end = vi.fn(() => Promise.resolve(undefined));
  }

  return {
    ...originalModule,
    Pool: vi.fn(() => new MockPool()),
  };
});

describe('SchemaDiscovery', () => {
  const mockDatabaseConfig: DatabaseConfig = {
    url: 'postgres://test:test@localhost:5432/testdb',
  };

  let connectionManager: PostgresConnectionManager;
  let schemaDiscovery: SchemaDiscovery;

  beforeEach(async () => {
    connectionManager = new PostgresConnectionManager(mockDatabaseConfig);
    await connectionManager.initialize();
    schemaDiscovery = new SchemaDiscovery(connectionManager);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create a schema discovery instance', () => {
      expect(schemaDiscovery).toBeInstanceOf(SchemaDiscovery);
    });
  });

  describe('discoverSchema', () => {
    it('should discover schema successfully', async () => {
      // Mock database responses
      const mockDatabaseNameResult = {
        rows: [{ current_database: 'testdb' }],
        rowCount: 1,
      };
      
      const mockTablesResult = {
        rows: [
          { table_schema: 'public', table_name: 'users', table_comment: 'User table' },
        ],
        rowCount: 1,
      };
      
      const mockViewsResult = {
        rows: [
          { table_schema: 'public', table_name: 'user_view', table_comment: 'User view' },
        ],
        rowCount: 1,
      };
      
      const mockMaterializedViewsResult = {
        rows: [
          { table_schema: 'public', table_name: 'user_matview', table_comment: null },
        ],
        rowCount: 1,
      };
      
      const mockColumnsResult = {
        rows: [
          {
            column_name: 'id',
            data_type: 'integer',
            is_nullable: false,
            default_value: 'nextval(\'users_id_seq\'::regclass)',
            ordinal_position: 1,
            is_primary_key: true,
            is_unique: true,
          },
        ],
        rowCount: 1,
      };
      
      const mockPrimaryKeyResult = {
        rows: [{ column_name: 'id' }],
        rowCount: 1,
      };
      
      const mockForeignKeysResult = {
        rows: [],
        rowCount: 0,
      };
      
      const mockUniqueConstraintsResult = {
        rows: [],
        rowCount: 0,
      };
      
      vi.mocked(Pool.prototype.query as any).mockImplementation((query: string) => {
        if (query.includes('current_database()')) {
          return Promise.resolve(mockDatabaseNameResult);
        } else if (query.includes('information_schema.tables') && query.includes('BASE TABLE')) {
          return Promise.resolve(mockTablesResult);
        } else if (query.includes('information_schema.tables') && query.includes('VIEW')) {
          return Promise.resolve(mockViewsResult);
        } else if (query.includes('pg_matviews')) {
          return Promise.resolve(mockMaterializedViewsResult);
        }
        return Promise.resolve({ rows: [], rowCount: 0 });
      });
      
      vi.mocked(Pool.prototype.query as any).mockImplementationOnce(() => Promise.resolve(mockDatabaseNameResult))
        .mockImplementationOnce(() => Promise.resolve(mockTablesResult))
        .mockImplementationOnce(() => Promise.resolve(mockViewsResult))
        .mockImplementationOnce(() => Promise.resolve(mockMaterializedViewsResult))
        .mockImplementation(() => Promise.resolve(mockColumnsResult));
      
      // Mock the detailed discovery methods
      vi.spyOn(schemaDiscovery as any, 'discoverColumns').mockResolvedValue(mockColumnsResult.rows);
      vi.spyOn(schemaDiscovery as any, 'discoverPrimaryKey').mockResolvedValue(mockPrimaryKeyResult.rows.map(r => r.column_name));
      vi.spyOn(schemaDiscovery as any, 'discoverForeignKeys').mockResolvedValue(mockForeignKeysResult.rows);
      vi.spyOn(schemaDiscovery as any, 'discoverUniqueConstraints').mockResolvedValue(mockUniqueConstraintsResult.rows);
      
      const result = await schemaDiscovery.discoverSchema();
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value.databaseName).toBe('testdb');
        expect(result.value.tables).toHaveLength(1);
        expect(result.value.views).toHaveLength(1);
        expect(result.value.materializedViews).toHaveLength(1);
      }
    });

    it('should handle schema discovery errors', async () => {
      vi.mocked(Pool.prototype.query as any).mockRejectedValue(new Error('Database error'));
      
      const result = await schemaDiscovery.discoverSchema();
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(QueryError);
      }
    });

    it('should filter schemas when options are provided', async () => {
      const options = {
        schemas: ['public'],
        includeSystemSchemas: false,
      };
      
      const mockResult = {
        rows: [{ current_database: 'testdb' }],
        rowCount: 1,
      };
      vi.mocked(Pool.prototype.query as any).mockResolvedValue(mockResult);
      
      // Mock the detailed discovery methods to return empty arrays
      vi.spyOn(schemaDiscovery as any, 'discoverColumns').mockResolvedValue([]);
      vi.spyOn(schemaDiscovery as any, 'discoverPrimaryKey').mockResolvedValue([]);
      vi.spyOn(schemaDiscovery as any, 'discoverForeignKeys').mockResolvedValue([]);
      vi.spyOn(schemaDiscovery as any, 'discoverUniqueConstraints').mockResolvedValue([]);
      
      const result = await schemaDiscovery.discoverSchema(options);
      expect(result.success).toBe(true);
    });
  });

  describe('createSchemaDiscovery', () => {
    it('should create a schema discovery instance', () => {
      const discovery = createSchemaDiscovery(connectionManager);
      expect(discovery).toBeInstanceOf(SchemaDiscovery);
    });
  });
});
