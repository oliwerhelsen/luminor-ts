import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Logger, LogLevel } from './logger.js';

describe('Logger', () => {
  let logger: Logger;
  let consoleSpy: any;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    logger = new Logger(LogLevel.DEBUG);
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should log debug messages when level is DEBUG', () => {
    logger.debug('Debug message');
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should log info messages', () => {
    logger.info('Info message');
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should log warn messages', () => {
    logger.warn('Warning message');
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should log error messages', () => {
    const error = new Error('Test error');
    logger.error('Error message', error);
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should not log debug messages when min level is INFO', () => {
    const infoLogger = new Logger(LogLevel.INFO);
    infoLogger.debug('Debug message');
    expect(consoleSpy).not.toHaveBeenCalled();
  });

  it('should include context in log', () => {
    logger.info('Message', { userId: '123' });
    expect(consoleSpy).toHaveBeenCalled();
    const call = consoleSpy.mock.calls[0][0];
    expect(call).toContain('Message');
  });
});

