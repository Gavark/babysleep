import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createAutosave, type SaveState } from '../../src/lib/autosave';

function setup() {
  const calls: { fields: string[]; resolve: (ok: boolean) => void }[] = [];
  const states: SaveState[] = [];
  const save = vi.fn((fields: string[]) => {
    return new Promise<boolean>((resolve) => {
      calls.push({ fields, resolve });
    });
  });
  const auto = createAutosave({ delayMs: 600, save, onState: (s) => states.push(s) });
  return { auto, calls, states, save };
}

async function settle(call: { resolve: (ok: boolean) => void }, ok: boolean) {
  call.resolve(ok);
  await Promise.resolve();
  await Promise.resolve();
  await vi.runAllTicks();
}

describe('createAutosave', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('waits for the delay before saving', () => {
    const { auto, save } = setup();
    auto.touch('a');
    expect(auto.state()).toBe('pending');
    expect(save).not.toHaveBeenCalled();
    vi.advanceTimersByTime(599);
    expect(save).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(save).toHaveBeenCalledTimes(1);
    expect(save).toHaveBeenCalledWith(['a']);
  });

  it('re-arms the delay on each touch and sends both fields once', () => {
    const { auto, save } = setup();
    auto.touch('a');
    vi.advanceTimersByTime(300);
    auto.touch('b');
    vi.advanceTimersByTime(599);
    expect(save).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(save).toHaveBeenCalledTimes(1);
    expect(save.mock.calls[0][0].sort()).toEqual(['a', 'b']);
  });

  it('flush sends immediately', () => {
    const { auto, save } = setup();
    auto.touch('a');
    auto.flush();
    expect(save).toHaveBeenCalledWith(['a']);
    expect(auto.state()).toBe('saving');
  });

  it('goes pending, saving, saved on success and empties dirty', async () => {
    const { auto, calls, states } = setup();
    auto.touch('a');
    vi.advanceTimersByTime(600);
    expect(auto.dirty().has('a')).toBe(true);
    await settle(calls[0], true);
    expect(states).toEqual(['pending', 'saving', 'saved']);
    expect(auto.state()).toBe('saved');
    expect(auto.dirty().size).toBe(0);
  });

  it('re-sends a field touched during the save, never two at once', async () => {
    const { auto, calls, save } = setup();
    auto.touch('a');
    vi.advanceTimersByTime(600);
    auto.touch('b');
    expect(auto.state()).toBe('saving');
    vi.advanceTimersByTime(600);
    expect(save).toHaveBeenCalledTimes(1);
    await settle(calls[0], true);
    expect(save).toHaveBeenCalledTimes(2);
    expect(save.mock.calls[1][0]).toEqual(['b']);
    expect(auto.state()).toBe('saving');
    await settle(calls[1], true);
    expect(auto.state()).toBe('saved');
    expect(auto.dirty().size).toBe(0);
  });

  it('re-sends the same field touched again during its own save', async () => {
    const { auto, calls, save } = setup();
    auto.touch('a');
    vi.advanceTimersByTime(600);
    auto.touch('a');
    await settle(calls[0], true);
    expect(save).toHaveBeenCalledTimes(2);
    expect(save.mock.calls[1][0]).toEqual(['a']);
  });

  it('keeps fields dirty on failure, no retry, flush retries', async () => {
    const { auto, calls, save } = setup();
    auto.touch('a');
    vi.advanceTimersByTime(600);
    await settle(calls[0], false);
    expect(auto.state()).toBe('error');
    expect(auto.dirty().has('a')).toBe(true);
    vi.advanceTimersByTime(5000);
    expect(save).toHaveBeenCalledTimes(1);
    auto.flush();
    expect(save).toHaveBeenCalledTimes(2);
    expect(save.mock.calls[1][0]).toEqual(['a']);
  });

  it('touch after an error moves to pending and re-arms the delay', async () => {
    const { auto, calls, save } = setup();
    auto.touch('a');
    vi.advanceTimersByTime(600);
    await settle(calls[0], false);
    auto.touch('b');
    expect(auto.state()).toBe('pending');
    vi.advanceTimersByTime(600);
    expect(save).toHaveBeenCalledTimes(2);
    expect(save.mock.calls[1][0].sort()).toEqual(['a', 'b']);
  });

  it('keeps fields touched during a failed save dirty', async () => {
    const { auto, calls } = setup();
    auto.touch('a');
    vi.advanceTimersByTime(600);
    auto.touch('b');
    await settle(calls[0], false);
    expect(auto.state()).toBe('error');
    expect([...auto.dirty()].sort()).toEqual(['a', 'b']);
  });

  it('treats a rejecting save like a failure', async () => {
    const save = vi
      .fn<(f: string[]) => Promise<boolean>>()
      .mockRejectedValueOnce(new Error('boom'))
      .mockResolvedValue(true);
    const auto = createAutosave({ delayMs: 600, save, onState: () => {} });
    auto.touch('a');
    vi.advanceTimersByTime(600);
    await vi.runAllTicks();
    await Promise.resolve();
    await Promise.resolve();
    expect(auto.state()).toBe('error');
    expect(auto.dirty().has('a')).toBe(true);
    auto.flush();
    expect(save).toHaveBeenCalledTimes(2);
    expect(save.mock.calls[1][0]).toEqual(['a']);
  });

  it('treats a synchronously throwing save like a failure', async () => {
    const save = vi
      .fn<(f: string[]) => Promise<boolean>>()
      .mockImplementationOnce(() => {
        throw new Error('boom');
      })
      .mockResolvedValue(true);
    const auto = createAutosave({ delayMs: 600, save, onState: () => {} });
    auto.touch('a');
    vi.advanceTimersByTime(600);
    await vi.runAllTicks();
    await Promise.resolve();
    await Promise.resolve();
    expect(auto.state()).toBe('error');
    expect(auto.dirty().has('a')).toBe(true);
    auto.touch('b');
    vi.advanceTimersByTime(600);
    expect(save).toHaveBeenCalledTimes(2);
    expect(save.mock.calls[1][0].sort()).toEqual(['a', 'b']);
  });

  it('flush during a save with nothing new starts no second save', async () => {
    const { auto, calls, save } = setup();
    auto.touch('a');
    vi.advanceTimersByTime(600);
    auto.flush();
    expect(save).toHaveBeenCalledTimes(1);
    await settle(calls[0], true);
    expect(auto.state()).toBe('saved');
    expect(save).toHaveBeenCalledTimes(1);
  });

  it('touch then flush during a save sends exactly one follow-up', async () => {
    const { auto, calls, save } = setup();
    auto.touch('a');
    vi.advanceTimersByTime(600);
    auto.touch('b');
    auto.flush();
    expect(save).toHaveBeenCalledTimes(1);
    await settle(calls[0], true);
    expect(save).toHaveBeenCalledTimes(2);
    expect(save.mock.calls[1][0]).toEqual(['b']);
    await settle(calls[1], true);
    expect(save).toHaveBeenCalledTimes(2);
    expect(auto.state()).toBe('saved');
  });

  it('flush with nothing dirty does nothing', () => {
    const { auto, save, states } = setup();
    auto.flush();
    expect(save).not.toHaveBeenCalled();
    expect(states).toEqual([]);
    expect(auto.state()).toBe('idle');
  });

  it('dispose before the deadline prevents the save', () => {
    const { auto, save } = setup();
    auto.touch('a');
    auto.dispose();
    vi.advanceTimersByTime(5000);
    expect(save).not.toHaveBeenCalled();
  });
});
