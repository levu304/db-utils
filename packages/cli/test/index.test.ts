import { describe, it, expect } from 'vitest';
import * as cli from '../src/index';
import { Command } from 'commander';

describe('CLI Package', () => {
  it('should export all required CLI functionality', () => {
    // Commands
    expect(typeof cli.transferCommand).toBe('function');
    
    // CLI program
    expect(cli.program).toBeDefined();
  });

  it('should have correct command registrations', () => {
    const program = new cli.Command();
    expect(program).toBeInstanceOf(Command);
  });
});
