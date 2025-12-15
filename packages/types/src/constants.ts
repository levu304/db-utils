/**
 * Configuration constants
 * Based on AGENTS.md requirements
 */

/**
 * Default connection pool settings
 */
export const DEFAULT_MAX_CONNECTIONS = 20;
export const DEFAULT_MIN_CONNECTIONS = 5;
export const DEFAULT_CONNECTION_TIMEOUT = 30000; // 30 seconds
export const DEFAULT_QUERY_TIMEOUT = 60000; // 60 seconds
export const DEFAULT_POOL_TIMEOUT = 60000; // 60 seconds

/**
 * Default batch processing settings
 */
export const DEFAULT_BATCH_SIZE = 1000;
export const MIN_BATCH_SIZE = 1;
export const MAX_BATCH_SIZE = 10000;

/**
 * Default retry settings
 */
export const DEFAULT_MAX_RETRIES = 3;
export const DEFAULT_RETRY_DELAY = 1000; // 1 second

/**
 * Environment variable names
 */
const ENV_VARS_RAW = {
  SOURCE_DATABASE_URL: 'SOURCE_DATABASE_URL',
  TARGET_DATABASE_URL: 'TARGET_DATABASE_URL',
  DATABASE_HOST: 'DATABASE_HOST',
  DATABASE_PORT: 'DATABASE_PORT',
  DATABASE_NAME: 'DATABASE_NAME',
  DATABASE_USERNAME: 'DATABASE_USERNAME',
  DATABASE_PASSWORD: 'DATABASE_PASSWORD',
} as const;

export const ENV_VARS = Object.freeze(ENV_VARS_RAW);
