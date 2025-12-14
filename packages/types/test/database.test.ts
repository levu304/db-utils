import { describe, it, expect } from 'vitest';
import type { ConnectionConfig, DatabaseConfig } from '../src/database';

describe('Database Types', () => {
  describe('ConnectionConfig', () => {
    it('should define required properties', () => {
      const config: ConnectionConfig = {
        host: 'localhost',
        port: 5432,
        database: 'testdb',
        username: 'testuser',
        password: 'testpass',
      };
      
      expect(config.host).toBe('localhost');
      expect(config.port).toBe(5432);
      expect(config.database).toBe('testdb');
      expect(config.username).toBe('testuser');
      expect(config.password).toBe('testpass');
    });

    it('should allow optional properties', () => {
      const config: ConnectionConfig = {
        host: 'localhost',
        port: 5432,
        database: 'testdb',
        username: 'testuser',
        password: 'testpass',
        ssl: true,
        connectionTimeout: 30000,
        queryTimeout: 60000,
      };
      
      expect(config.ssl).toBe(true);
      expect(config.connectionTimeout).toBe(30000);
      expect(config.queryTimeout).toBe(60000);
    });
  });

  describe('DatabaseConfig', () => {
    it('should allow url-based configuration', () => {
      const config: DatabaseConfig = {
        url: 'postgres://user:pass@localhost:5432/db',
      };
      
      expect(config.url).toBe('postgres://user:pass@localhost:5432/db');
    });

    it('should allow connection-based configuration', () => {
      const connectionConfig: ConnectionConfig = {
        host: 'localhost',
        port: 5432,
        database: 'testdb',
        username: 'testuser',
        password: 'testpass',
      };
      
      const config: DatabaseConfig = {
        connection: connectionConfig,
        maxConnections: 20,
        minConnections: 5,
        batchSize: 1000,
      };
      
      expect(config.connection).toBe(connectionConfig);
      expect(config.maxConnections).toBe(20);
      expect(config.minConnections).toBe(5);
      expect(config.batchSize).toBe(1000);
    });
  });
});
