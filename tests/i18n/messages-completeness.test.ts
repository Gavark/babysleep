import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

function loadKeys(file: string): Set<string> {
  const raw = fs.readFileSync(path.resolve(file), 'utf-8');
  const obj = JSON.parse(raw) as Record<string, unknown>;
  return new Set(Object.keys(obj).filter((k) => !k.startsWith('$')));
}

describe('messages/*.json — completeness', () => {
  const fr = loadKeys('messages/fr.json');
  const en = loadKeys('messages/en.json');

  it('fr and en share exactly the same key set', () => {
    const missingInEn = [...fr].filter((k) => !en.has(k));
    const missingInFr = [...en].filter((k) => !fr.has(k));
    expect({ missingInEn, missingInFr }).toEqual({
      missingInEn: [],
      missingInFr: []
    });
  });

  it('catalogue is non-trivial (sanity bound)', () => {
    expect(fr.size).toBeGreaterThan(50);
  });

  it('each EN value is non-empty', () => {
    const raw = JSON.parse(fs.readFileSync('messages/en.json', 'utf-8')) as Record<string, string>;
    const blanks = Object.entries(raw)
      .filter(([k, v]) => !k.startsWith('$') && typeof v === 'string' && v.trim() === '')
      .map(([k]) => k);
    expect(blanks).toEqual([]);
  });

  it('each FR value is non-empty', () => {
    const raw = JSON.parse(fs.readFileSync('messages/fr.json', 'utf-8')) as Record<string, string>;
    const blanks = Object.entries(raw)
      .filter(([k, v]) => !k.startsWith('$') && typeof v === 'string' && v.trim() === '')
      .map(([k]) => k);
    expect(blanks).toEqual([]);
  });
});
