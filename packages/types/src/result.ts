/**
 * Result type pattern for error handling
 * Based on AGENTS.md requirements
 */

/**
 * Result type pattern for error handling
 * Either a success with value or failure with error
 */
export type Result<T, E = Error> =
  | { success: true; value: T }
  | { success: false; error: E };

/**
 * Create a successful result
 */
export function success<T>(value: T): Result<T, never> {
  return { success: true, value };
}

/**
 * Create a failed result
 */
export function failure<E>(error: E): Result<never, E> {
  return { success: false, error };
}

/**
 * Type guard to check if a result is successful
 */
export function isSuccess<T, E>(result: Result<T, E>): result is { success: true; value: T } {
  return result.success;
}

/**
 * Type guard to check if a result is a failure
 */
export function isFailure<T, E>(result: Result<T, E>): result is { success: false; error: E } {
  return !result.success;
}
