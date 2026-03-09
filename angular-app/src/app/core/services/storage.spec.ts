import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LoggerService } from './logger';
import { StorageService } from './storage';

describe('StorageService', () => {
  let service: StorageService;
  const logger = {
    debug: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  } as unknown as LoggerService;

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [
        StorageService,
        { provide: LoggerService, useValue: logger },
      ],
    });

    service = TestBed.inject(StorageService);
  });

  it('supports get/set/remove/has in local storage', () => {
    service.set('k', { a: 1 });
    expect(service.has('k')).toBe(true);
    expect(service.get<{ a: number }>('k')).toEqual({ a: 1 });

    service.remove('k');
    expect(service.get('k')).toBeNull();
  });

  it('supports get/set/remove/has in session storage', () => {
    service.setSession('k', 123);
    expect(service.hasSession('k')).toBe(true);
    expect(service.getSession<number>('k')).toBe(123);

    service.removeSession('k');
    expect(service.getSession('k')).toBeNull();
  });

  it('expires items, supports raw parsed value, and clears only prefixed keys', () => {
    service.set('exp', 'v', { expiresIn: 1 });
    const nowSpy = vi.spyOn(Date, 'now').mockReturnValue(Date.now() + 10);

    expect(service.get('exp')).toBeNull();

    localStorage.setItem('app_raw', JSON.stringify({ hello: 'world' }));
    expect(service.get<any>('raw')).toEqual({ hello: 'world' });

    localStorage.setItem('other_key', 'x');
    service.set('a', 1);
    service.clear();

    expect(localStorage.getItem('other_key')).toBe('x');
    nowSpy.mockRestore();
  });

  it('handles read/write/remove/clear errors gracefully', () => {
    const getSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('boom');
    });
    expect(service.get('x')).toBeNull();

    getSpy.mockRestore();

    const setSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('boom');
    });
    service.set('x', 1);

    setSpy.mockRestore();

    const removeSpy = vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new Error('boom');
    });
    service.remove('x');

    removeSpy.mockRestore();

    const keySpy = vi.spyOn(Storage.prototype, 'key').mockImplementation(() => {
      throw new Error('boom');
    });
    service.clear();

    keySpy.mockRestore();

    expect((logger as any).warn).toHaveBeenCalled();
    expect((logger as any).error).toHaveBeenCalled();
  });
});
