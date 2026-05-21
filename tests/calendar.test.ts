import { describe, it, expect } from 'vitest';
import { buildMonthGrid } from '../src/lib/calendar';

describe('buildMonthGrid', () => {
  it('returns 35 or 42 cells (multiple of 7)', () => {
    const cells = buildMonthGrid(2026, 5, '2026-05-21');
    expect(cells.length % 7).toBe(0);
    expect(cells.length === 35 || cells.length === 42).toBe(true);
  });

  it('starts on Monday', () => {
    // May 2026: 1st is a Friday. Grid starts on the Monday before (2026-04-27).
    const cells = buildMonthGrid(2026, 5, '2026-05-21');
    expect(cells[0].date).toBe('2026-04-27');
    expect(cells[0].inMonth).toBe(false);
  });

  it('marks days of the displayed month with inMonth = true', () => {
    const cells = buildMonthGrid(2026, 5, '2026-05-21');
    const inMonth = cells.filter((c) => c.inMonth);
    expect(inMonth.length).toBe(31); // May has 31 days
    expect(inMonth[0].date).toBe('2026-05-01');
    expect(inMonth[inMonth.length - 1].date).toBe('2026-05-31');
  });

  it('handles February of a non-leap year (28 days, starts Sunday)', () => {
    // Feb 2026: 1st is a Sunday. Grid starts on the Monday before (2026-01-26).
    const cells = buildMonthGrid(2026, 2, '2026-02-15');
    expect(cells[0].date).toBe('2026-01-26');
    expect(cells.filter((c) => c.inMonth).length).toBe(28);
  });

  it('handles February of a leap year (29 days)', () => {
    const cells = buildMonthGrid(2024, 2, '2024-02-15');
    expect(cells.filter((c) => c.inMonth).length).toBe(29);
  });

  it('handles a month starting on Monday with exactly 4 weeks (only possible for Feb non-leap starting Mon)', () => {
    // Feb 2027: 1st is a Monday, 28 days → exactly 4 weeks. Grid length = 28.
    const cells = buildMonthGrid(2027, 2, '2027-02-15');
    expect(cells.length === 28 || cells.length === 35).toBe(true);
    expect(cells[0].date).toBe('2027-02-01');
  });
});
