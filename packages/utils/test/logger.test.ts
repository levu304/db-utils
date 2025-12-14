import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ConsoleLogger, createLogger, type LogLevel } from '../src/logger';

describe('Logger Utilities', () => {
  describe('ConsoleLogger', () => {
    let logger: ConsoleLogger;
    let originalConsole: typeof console;

    beforeEach(() => {
      // Save original console
      originalConsole = { ...console };
      
      // Mock console methods
      vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.spyOn(console, 'warn').mockImplementation(() => {});
      vi.spyOn(console, 'info').mockImplementation(() => {});
      vi.spyOn(console, 'debug').mockImplementation(() => {});
      
      logger = new ConsoleLogger('test-logger');
    });

    afterEach(() => {
      // Restore original console
      Object.assign(console, originalConsole);
      vi.restoreAllMocks();
    });

    it('should create a logger with default level', () => {
      expect(logger).toBeInstanceOf(ConsoleLogger);
    });

    it('should log error messages', () => {
      logger.error('test error message');
      expect(console.error).toHaveBeenCalled();
    });

    it('should log warning messages', () => {
      logger.warn('test warning message');
      expect(console.warn).toHaveBeenCalled();
    });

    it('should log info messages', () => {
      logger.info('test info message');
      expect(console.info).toHaveBeenCalled();
    });

    it('should log debug messages when level is debug', () => {
      const debugLogger = new ConsoleLogger('debug-logger', 'debug');
      debugLogger.debug('test debug message');
      expect(console.debug).toHaveBeenCalled();
    });

    it('should not log debug messages when level is info', () => {
      logger.debug('test debug message');
      expect(console.debug).not.toHaveBeenCalled();
    });

    it('should include metadata in log messages', () => {
      logger.info('test message', { userId: 123, action: 'test' });
      expect(console.info).toHaveBeenCalled();
    });

    it('should respect log level hierarchy', () => {
      const errorLogger = new ConsoleLogger('error-logger', 'error');
      
      errorLogger.error('error message');
      errorLogger.warn('warning message');
      errorLogger.info('info message');
      errorLogger.debug('debug message');
      
      expect(console.error).toHaveBeenCalled();
      expect(console.warn).not.toHaveBeenCalled();
      expect(console.info).not.toHaveBeenCalled();
      expect(console.debug).not.toHaveBeenCalled();
    });
  });

  describe('createLogger', () => {
    it('should create a logger instance', () => {
      const logger = createLogger('test');
      expect(logger).toBeDefined();
      expect(typeof logger.error).toBe('function');
      expect(typeof logger.warn).toBe('function');
      expect(typeof logger.info).toBe('function');
      expect(typeof logger.debug).toBe('function');
    });

    it('should create a logger with specified level', () => {
      const logger = createLogger('test', 'debug');
      expect(logger).toBeDefined();
    });
  });
});
