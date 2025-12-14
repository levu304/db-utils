/**
 * Environment variable validation utilities
 * Based on AGENTS.md requirements
 */

import { z } from 'zod';
import { 
  type DatabaseConfig, 
  type ConnectionConfig,
  ConfigurationError,
  ENV_VARS
} from '@db-utils/types';

/**
 * Zod schema for validating individual connection configuration
 */
export const connectionConfigSchema = z.object({
  host: z.string().min(1),
  port: z.number().min(1).max(65535),
  database: z.string().min(1),
  username: z.string().min(1),
  password: z.string().min(1),
  ssl: z.boolean().optional(),
  connectionTimeout: z.number().optional(),
  queryTimeout: z.number().optional(),
});

/**
 * Zod schema for validating database configuration
 */
export const databaseConfigSchema = z.object({
  url: z.string().url().optional(),
  connection: connectionConfigSchema.optional(),
  maxConnections: z.number().min(1).max(100).optional(),
  minConnections: z.number().min(0).max(50).optional(),
  poolTimeout: z.number().optional(),
  batchSize: z.number().min(1).max(10000).optional(),
}).refine(
  (data: any) => Boolean(data.url) || Boolean(data.connection),
  { message: 'Either url or connection must be provided' }
);

/**
 * Parse and validate a database URL
 * @param url - Database connection URL
 * @returns Validated ConnectionConfig
 */
export function parseDatabaseUrl(url: string): ConnectionConfig {
  try {
    const parsedUrl = new URL(url);
    
    if (parsedUrl.protocol !== 'postgres:' && parsedUrl.protocol !== 'postgresql:') {
      throw new ConfigurationError(`Invalid protocol: ${parsedUrl.protocol}`);
    }
    
    return {
      host: parsedUrl.hostname,
      port: parsedUrl.port ? parseInt(parsedUrl.port, 10) : 5432,
      database: parsedUrl.pathname.substring(1),
      username: parsedUrl.username,
      password: parsedUrl.password,
    };
  } catch (error) {
    if (error instanceof ConfigurationError) {
      throw error;
    }
    throw new ConfigurationError(`Invalid database URL: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Validate environment variables for database configuration
 * @returns Validated DatabaseConfig
 */
export function validateEnvironment(): DatabaseConfig {
  const sourceUrl = process.env[ENV_VARS.SOURCE_DATABASE_URL];
  const targetUrl = process.env[ENV_VARS.TARGET_DATABASE_URL];
  
  if (!sourceUrl && !targetUrl) {
    throw new ConfigurationError('Either SOURCE_DATABASE_URL or TARGET_DATABASE_URL must be provided');
  }
  
  const config: DatabaseConfig = {};
  
  if (sourceUrl) {
    config.url = sourceUrl;
  }
  
  return config;
}
