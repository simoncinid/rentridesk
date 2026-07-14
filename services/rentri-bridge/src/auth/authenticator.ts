import { createRemoteJWKSet, jwtVerify } from 'jose';
import type { AppConfig } from '../config.js';
import { AuthenticationError } from '../errors.js';

export interface RequestActor {
  userId: string;
  globalRole: 'user' | 'platform_admin' | 'service';
  demo: boolean;
}

export async function authenticate(
  authorization: string | undefined,
  config: AppConfig,
): Promise<RequestActor> {
  if (!authorization && ['development', 'test'].includes(config.APP_ENV)) {
    return { userId: '00000000-0000-4000-8000-000000000001', globalRole: 'user', demo: true };
  }
  const token = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token || !config.NHOST_JWKS_URL) throw new AuthenticationError();
  try {
    const { payload } = await jwtVerify(token, createRemoteJWKSet(new URL(config.NHOST_JWKS_URL)));
    if (!payload.sub) throw new AuthenticationError();
    const allowed = ['user', 'platform_admin', 'service'] as const;
    const claimRole = payload['https://hasura.io/jwt/claims'];
    const rawRoleValue =
      typeof claimRole === 'object' && claimRole !== null
        ? (claimRole as Record<string, unknown>)['x-hasura-default-role']
        : 'user';
    const rawRole = typeof rawRoleValue === 'string' ? rawRoleValue : 'user';
    const globalRole = allowed.find((role) => role === rawRole) ?? 'user';
    return { userId: payload.sub, globalRole, demo: false };
  } catch {
    throw new AuthenticationError();
  }
}
