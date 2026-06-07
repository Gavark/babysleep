import { describe, it, expect } from 'vitest';
import { localHHMMToEpoch } from '../../src/lib/tz';

describe('localHHMMToEpoch', () => {
  it('interprets HH:MM in America/Guadeloupe (UTC-4, no DST)', () => {
    const epoch = localHHMMToEpoch('2030-06-15', '10:16', 'America/Guadeloupe');
    expect(epoch).toBe(Math.floor(Date.UTC(2030, 5, 15, 14, 16, 0) / 1000));
  });

  it('interprets HH:MM in Europe/Paris during summer DST (UTC+2)', () => {
    const epoch = localHHMMToEpoch('2030-07-15', '14:30', 'Europe/Paris');
    expect(epoch).toBe(Math.floor(Date.UTC(2030, 6, 15, 12, 30, 0) / 1000));
  });

  it('interprets HH:MM in Europe/Paris during winter (UTC+1)', () => {
    const epoch = localHHMMToEpoch('2030-01-15', '14:30', 'Europe/Paris');
    expect(epoch).toBe(Math.floor(Date.UTC(2030, 0, 15, 13, 30, 0) / 1000));
  });

  it('interprets HH:MM in UTC directly', () => {
    const epoch = localHHMMToEpoch('2030-06-15', '12:00', 'UTC');
    expect(epoch).toBe(Math.floor(Date.UTC(2030, 5, 15, 12, 0, 0) / 1000));
  });

  it('falls back to Europe/Paris for an invalid timezone', () => {
    const epoch = localHHMMToEpoch('2030-07-15', '14:30', 'Not/AZone');
    expect(epoch).toBe(Math.floor(Date.UTC(2030, 6, 15, 12, 30, 0) / 1000));
  });

  it('handles HH:MM > 24:00 by overflowing into the next day', () => {
    const epoch = localHHMMToEpoch('2030-06-15', '25:30', 'America/Guadeloupe');
    expect(epoch).toBe(Math.floor(Date.UTC(2030, 5, 16, 5, 30, 0) / 1000));
  });
});
