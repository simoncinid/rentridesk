# Macchine a stati

La definizione FIR è centralizzata in `packages/domain/src/fir-state-machine.ts`. Ogni arco dichiara partenza, arrivo, ruoli, campi obbligatori, azione e rollback. Nessun endpoint modifica uno stato ufficiale fuori da questa definizione.

Movimenti bloccati e documenti con `legal_lock` sono protetti anche da trigger PostgreSQL. Una rettifica crea una nuova registrazione collegata; non riscrive quella storica.
