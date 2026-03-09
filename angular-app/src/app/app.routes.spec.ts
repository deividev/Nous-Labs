import { describe, expect, it } from 'vitest';
import { routes } from './app.routes';
import { Landing } from './features/landing/landing';

describe('app.routes', () => {
  it('defines home route with Landing component and title', () => {
    expect(routes[0].path).toBe('');
    expect(routes[0].component).toBe(Landing);
    expect(routes[0].title).toContain('Home');
  });

  it('defines wildcard redirect to home', () => {
    expect(routes[1]).toEqual({ path: '**', redirectTo: '' });
  });
});
