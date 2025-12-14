/**
 * Custom error types for database operations
 * Based on AGENTS.md requirements
 */

/**
 * Base error class for database operations
 */
export class DatabaseError extends Error {
  constructor(message: string, public readonly code?: string) {
    super(message);
    this.name = 'DatabaseError';
  }
}

/**
 * Error for connection failures
 */
export class ConnectionError extends DatabaseError {
  constructor(message: string) {
    super(message, 'CONNECTION_ERROR');
    this.name = 'ConnectionError';
  }
}

/**
 * Error for query execution failures
 */
export class QueryError extends DatabaseError {
  constructor(message: string, public readonly query?: string) {
    super(message, 'QUERY_ERROR');
    this.name = 'QueryError';
  }
}

/**
 * Error for validation failures
 */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Error for configuration issues
 */
export class ConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigurationError';
  }
}

/**
 * Error for timeout issues
 */
export class TimeoutError extends DatabaseError {
  constructor(message: string) {
    super(message, 'TIMEOUT_ERROR');
    this.name = 'TimeoutError';
  }
}
