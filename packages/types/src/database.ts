/**
 * Database configuration types
 * Based on AGENTS.md requirements
 */

/**
 * PostgreSQL connection configuration
 */
export interface ConnectionConfig {
  /** Database host */
  host: string;
  
  /** Database port */
  port: number;
  
  /** Database name */
  database: string;
  
  /** Username */
  username: string;
  
  /** Password */
  password: string;
  
  /** SSL mode */
  ssl?: boolean;
  
  /** Connection timeout in milliseconds */
  connectionTimeout?: number;
  
  /** Query timeout in milliseconds */
  queryTimeout?: number;
}

/**
 * Database configuration with optional environment-based credentials
 */
export interface DatabaseConfig {
  /** Connection URL (alternative to individual properties) */
  url?: string;
  
  /** Individual connection properties */
  connection?: ConnectionConfig;
  
  /** Maximum number of connections in the pool */
  maxConnections?: number;
  
  /** Minimum number of connections in the pool */
  minConnections?: number;
  
  /** Connection pool timeout in milliseconds */
  poolTimeout?: number;
  
  /** Batch size for operations */
  batchSize?: number;
}
