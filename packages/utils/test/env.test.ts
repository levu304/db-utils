import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { 
  connectionConfigSchema, 
  databaseConfigSchema, 
  parseDatabaseUrl, 
  validateEnvironment 
} from '../src/env';
import { ConfigurationError, ENV_VARS } from '@db-utils/types';

describe('Environment Utilities', () => {
  describe('connectionConfigSchema', () => {
    it('should validate a correct connection configuration', () => {
      const config = {
        host: 'localhost',
        port: 5432,
        database: 'testdb',
        username: 'testuser',
        password: 'testpass',
      };
      
      const result = connectionConfigSchema.safeParse(config);
      expect(result.success).toBe(true);
    });

    it('should reject missing required fields', () => {
      const config = {
        host: 'localhost',
        port: 5432,
        // missing database, username, password
      };
      
      const result = connectionConfigSchema.safeParse(config);
      expect(result.success).toBe(false);
    });

    it('should reject invalid port numbers', () => {
      const config = {
        host: 'localhost',
        port: 99999, // invalid port
        database: 'testdb',
        username: 'testuser',
        password: 'testpass',
      };
      
      const result = connectionConfigSchema.safeParse(config);
      expect(result.success).toBe(false);
    });
  });

  describe('databaseConfigSchema', () => {
    it('should validate a configuration with URL', () => {
      const config = {
        url: 'postgres://user:pass@localhost:5432/db',
      };
      
      const result = databaseConfigSchema.safeParse(config);
      expect(result.success).toBe(true);
    });

    it('should validate a configuration with connection object', () => {
      const config = {
        connection: {
          host: 'localhost',
          port: 5432,
          database: 'testdb',
          username: 'testuser',
          password: 'testpass',
        },
      };
      
      const result = databaseConfigSchema.safeParse(config);
      expect(result.success).toBe(true);
    });

    it('should reject configuration without url or connection', () => {
      const config = {
        maxConnections: 20,
        // missing url and connection
      };
      
      const result = databaseConfigSchema.safeParse(config);
      expect(result.success).toBe(false);
    });
  });

  describe('parseDatabaseUrl', () => {
    it('should parse a valid PostgreSQL URL', () => {
      const url = 'postgres://testuser:testpass@localhost:5432/testdb';
      const result = parseDatabaseUrl(url);
      
      expect(result).toEqual({
        host: 'localhost',
        port: 5432,
        database: 'testdb',
        username: 'testuser',
        password: 'testpass',
      });
    });

    it('should parse a valid PostgreSQL URL with default port', () => {
      const url = 'postgres://testuser:testpass@localhost/testdb';
      const result = parseDatabaseUrl(url);
      
      expect(result).toEqual({
        host: 'localhost',
        port: 5432, // default PostgreSQL port
        database: 'testdb',
        username: 'testuser',
        password: 'testpass',
      });
    });

    it('should throw ConfigurationError for invalid protocol', () => {
      const url = 'mysql://testuser:testpass@localhost:3306/testdb';
      
      expect(() => parseDatabaseUrl(url)).toThrow(ConfigurationError);
      expect(() => parseDatabaseUrl(url)).toThrow('Invalid protocol');
    });

    it('should throw ConfigurationError for invalid URL format', () => {
      const url = 'not-a-url';
      
      expect(() => parseDatabaseUrl(url)).toThrow(ConfigurationError);
    });
  });

  describe('validateEnvironment', () => {
    const originalEnv = process.env;

    beforeEach(() => {
      // Reset environment variables
      process.env = { ...originalEnv };
    });

    afterEach(() => {
      // Restore original environment
      process.env = originalEnv;
    });

    it('should validate environment with SOURCE_DATABASE_URL', () => {
      process.env[ENV_VARS.SOURCE_DATABASE_URL] = 'postgres://user:pass@localhost:5432/db';
      
      const result = validateEnvironment();
      expect(result.url).toBe('postgres://user:pass@localhost:5432/db');
    });

    it('should throw ConfigurationError when no database URLs are provided', () => {
      expect(() => validateEnvironment()).toThrow(ConfigurationError);
      expect(() => validateEnvironment()).toThrow('SOURCE_DATABASE_URL or TARGET_DATABASE_URL must be provided');
    });
  });
});
