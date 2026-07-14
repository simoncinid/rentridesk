import type { OrganizationRole } from '@rentridesk/contracts';

const grants = {
  manageOrganization: ['owner', 'admin'],
  manageMembers: ['owner', 'admin'],
  manageWasteProfiles: ['owner', 'admin', 'environmental_manager', 'consultant'],
  createMovements: ['owner', 'admin', 'environmental_manager', 'operator', 'consultant'],
  lockMovements: ['owner', 'admin', 'environmental_manager', 'consultant'],
  createFir: ['owner', 'admin', 'environmental_manager', 'operator', 'consultant'],
  submitFir: ['owner', 'admin', 'environmental_manager', 'consultant'],
  manageRentriConnection: ['owner', 'admin', 'environmental_manager'],
  readAudit: ['owner', 'admin', 'environmental_manager', 'consultant'],
  manageBilling: ['owner', 'admin', 'billing_manager'],
  actAsPartner: ['partner_admin'],
} as const satisfies Record<string, readonly OrganizationRole[]>;

export type Permission = keyof typeof grants;
export const can = (role: OrganizationRole, permission: Permission): boolean =>
  grants[permission].includes(role as never);
