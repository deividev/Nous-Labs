import { describe, expect, it } from 'vitest';
import { isRadialChartType, isSpecializedChartType, transformToRadialDataset } from './chart.utils';

describe('chart.utils', () => {
  const baseData = {
    labels: ['Jan', 'Feb'],
    datasets: [
      {
        label: 'A',
        data: [2, 4],
        backgroundColor: 'red',
        borderColor: 'darkred',
        borderWidth: 2,
      },
      {
        label: 'B',
        data: [6, 8],
        backgroundColor: 'blue',
        borderColor: 'darkblue',
        borderWidth: 2,
      },
    ],
  };

  it('returns same data when already single dataset', () => {
    const single = { ...baseData, datasets: [baseData.datasets[0]] };
    expect(transformToRadialDataset(single)).toBe(single);
  });

  it('transforms multi-dataset to radial format with averages', () => {
    const result = transformToRadialDataset(baseData, 'projects');

    expect(result.labels).toEqual(['A', 'B']);
    expect(result.datasets).toHaveLength(1);
    expect(result.datasets[0].label).toBe('Average Projects');
    expect(result.datasets[0].data).toEqual([3, 7]);
    expect(result.datasets[0].backgroundColor).toEqual(['red', 'blue']);
    expect(result.datasets[0].borderColor).toEqual(['darkred', 'darkblue']);
  });

  it('supports hours and team label maps + fallback label', () => {
    expect(transformToRadialDataset(baseData, 'hours').datasets[0].label).toBe('Average Hours');
    expect(transformToRadialDataset(baseData, 'team').datasets[0].label).toBe('Team Members');
    expect(transformToRadialDataset(baseData, 'unknown').datasets[0].label).toBe('Data');
  });

  it('detects radial chart types', () => {
    expect(isRadialChartType('pie')).toBe(true);
    expect(isRadialChartType('doughnut')).toBe(true);
    expect(isRadialChartType('polarArea')).toBe(true);
    expect(isRadialChartType('radar')).toBe(true);
    expect(isRadialChartType('bar')).toBe(false);
  });

  it('detects specialized chart types', () => {
    expect(isSpecializedChartType('bubble')).toBe(true);
    expect(isSpecializedChartType('scatter')).toBe(true);
    expect(isSpecializedChartType('line')).toBe(false);
  });
});
