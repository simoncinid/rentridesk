import { z } from 'zod';

export const organizationRoleSchema = z.enum([
  'owner',
  'admin',
  'environmental_manager',
  'operator',
  'consultant',
  'viewer',
  'billing_manager',
  'partner_admin',
]);
export type OrganizationRole = z.infer<typeof organizationRoleSchema>;

export const firStatusSchema = z.enum([
  'draft',
  'validation_failed',
  'ready_for_numbering',
  'numbering_pending',
  'numbered',
  'ready_for_producer_signature',
  'producer_signature_pending',
  'producer_signed',
  'shared_with_carrier',
  'carrier_integration_pending',
  'carrier_ready_to_sign',
  'carrier_signed',
  'in_transit',
  'destination_integration_pending',
  'destination_ready_to_sign',
  'destination_signed',
  'complete_copy_pending',
  'complete_copy_received',
  'data_transmission_pending',
  'transmitted',
  'conservation_pending',
  'conserved',
  'cancel_pending',
  'cancelled',
  'error',
]);
export type FirStatus = z.infer<typeof firStatusSchema>;

export const createMovementSchema = z.object({
  organizationId: z.string().uuid(),
  registerId: z.string().uuid(),
  localUnitId: z.string().uuid(),
  type: z.enum(['load', 'unload']),
  wasteProfileId: z.string().uuid(),
  operationDate: z.string().date(),
  quantity: z.coerce.number().positive(),
  quantityUnitCode: z.enum(['kg', 't', 'l']),
  notes: z.string().max(2000).optional(),
  expectedVersion: z.number().int().nonnegative().default(0),
});
export type CreateMovementInput = z.infer<typeof createMovementSchema>;

export const createFirSchema = z.object({
  organizationId: z.string().uuid(),
  localUnitId: z.string().uuid(),
  wasteProfileId: z.string().uuid(),
  quantity: z.coerce.number().positive(),
  quantityUnitCode: z.enum(['kg', 't', 'l']),
  carrierPartyId: z.string().uuid(),
  destinationPartyId: z.string().uuid(),
  recoveryDisposalCode: z.string().min(1),
  departurePlannedAt: z.string().datetime(),
  intermediaryPartyId: z.string().uuid().optional(),
  notes: z.string().max(2000).optional(),
});
export type CreateFirInput = z.infer<typeof createFirSchema>;

export const transitionFirSchema = z.object({
  organizationId: z.string().uuid(),
  firId: z.string().uuid(),
  targetStatus: firStatusSchema,
  expectedVersion: z.number().int().nonnegative(),
  idempotencyKey: z.string().min(8).max(128),
});

export const apiErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  correlationId: z.string(),
  retryable: z.boolean(),
  suggestedAction: z.string().optional(),
  fieldErrors: z.record(z.string(), z.array(z.string())).optional(),
});
export type ApiError = z.infer<typeof apiErrorSchema>;

export const apiSuccessSchema = <T extends z.ZodType>(data: T) =>
  z.object({
    data,
    correlationId: z.string(),
    replayed: z.boolean().optional(),
  });
