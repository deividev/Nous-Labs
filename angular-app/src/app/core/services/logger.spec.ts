import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { environment } from '../../../environments/environment';
import { LoggerService } from './logger';

describe('LoggerService', () => {
  beforeEach(() => {
    environment.logging.level = 'debug';
    environment.logging.enableConsole = true;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('logs all levels and utility methods', () => {
    const debug = vi.spyOn(console, 'debug').mockImplementation(() => undefined);
    const info = vi.spyOn(console, 'info').mockImplementation(() => undefined);
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const group = vi.spyOn(console, 'group').mockImplementation(() => undefined);
    const groupEnd = vi.spyOn(console, 'groupEnd').mockImplementation(() => undefined);
    const time = vi.spyOn(console, 'time').mockImplementation(() => undefined);
    const timeEnd = vi.spyOn(console, 'timeEnd').mockImplementation(() => undefined);
    const table = vi.spyOn(console, 'table').mockImplementation(() => undefined);

    const logger = new LoggerService();

    logger.debug('d');
    logger.info('i');
    logger.warn('w');
    logger.error('e');
    logger.group('g');
    logger.groupEnd();
    logger.time('t');
    logger.timeEnd('t');
    logger.table([{ a: 1 }]);

    expect(debug).toHaveBeenCalled();
    expect(info).toHaveBeenCalled();
    expect(warn).toHaveBeenCalled();
    expect(error).toHaveBeenCalled();
    expect(group).toHaveBeenCalled();
    expect(groupEnd).toHaveBeenCalled();
    expect(time).toHaveBeenCalled();
    expect(timeEnd).toHaveBeenCalled();
    expect(table).toHaveBeenCalled();
  });

  it('respects disabled console and level filtering branches', () => {
    environment.logging.level = 'warn';
    environment.logging.enableConsole = false;

    const debug = vi.spyOn(console, 'debug').mockImplementation(() => undefined);
    const info = vi.spyOn(console, 'info').mockImplementation(() => undefined);
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    const logger = new LoggerService();
    logger.debug('d');
    logger.info('i');
    logger.warn('w');
    logger.group('g');

    expect(debug).not.toHaveBeenCalled();
    expect(info).not.toHaveBeenCalled();
    expect(warn).not.toHaveBeenCalled();
  });
});
