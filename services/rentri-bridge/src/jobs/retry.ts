export interface RetryOptions {
  maxAttempts: number;
  baseDelayMs: number;
  random?: () => number;
}
export async function withRetry<T>(
  operation: (attempt: number) => Promise<T>,
  options: RetryOptions,
): Promise<T> {
  let last: unknown;
  for (let attempt = 1; attempt <= options.maxAttempts; attempt++) {
    try {
      return await operation(attempt);
    } catch (error) {
      last = error;
      if (attempt < options.maxAttempts) {
        const jitter = (options.random?.() ?? Math.random()) * 0.25;
        await new Promise((resolve) =>
          setTimeout(resolve, options.baseDelayMs * 2 ** (attempt - 1) * (1 + jitter)),
        );
      }
    }
  }
  throw last;
}
export class CircuitBreaker {
  private failures = 0;
  private openedAt: number | null = null;
  constructor(
    private readonly threshold = 3,
    private readonly resetMs = 30_000,
  ) {}
  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.openedAt && Date.now() - this.openedAt < this.resetMs)
      throw new Error('Circuito RENTRI aperto');
    try {
      const result = await operation();
      this.failures = 0;
      this.openedAt = null;
      return result;
    } catch (error) {
      this.failures++;
      if (this.failures >= this.threshold) this.openedAt = Date.now();
      throw error;
    }
  }
  get state() {
    return this.openedAt ? 'open' : 'closed';
  }
}
