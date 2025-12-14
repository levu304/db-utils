import { describe, it, expect } from 'vitest';
import * as utils from '../src/index';

describe('Utils Package', () => {
  it('should export all required utilities', () => {
    // Environment utilities
    expect(typeof utils.connectionConfigSchema).toBe('object');
    expect(typeof utils.databaseConfigSchema).toBe('object');
    expect(typeof utils.parseDatabaseUrl).toBe('function');
    expect(typeof utils.validateEnvironment).toBe('function');
    
    // Error utilities
    expect(typeof utils.errorToResult).toBe('function');
    expect(typeof utils.tryAsync).toBe('function');
    expect(typeof utils.trySync).toBe('function');
    expect(typeof utils.getErrorMessage).toBe('function');
    expect(typeof utils.isDatabaseErrorType).toBe('function');
    
    // Logger utilities
    expect(typeof utils.ConsoleLogger).toBe('function');
    expect(typeof utils.createLogger).toBe('function');
    expect(typeof utils.logger).toBe('object');
  });

  it('should have correct utility functionality', () => {
    // Test environment utilities
    const url = 'postgres://test:test@localhost:5432/testdb';
    const parsed = utils.parseDatabaseUrl(url);
    expect(parsed.host).toBe('localhost');
    expect(parsed.port).toBe(5432);
    expect(parsed.database).toBe('testdb');
    expect(parsed.username).toBe('test');
    expect(parsed.password).toBe('test');
    
    // Test error utilities
    const result = utils.trySync(() => 'test');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value).toBe('test');
    }
    
    // Test logger utilities
    const logger = utils.createLogger('test');
    expect(logger).toBeDefined();
    expect(typeof logger.error).toBe('function');
    expect(typeof logger.warn).toBe('function');
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.debug).toBe('function');
  });
});
