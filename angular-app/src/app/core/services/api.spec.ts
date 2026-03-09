import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LoggerService } from './logger';
import { ApiService } from './api';

describe('ApiService', () => {
  let service: ApiService;
  const http = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  } as unknown as HttpClient;
  const logger = {
    debug: vi.fn(),
    error: vi.fn(),
  } as unknown as LoggerService;

  beforeEach(() => {
    vi.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        ApiService,
        { provide: HttpClient, useValue: http },
        { provide: LoggerService, useValue: logger },
      ],
    });
    service = TestBed.inject(ApiService);
  });

  it('handles all HTTP verbs on success', async () => {
    (http.get as any).mockReturnValue(of({ ok: true }));
    (http.post as any).mockReturnValue(of({ ok: true }));
    (http.put as any).mockReturnValue(of({ ok: true }));
    (http.patch as any).mockReturnValue(of({ ok: true }));
    (http.delete as any).mockReturnValue(of({ ok: true }));

    await expect(firstValueFrom(service.get('users'))).resolves.toEqual({ ok: true });
    await expect(firstValueFrom(service.post('/users', { a: 1 }))).resolves.toEqual({ ok: true });
    await expect(firstValueFrom(service.put('users/1', { a: 1 }))).resolves.toEqual({ ok: true });
    await expect(firstValueFrom(service.patch('users/1', { a: 1 }))).resolves.toEqual({ ok: true });
    await expect(firstValueFrom(service.delete('users/1'))).resolves.toEqual({ ok: true });

    expect((logger as any).debug).toHaveBeenCalled();
  });

  it('handles client/network/server errors and full URLs', async () => {
    const clientErr = new HttpErrorResponse({
      error: new ErrorEvent('x', { message: 'client-fail' }),
      status: 400,
      statusText: 'Bad Request',
      url: '/x',
    });
    (http.get as any).mockReturnValueOnce(throwError(() => clientErr));
    await expect(firstValueFrom(service.get('http://example.com/x'))).rejects.toMatchObject({
      status: 400,
      message: expect.stringContaining('Client error'),
    });

    const netErr = new HttpErrorResponse({ status: 0, statusText: 'Unknown', url: '/x' });
    (http.get as any).mockReturnValueOnce(throwError(() => netErr));
    await expect(firstValueFrom(service.get('/x'))).rejects.toMatchObject({
      status: 0,
      message: expect.stringContaining('Network error'),
    });

    const serverErr = new HttpErrorResponse({
      error: { message: 'server-msg' },
      status: 500,
      statusText: 'Server Error',
      url: '/x',
    });
    (http.get as any).mockReturnValueOnce(throwError(() => serverErr));
    await expect(firstValueFrom(service.get('/x'))).rejects.toMatchObject({
      status: 500,
      message: 'server-msg',
    });

    expect((logger as any).error).toHaveBeenCalled();
  });
});
