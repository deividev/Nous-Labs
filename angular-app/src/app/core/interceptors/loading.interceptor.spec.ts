import { HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of } from 'rxjs';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { LoadingService } from '../services/loading';
import { loadingInterceptor } from './loading.interceptor';

describe('loadingInterceptor', () => {
  const loadingMock = {
    show: vi.fn(),
    hide: vi.fn(),
  } as unknown as LoadingService;

  afterEach(() => vi.clearAllMocks());

  it('shows/hides loading by default', async () => {
    TestBed.configureTestingModule({
      providers: [{ provide: LoadingService, useValue: loadingMock }],
    });

    const req = new HttpRequest('GET', '/api/test');
    const next = vi.fn(() => of(new HttpResponse({ status: 200 })));

    const result$ = TestBed.runInInjectionContext(() => loadingInterceptor(req, next));
    await firstValueFrom(result$);

    expect(loadingMock.show).toHaveBeenCalledOnce();
    expect(loadingMock.hide).toHaveBeenCalledOnce();
  });

  it('skips loading when X-Skip-Loading header exists', async () => {
    TestBed.configureTestingModule({
      providers: [{ provide: LoadingService, useValue: loadingMock }],
    });

    const req = new HttpRequest('GET', '/api/test', null, {
      headers: new HttpHeaders({ 'X-Skip-Loading': '1' }),
    });
    const next = vi.fn(() => of(new HttpResponse({ status: 200 })));

    const result$ = TestBed.runInInjectionContext(() => loadingInterceptor(req, next));
    await firstValueFrom(result$);

    expect(loadingMock.show).not.toHaveBeenCalled();
    expect(loadingMock.hide).not.toHaveBeenCalled();
  });
});
