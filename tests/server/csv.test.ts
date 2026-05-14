import { describe, it, expect } from 'vitest';
import { buildSleepCsv } from '../../src/lib/server/csv';

describe('buildSleepCsv', () => {
  it('produces UTF-8 BOM + ; separator', () => {
    const out = buildSleepCsv([], 'Léa');
    expect(out.startsWith('﻿')).toBe(true);
    const firstLine = out.split('\r\n')[0].slice(1);
    expect(firstLine.split(';')).toEqual([
      'Date', 'Réveil',
      'S1 début', 'S1 fin', 'S1 durée',
      'S2 début', 'S2 fin', 'S2 durée',
      'S3 début', 'S3 fin', 'S3 durée',
      'S4 début', 'S4 fin', 'S4 durée',
      'Coucher', 'Nb siestes', 'Durée nuit préc.', 'Durée jour', 'Notes'
    ]);
  });

  it('escapes notes containing semicolons or quotes', () => {
    const rows = [{
      date: '2025-07-15', wakeTime: '07:00',
      nap1Start: null, nap1End: null, nap2Start: null, nap2End: null,
      nap3Start: null, nap3End: null, nap4Start: null, nap4End: null,
      bedtime: '20:00', notes: 'note avec ; et "guillemets"'
    }];
    const out = buildSleepCsv(rows, 'X');
    expect(out).toContain('"note avec ; et ""guillemets"""');
  });

  it('computes Nb siestes from non-null nap fields', () => {
    const rows = [{
      date: '2025-07-15', wakeTime: '07:00',
      nap1Start: null, nap1End: '09:00', nap2Start: null, nap2End: '13:00',
      nap3Start: null, nap3End: null, nap4Start: null, nap4End: null,
      bedtime: '20:00', notes: null
    }];
    const out = buildSleepCsv(rows, 'X');
    const line = out.split('\r\n')[1].split(';');
    // columns: Date(0) Réveil(1) S1début(2) S1fin(3) S1dur(4) S2début(5) S2fin(6) S2dur(7)
    //          S3début(8) S3fin(9) S3dur(10) S4début(11) S4fin(12) S4dur(13)
    //          Coucher(14) Nb siestes(15) Durée nuit(16) Durée jour(17) Notes(18)
    expect(line[15]).toBe('2');
  });

  it('computes durée nuit préc. across two consecutive days', () => {
    const rows = [
      { date: '2025-07-16', wakeTime: '07:00', nap1Start: null, nap1End: null, nap2Start: null, nap2End: null, nap3Start: null, nap3End: null, nap4Start: null, nap4End: null, bedtime: '20:30', notes: null },
      { date: '2025-07-15', wakeTime: '06:30', nap1Start: null, nap1End: null, nap2Start: null, nap2End: null, nap3Start: null, nap3End: null, nap4Start: null, nap4End: null, bedtime: '20:00', notes: null }
    ];
    const out = buildSleepCsv(rows, 'X');
    const lines = out.split('\r\n').filter(Boolean);
    expect(lines[1].split(';')[16]).toBe('11:00');
    expect(lines[2].split(';')[16]).toBe('');
  });

  it('uses priorEntry to compute prev-night for the oldest range row', () => {
    const rows = [
      { date: '2025-07-16', wakeTime: '07:00', nap1Start: null, nap1End: null, nap2Start: null, nap2End: null, nap3Start: null, nap3End: null, nap4Start: null, nap4End: null, bedtime: '20:30', notes: null }
    ];
    const prior = { date: '2025-07-15', wakeTime: '06:30', nap1Start: null, nap1End: null, nap2Start: null, nap2End: null, nap3Start: null, nap3End: null, nap4Start: null, nap4End: null, bedtime: '20:00', notes: null };
    const out = buildSleepCsv(rows, 'X', { priorEntry: prior });
    const lines = out.split('\r\n').filter(Boolean);
    expect(lines[1].split(';')[16]).toBe('11:00');
  });

  it('computes nap durations and total day sleep in CSV', () => {
    const rows = [{
      date: '2025-07-15', wakeTime: '07:00',
      nap1Start: '09:00', nap1End: '10:00',
      nap2Start: '13:00', nap2End: '14:30',
      nap3Start: null, nap3End: null, nap4Start: null, nap4End: null,
      bedtime: '20:00', notes: null
    }];
    const out = buildSleepCsv(rows, 'X');
    const line = out.split('\r\n')[1].split(';');
    expect(line[4]).toBe('01:00');   // S1 durée
    expect(line[7]).toBe('01:30');   // S2 durée
    expect(line[17]).toBe('02:30');  // Durée jour
  });
});
