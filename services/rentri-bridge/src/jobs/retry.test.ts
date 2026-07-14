import { describe, expect, it } from 'vitest';
import { CircuitBreaker, withRetry } from './retry.js';
describe('resilienza', () => {
  it('ritenta errori temporanei', async () => {
    let calls = 0;
    const value = await withRetry(
      async () => {
        calls++;
        if (calls < 3) throw new Error('temporaneo');
        return 'ok';
      },
      { maxAttempts: 3, baseDelayMs: 1, random: () => 0 },
    );
    expect(value).toBe('ok');
  });
  it('apre il circuito', async () => {
    const breaker = new CircuitBreaker(2, 1000);
    await expect(
      breaker.execute(async () => {
        throw new Error('x');
      }),
    ).rejects.toThrow();
    await expect(
      breaker.execute(async () => {
        throw new Error('x');
      }),
    ).rejects.toThrow();
    expect(breaker.state).toBe('open');
    await expect(breaker.execute(async () => true)).rejects.toThrow('aperto');
  });
});
