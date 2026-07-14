import { describe, expect, it } from 'vitest';
import { InMemoryIdempotencyStore } from './store.js';
describe('idempotency', () => {
  it('riproduce la risposta e rifiuta payload differenti', async () => {
    const store = new InMemoryIdempotencyStore();
    let calls = 0;
    const run = () => store.execute('fir', 'same-key', { a: 1 }, async () => ++calls);
    expect((await run()).response).toBe(1);
    expect((await run()).replayed).toBe(true);
    expect(calls).toBe(1);
    await expect(store.execute('fir', 'same-key', { a: 2 }, async () => 2)).rejects.toThrow(
      'idempotenza',
    );
  });
});
