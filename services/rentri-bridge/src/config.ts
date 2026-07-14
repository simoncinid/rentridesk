import { z } from 'zod';

const environmentSchema = z.object({
  APP_ENV: z.enum(['development', 'test', 'staging', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3001),
  APP_BASE_URL: z.string().url().default('http://localhost:5173'),
  RENTRI_ENVIRONMENT: z.enum(['mock', 'demo', 'production']).default('mock'),
  RENTRI_API_BASE_URL: z.string().url().default('https://demoapi.rentri.gov.it'),
  RENTRI_API_TIMEOUT_MS: z.coerce.number().int().positive().default(10000),
  RENTRI_API_MAX_RETRIES: z.coerce.number().int().min(0).max(8).default(3),
  RENTRI_INTEROPERABILITY_CERTIFICATE_REF: z.string().optional(),
  CREDENTIAL_MASTER_KEY: z.string().min(16).default('development-only-master-key'),
  NHOST_SUBDOMAIN: z.string().default('local'),
  NHOST_REGION: z.string().default('local'),
  NHOST_JWKS_URL: z.string().url().optional(),
  DATABASE_URL: z.string().optional(),
  GMAIL_PASSWORD: z.string().optional(),
  LOG_LEVEL: z.string().default('info'),
});
export type AppConfig = z.infer<typeof environmentSchema>;
export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  const config = environmentSchema.parse(env);
  if (config.RENTRI_ENVIRONMENT === 'production') {
    if (
      config.APP_ENV !== 'production' ||
      config.NHOST_SUBDOMAIN === 'local' ||
      !config.RENTRI_INTEROPERABILITY_CERTIFICATE_REF
    )
      throw new Error('Avvio RENTRI production bloccato: ambiente o certificato non validi');
  }
  if (!['development', 'test'].includes(config.APP_ENV) && !config.NHOST_JWKS_URL) {
    throw new Error('NHOST_JWKS_URL è obbligatorio fuori dallo sviluppo locale');
  }
  return config;
}
