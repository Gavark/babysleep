export type SaveState = 'idle' | 'pending' | 'saving' | 'saved' | 'error';

/**
 * Debounced autosave with a single in-flight save.
 *
 * - `touch` marks a field modified and (re)arms the delay.
 * - Only one `save` runs at a time; fields touched during a save are sent
 *   in a new save as soon as the current one succeeds.
 * - On failure nothing is retried automatically: the fields stay dirty and
 *   the next `touch` or `flush` retries.
 */
export function createAutosave(opts: {
  delayMs: number;
  /** Sends these fields; resolves true on success. Never rejects. */
  save: (fields: string[]) => Promise<boolean>;
  onState: (state: SaveState) => void;
}) {
  const dirty = new Set<string>();
  /** Fields touched while a save is in flight (they stay dirty after it). */
  const retouched = new Set<string>();
  let current: SaveState = 'idle';
  let inFlight: string[] | null = null;
  let timer: ReturnType<typeof setTimeout> | null = null;

  function setState(next: SaveState) {
    current = next;
    opts.onState(next);
  }

  function clearTimer() {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
  }

  /** Calls `save` synchronously; a throw or rejection counts as a failed save. */
  function safeSave(fields: string[]): Promise<boolean> {
    try {
      return Promise.resolve(opts.save(fields)).catch(() => false);
    } catch {
      return Promise.resolve(false);
    }
  }

  function send() {
    clearTimer();
    if (inFlight || dirty.size === 0) return;
    const fields = [...dirty];
    inFlight = fields;
    retouched.clear();
    setState('saving');
    safeSave(fields).then((ok) => {
      inFlight = null;
      if (!ok) {
        setState('error');
        return;
      }
      for (const f of fields) if (!retouched.has(f)) dirty.delete(f);
      retouched.clear();
      if (dirty.size > 0) send();
      else setState('saved');
    });
  }

  return {
    touch(field: string) {
      dirty.add(field);
      if (inFlight) {
        // Remembered; sent when the current save ends.
        retouched.add(field);
        return;
      }
      clearTimer();
      timer = setTimeout(send, opts.delayMs);
      if (current !== 'pending') setState('pending');
    },
    flush() {
      send();
    },
    dirty(): ReadonlySet<string> {
      return dirty;
    },
    state(): SaveState {
      return current;
    },
    /** Cancels the delay only; an in-flight save still completes and may call `onState` afterwards. */
    dispose() {
      clearTimer();
    }
  };
}
