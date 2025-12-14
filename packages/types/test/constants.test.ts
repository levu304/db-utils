import { describe, it, expect } from 'vitest';
import {
  DEFAULT_MAX_CONNECTIONS,
  DEFAULT_MIN_CONNECTIONS,
  DEFAULT_CONNECTION_TIMEOUT,
  DEFAULT_QUERY_TIMEOUT,
  DEFAULT_POOL_TIMEOUT,
  DEFAULT_BATCH_SIZE,
  MIN_BATCH_SIZE,
  MAX_BATCH_SIZE,
  DEFAULT_MAX_RETRIES,
  DEFAULT_RETRY_DELAY,
  ENV_VARS
} from '../src/constants';

describe('Constants', () => {
  describe('Connection Pool Settings', () => {
    it('should have correct default max connections', () => {
      expect(DEFAULT_MAX_CONNECTIONS).toBe(20);
    });

    it('should have correct default min connections', () => {
      expect(DEFAULT_MIN_CONNECTIONS).toBe(5);
    });

    it('should have correct default connection timeout', () => {
      expect(DEFAULT_CONNECTION_TIMEOUT).toBe(30000);
    });

    it('should have correct default query timeout', () => {
      expect(DEFAULT_QUERY_TIMEOUT).toBe(60000);
    });

    it('should have correct default pool timeout', () => {
      expect(DEFAULT_POOL_TIMEOUT).toBe(60000);
    });
  });

  describe('Batch Processing Settings', () => {
    it('should have correct default batch size', () => {
      expect(DEFAULT_BATCH_SIZE).toBe(1000);
    });

    it('should have correct min batch size', () => {
      expect(MIN_BATCH_SIZE).toBe(1);
    });

    it('should have correct max batch size', () => {
      expect(MAX_BATCH_SIZE).toBe(10000);
    });
  });

  describe('Retry Settings', () => {
    it('should have correct default max retries', () => {
      expect(DEFAULT_MAX_RETRIES).toBe(3);
    });

    it('should have correct default retry delay', () => {
      expect(DEFAULT_RETRY_DELAY).toBe(1000);
    });
  });

  describe('Environment Variables', () => {
    it('should have correct environment variable names', () => {
      expect(ENV_VARS.SOURCE_DATABASE_URL).toBe('SOURCE_DATABASE_URL');
      expect(ENV_VARS.TARGET_DATABASE_URL).toBe('TARGET_DATABASE_URL');
      expect(ENV_VARS.DATABASE_HOST).toBe('DATABASE_HOST');
      expect(ENV_VARS.DATABASE_PORT).toBe('DATABASE_PORT');
      expect(ENV_VARS.DATABASE_NAME).toBe('DATABASE_NAME');
      expect(ENV_VARS.DATABASE_USERNAME).toBe('DATABASE_USERNAME');
      expect(ENV_VARS.DATABASE_PASSWORD).toBe('DATABASE_PASSWORD');
    });

    it('should have frozen environment variables object', () => {
      expect(() => {
        // @ts-expect-error - Testing that object is readonly
        ENV_VARS.NEW_VAR = 'test';
      }).toThrow();
    });
  });
});
