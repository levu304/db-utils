import { describe, it, expect } from 'vitest';
import { 
  errorToResult, 
  tryAsync, 
  trySync, 
  getErrorMessage,
  isDatabaseErrorType
} from '../src/errors';
import { 
  success, 
  failure,
  DatabaseError,
  ConnectionError,
  QueryError,
  ValidationError
} from '@db-utils/types';

describe('Error Utilities', () => {
  describe('errorToResult', () => {
    it('should convert an Error to a Result failure', () => {
      const error = new Error('test error');
      const result = errorToResult<string>(error);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(error);
      }
    });

    it('should convert a string to a Result failure', () => {
      const result = errorToResult<string>('test error');
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(Error);
        expect(result.error.message).toBe('test error');
      }
    });

    it('should convert a number to a Result failure', () => {
      const result = errorToResult<string>(42);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(Error);
        expect(result.error.message).toBe('42');
      }
    });
  });

  describe('tryAsync', () => {
    it('should wrap a successful async function in a Result', async () => {
      const fn = async () => 'success';
      const result = await tryAsync(fn);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBe('success');
      }
    });

    it('should wrap a failing async function in a Result', async () => {
      const fn = async () => {
        throw new Error('async error');
      };
      const result = await tryAsync(fn);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(Error);
        expect(result.error.message).toBe('async error');
      }
    });
  });

  describe('trySync', () => {
    it('should wrap a successful sync function in a Result', () => {
      const fn = () => 'success';
      const result = trySync(fn);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBe('success');
      }
    });

    it('should wrap a failing sync function in a Result', () => {
      const fn = () => {
        throw new Error('sync error');
      };
      const result = trySync(fn);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(Error);
        expect(result.error.message).toBe('sync error');
      }
    });
  });

  describe('getErrorMessage', () => {
    it('should get message from Error instance', () => {
      const error = new Error('test error');
      const message = getErrorMessage(error);
      expect(message).toBe('test error');
    });

    it('should convert non-Error to string', () => {
      const message = getErrorMessage('test error');
      expect(message).toBe('test error');
    });

    it('should convert number to string', () => {
      const message = getErrorMessage(42);
      expect(message).toBe('42');
    });

    it('should convert null to string', () => {
      const message = getErrorMessage(null);
      expect(message).toBe('null');
    });
  });

  describe('isDatabaseErrorType', () => {
    it('should return true for ConnectionError', () => {
      const error = new ConnectionError('connection failed');
      expect(isDatabaseErrorType(error, 'ConnectionError')).toBe(true);
    });

    it('should return true for QueryError', () => {
      const error = new QueryError('query failed');
      expect(isDatabaseErrorType(error, 'QueryError')).toBe(true);
    });

    it('should return false for regular Error', () => {
      const error = new Error('regular error');
      expect(isDatabaseErrorType(error, 'ConnectionError')).toBe(false);
    });

    it('should return false for string', () => {
      expect(isDatabaseErrorType('error', 'ConnectionError')).toBe(false);
    });
  });
});
