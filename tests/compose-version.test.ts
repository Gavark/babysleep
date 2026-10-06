import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

/**
 * Every shipped compose file pins the app image to the released version.
 * Version bumps are manual, so this catches a file left on the old tag.
 */

const VERSION = JSON.parse(readFileSync('package.json', 'utf8')).version as string;
const FILES = ['docker-compose.yml', 'docker-compose.full.yml', 'docker-compose.quickstart.yml', 'docs/UPGRADING.md'];

describe('compose image tags', () => {
  for (const file of FILES) {
    it(`${file} pins ghcr.io/gavark/babysleep:v${VERSION}`, () => {
      const tags = [...readFileSync(file, 'utf8').matchAll(/ghcr\.io\/gavark\/babysleep:(\S+)/g)].map((m) => m[1]);
      expect(tags.length).toBeGreaterThan(0);
      for (const tag of tags) expect(tag).toBe(`v${VERSION}`);
    });
  }
});
