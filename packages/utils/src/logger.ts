/**
 * Logging utilities
 * Based on AGENTS.md requirements
 */

export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

/**
 * Logger interface
 */
export interface Logger {
  error(message: string, meta?: Record<string, unknown>): void;
  warn(message: string, meta?: Record<string, unknown>): void;
  info(message: string, meta?: Record<string, unknown>): void;
  debug(message: string, meta?: Record<string, unknown>): void;
}

/**
 * Console logger implementation
 */
export class ConsoleLogger implements Logger {
  private readonly level: LogLevel;
  private readonly name: string;

  constructor(name: string, level: LogLevel = 'info') {
    this.name = name;
    this.level = level;
  }

  private shouldLog(targetLevel: LogLevel): boolean {
    const levels: LogLevel[] = ['error', 'warn', 'info', 'debug'];
    const currentLevelIndex = levels.indexOf(this.level);
    const targetLevelIndex = levels.indexOf(targetLevel);
    return targetLevelIndex <= currentLevelIndex;
  }

  private formatMessage(level: LogLevel, message: string, meta?: Record<string, unknown>): string {
    const timestamp = new Date().toISOString();
    const metaString = meta ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] [${this.name}] ${message}${metaString}`;
  }

  error(message: string, meta?: Record<string, unknown>): void {
    if (this.shouldLog('error')) {
      console.error(this.formatMessage('error', message, meta));
    }
  }

  warn(message: string, meta?: Record<string, unknown>): void {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', message, meta));
    }
  }

  info(message: string, meta?: Record<string, unknown>): void {
    if (this.shouldLog('info')) {
      console.info(this.formatMessage('info', message, meta));
    }
  }

  debug(message: string, meta?: Record<string, unknown>): void {
    if (this.shouldLog('debug')) {
      console.debug(this.formatMessage('debug', message, meta));
    }
  }
}

/**
 * Create a logger instance
 * @param name - Name of the logger
 * @param level - Log level
 * @returns Logger instance
 */
export function createLogger(name: string, level: LogLevel = 'info'): Logger {
  return new ConsoleLogger(name, level);
}

/**
 * Global logger instance
 */
export const logger = createLogger('db-utils');
