import { describe, it, expect } from 'vitest';
import { buildTimeline } from '../../src/lib/timeline';
import { fieldsFromEntry, type DayFields } from '../../src/lib/day-form';
import { paramsForAge } from '../../src/lib/age-params';
import { suggestNextNap, idealBedtime } from '../../src/lib/sleep-calc';

const ageParams = paramsForAge(8);
const f = (over: Record<string, string> = {}): DayFields => ({ ...fieldsFromEntry(null), ...over });
const build = (over: Record<string, string> = {}, napCount = 3, desiredWakeTime: string | null = null) =>
  buildTimeline({ fields: f(over), napCount, ageParams, desiredWakeTime });

describe('buildTimeline', () => {
  it('builds an all-upcoming skeleton for an empty day', () => {
    const t = build();
    expect(t.rows.map((r) => r.kind)).toEqual(['wake', 'nap', 'nap', 'nap', 'bedtime']);
    expect(t.rows.every((r) => r.state === 'upcoming')).toBe(true);
    // Without a wake-up time the card (and its "enter wake-up" button) sits
    // right under the wake row, not above the timeline.
    expect(t.nowAfter).toBe(0);
    const nap1 = t.rows[1];
    if (nap1.kind !== 'nap') throw new Error('expected nap');
    expect(nap1.suggestedStart).toBe('');
  });

  it('marks the wake done and suggests the first nap from it', () => {
    const t = build({ wake_time: '06:40' });
    expect(t.rows[0].state).toBe('done');
    expect(t.nowAfter).toBe(0);
    const nap1 = t.rows[1];
    if (nap1.kind !== 'nap') throw new Error('expected nap');
    expect(nap1.suggestedStart).toBe(suggestNextNap('06:40', ageParams.firstAwakeWindowMin));
  });

  it('computes a done nap duration net of the pause and suggests the next start', () => {
    const t = build({ wake_time: '06:40', nap1_start: '09:10', nap1_end: '10:25', nap1_pause_min: '10' });
    const nap1 = t.rows[1];
    const nap2 = t.rows[2];
    if (nap1.kind !== 'nap' || nap2.kind !== 'nap') throw new Error('expected naps');
    expect(nap1.durationMin).toBe(65);
    expect(nap1.state).toBe('done');
    expect(nap1.n).toBe(1);
    expect(t.nowAfter).toBe(1);
    expect(nap2.suggestedStart).toBe(suggestNextNap('10:25', ageParams.awakeWindowMin));
  });

  it('wraps a nap crossing midnight and floors the duration at 0', () => {
    const t = build({ wake_time: '06:40', nap1_start: '23:50', nap1_end: '00:20', nap2_start: '10:00', nap2_end: '10:05', nap2_pause_min: '30' });
    const nap1 = t.rows[1];
    const nap2 = t.rows[2];
    if (nap1.kind !== 'nap' || nap2.kind !== 'nap') throw new Error('expected naps');
    expect(nap1.durationMin).toBe(30);
    expect(nap2.durationMin).toBe(0);
  });

  it('flags a started nap without end as in progress', () => {
    const t = build({
      wake_time: '06:40',
      nap1_start: '09:10',
      nap1_end: '10:25',
      nap2_start: '13:50'
    });
    const nap2 = t.rows[2];
    if (nap2.kind !== 'nap') throw new Error('expected nap');
    expect(nap2.state).toBe('progress');
    expect(nap2.durationMin).toBeNull();
    expect(t.nowAfter).toBe(2);
  });

  it('keeps slot order when naps are filled out of order', () => {
    const t = build({ wake_time: '06:40', nap2_start: '13:00', nap2_end: '14:00' });
    expect(t.rows.map((r) => (r.kind === 'nap' ? r.n : 0))).toEqual([0, 1, 2, 3, 0]);
    expect(t.rows[1].state).toBe('upcoming');
    expect(t.rows[2].state).toBe('done');
    expect(t.nowAfter).toBe(2);
  });

  it('shows as many nap rows as asked', () => {
    expect(build({}, 5).rows).toHaveLength(7);
  });

  it('places the now card after the bedtime once it is entered', () => {
    const t = build({ wake_time: '06:40', bedtime: '20:10' });
    const last = t.rows[t.rows.length - 1];
    expect(last.kind).toBe('bedtime');
    expect(last.state).toBe('done');
    expect(t.nowAfter).toBe(t.rows.length - 1);
  });

  it('uses the desired wake time for the ideal bedtime, else the actual wake', () => {
    const withDesired = build({ wake_time: '06:40' }, 3, '07:00');
    const bed = withDesired.rows[withDesired.rows.length - 1];
    if (bed.kind !== 'bedtime') throw new Error('expected bedtime');
    expect(bed.ideal).toBe(idealBedtime('07:00', ageParams.nightSleepH));

    const without = build({ wake_time: '06:40' }, 3, null);
    const bed2 = without.rows[without.rows.length - 1];
    if (bed2.kind !== 'bedtime') throw new Error('expected bedtime');
    expect(bed2.ideal).toBe(idealBedtime('06:40', ageParams.nightSleepH));
  });

  it('leaves bedtime suggestions empty without any wake', () => {
    const t = build();
    const bed = t.rows[t.rows.length - 1];
    if (bed.kind !== 'bedtime') throw new Error('expected bedtime');
    expect(bed.suggested).toBe('');
    expect(bed.ideal).toBe('');
  });
});
