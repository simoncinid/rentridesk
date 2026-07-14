import type { FirStatus, OrganizationRole } from '@rentridesk/contracts';

export interface FirTransition {
  from: FirStatus;
  to: FirStatus;
  roles: readonly OrganizationRole[];
  requiredFields: readonly string[];
  action: string;
  rollbackAllowed: boolean;
}

const operationalRoles: readonly OrganizationRole[] = [
  'owner',
  'admin',
  'environmental_manager',
  'operator',
  'consultant',
];
const managerRoles: readonly OrganizationRole[] = [
  'owner',
  'admin',
  'environmental_manager',
  'consultant',
];

export const firTransitions: readonly FirTransition[] = [
  {
    from: 'draft',
    to: 'ready_for_numbering',
    roles: operationalRoles,
    requiredFields: ['wasteProfileId', 'quantity', 'carrierPartyId', 'destinationPartyId'],
    action: 'validate',
    rollbackAllowed: true,
  },
  {
    from: 'validation_failed',
    to: 'ready_for_numbering',
    roles: operationalRoles,
    requiredFields: ['validationErrorsResolved'],
    action: 'validate',
    rollbackAllowed: true,
  },
  {
    from: 'ready_for_numbering',
    to: 'numbering_pending',
    roles: managerRoles,
    requiredFields: ['rentriConnection'],
    action: 'reserve_number',
    rollbackAllowed: false,
  },
  {
    from: 'numbering_pending',
    to: 'numbered',
    roles: managerRoles,
    requiredFields: ['rentriFirNumber'],
    action: 'confirm_number',
    rollbackAllowed: false,
  },
  {
    from: 'numbered',
    to: 'ready_for_producer_signature',
    roles: operationalRoles,
    requiredFields: ['currentVersionHash'],
    action: 'prepare_signature',
    rollbackAllowed: false,
  },
  {
    from: 'ready_for_producer_signature',
    to: 'producer_signature_pending',
    roles: managerRoles,
    requiredFields: ['signatureProvider'],
    action: 'request_signature',
    rollbackAllowed: false,
  },
  {
    from: 'producer_signature_pending',
    to: 'producer_signed',
    roles: managerRoles,
    requiredFields: ['signatureProof'],
    action: 'confirm_signature',
    rollbackAllowed: false,
  },
  {
    from: 'producer_signed',
    to: 'shared_with_carrier',
    roles: operationalRoles,
    requiredFields: [],
    action: 'share',
    rollbackAllowed: false,
  },
  {
    from: 'shared_with_carrier',
    to: 'carrier_signed',
    roles: managerRoles,
    requiredFields: ['carrierSignatureProof'],
    action: 'receive_carrier_signature',
    rollbackAllowed: false,
  },
  {
    from: 'carrier_signed',
    to: 'in_transit',
    roles: operationalRoles,
    requiredFields: ['departureAt'],
    action: 'start_transport',
    rollbackAllowed: false,
  },
  {
    from: 'in_transit',
    to: 'destination_signed',
    roles: managerRoles,
    requiredFields: ['destinationSignatureProof'],
    action: 'receive_destination_signature',
    rollbackAllowed: false,
  },
  {
    from: 'destination_signed',
    to: 'complete_copy_pending',
    roles: operationalRoles,
    requiredFields: [],
    action: 'request_complete_copy',
    rollbackAllowed: false,
  },
  {
    from: 'complete_copy_pending',
    to: 'complete_copy_received',
    roles: managerRoles,
    requiredFields: ['completeCopyHash'],
    action: 'store_complete_copy',
    rollbackAllowed: false,
  },
  {
    from: 'complete_copy_received',
    to: 'data_transmission_pending',
    roles: managerRoles,
    requiredFields: ['unloadAllocation'],
    action: 'create_unload',
    rollbackAllowed: false,
  },
  {
    from: 'data_transmission_pending',
    to: 'transmitted',
    roles: managerRoles,
    requiredFields: ['rentriTransmissionReference'],
    action: 'transmit_data',
    rollbackAllowed: false,
  },
  {
    from: 'transmitted',
    to: 'conservation_pending',
    roles: managerRoles,
    requiredFields: [],
    action: 'prepare_conservation',
    rollbackAllowed: false,
  },
  {
    from: 'conservation_pending',
    to: 'conserved',
    roles: managerRoles,
    requiredFields: ['conservationReceipt'],
    action: 'confirm_conservation',
    rollbackAllowed: false,
  },
];

export function getTransition(from: FirStatus, to: FirStatus): FirTransition | undefined {
  return firTransitions.find((transition) => transition.from === from && transition.to === to);
}

export function assertTransition(
  from: FirStatus,
  to: FirStatus,
  role: OrganizationRole,
  fields: Readonly<Record<string, unknown>>,
): FirTransition {
  const transition = getTransition(from, to);
  if (!transition) throw new Error(`Transizione FIR non ammessa: ${from} → ${to}`);
  if (!transition.roles.includes(role)) throw new Error('Ruolo non autorizzato alla transizione');
  const missing = transition.requiredFields.filter(
    (field) => fields[field] === undefined || fields[field] === null || fields[field] === '',
  );
  if (missing.length > 0) throw new Error(`Campi mancanti: ${missing.join(', ')}`);
  return transition;
}
