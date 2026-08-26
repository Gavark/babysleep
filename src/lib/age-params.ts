export type AgeParams = {
  /** Stable identity for the bracket. NOT display text: render it with
   *  formatAgeBracket() from $lib/format, which is locale-aware. */
  key: string;
  ageMinMonths: number;
  ageMaxMonths: number;
  naps: number;
  firstAwakeWindowMin: number;   // wake → first nap (typically shorter than later windows)
  awakeWindowMin: number;        // between consecutive naps
  beforeBedWindowMin: number;    // last nap → night
  nightSleepH: number;
  daySleepH: number;
};

// firstAwakeWindowMin is taken ~80–85% of awakeWindowMin to reflect the
// shorter morning wake window common in pediatric sleep guidance.
// For 4-6 mois, values calibrated against ~28 days of real data (May 2026):
// real avg first-nap delay landed at 2h exactly with wide variance, but the
// literature consensus (Charlotte Mahé / Pediatric Sleep Council / Möms On Call)
// places it closer to 1h30–1h45 for this age — 100 min splits the difference.
// beforeBedWindowMin 4-6 mois bumped to 150 (was 120) for the same reason.
export const AGE_PARAMS: readonly AgeParams[] = [
  { key: '0-3m',    ageMinMonths: 0,  ageMaxMonths: 3,  naps: 4, firstAwakeWindowMin: 60,  awakeWindowMin: 75,  beforeBedWindowMin: 60,  nightSleepH: 9,  daySleepH: 7   },
  { key: '3-4m',    ageMinMonths: 3,  ageMaxMonths: 4,  naps: 4, firstAwakeWindowMin: 75,  awakeWindowMin: 90,  beforeBedWindowMin: 90,  nightSleepH: 10, daySleepH: 5   },
  { key: '4-6m',    ageMinMonths: 4,  ageMaxMonths: 6,  naps: 3, firstAwakeWindowMin: 100, awakeWindowMin: 120, beforeBedWindowMin: 150, nightSleepH: 11, daySleepH: 3.5 },
  { key: '6-9m',    ageMinMonths: 6,  ageMaxMonths: 9,  naps: 3, firstAwakeWindowMin: 135, awakeWindowMin: 165, beforeBedWindowMin: 180, nightSleepH: 11, daySleepH: 3   },
  { key: '9-12m',   ageMinMonths: 9,  ageMaxMonths: 12, naps: 2, firstAwakeWindowMin: 180, awakeWindowMin: 210, beforeBedWindowMin: 240, nightSleepH: 11, daySleepH: 2.5 },
  { key: '12-18m',  ageMinMonths: 12, ageMaxMonths: 18, naps: 2, firstAwakeWindowMin: 240, awakeWindowMin: 270, beforeBedWindowMin: 300, nightSleepH: 11, daySleepH: 2.5 },
  { key: '18-24m',  ageMinMonths: 18, ageMaxMonths: 24, naps: 1, firstAwakeWindowMin: 300, awakeWindowMin: 330, beforeBedWindowMin: 330, nightSleepH: 11, daySleepH: 2   },
  { key: '2-3y',    ageMinMonths: 24, ageMaxMonths: 36, naps: 1, firstAwakeWindowMin: 330, awakeWindowMin: 360, beforeBedWindowMin: 360, nightSleepH: 11, daySleepH: 1.5 }
] as const;

export function paramsForAge(months: number): AgeParams {
  if (!Number.isFinite(months)) return AGE_PARAMS[0];
  if (months < AGE_PARAMS[0].ageMinMonths) return AGE_PARAMS[0];
  let chosen = AGE_PARAMS[0];
  for (const t of AGE_PARAMS) {
    if (t.ageMinMonths <= months) chosen = t;
    else break;
  }
  return chosen;
}

/**
 * Return the index in AGE_PARAMS of the bracket matching the given age in months.
 * Mirrors paramsForAge's selection logic so the index points at the same row.
 * Returns the LAST bracket's index for ages past the table.
 */
export function findCurrentBracketIdx(months: number): number {
  if (!Number.isFinite(months)) return 0;
  if (months < AGE_PARAMS[0].ageMinMonths) return 0;
  let chosen = 0;
  for (let i = 0; i < AGE_PARAMS.length; i++) {
    if (AGE_PARAMS[i].ageMinMonths <= months) chosen = i;
    else break;
  }
  return chosen;
}
