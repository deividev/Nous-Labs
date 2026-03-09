import { HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom, throwError } from 'rxjs';
import { describe, expect, it, vi } from 'vitest';
import { LoggerService } from '../services';
import { errorInterceptor } from './error.interceptor';

describe('errorInterceptor', () => {
  const loggerMock = {
    error: vi.fn(),
    warn: vi.fn(),
  } as unknown as LoggerService;

  it.each([0, 401, 403, 404, 500, 502, 503])('logs per status case: %s', async (status) => {
    vi.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [{ provide: LoggerService, useValue: loggerMock }],
    });

    const req = new HttpRequest('GET', '/api/test');
    const err = new HttpErrorResponse({ status, statusText: 'ERR', url: '/api/test' });
    const next = vi.fn(() => throwError(() => err));

    const result$ = TestBed.runInInjectionContext(() => errorInterceptor(req, next));

    await expect(firstValueFrom(result$)).rejects.toBe(err);
    expect(loggerMock.error).toHaveBeenCalled();
  });
});
