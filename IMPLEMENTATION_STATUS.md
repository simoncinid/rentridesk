# rentridesk — stato implementazione

Ultimo aggiornamento: 2026-07-14

## Piano di esecuzione

1. Inizializzare il monorepo pnpm con web app, Run Service, pacchetti condivisi, qualità e CI.
2. Definire dominio, migrazione PostgreSQL, metadata Hasura deny-by-default, seed e configurazione Nhost.
3. Implementare la web app italiana desktop-first con autenticazione demo, onboarding, dashboard, registro, FIR, anagrafiche, documenti, avvisi e aree partner/admin.
4. Implementare il bridge Fastify, autorizzazione, macchina a stati FIR, adapter RENTRI mock, job persistenti, idempotenza, cifratura e OpenAPI.
5. Verificare lint, typecheck, test, build ed esperienza browser; documentare avvio e limiti dell'integrazione reale.

## Stato capability

| Area | Stato | Note |
| --- | --- | --- |
| Monorepo e tooling | implemented | pnpm 11.13.0, TypeScript strict, ESLint, Prettier, Vitest, Playwright, CI e lockfile. |
| Frontend applicativo | implemented | Landing, auth, onboarding, dashboard, coda, registri, movimenti, FIR, archivi, connessione, partner e admin. |
| Database e migrazioni | implemented | Migrazione e seed verificati da database vuoto su PostgreSQL locale. |
| Hasura permissions | implemented | Metadata tenant-aware deny-by-default e mutation limitate alle bozze/anagrafiche. |
| Nhost configuration | implemented | Configurazione locale, Auth/MFA, Storage e template e-mail predisposti. |
| Run Service | implemented | Fastify, OpenAPI, errori, idempotenza, cifratura, health/readiness e comandi sensibili. |
| RENTRI mock | implemented_with_mock | Connessione/validazione, numerazione, firma e copia completa simulate; le altre capability sono dichiarate `unsupported`. |
| RENTRI demo | blocked_by_credentials | Richiede boarding e certificato di interoperabilità. |
| RENTRI production | blocked_by_credentials | Richiede verifica completa in demo e credenziali reali. |
| xFIR reale | blocked_by_official_specification | Gli schemi ufficiali devono essere acquisiti/versionati e validati con credenziali; nessuna firma XAdES proprietaria. |
| Test automatici | implemented | 11 test unitari; E2E Playwright predisposti. `pnpm verify` superato il 2026-07-14. |
| Documentazione operativa | implemented | Architettura, tenancy, database, permessi, RENTRI, runbook, threat model e checklist. |

## Verifiche finali

- `pnpm lint`: superato
- `pnpm typecheck`: superato
- `pnpm verify:unit`: 11/11 test superati
- `pnpm build`: superato per web, dominio e Run Service
- migrazione e seed: applicati con successo a un database PostgreSQL vuoto
- vincolo movimento bloccato: verificato con errore atteso
- endpoint bridge: health, readiness, capability e replay idempotente verificati
- verifica visuale nel browser integrato: non eseguita perché il browser non era disponibile nella sessione

Le etichette usate sono: `implemented`, `implemented_with_mock`, `blocked_by_credentials`, `blocked_by_official_specification`, `not_started`.
