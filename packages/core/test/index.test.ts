import { describe, it, expect } from 'vitest';
import * as core from '../src/index';
import { PostgresConnectionManager } from '../src/connection';
import { SchemaDiscovery } from '../src/schema';

describe('Core Package', () => {
  it('should export all required core functionality', () => {
    // Connection management
    expect(typeof core.PostgresConnectionManager).toBe('function');
    expect(typeof core.createConnectionManager).toBe('function');
    
    // Schema discovery
    expect(typeof core.SchemaDiscovery).toBe('function');
    expect(typeof core.createSchemaDiscovery).toBe('function');
  });

  it('should have correct class implementations', () => {
    // Test that we can create instances of exported classes
    const mockConfig = {
      url: 'postgres://test:test@localhost:5432/testdb',
    };
    
    const connectionManager = new core.PostgresConnectionManager(mockConfig);
    expect(connectionManager).toBeInstanceOf(PostgresConnectionManager);
    expect(connectionManager).toBeInstanceOf(core.PostgresConnectionManager);
    
    const schemaDiscovery = new core.SchemaDiscovery(connectionManager);
    expect(schemaDiscovery).toBeInstanceOf(SchemaDiscovery);
    expect(schemaDiscovery).toBeInstanceOf(core.SchemaDiscovery);
  });

  it('should have correct factory functions', () => {
    const mockConfig = {
      url: 'postgres://test:test@localhost:5432/testdb',
    };
    
    const connectionManager = core.createConnectionManager(mockConfig);
    expect(connectionManager).toBeInstanceOf(PostgresConnectionManager);
    
    const schemaDiscovery = core.createSchemaDiscovery(connectionManager);
    expect(schemaDiscovery).toBeInstanceOf(SchemaDiscovery);
  });
});
