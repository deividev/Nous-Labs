import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Landing } from './landing';
import { ThemeService } from '../../core/services';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('Landing', () => {
  let component: Landing;
  let fixture: ComponentFixture<Landing>;
  let themeService: ThemeService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Landing],
      providers: [ThemeService],
    }).compileComponents();

    fixture = TestBed.createComponent(Landing);
    component = fixture.componentInstance;
    themeService = TestBed.inject(ThemeService);
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('State', () => {
    it('should have empty email by default', () => {
      expect((component as any).email()).toBe('');
    });

    it('should have default chart type as bar', () => {
      expect((component as any).currentChartType()).toBe('bar');
    });

    it('should have default dataset as projects', () => {
      expect((component as any).currentDataset()).toBe('projects');
    });

    it('should have null selected data point by default', () => {
      expect((component as any).selectedDataPoint()).toBeNull();
    });
  });

  describe('Projects Data', () => {
    it('should have projects defined', () => {
      expect((component as any).projects()).toBeDefined();
      expect((component as any).projects().length).toBeGreaterThan(0);
    });

    it('should have project columns defined', () => {
      expect((component as any).projectColumns()).toBeDefined();
      expect((component as any).projectColumns().length).toBeGreaterThan(0);
    });
  });

  describe('Theme Integration', () => {
    it('should have isDarkMode computed', () => {
      expect((component as any).isDarkMode).toBeDefined();
    });

    it('should reflect theme service mode', () => {
      // Set to light mode first
      themeService.setTheme('blue');
      fixture.detectChanges();

      const config = themeService.currentConfig();
      const expectedDark = config.mode === 'dark';
      expect((component as any).isDarkMode()).toBe(expectedDark);
    });
  });

  describe('Navigation', () => {
    it('should scroll to section when scrollToSection is called', () => {
      const scrollIntoViewMock = vi.fn();
      const mockElement = { scrollIntoView: scrollIntoViewMock };

      vi.spyOn(document, 'getElementById').mockReturnValue(mockElement as any);

      (component as any).scrollToSection('features');

      expect(document.getElementById).toHaveBeenCalledWith('features');
      expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth' });
    });

    it('should not throw if section not found', () => {
      vi.spyOn(document, 'getElementById').mockReturnValue(null);
      expect(() => (component as any).scrollToSection('nonexistent')).not.toThrow();
    });
  });

  describe('Email and validation', () => {
    it('submits valid email and resets field', () => {
      (component as any).email.set('test@example.com');
      const preventDefault = vi.fn();
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => undefined);
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);

      (component as any).handleEmailSubmit({ preventDefault } as unknown as Event);

      expect(preventDefault).toHaveBeenCalled();
      expect(alertSpy).toHaveBeenCalled();
      expect(logSpy).toHaveBeenCalled();
      expect((component as any).email()).toBe('');
    });

    it('does not submit invalid email', () => {
      (component as any).email.set('invalid-email');
      const preventDefault = vi.fn();
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => undefined);

      (component as any).handleEmailSubmit({ preventDefault } as unknown as Event);

      expect(preventDefault).toHaveBeenCalled();
      expect(alertSpy).not.toHaveBeenCalled();
      expect((component as any).email()).toBe('invalid-email');
    });

    it('validates email regex helper', () => {
      expect((component as any).isValidEmail('a@b.com')).toBe(true);
      expect((component as any).isValidEmail('bad')).toBe(false);
    });
  });

  describe('Charts', () => {
    it('changes chart type and resets selected point', () => {
      (component as any).selectedDataPoint.set('x');
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);

      (component as any).changeChartType('line');

      expect((component as any).currentChartType()).toBe('line');
      expect((component as any).selectedDataPoint()).toBeNull();
      expect(logSpy).toHaveBeenCalled();
    });

    it('changes dataset and resets selected point', () => {
      (component as any).selectedDataPoint.set('x');
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);

      (component as any).changeDataset('hours');

      expect((component as any).currentDataset()).toBe('hours');
      expect((component as any).selectedDataPoint()).toBeNull();
      expect(logSpy).toHaveBeenCalled();
    });

    it('computes chart title for special and dataset-based charts', () => {
      (component as any).changeChartType('bubble');
      expect((component as any).chartTitle()).toContain('Bubble Chart');

      (component as any).changeChartType('scatter');
      expect((component as any).chartTitle()).toContain('Scatter Plot');

      (component as any).changeChartType('bar');
      (component as any).changeDataset('team');
      expect((component as any).chartTitle()).toContain('Team Distribution');

      (component as any).changeDataset('hours');
      expect((component as any).chartTitle()).toContain('Working Hours');
    });

    it('builds radial dataset for pie/radar and specialized data for bubble/scatter', () => {
      (component as any).changeDataset('projects');
      (component as any).changeChartType('pie');
      const pieData = (component as any).chartData();
      expect(pieData.datasets).toHaveLength(1);

      (component as any).changeChartType('bubble');
      const bubbleData = (component as any).chartData();
      expect(Array.isArray(bubbleData.datasets[0].data)).toBe(true);

      (component as any).changeChartType('scatter');
      const scatterData = (component as any).chartData();
      expect(scatterData.datasets[0].label).toContain('Development');
    });

    it('handles onChartClick for regular and specialized charts', () => {
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);

      (component as any).changeChartType('bar');
      (component as any).changeDataset('projects');
      (component as any).onChartClick({ element: { datasetIndex: 0, index: 0 } });
      expect((component as any).selectedDataPoint()).toContain('Completed Projects');

      (component as any).changeChartType('bubble');
      (component as any).onChartClick({ element: { datasetIndex: 0, index: 0 } });
      expect((component as any).selectedDataPoint()).toContain('size');

      (component as any).changeChartType('scatter');
      (component as any).onChartClick({ element: { datasetIndex: 0, index: 0 } });
      expect((component as any).selectedDataPoint()).toContain('(x:');

      expect(logSpy).toHaveBeenCalled();
    });

    it('chart options callback formats values by dataset and chart type', () => {
      (component as any).changeChartType('bar');
      (component as any).changeDataset('hours');

      const options = (component as any).chartOptions();
      const cb = options.plugins.tooltip.callbacks.label;

      expect(
        cb({ dataset: { label: 'Hours' }, parsed: { y: 20 }, formattedValue: '20', raw: 20 }),
      ).toContain('hours');

      (component as any).changeDataset('team');
      expect(
        cb({ dataset: { label: 'Team' }, parsed: { y: 8 }, formattedValue: '8', raw: 8 }),
      ).toContain('members');

      (component as any).changeChartType('bubble');
      expect(
        cb({ dataset: { label: 'Bubble' }, raw: { x: 1, y: 2, r: 3 } }),
      ).toContain('size: 3');

      (component as any).changeChartType('scatter');
      expect(
        cb({ dataset: { label: 'Scatter' }, raw: { x: 1, y: 2 } }),
      ).toContain('(x: 1, y: 2)');
    });

    it('chart options onClick updates selection and supports pie scales undefined', () => {
      const optionsBar = (component as any).chartOptions();
      optionsBar.onClick({}, [{ datasetIndex: 0, index: 0 }]);
      expect((component as any).selectedDataPoint()).toBeTruthy();

      (component as any).changeChartType('doughnut');
      const optionsDoughnut = (component as any).chartOptions();
      expect(optionsDoughnut.scales).toBeUndefined();
    });
  });
});
