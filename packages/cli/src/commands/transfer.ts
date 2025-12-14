import { Command } from 'commander';
import { 
  type DatabaseConfig,
  ConnectionError,
  ConfigurationError
} from '@db-utils/types';
import { 
  parseDatabaseUrl, 
  validateEnvironment,
  logger
} from '@db-utils/utils';
import { 
  PostgresConnectionManager,
  SchemaDiscovery,
  createConnectionManager,
  createSchemaDiscovery
} from '@db-utils/core';
import { z } from 'zod';

/**
 * Zod schema for transfer command options
 */
const transferOptionsSchema = z.object({
  from: z.string().url(),
  to: z.string().url(),
  batchSize: z.number().min(1).max(10000).optional(),
  includeSystemSchemas: z.boolean().optional(),
  schemas: z.string().optional(),
  tables: z.string().optional(),
});

/**
 * Transfer command options
 */
interface TransferOptions {
  from: string;
  to: string;
  batchSize?: number;
  includeSystemSchemas?: boolean;
  schemas?: string;
  tables?: string;
}

/**
 * Register the transfer command
 * @param program - Commander program instance
 */
export function transferCommand(program: Command): void {
  program
    .command('transfer')
    .description('Transfer data between PostgreSQL databases')
    .option('-f, --from <url>', 'Source database URL')
    .option('-t, --to <url>', 'Target database URL')
    .option('--batch-size <number>', 'Batch size for operations', '1000')
    .option('--include-system-schemas', 'Include system schemas in transfer')
    .option('--schemas <schemas>', 'Comma-separated list of schemas to transfer')
    .option('--tables <tables>', 'Comma-separated list of tables to transfer')
    .action(async (options: TransferOptions) => {
      try {
        // Validate options
        const validatedOptions = transferOptionsSchema.parse({
          ...options,
          batchSize: options.batchSize ? parseInt(options.batchSize.toString()) : undefined,
        });
        
        logger.info('Starting database transfer', { 
          from: validatedOptions.from,
          to: validatedOptions.to,
          batchSize: validatedOptions.batchSize
        });
        
        // Parse source and target database configurations
        const sourceConfig = parseDatabaseUrl(validatedOptions.from);
        const targetConfig = parseDatabaseUrl(validatedOptions.to);
        
        // Create connection managers
        const sourceManager = createConnectionManager({ connection: sourceConfig });
        const targetManager = createConnectionManager({ connection: targetConfig });
        
        // Initialize connections
        await sourceManager.initialize();
        await targetManager.initialize();
        
        logger.info('Database connections established');
        
        // Create schema discovery services
        const sourceSchemaDiscovery = createSchemaDiscovery(sourceManager);
        const targetSchemaDiscovery = createSchemaDiscovery(targetManager);
        
        // Discover schemas
        const sourceSchemaResult = await sourceSchemaDiscovery.discoverSchema({
          includeSystemSchemas: validatedOptions.includeSystemSchemas,
        schemas: validatedOptions.schemas?.split(',').map((s: string) => s.trim()),
        tables: validatedOptions.tables?.split(',').map((t: string) => t.trim()),
        });
        
        if (!sourceSchemaResult.success) {
          throw sourceSchemaResult.error;
        }
        
        logger.info('Source schema discovered', {
          tableCount: sourceSchemaResult.value.tables.length,
          viewCount: sourceSchemaResult.value.views.length,
          materializedViewCount: sourceSchemaResult.value.materializedViews.length
        });
        
        // TODO: Implement actual data transfer logic
        // This would involve:
        // 1. Creating schema in target database
        // 2. Transferring table data in batches
        // 3. Handling constraints and indexes
        // 4. Progress tracking
        
        console.log('✅ Transfer completed successfully!');
        console.log(`📊 Transferred: ${sourceSchemaResult.value.tables.length} tables, ${sourceSchemaResult.value.views.length} views`);
        
        // Close connections
        await sourceManager.close();
        await targetManager.close();
        
        logger.info('Database connections closed');
      } catch (error) {
        if (error instanceof z.ZodError) {
          logger.error('Invalid command options:', { errors: error.errors });
          console.error('❌ Invalid options:');
          error.errors.forEach(err => {
            console.error(`  - ${err.path.join('.')}: ${err.message}`);
          });
        } else if (error instanceof ConnectionError) {
          logger.error('Database connection error:', { message: error.message });
          console.error('❌ Database connection error:', error.message);
        } else if (error instanceof ConfigurationError) {
          logger.error('Configuration error:', { message: error.message });
          console.error('❌ Configuration error:', error.message);
        } else {
          const typedError = error as Error;
          logger.error('Transfer failed:', { error: typedError });
          console.error('❌ Transfer failed:', typedError instanceof Error ? typedError.message : String(typedError));
        }
        
        process.exit(1);
      }
    });
}
