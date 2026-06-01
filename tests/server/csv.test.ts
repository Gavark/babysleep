import { describe, it, expect } from 'vitest';
import { buildSleepCsv } from '../../src/lib/server/csv';

describe('buildSleepCsv', () => {
  it('produces UTF-8 BOM + ; separator', () => {
    const out = buildSleepCsv([], 'Léa');
    expect(out.startsWith('﻿')).toBe(true);
    const firstLine = out.split('\r\n')[0].slice(1);
    expect(firstLine.split(';')).toEqual([
      'Date', 'Réveil',
      'S1 début', 'S1 fin', 'S1 pause (min)', 'S1 durée',
      'S2 début', 'S2 fin', 'S2 pause (min)', 'S2 durée',
      'S3 début', 'S3 fin', 'S3 pause (min)', 'S3 durée',
      'S4 début', 'S4 fin', 'S4 pause (min)', 'S4 durée',
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
    // columns: Date(0) Réveil(1)
    //   S1: début(2) fin(3) pause(4) durée(5)
    //   S2: début(6) fin(7) pause(8) durée(9)
    //   S3: début(10) fin(11) pause(12) durée(13)
    //   S4: début(14) fin(15) pause(16) durée(17)
    //   Coucher(18) Nb siestes(19) Durée nuit(20) Durée jour(21) Notes(22)
    expect(line[19]).toBe('2');
  });

  it('computes durée nuit préc. across two consecutive days', () => {
    const rows = [
      { date: '2025-07-16', wakeTime: '07:00', nap1Start: null, nap1End: null, nap2Start: null, nap2End: null, nap3Start: null, nap3End: null, nap4Start: null, nap4End: null, bedtime: '20:30', notes: null },
      { date: '2025-07-15', wakeTime: '06:30', nap1Start: null, nap1End: null, nap2Start: null, nap2End: null, nap3Start: null, nap3End: null, nap4Start: null, nap4End: null, bedtime: '20:00', notes: null }
    ];
    const out = buildSleepCsv(rows, 'X');
    const lines = out.split('\r\n').filter(Boolean);
    expect(lines[1].split(';')[20]).toBe('11:00');
    expect(lines[2].split(';')[20]).toBe('');
  });

  it('uses priorEntry to compute prev-night for the oldest range row', () => {
    const rows = [
      { date: '2025-07-16', wakeTime: '07:00', nap1Start: null, nap1End: null, nap2Start: null, nap2End: null, nap3Start: null, nap3End: null, nap4Start: null, nap4End: null, bedtime: '20:30', notes: null }
    ];
    const prior = { date: '2025-07-15', wakeTime: '06:30', nap1Start: null, nap1End: null, nap2Start: null, nap2End: null, nap3Start: null, nap3End: null, nap4Start: null, nap4End: null, bedtime: '20:00', notes: null };
    const out = buildSleepCsv(rows, 'X', { priorEntry: prior });
    const lines = out.split('\r\n').filter(Boolean);
    expect(lines[1].split(';')[20]).toBe('11:00');
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
    expect(line[5]).toBe('01:00');   // S1 durée
    expect(line[9]).toBe('01:30');   // S2 durée
    expect(line[21]).toBe('02:30');  // Durée jour
  });

  it('subtracts pause minutes from per-nap durée and from Durée jour', () => {
    const rows = [{
      date: '2025-07-15', wakeTime: '07:00',
      nap1Start: '09:00', nap1End: '10:00',     // 60 min - 15 pause = 45
      nap2Start: '13:00', nap2End: '14:30',     // 90 min - 30 pause = 60
      nap3Start: null, nap3End: null, nap4Start: null, nap4End: null,
      nap1PauseMin: 15, nap2PauseMin: 30, nap3PauseMin: null, nap4PauseMin: null,
      bedtime: '20:00', notes: null
    }];
    const out = buildSleepCsv(rows, 'X');
    const line = out.split('\r\n')[1].split(';');
    expect(line[4]).toBe('15');      // S1 pause (min)
    expect(line[5]).toBe('00:45');   // S1 durée nette
    expect(line[8]).toBe('30');      // S2 pause (min)
    expect(line[9]).toBe('01:00');   // S2 durée nette
    expect(line[21]).toBe('01:45');  // Durée jour nette = 45+60
  });
});
