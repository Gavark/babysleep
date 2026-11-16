import { describe, it, expect } from 'vitest';
import { parseNavMode, activeNavTab } from '../../src/lib/nav';

describe('parseNavMode', () => {
  it('returns classic only for the exact value', () => {
    expect(parseNavMode('classic')).toBe('classic');
  });
  it.each([undefined, null, '', 'bottom', 'foo', 'CLASSIC'])('falls back to bottom for %s', (raw) => {
    expect(parseNavMode(raw)).toBe('bottom');
  });
});

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
