import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';

export interface KeyManagementProvider {
  wrapKey(key: Buffer): Promise<string>;
  unwrapKey(value: string): Promise<Buffer>;
}
const derive = (value: string): Buffer => createHash('sha256').update(value).digest();
function encryptWithKey(value: Buffer, key: Buffer): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(value), cipher.final()]);
  return [
    iv.toString('base64'),
    cipher.getAuthTag().toString('base64'),
    encrypted.toString('base64'),
  ].join('.');
}
function decryptWithKey(value: string, key: Buffer): Buffer {
  const [iv, tag, payload] = value.split('.');
  if (!iv || !tag || !payload) throw new Error('Payload cifrato non valido');
  const decipher = createDecipheriv('aes-256-gcm', key, Buffer.from(iv, 'base64'));
  decipher.setAuthTag(Buffer.from(tag, 'base64'));
  return Buffer.concat([decipher.update(Buffer.from(payload, 'base64')), decipher.final()]);
}
export class EnvironmentMasterKeyProvider implements KeyManagementProvider {
  private readonly key: Buffer;
  constructor(master: string) {
    this.key = derive(master);
  }
  async wrapKey(key: Buffer) {
    return encryptWithKey(key, this.key);
  }
  async unwrapKey(value: string) {
    return decryptWithKey(value, this.key);
  }
}
export interface EncryptedEnvelope {
  version: number;
  wrappedKey: string;
  payload: string;
  fingerprint: string;
}
export async function encryptEnvelope(
  value: string,
  provider: KeyManagementProvider,
): Promise<EncryptedEnvelope> {
  const dataKey = randomBytes(32);
  return {
    version: 1,
    wrappedKey: await provider.wrapKey(dataKey),
    payload: encryptWithKey(Buffer.from(value), dataKey),
    fingerprint: createHash('sha256').update(value).digest('hex'),
  };
}
export async function decryptEnvelope(
  envelope: EncryptedEnvelope,
  provider: KeyManagementProvider,
): Promise<string> {
  const dataKey = await provider.unwrapKey(envelope.wrappedKey);
  return decryptWithKey(envelope.payload, dataKey).toString('utf8');
}
