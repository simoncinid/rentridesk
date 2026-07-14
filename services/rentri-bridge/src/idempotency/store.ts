import { createHash } from 'node:crypto';
import { IdempotencyConflictError } from '../errors.js';
interface RecordValue<T> {
  requestHash: string;
  response: T;
}
export class InMemoryIdempotencyStore {
  private readonly records = new Map<string, RecordValue<unknown>>();
  async execute<T>(
    scope: string,
    key: string,
    payload: unknown,
    operation: () => Promise<T>,
  ): Promise<{ response: T; replayed: boolean }> {
    const storageKey = `${scope}:${key}`;
    const requestHash = createHash('sha256').update(JSON.stringify(payload)).digest('hex');
    const existing = this.records.get(storageKey);
    if (existing) {
      if (existing.requestHash !== requestHash) throw new IdempotencyConflictError();
      return { response: existing.response as T, replayed: true };
    }
    const response = await operation();
    this.records.set(storageKey, { requestHash, response });
    return { response, replayed: false };
  }
}
