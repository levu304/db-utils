import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PostgresConnectionManager, createConnectionManager } from '../src/connection';
import { 
  ConnectionError, 
  ConfigurationError,
  type DatabaseConfig 
} from '@db-utils/types';
import { Pool } from 'pg';

// Mock pg module
vi.mock('pg', () => {
  const mockPool = {
    connect: vi.fn().mockResolvedValue({
      release: vi.fn(),
    }),
    query: vi.fn().mockResolvedValue({
      rows: [],
      rowCount: 0,
    }),
    end: vi.fn().mockResolvedValue(undefined),
  };
  
  return {
    Pool: vi.fn(() => mockPool),
    mockPool,
  };
});

describe('PostgresConnectionManager', () => {
  const mockDatabaseConfig: DatabaseConfig = {
    url: 'postgres://test:test@localhost:5432/testdb',
  };

  describe('constructor', () => {
    it('should create a connection manager instance', () => {
      const manager = new PostgresConnectionManager(mockDatabaseConfig);
      expect(manager).toBeInstanceOf(PostgresConnectionManager);
    });
  });

  describe('initialize', () => {
    let manager: PostgresConnectionManager;

    beforeEach(() => {
      manager = new PostgresConnectionManager(mockDatabaseConfig);
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    it('should initialize the connection pool successfully', async () => {
      await expect(manager.initialize()).resolves.toBeUndefined();
      expect(manager.getPool()).not.toBeNull();
    });

    it('should handle initialization errors', async () => {
      vi.mocked(Pool.prototype.connect).mockRejectedValue(new Error('Connection failed'));
      
      await expect(manager.initialize()).rejects.toThrow(ConnectionError);
    });

    it('should warn if already initialized', async () => {
      await manager.initialize();
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      await manager.initialize();
      expect(consoleWarnSpy).toHaveBeenCalledWith('Connection pool already initialized');
      
      consoleWarnSpy.mockRestore();
    });
  });

  describe('close', () => {
    let manager: PostgresConnectionManager;

    beforeEach(() => {
      manager = new PostgresConnectionManager(mockDatabaseConfig);
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    it('should close the connection pool successfully', async () => {
      await manager.initialize();
      await expect(manager.close()).resolves.toBeUndefined();
      expect(manager.getPool()).toBeNull();
    });

    it('should handle close errors', async () => {
      await manager.initialize();
      vi.mocked(Pool.prototype.end).mockRejectedValue(new Error('Close failed'));
      
      await expect(manager.close()).rejects.toThrow(ConnectionError);
    });

    it('should warn if pool is not initialized', async () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      await manager.close();
      expect(consoleWarnSpy).toHaveBeenCalledWith('Connection pool not initialized');
      
      consoleWarnSpy.mockRestore();
    });
  });

  describe('query', () => {
    let manager: PostgresConnectionManager;

    beforeEach(async () => {
      manager = new PostgresConnectionManager(mockDatabaseConfig);
      await manager.initialize();
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    it('should execute a query successfully', async () => {
      const mockResult = {
        rows: [{ id: 1, name: 'test' }],
        rowCount: 1,
      };
      vi.mocked(Pool.prototype.query).mockResolvedValue(mockResult);
      
      const result = await manager.query('SELECT * FROM test');
      expect(result).toEqual(mockResult);
    });

    it('should handle query errors', async () => {
      vi.mocked(Pool.prototype.query).mockRejectedValue(new Error('Query failed'));
      
      await expect(manager.query('SELECT * FROM test')).rejects.toThrow(ConnectionError);
    });

    it('should throw error if pool is not initialized', async () => {
      const uninitManager = new PostgresConnectionManager(mockDatabaseConfig);
      await expect(uninitManager.query('SELECT * FROM test')).rejects.toThrow(ConnectionError);
    });
  });

  describe('execute', () => {
    let manager: PostgresConnectionManager;

    beforeEach(async () => {
      manager = new PostgresConnectionManager(mockDatabaseConfig);
      await manager.initialize();
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    it('should execute a query with parameters', async () => {
      const mockResult = {
        rows: [{ id: 1, name: 'test' }],
        rowCount: 1,
      };
      vi.mocked(Pool.prototype.query).mockResolvedValue(mockResult);
      
      const result = await manager.execute('SELECT * FROM test WHERE id = $1', [1]);
      expect(result).toEqual(mockResult);
      expect(Pool.prototype.query).toHaveBeenCalledWith('SELECT * FROM test WHERE id = $1', [1]);
    });
  });

  describe('getPool', () => {
    it('should return null if pool is not initialized', () => {
      const manager = new PostgresConnectionManager(mockDatabaseConfig);
      expect(manager.getPool()).toBeNull();
    });

    it('should return pool instance after initialization', async () => {
      const manager = new PostgresConnectionManager(mockDatabaseConfig);
      await manager.initialize();
      expect(manager.getPool()).not.toBeNull();
    });
  });

  describe('createConnectionManager', () => {
    it('should create a connection manager instance', () => {
      const manager = createConnectionManager(mockDatabaseConfig);
      expect(manager).toBeInstanceOf(PostgresConnectionManager);
    });
  });
});
