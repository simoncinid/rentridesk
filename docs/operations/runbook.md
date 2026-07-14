# Runbook

Controllare `/health/live`, `/health/ready`, code `pending/retry_wait/dead_letter`, error rate RENTRI, certificati e spazio Storage. Non riprovare job non idempotenti senza verificare il riferimento remoto.

In incidente: bloccare nuovi invii con feature flag, mantenere letture e documenti, raccogliere correlation ID, verificare audit, isolare la causa, applicare retry controllato e documentare il ripristino.
