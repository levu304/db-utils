import { describe, it, expect } from 'vitest';
import * as types from '../src/index';

describe('Types Package', () => {
  it('should export all required types and functions', () => {
    // Result types
    expect(typeof types.success).toBe('function');
    expect(typeof types.failure).toBe('function');
    expect(typeof types.isSuccess).toBe('function');
    expect(typeof types.isFailure).toBe('function');
    
    // Error types
    expect(typeof types.DatabaseError).toBe('function');
    expect(typeof types.ConnectionError).toBe('function');
    expect(typeof types.QueryError).toBe('function');
    expect(typeof types.ValidationError).toBe('function');
    expect(typeof types.ConfigurationError).toBe('function');
    expect(typeof types.TimeoutError).toBe('function');
    
    // Constants
    expect(typeof types.DEFAULT_MAX_CONNECTIONS).toBe('number');
    expect(typeof types.DEFAULT_BATCH_SIZE).toBe('number');
    expect(typeof types.ENV_VARS).toBe('object');
  });

  it('should have correct type definitions', () => {
    // Test that we can create instances of exported types
    const result = types.success('test');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value).toBe('test');
    }
    
    const error = new types.DatabaseError('test error');
    expect(error.message).toBe('test error');
    expect(error.name).toBe('DatabaseError');
    
    expect(types.DEFAULT_MAX_CONNECTIONS).toBe(20);
    expect(types.DEFAULT_BATCH_SIZE).toBe(1000);
  });
});
