/**
 * Error handling utilities
 * Based on AGENTS.md requirements
 */

import { 
  type Result, 
  success, 
  failure,
  type DatabaseError,
  type ConnectionError,
  type QueryError,
  type ValidationError,
  type ConfigurationError,
  type TimeoutError
} from '@db-utils/types';

/**
 * Convert an error to a Result failure
 * @param error - The error to convert
 * @returns A Result with the error
 */
export function errorToResult<T>(error: unknown): Result<T, Error> {
  if (error instanceof Error) {
    return failure(error);
  }
  return failure(new Error(String(error)));
}

/**
 * Wrap a function that might throw an error in a Result
 * @param fn - Function to wrap
 * @returns Result of the function or error
 */
export async function tryAsync<T>(fn: () => Promise<T>): Promise<Result<T, Error>> {
  try {
    const value = await fn();
    return success(value);
  } catch (error) {
    return errorToResult<T>(error);
  }
}

/**
 * Wrap a synchronous function that might throw an error in a Result
 * @param fn - Function to wrap
 * @returns Result of the function or error
 */
export function trySync<T>(fn: () => T): Result<T, Error> {
  try {
    const value = fn();
    return success(value);
  } catch (error) {
    return errorToResult<T>(error);
  }
}

/**
 * Get the error message from an error
 * @param error - The error to get message from
 * @returns Error message
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

/**
 * Check if an error is a specific type of database error
 * @param error - The error to check
 * @param errorType - The type of error to check for
 * @returns True if the error is of the specified type
 */
export function isDatabaseErrorType(
  error: unknown, 
  errorType: 'ConnectionError' | 'QueryError' | 'TimeoutError'
): boolean {
  return error instanceof Error && error.name === errorType;
}
