/**
 * PostgreSQL connection manager
 * Based on AGENTS.md requirements
 */

import { Pool, PoolConfig, QueryResult } from 'pg';
import { 
  type ConnectionConfig, 
  type DatabaseConfig,
  ConnectionError,
  ConfigurationError,
  DEFAULT_MAX_CONNECTIONS,
  DEFAULT_MIN_CONNECTIONS,
  DEFAULT_CONNECTION_TIMEOUT,
  DEFAULT_QUERY_TIMEOUT
} from '@db-utils/types';
import { parseDatabaseUrl, trySync } from '@db-utils/utils';
import { logger } from '@db-utils/utils';

/**
 * Connection pool configuration
 */
export interface PoolConfiguration {
  /** Maximum number of connections in the pool */
  maxConnections?: number;
  
  /** Minimum number of connections in the pool */
  minConnections?: number;
  
  /** Connection timeout in milliseconds */
  connectionTimeout?: number;
  
  /** Query timeout in milliseconds */
  queryTimeout?: number;
  
  /** Pool timeout in milliseconds */
  poolTimeout?: number;
}

/**
 * PostgreSQL connection manager
 */
export class PostgresConnectionManager {
  private pool: Pool | null = null;
  private readonly config: DatabaseConfig;
  private readonly poolConfig: PoolConfiguration;

  constructor(config: DatabaseConfig, poolConfig: PoolConfiguration = {}) {
    this.config = config;
    this.poolConfig = poolConfig;
  }

  /**
   * Initialize the connection pool
   * @returns Promise that resolves when the pool is initialized
   */
  async initialize(): Promise<void> {
    if (this.pool) {
      logger.warn('Connection pool already initialized');
      return;
    }

    try {
      const pgConfig = await this.createPgPoolConfig();
      this.pool = new Pool(pgConfig);
      
      // Test the connection
      const client = await this.pool.connect();
      client.release();
      
      logger.info('PostgreSQL connection pool initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize PostgreSQL connection pool', { error });
      throw new ConnectionError(`Failed to initialize connection pool: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Close the connection pool
   * @returns Promise that resolves when the pool is closed
   */
  async close(): Promise<void> {
    if (!this.pool) {
      logger.warn('Connection pool not initialized');
      return;
    }

    try {
      await this.pool.end();
      this.pool = null;
      logger.info('PostgreSQL connection pool closed successfully');
    } catch (error) {
      logger.error('Failed to close PostgreSQL connection pool', { error });
      throw new ConnectionError(`Failed to close connection pool: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Execute a query
   * @param query - SQL query string
   * @param values - Query parameters
   * @returns Query result
   */
  async query<T = any>(query: string, values?: any[]): Promise<QueryResult<T>> {
    if (!this.pool) {
      throw new ConnectionError('Connection pool not initialized. Call initialize() first.');
    }

    try {
      logger.debug('Executing query', { query, values });
      const result = await this.pool.query<T>(query, values);
      logger.debug('Query executed successfully', { rowCount: result.rowCount });
      return result;
    } catch (error) {
      logger.error('Query execution failed', { query, error });
      throw new ConnectionError(`Query execution failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Execute a query with parameterized values (safe from SQL injection)
   * @param query - SQL query string with $1, $2, etc. placeholders
   * @param values - Query parameters
   * @returns Query result
   */
  async execute<T = any>(query: string, values: any[] = []): Promise<QueryResult<T>> {
    return this.query<T>(query, values);
  }

  /**
   * Create PostgreSQL pool configuration from DatabaseConfig
   * @returns PoolConfig for node-postgres
   */
  private async createPgPoolConfig(): Promise<PoolConfig> {
    const connectionConfig = await this.resolveConnectionConfig();
    
    return {
      host: connectionConfig.host,
      port: connectionConfig.port,
      database: connectionConfig.database,
      user: connectionConfig.username,
      password: connectionConfig.password,
      max: this.poolConfig.maxConnections ?? DEFAULT_MAX_CONNECTIONS,
      min: this.poolConfig.minConnections ?? DEFAULT_MIN_CONNECTIONS,
      connectionTimeoutMillis: this.poolConfig.connectionTimeout ?? DEFAULT_CONNECTION_TIMEOUT,
      idleTimeoutMillis: this.poolConfig.poolTimeout ?? DEFAULT_CONNECTION_TIMEOUT,
      query_timeout: this.poolConfig.queryTimeout ?? DEFAULT_QUERY_TIMEOUT,
    };
  }

  /**
   * Resolve connection configuration from DatabaseConfig
   * @returns ConnectionConfig
   */
  private async resolveConnectionConfig(): Promise<ConnectionConfig> {
    if (this.config.connection) {
      return this.config.connection;
    }
    
    if (this.config.url) {
      const result = trySync(() => parseDatabaseUrl(this.config.url!));
      if (!result.success) {
        throw new ConfigurationError(`Invalid database URL: ${result.error.message}`);
      }
      return result.value;
    }
    
    throw new ConfigurationError('Either connection or url must be provided in DatabaseConfig');
  }

  /**
   * Get the current pool instance (for advanced use cases)
   * @returns Pool instance or null if not initialized
   */
  getPool(): Pool | null {
    return this.pool;
  }
}

/**
 * Create a new PostgreSQL connection manager
 * @param config - Database configuration
 * @param poolConfig - Pool configuration
 * @returns PostgresConnectionManager instance
 */
export function createConnectionManager(
  config: DatabaseConfig, 
  poolConfig: PoolConfiguration = {}
): PostgresConnectionManager {
  return new PostgresConnectionManager(config, poolConfig);
}
