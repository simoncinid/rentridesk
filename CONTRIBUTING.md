# Contribuire

Usare Node 22+, pnpm 11.13.0 e TypeScript strict. Prima di una modifica eseguire `pnpm verify`. La logica di dominio appartiene a `packages/domain`, i contratti a `packages/contracts`, gli accessi esterni al bridge. Non inserire SQL nei componenti React e non chiamare RENTRI dal browser.

Le migrazioni sono additive e devono partire da database vuoto. Non modificare documenti, movimenti o FIR storici con script distruttivi. Ogni nuova operazione sensibile richiede schema Zod, autorizzazione, correlation ID, idempotenza e audit.
