# rentridesk

Piattaforma SaaS multi-tenant per officine, carrozzerie ed elettrauto che gestiscono rifiuti, registro cronologico, formulari FIR digitali, documenti e interoperabilità RENTRI. L’interfaccia è in italiano e privilegia procedure guidate, azioni esplicite e una coda unica per ciò che richiede intervento.

> Il repository non contiene credenziali e non effettua invii reali a RENTRI per impostazione predefinita. La classificazione EER resta a carico dell’azienda o del consulente. Il software non offre consulenza legale.

## Architettura

- `apps/web`: React 19, TypeScript strict, Vite, React Router, TanStack Query/Table, React Hook Form e Zod.
- `services/rentri-bridge`: Run Service Fastify. Custodisce le operazioni sensibili, l’adapter RENTRI, idempotenza, retry, OpenAPI e log strutturati.
- `packages/contracts`: schemi Zod condivisi tra browser e servizio.
- `packages/domain`: giacenze, FIFO, permessi e macchina a stati FIR verificati con Vitest.
- `nhost`: migrazione PostgreSQL, viste, vincoli di integrità, seed, configurazione e metadata Hasura deny-by-default.
- `docs`: decisioni, permessi, integrazione RENTRI, sicurezza e runbook.

Il browser legge i dati consentiti tramite Hasura. Numerazione, firme, trasmissioni, modifiche di stato ufficiali, credenziali e copie complete passano dal bridge. L’adapter predefinito è `MockRentriAdapter`; l’attivazione reale è deliberatamente bloccata senza ambiente, certificato e verifiche.

## Requisiti

- Node.js 22 LTS o successivo
- pnpm 11.13.0
- Docker Desktop e Nhost CLI per lo stack locale completo

## Avvio rapido dell’interfaccia

```bash
npx pnpm@11.13.0 install
cp .env.example .env
npx pnpm@11.13.0 dev:web
```

Aprire `http://localhost:5173`. Account dimostrativo:

- e-mail: `demo@rentridesk.example`
- password: `Demo-2026!`

Il pulsante **Entra nella demo** usa dati fittizi anche senza autenticazione Nhost.

## Avvio del bridge

```bash
npx pnpm@11.13.0 dev:bridge
```

- health: `http://localhost:3001/health/live`
- readiness: `http://localhost:3001/health/ready`
- OpenAPI: `http://localhost:3001/docs`

In sviluppo il bridge accetta le chiamate senza un JWT reale; staging e produzione richiedono Bearer token. Questa eccezione non si attiva quando `APP_ENV` è diverso da `development` o `test`.

## Nhost locale

1. Installare la [Nhost CLI](https://docs.nhost.io/platform/cli/local-development).
2. Entrare nella cartella `nhost` ed eseguire `nhost up`.
3. Applicare la migrazione `20260714090000_initial` e il seed `default.sql`.
4. Configurare nel file `.env` subdomain, region e admin secret locali.
5. Eseguire `pnpm graphql:codegen` quando Hasura è disponibile.

La migrazione crea tenant, unità locali, anagrafiche, autorizzazioni, documenti, registri, movimenti, giacenze, FIR versionati, eventi, firme, job, idempotenza, audit concatenato, notifiche, billing, conservazione e feature flag. Trigger PostgreSQL bloccano la modifica di documenti legali, movimenti bloccati e audit.

## Verifiche e build

```bash
pnpm lint
pnpm typecheck
pnpm verify:unit
pnpm build
pnpm verify
pnpm verify:e2e
```

La build web prerenderizza la home e tutte le pagine pubbliche RENTRI: title, description,
canonical, Open Graph, contenuti, FAQ e dati strutturati sono presenti nell’HTML iniziale. Genera
anche `sitemap.xml` e `robots.txt`. Il canonical host predefinito è `https://rentridesk.it` e può
essere cambiato in fase di build con `VITE_PUBLIC_SITE_URL`.

Per validare gli output SEO dopo la build:

```bash
pnpm --filter @rentridesk/web check:seo
```

L’hosting statico deve servire il relativo `index.html` per gli URL senza estensione (per esempio
`/software-rentri-officine` → `/software-rentri-officine/index.html`). Il server di anteprima Vite
è già configurato in questo modo.

I test E2E avviano automaticamente Vite. Le verifiche di integrazione con Nhost richiedono lo stack locale attivo.

## Ambienti RENTRI

### Mock → demo

1. Completare boarding nell’area RENTRI demo.
2. Ottenere e custodire il certificato di interoperabilità fuori dal repository.
3. Inserire il riferimento del secret in `RENTRI_INTEROPERABILITY_CERTIFICATE_REF` e la master key in Nhost Secrets.
4. Impostare `RENTRI_ENVIRONMENT=demo` e gli URL ufficiali demo.
5. Verificare ogni capability e aggiornare la matrice in `docs/rentri/demo-to-production-checklist.md`.

### Demo → produzione

Il bridge rifiuta l’avvio con `RENTRI_ENVIRONMENT=production` se `APP_ENV` non è `production`, se Nhost è locale o se manca il certificato. Prima dell’attivazione servono prove complete in demo, revisione di OpenAPI/XSD/changelog, rotazione delle credenziali, runbook e piano di rollback. Vedere [integration-overview.md](docs/rentri/integration-overview.md).

## Secret e certificati

Usare Nhost Secrets o il secret manager del runtime; non modificare `.env.example` con valori reali. `NHOST_ADMIN_SECRET`, `NHOST_WEBHOOK_SECRET`, `CREDENTIAL_MASTER_KEY`, riferimenti ai certificati e chiavi Stripe non devono entrare nel browser. Le credenziali applicative sono protette con envelope encryption e una DEK distinta per record.

## Limiti intenzionali

- Nessun adapter RENTRI produzione è dichiarato pronto.
- Nessuna firma XAdES viene implementata internamente.
- I codici dei seed sono esclusivamente dimostrativi e non sono una fonte normativa.
- Conservazione e billing usano provider mock finché non vengono configurati provider esterni.
- L’autenticazione visuale demo non sostituisce i test Nhost Auth dello stack locale.

Lo stato analitico è in [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md).
