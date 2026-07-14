import { describe, expect, it } from 'vitest';
import { decryptEnvelope, encryptEnvelope, EnvironmentMasterKeyProvider } from './encryption.js';
describe('envelope encryption', () => {
  it('usa una DEK distinta e decifra il payload', async () => {
    const provider = new EnvironmentMasterKeyProvider('master-key-for-unit-tests');
    const a = await encryptEnvelope('certificato-segreto', provider);
    const b = await encryptEnvelope('certificato-segreto', provider);
    expect(a.payload).not.toBe(b.payload);
    expect(await decryptEnvelope(a, provider)).toBe('certificato-segreto');
    expect(a.fingerprint).toBe(b.fingerprint);
  });
});
