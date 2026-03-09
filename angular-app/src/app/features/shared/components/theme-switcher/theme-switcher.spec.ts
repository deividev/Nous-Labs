import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';
import { ThemeSwitcher } from './theme-switcher';
import { ThemeService } from '../../../../core/services';

describe('ThemeSwitcher', () => {
  let component: ThemeSwitcher;
  let fixture: ComponentFixture<ThemeSwitcher>;
  let themeService: ThemeService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemeSwitcher],
      providers: [ThemeService],
    }).compileComponents();

    fixture = TestBed.createComponent(ThemeSwitcher);
    component = fixture.componentInstance;
    themeService = TestBed.inject(ThemeService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Theme Service Integration', () => {
    it('should have access to themeService', () => {
      expect((component as any).themeService).toBeTruthy();
    });

    it('should have categories defined', () => {
      expect((component as any).categories).toBeDefined();
      expect((component as any).categories.length).toBeGreaterThan(0);
    });
  });

  describe('Theme Operations', () => {
    it('should change theme when setTheme is called', () => {
      themeService.setTheme('blue');
      expect(themeService.currentTheme()).toBe('blue');
    });

    it('should toggle dark mode', () => {
      const initialMode = themeService.currentConfig().mode;
      themeService.toggleDarkMode();
      const newMode = themeService.currentConfig().mode;
      expect(newMode).not.toBe(initialMode);
    });

    it('should expose theme preview helper', () => {
      const preview = (component as any).getThemePreview('blue');
      expect(typeof preview).toBe('string');
      expect(preview.length).toBeGreaterThan(0);
    });
  });

  describe('Rendering', () => {
    it('should render theme label', () => {
      const element = fixture.nativeElement;
      expect(element.querySelector('.theme-label')).toBeTruthy();
    });

    it('should render dark toggle button', () => {
      const element = fixture.nativeElement;
      expect(element.querySelector('.dark-toggle')).toBeTruthy();
    });

    it('should render theme categories', () => {
      const element = fixture.nativeElement;
      expect(element.querySelector('.theme-categories')).toBeTruthy();
    });

    it('should trigger dark toggle and theme button click handlers', () => {
      const toggleSpy = vi.spyOn(themeService, 'toggleDarkMode');
      const setThemeSpy = vi.spyOn(themeService, 'setTheme');

      const element = fixture.nativeElement as HTMLElement;
      (element.querySelector('.dark-toggle') as HTMLButtonElement).click();
      fixture.detectChanges();

      const themeButtons = element.querySelectorAll('.theme-btn');
      expect(themeButtons.length).toBeGreaterThan(0);
      (themeButtons[0] as HTMLButtonElement).click();

      expect(toggleSpy).toHaveBeenCalled();
      expect(setThemeSpy).toHaveBeenCalled();
    });
  });
});
