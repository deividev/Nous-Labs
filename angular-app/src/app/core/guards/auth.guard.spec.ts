import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LoggerService, StorageService } from '../services';
import { authGuard, guestGuard, roleGuard } from './auth.guard';

describe('auth/guest/role guards', () => {
  const storageMock = {
    get: vi.fn(),
    setSession: vi.fn(),
  } as unknown as StorageService;

  const routerMock = {
    createUrlTree: vi.fn((segments: string[]) => ({ segments })),
  } as unknown as Router;

  const loggerMock = {
    debug: vi.fn(),
    warn: vi.fn(),
  } as unknown as LoggerService;

  beforeEach(() => {
    vi.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [
        { provide: StorageService, useValue: storageMock },
        { provide: Router, useValue: routerMock },
        { provide: LoggerService, useValue: loggerMock },
      ],
    });
  });

  it('authGuard allows access when auth token exists', () => {
    (storageMock.get as any).mockReturnValue('token');

    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as any, { url: '/dashboard' } as any),
    );

    expect(result).toBe(true);
    expect(loggerMock.debug).toHaveBeenCalled();
  });

  it('authGuard redirects to login when token missing', () => {
    (storageMock.get as any).mockReturnValue(null);

    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as any, { url: '/admin' } as any),
    );

    expect(storageMock.setSession).toHaveBeenCalledWith('redirect_url', '/admin');
    expect(routerMock.createUrlTree).toHaveBeenCalled();
    expect(result).toEqual({ segments: ['/login'] });
  });

  it('guestGuard allows guest when no token', () => {
    (storageMock.get as any).mockReturnValue(null);

    const result = TestBed.runInInjectionContext(() => guestGuard({} as any, {} as any));

    expect(result).toBe(true);
  });

  it('guestGuard redirects authenticated users to home', () => {
    (storageMock.get as any).mockReturnValue('token');

    const result = TestBed.runInInjectionContext(() => guestGuard({} as any, {} as any));

    expect(result).toEqual({ segments: ['/'] });
  });

  it('roleGuard allows users with matching role(s)', () => {
    const guard = roleGuard(['admin', 'owner']);
    (storageMock.get as any).mockReturnValue({ roles: ['member', 'admin'] });

    const result = TestBed.runInInjectionContext(() => guard({} as any, {} as any));

    expect(result).toBe(true);
  });

  it('roleGuard supports single role field and redirects unauthorized users', () => {
    const guard = roleGuard(['admin']);
    (storageMock.get as any).mockReturnValue({ role: 'viewer' });

    const result = TestBed.runInInjectionContext(() => guard({} as any, {} as any));

    expect(loggerMock.warn).toHaveBeenCalled();
    expect(result).toEqual({ segments: ['/unauthorized'] });
  });

  it('roleGuard redirects when user data is missing', () => {
    const guard = roleGuard(['admin']);
    (storageMock.get as any).mockReturnValue(null);

    const result = TestBed.runInInjectionContext(() => guard({} as any, {} as any));

    expect(result).toEqual({ segments: ['/unauthorized'] });
  });
});
