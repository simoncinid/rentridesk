export type CapabilityStatus =
  'supported' | 'unsupported' | 'mock_only' | 'demo_verified' | 'production_verified';
export interface RentriCapability {
  capability: string;
  status: CapabilityStatus;
  lastVerifiedAt: string | null;
  documentationVersion: string;
}
export interface FirDraft {
  internalNumber: string;
  wasteCode: string;
  quantity: number;
  unit: string;
}
export interface RentriAdapter {
  readonly environment: 'mock' | 'demo' | 'production';
  getCapabilities(): readonly RentriCapability[];
  checkConnection(): Promise<{ ok: boolean; reference: string }>;
  validateFir(fir: FirDraft): Promise<{ valid: boolean; errors: readonly string[] }>;
  reserveOrAssignFirNumber(
    fir: FirDraft,
    idempotencyKey: string,
  ): Promise<{ number: string; reference: string }>;
  requestProducerSignature(
    reference: string,
  ): Promise<{ operationId: string; status: 'pending' | 'signed' }>;
  downloadCompleteFirCopy(reference: string): Promise<{ content: Buffer; mimeType: string }>;
}
