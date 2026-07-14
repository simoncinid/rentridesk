import { afterEach, describe, expect, it } from 'vitest';
import { createApp } from './app.js';
import { loadConfig } from './config.js';

const apps: ReturnType<typeof createApp>[] = [];

function testApp() {
  const app = createApp(
    loadConfig({
      APP_ENV: 'test',
      APP_BASE_URL: 'http://localhost:5173',
      RENTRI_ENVIRONMENT: 'mock',
      CREDENTIAL_MASTER_KEY: 'test-master-key-long-enough',
    }),
  );
  apps.push(app);
  return app;
}

afterEach(async () => {
  await Promise.all(apps.splice(0).map((app) => app.close()));
});

describe('POST /v1/public/leads', () => {
  it('rifiuta payload incompleti senza richiedere autenticazione', async () => {
    const response = await testApp().inject({
      method: 'POST',
      url: '/v1/public/leads',
      payload: { name: 'A' },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toMatchObject({ code: 'INVALID_LEAD' });
  });

  it('non finge di salvare un contatto quando il database non è configurato', async () => {
    const response = await testApp().inject({
      method: 'POST',
      url: '/v1/public/leads',
      payload: {
        name: 'Mario Rossi',
        email: 'mario@example.com',
        businessType: 'Officina meccanica',
        currentProcess: 'Fogli di calcolo',
        privacyAccepted: true,
        privacyVersion: '2026-07-14',
        website: '',
      },
    });

    expect(response.statusCode).toBe(503);
    expect(response.json()).toMatchObject({ code: 'LEAD_STORAGE_UNAVAILABLE' });
  });

  it('accetta silenziosamente il campo trappola compilato dai bot', async () => {
    const response = await testApp().inject({
      method: 'POST',
      url: '/v1/public/leads',
      payload: {
        name: 'Mario Rossi',
        email: 'mario@example.com',
        businessType: 'Officina meccanica',
        privacyAccepted: true,
        privacyVersion: '2026-07-14',
        website: 'spam.example',
      },
    });

    expect(response.statusCode).toBe(202);
    expect(response.json()).toEqual({ accepted: true });
  });
});
