import { createHash } from 'node:crypto';
import type { FirDraft, RentriAdapter, RentriCapability } from './adapter.js';
const capabilities: Readonly<Record<string, RentriCapability['status']>> = {
  codifications_sync: 'unsupported',
  register_opening: 'unsupported',
  movement_transmission: 'unsupported',
  fir_numbering: 'mock_only',
  digital_fir_creation: 'unsupported',
  xfir_upload: 'unsupported',
  remote_signature: 'mock_only',
  complete_copy_download: 'mock_only',
  fir_data_transmission: 'unsupported',
  fir_cancellation: 'unsupported',
  rollback_signature: 'unsupported',
};
export class MockRentriAdapter implements RentriAdapter {
  readonly environment = 'mock' as const;
  getCapabilities(): readonly RentriCapability[] {
    return Object.entries(capabilities).map(([capability, status]) => ({
      capability,
      status,
      lastVerifiedAt: '2026-07-14',
      documentationVersion: '1.1.1290',
    }));
  }
  async checkConnection() {
    return { ok: true, reference: 'mock-connection' };
  }
  async validateFir(fir: FirDraft) {
    const errors = [
      ...(fir.quantity <= 0 ? ['quantity'] : []),
      ...(!fir.wasteCode ? ['wasteCode'] : []),
    ];
    return { valid: errors.length === 0, errors };
  }
  async reserveOrAssignFirNumber(fir: FirDraft, idempotencyKey: string) {
    const hash = createHash('sha256')
      .update(`${fir.internalNumber}:${idempotencyKey}`)
      .digest('hex')
      .slice(0, 6)
      .toUpperCase();
    return { number: `DEMO-${hash}-26`, reference: `mock-${hash.toLowerCase()}` };
  }
  async requestProducerSignature(reference: string) {
    return { operationId: `sign-${reference}`, status: 'signed' as const };
  }
  async downloadCompleteFirCopy(reference: string) {
    return {
      content: Buffer.from(`<xfir environment="mock" reference="${reference}"/>`),
      mimeType: 'application/xml',
    };
  }
}
