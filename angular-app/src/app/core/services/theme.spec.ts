import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ThemeService } from './theme';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.removeAttribute('data-theme-mode');

    TestBed.configureTestingModule({ providers: [ThemeService] });
    service = TestBed.inject(ThemeService);
  });

  it('applies selected theme attributes to document root', () => {
    service.setTheme('dark');
    expect(service.currentTheme()).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme-mode')).toBe('dark');
  });

  it('falls back to default for invalid theme and persists', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    service.setTheme('invalid-theme' as any);

    expect(service.currentTheme()).toBe('blue');
    expect(localStorage.getItem('app-theme')).toBe('blue');
    expect(warnSpy).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalled();
  });

  it('toggles dark mode and resets default', () => {
    service.setTheme('dark');
    service.toggleDarkMode();
    expect(service.currentTheme()).toBe('blue');

    service.toggleDarkMode();
    expect(service.currentTheme()).toBe('dark');

    service.resetToDefault();
    expect(service.currentTheme()).toBe('blue');
  });
});
