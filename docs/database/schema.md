# Schema database

La migrazione iniziale si trova in `nhost/migrations/default/20260714090000_initial`. UUID sono generati dal database, i timestamp sono UTC (`timestamptz`) e quantità/importi usano `numeric`.

I blocchi principali sono identità/tenant, unità e connessioni, codifiche versionate, rifiuti e soggetti, documenti, registri/movimenti, FIR/versioni/firme/eventi, code e audit, notifiche, onboarding, billing, conservazione e feature flag. `stock_balances` non somma unità diverse.
