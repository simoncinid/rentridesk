import type { RequestActor } from '../auth/authenticator.js';
declare module 'fastify' {
  interface FastifyRequest {
    actor: RequestActor;
  }
}
