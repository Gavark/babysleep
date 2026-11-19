import { describe, it, expect } from 'vitest';
import { activeNavTab } from '../../src/lib/nav';

describe('activeNavTab', () => {
  it.each([
    ['/app/babies/1/today', 'today'],
    ['/app/babies/12/history', 'history'],
    ['/app/babies/1/calendar', 'calendar'],
    ['/app/babies/1/stats/', 'stats']
  ])('%s -> %s', (path, tab) => {
    expect(activeNavTab(path)).toBe(tab);
  });
  it.each([
    '/app/babies/1',
    '/app/babies/1/age-rules',
    '/app/babies/1/day/2026-11-16',
    '/app/babies',
    '/account/today'
  ])('%s -> null', (path) => {
    expect(activeNavTab(path)).toBeNull();
  });
});
