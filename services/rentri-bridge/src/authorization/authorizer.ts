import { Pool } from 'pg';
import type { OrganizationRole } from '@rentridesk/contracts';
import { can, type Permission } from '@rentridesk/domain';
import type { AppConfig } from '../config.js';
import { AuthorizationError } from '../errors.js';
import type { RequestActor } from '../auth/authenticator.js';

const roleValues: readonly OrganizationRole[] = [
  'owner',
  'admin',
  'environmental_manager',
  'operator',
  'consultant',
  'viewer',
  'billing_manager',
  'partner_admin',
];

export class OrganizationAuthorizer {
  private readonly pool: Pool | null;
  constructor(config: AppConfig) {
    this.pool = config.DATABASE_URL
      ? new Pool({ connectionString: config.DATABASE_URL, max: 5 })
      : null;
  }
  async authorize(
    actor: RequestActor,
    organizationId: string,
    permission: Permission,
  ): Promise<OrganizationRole> {
    if (actor.globalRole === 'platform_admin') return 'owner';
    if (actor.demo && !this.pool) return 'owner';
    if (!this.pool) throw new AuthorizationError();
    const result = await this.pool.query<{ role: string }>(
      "SELECT role FROM public.organization_memberships m JOIN public.organizations o ON o.id=m.organization_id WHERE m.organization_id=$1 AND m.user_id=$2 AND m.status='active' AND o.status='active' LIMIT 1",
      [organizationId, actor.userId],
    );
    const rawRole = result.rows[0]?.role;
    const role = roleValues.find((candidate) => candidate === rawRole);
    if (!role || !can(role, permission)) throw new AuthorizationError();
    return role;
  }
  async close(): Promise<void> {
    await this.pool?.end();
  }
}
