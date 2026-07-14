import { randomUUID } from 'node:crypto';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import Fastify from 'fastify';
import { Pool } from 'pg';
import { z } from 'zod';
import { createMovementSchema, transitionFirSchema } from '@rentridesk/contracts';
import { assertTransition } from '@rentridesk/domain';
import type { AppConfig } from './config.js';
import { AppError, AuthenticationError } from './errors.js';
import { InMemoryIdempotencyStore } from './idempotency/store.js';
import { MockRentriAdapter } from './rentri/mock-adapter.js';
import { authenticate } from './auth/authenticator.js';
import { OrganizationAuthorizer } from './authorization/authorizer.js';
import { sendLeadNotificationEmail } from './notifications/lead-mail.js';

const idempotency = new InMemoryIdempotencyStore();
const adapter = new MockRentriAdapter();
const leadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(40).optional().or(z.literal('')),
  businessType: z.string().trim().min(2).max(80),
  currentProcess: z.string().trim().max(120).optional().or(z.literal('')),
  message: z.string().trim().max(1000).optional().or(z.literal('')),
  source: z.string().trim().max(80).default('landing-page'),
  utmSource: z.string().trim().max(120).optional(),
  utmMedium: z.string().trim().max(120).optional(),
  utmCampaign: z.string().trim().max(120).optional(),
  privacyAccepted: z.literal(true),
  privacyVersion: z.string().trim().min(1).max(30),
  website: z.string().max(200).optional(),
});

