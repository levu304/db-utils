import { describe, it, expect } from 'vitest';
import { success, failure, isSuccess, isFailure, type Result } from '../src/result';

describe('Result Type', () => {
  describe('success', () => {
    it('should create a successful result', () => {
      const result = success('test');
      expect(result).toEqual({ success: true, value: 'test' });
    });
  });

  describe('failure', () => {
    it('should create a failed result', () => {
      const error = new Error('test error');
      const result = failure(error);
      expect(result).toEqual({ success: false, error });
    });
  });

  describe('isSuccess', () => {
    it('should return true for successful results', () => {
      const result: Result<string, Error> = success('test');
      expect(isSuccess(result)).toBe(true);
    });

    it('should return false for failed results', () => {
      const result: Result<string, Error> = failure(new Error('test'));
      expect(isSuccess(result)).toBe(false);
    });
  });

  describe('isFailure', () => {
    it('should return true for failed results', () => {
      const result: Result<string, Error> = failure(new Error('test'));
      expect(isFailure(result)).toBe(true);
    });

    it('should return false for successful results', () => {
      const result: Result<string, Error> = success('test');
      expect(isFailure(result)).toBe(false);
    });
  });
});
