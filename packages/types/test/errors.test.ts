import { describe, it, expect } from 'vitest';
import {
  DatabaseError,
  ConnectionError,
  QueryError,
  ValidationError,
  ConfigurationError,
  TimeoutError
} from '../src/errors';

describe('Error Types', () => {
  describe('DatabaseError', () => {
    it('should create a database error with message and code', () => {
      const error = new DatabaseError('Database connection failed', 'CONNECTION_ERROR');
      expect(error).toBeInstanceOf(DatabaseError);
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Database connection failed');
      expect(error.code).toBe('CONNECTION_ERROR');
      expect(error.name).toBe('DatabaseError');
    });

    it('should create a database error without code', () => {
      const error = new DatabaseError('Database error');
      expect(error).toBeInstanceOf(DatabaseError);
      expect(error.message).toBe('Database error');
      expect(error.code).toBeUndefined();
      expect(error.name).toBe('DatabaseError');
    });
  });

  describe('ConnectionError', () => {
    it('should create a connection error', () => {
      const error = new ConnectionError('Could not connect to database');
      expect(error).toBeInstanceOf(ConnectionError);
      expect(error).toBeInstanceOf(DatabaseError);
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Could not connect to database');
      expect(error.code).toBe('CONNECTION_ERROR');
      expect(error.name).toBe('ConnectionError');
    });
  });

  describe('QueryError', () => {
    it('should create a query error with message', () => {
      const error = new QueryError('Invalid SQL syntax');
      expect(error).toBeInstanceOf(QueryError);
      expect(error).toBeInstanceOf(DatabaseError);
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Invalid SQL syntax');
      expect(error.code).toBe('QUERY_ERROR');
      expect(error.name).toBe('QueryError');
      expect(error.query).toBeUndefined();
    });

    it('should create a query error with query', () => {
      const error = new QueryError('Invalid SQL syntax', 'SELECT * FROM invalid_table');
      expect(error).toBeInstanceOf(QueryError);
      expect(error.query).toBe('SELECT * FROM invalid_table');
    });
  });

  describe('ValidationError', () => {
    it('should create a validation error', () => {
      const error = new ValidationError('Invalid database configuration');
      expect(error).toBeInstanceOf(ValidationError);
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Invalid database configuration');
      expect(error.name).toBe('ValidationError');
    });
  });

  describe('ConfigurationError', () => {
    it('should create a configuration error', () => {
      const error = new ConfigurationError('Missing required configuration');
      expect(error).toBeInstanceOf(ConfigurationError);
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Missing required configuration');
      expect(error.name).toBe('ConfigurationError');
    });
  });

  describe('TimeoutError', () => {
    it('should create a timeout error', () => {
      const error = new TimeoutError('Query timed out');
      expect(error).toBeInstanceOf(TimeoutError);
      expect(error).toBeInstanceOf(DatabaseError);
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Query timed out');
      expect(error.code).toBe('TIMEOUT_ERROR');
      expect(error.name).toBe('TimeoutError');
    });
  });
});