export function createApp(config: AppConfig) {
  const app = Fastify({
    logger: {
      level: config.LOG_LEVEL,
      redact: [
        'req.headers.authorization',
        'req.headers.cookie',
        '*.encryptedPayload',
        '*.certificate',
      ],
    },
    genReqId: (request) => String(request.headers['x-correlation-id'] ?? randomUUID()),
    bodyLimit: 25 * 1024 * 1024,
  });
  const authorizer = new OrganizationAuthorizer(config);
  const leadPool = config.DATABASE_URL
    ? new Pool({ connectionString: config.DATABASE_URL, max: 3 })
    : null;
  app.decorateRequest('actor');
  void app.register(helmet, { contentSecurityPolicy: false });
  void app.register(cors, { origin: [config.APP_BASE_URL], credentials: false });
  void app.register(rateLimit, { max: 100, timeWindow: '1 minute' });
  void app.register(swagger, {
    openapi: {
      info: {
        title: 'rentridesk internal bridge',
        version: '0.1.0',
        description: 'Operazioni sensibili, RENTRI e job applicativi',
      },
      servers: [{ url: `http://localhost:${config.PORT}` }],
    },
  });
  void app.register(swaggerUi, { routePrefix: '/docs' });
  app.addHook('onRequest', async (request, reply) => {
    reply.header('x-correlation-id', request.id);
    if (
      request.url.startsWith('/health') ||
      request.url.startsWith('/docs') ||
      request.url.startsWith('/v1/public/leads')
    )
      return;
    request.actor = await authenticate(request.headers.authorization, config);
  });
  app.addHook('onClose', async () => {
    await authorizer.close();
    await leadPool?.end();
  });
  app.setErrorHandler((error, request, reply) => {
    const appError =
      error instanceof AppError
        ? error
        : new AppError('INTERNAL_ERROR', 'Si è verificato un errore inatteso', 500);
    request.log.error(
      { err: error instanceof AppError ? { name: error.name, code: error.code } : error },
      'request failed',
    );
    void reply.status(appError.statusCode).send({
      code: appError.code,
      message: appError.message,
      technical_message:
        config.APP_ENV === 'production'
          ? undefined
          : error instanceof Error
            ? error.message
            : 'Unknown error',
      correlation_id: request.id,
      retryable: appError.retryable,
      suggested_action: appError.suggestedAction,
    });
  });
  app.get('/health/live', { schema: { tags: ['health'] } }, async () => ({ status: 'ok' }));
  app.get('/health/ready', { schema: { tags: ['health'] } }, async () => ({
    status: 'ready',
    rentriEnvironment: config.RENTRI_ENVIRONMENT,
  }));
  app.post(
    '/v1/public/leads',
    {
      config: { rateLimit: { max: 5, timeWindow: '1 hour' } },
      schema: { tags: ['public'], summary: 'Raccoglie una richiesta dalla landing pubblica' },
    },
    async (request, reply) => {
      const parsed = leadSchema.safeParse(request.body);
      if (!parsed.success) {
        throw new AppError('INVALID_LEAD', 'Controlla i dati inseriti e riprova', 400);
      }
      if (parsed.data.website) return reply.status(202).send({ accepted: true });
      if (!leadPool) {
        throw new AppError(
          'LEAD_STORAGE_UNAVAILABLE',
          'Raccolta contatti temporaneamente non disponibile',
          503,
        );
      }

      const lead = parsed.data;
      const result = await leadPool.query<{ id: string }>(
        `INSERT INTO public.marketing_leads (
          name, email, phone, business_type, current_process, message, source,
          utm_source, utm_medium, utm_campaign, privacy_version, privacy_accepted_at
        ) VALUES ($1, $2, NULLIF($3, ''), $4, NULLIF($5, ''), NULLIF($6, ''), $7,
          $8, $9, $10, $11, now()
        ) RETURNING id`,
        [
          lead.name,
          lead.email.toLowerCase(),
          lead.phone ?? '',
          lead.businessType,
          lead.currentProcess ?? '',
          lead.message ?? '',
          lead.source,
          lead.utmSource ?? null,
          lead.utmMedium ?? null,
          lead.utmCampaign ?? null,
          lead.privacyVersion,
        ],
      );
      const leadId = result.rows[0]?.id;
      if (config.GMAIL_PASSWORD) {
        try {
          const emailPayload = {
            name: lead.name,
            email: lead.email.toLowerCase(),
            businessType: lead.businessType,
            source: lead.source,
            privacyVersion: lead.privacyVersion,
            ...(lead.phone ? { phone: lead.phone } : {}),
            ...(lead.currentProcess ? { currentProcess: lead.currentProcess } : {}),
            ...(lead.message ? { message: lead.message } : {}),
            ...(lead.utmSource ? { utmSource: lead.utmSource } : {}),
            ...(lead.utmMedium ? { utmMedium: lead.utmMedium } : {}),
            ...(lead.utmCampaign ? { utmCampaign: lead.utmCampaign } : {}),
            ...(leadId ? { leadId } : {}),
          };
          await sendLeadNotificationEmail(emailPayload, config.GMAIL_PASSWORD);
        } catch (error) {
          request.log.error({ err: error, leadId }, 'lead notification email failed');
        }
      }
      return reply.status(201).send({ accepted: true, id: leadId });
    },
  );
  app.get(
    '/v1/rentri/capabilities',
    { schema: { tags: ['rentri'], summary: 'Capability matrix' } },
    async () => ({ data: adapter.getCapabilities() }),
  );
  app.get(
    '/v1/rentri/connection/check',
    { schema: { tags: ['rentri'], summary: 'Verifica connessione' } },
    async () => ({ data: await adapter.checkConnection() }),
  );
  app.post(
    '/v1/movements',
    { schema: { tags: ['movements'], summary: 'Crea un movimento in bozza' } },
    async (request, reply) => {
      const input = createMovementSchema.parse(request.body);
      await authorizer.authorize(request.actor, input.organizationId, 'createMovements');
      return reply
        .status(201)
        .send({ data: { id: randomUUID(), ...input, status: 'draft', correlationId: request.id } });
    },
  );
  app.post(
    '/v1/firs/:firId/transitions',
    { schema: { tags: ['firs'], summary: 'Transizione atomica dello stato FIR' } },
    async (request) => {
      const input = transitionFirSchema.parse(request.body);
      const body = z
        .object({
          currentStatus: z.string(),
          fields: z.record(z.string(), z.unknown()),
        })
        .parse(request.body);
      const role = await authorizer.authorize(request.actor, input.organizationId, 'submitFir');
      const transition = assertTransition(
        body.currentStatus as Parameters<typeof assertTransition>[0],
        input.targetStatus,
        role,
        body.fields,
      );
      return idempotency.execute(`fir:${input.firId}`, input.idempotencyKey, input, async () => ({
        firId: input.firId,
        status: input.targetStatus,
        action: transition.action,
        version: input.expectedVersion + 1,
        correlationId: request.id,
      }));
    },
  );
  app.post(
    '/v1/firs/number',
    { schema: { tags: ['firs', 'rentri'], summary: 'Numerazione FIR idempotente' } },
    async (request) => {
      const body = z
        .object({
          organizationId: z.string().uuid(),
          internalNumber: z.string(),
          wasteCode: z.string(),
          quantity: z.number().positive(),
          unit: z.string(),
          idempotencyKey: z.string().min(8),
        })
        .parse(request.body);
      await authorizer.authorize(request.actor, body.organizationId, 'submitFir');
      return idempotency.execute('fir-number', body.idempotencyKey, body, () =>
        adapter.reserveOrAssignFirNumber(body, body.idempotencyKey),
      );
    },
  );
  app.post(
    '/v1/jobs/run-once',
    { schema: { tags: ['jobs'], summary: 'Esegue un lotto con SKIP LOCKED' } },
    async () => ({
      data: { claimed: 0, completed: 0, retried: 0 },
      message: 'Database non configurato: nessun job acquisito',
    }),
  );
  app.post(
    '/v1/events/nhost',
    { schema: { tags: ['events'], summary: 'Riceve eventi Nhost idempotenti' } },
    async (request) => {
      if (request.headers['x-webhook-secret'] !== process.env['NHOST_WEBHOOK_SECRET'])
        throw new AuthenticationError();
      return { accepted: true, correlationId: request.id };
    },
  );
  return app;
}
