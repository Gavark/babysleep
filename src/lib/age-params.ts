export type AgeParams = {
  label: string;
  ageMinMonths: number;
  ageMaxMonths: number;
  naps: number;
  awakeWindowMin: number;
  beforeBedWindowMin: number;
  nightSleepH: number;
  daySleepH: number;
};

export const AGE_PARAMS: readonly AgeParams[] = [
  { label: '0-3 mois',   ageMinMonths: 0,  ageMaxMonths: 3,  naps: 4, awakeWindowMin: 75,  beforeBedWindowMin: 60,  nightSleepH: 9,  daySleepH: 7   },
  { label: '3-4 mois',   ageMinMonths: 3,  ageMaxMonths: 4,  naps: 4, awakeWindowMin: 90,  beforeBedWindowMin: 90,  nightSleepH: 10, daySleepH: 5   },
  { label: '4-6 mois',   ageMinMonths: 4,  ageMaxMonths: 6,  naps: 3, awakeWindowMin: 120, beforeBedWindowMin: 120, nightSleepH: 11, daySleepH: 3.5 },
  { label: '6-9 mois',   ageMinMonths: 6,  ageMaxMonths: 9,  naps: 3, awakeWindowMin: 165, beforeBedWindowMin: 180, nightSleepH: 11, daySleepH: 3   },
  { label: '9-12 mois',  ageMinMonths: 9,  ageMaxMonths: 12, naps: 2, awakeWindowMin: 210, beforeBedWindowMin: 240, nightSleepH: 11, daySleepH: 2.5 },
  { label: '12-18 mois', ageMinMonths: 12, ageMaxMonths: 18, naps: 2, awakeWindowMin: 270, beforeBedWindowMin: 300, nightSleepH: 11, daySleepH: 2.5 },
  { label: '18-24 mois', ageMinMonths: 18, ageMaxMonths: 24, naps: 1, awakeWindowMin: 330, beforeBedWindowMin: 330, nightSleepH: 11, daySleepH: 2   },
  { label: '2-3 ans',    ageMinMonths: 24, ageMaxMonths: 36, naps: 1, awakeWindowMin: 360, beforeBedWindowMin: 360, nightSleepH: 11, daySleepH: 1.5 }
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
