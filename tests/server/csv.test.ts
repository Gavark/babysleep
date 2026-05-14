import { describe, it, expect } from 'vitest';
import { buildSleepCsv } from '../../src/lib/server/csv';

describe('buildSleepCsv', () => {
  it('produces UTF-8 BOM + ; separator', () => {
    const out = buildSleepCsv([], 'Léa');
    expect(out.startsWith('﻿')).toBe(true);
    const firstLine = out.split('\r\n')[0].slice(1);
    expect(firstLine.split(';')).toEqual([
      'Date', 'Réveil', 'Sieste 1', 'Sieste 2', 'Sieste 3', 'Sieste 4',
      'Coucher', 'Nb siestes', 'Durée nuit préc.', 'Notes'
    ]);
  });

  it('escapes notes containing semicolons or quotes', () => {
    const rows = [{
      date: '2025-07-15', wakeTime: '07:00', nap1End: null, nap2End: null, nap3End: null, nap4End: null,
      bedtime: '20:00', notes: 'note avec ; et "guillemets"'
    }];
    const out = buildSleepCsv(rows, 'X');
    expect(out).toContain('"note avec ; et ""guillemets"""');
  });

  it('computes Nb siestes from non-null nap fields', () => {
    const rows = [{
      date: '2025-07-15', wakeTime: '07:00', nap1End: '09:00', nap2End: '13:00', nap3End: null, nap4End: null,
      bedtime: '20:00', notes: null
    }];
    const out = buildSleepCsv(rows, 'X');
    const line = out.split('\r\n')[1].split(';');
    expect(line[7]).toBe('2');
  });

  it('computes durée nuit préc. across two consecutive days', () => {
    const rows = [
      { date: '2025-07-16', wakeTime: '07:00', nap1End: null, nap2End: null, nap3End: null, nap4End: null, bedtime: '20:30', notes: null },
      { date: '2025-07-15', wakeTime: '06:30', nap1End: null, nap2End: null, nap3End: null, nap4End: null, bedtime: '20:00', notes: null }
    ];
    const out = buildSleepCsv(rows, 'X');
    const lines = out.split('\r\n').filter(Boolean);
    expect(lines[1].split(';')[8]).toBe('10:30');
    expect(lines[2].split(';')[8]).toBe('');
  });
});
