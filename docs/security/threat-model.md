# Threat model

| Minaccia | Contromisura principale |
| --- | --- |
| Accesso cross-tenant / partner eccessivo | Membership e relazione cliente verificate in Hasura e bridge |
| Furto token | JWT brevi, MFA privilegiati, revoca sessione |
| Admin secret o certificato esposto | Solo secret manager, redazione log, mai frontend |
| Documento alterato | SHA-256, legal lock, verifica periodica |
| Doppio invio / replay | Idempotency key, request hash, audit |
| FIR modificato dopo firma | Versioni immutabili e macchina a stati |
| Upload malevolo | Limite, MIME/firma file, nome interno, bucket privato |
| Webhook falso | Secret, correlation ID, handler idempotente |
| RENTRI indisponibile o schema cambiato | Coda, retry, circuit breaker, capability e hash specifiche |
| Errore di mapping | Mapper espliciti e test fixture |
