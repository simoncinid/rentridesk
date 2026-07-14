# Sicurezza

Segnalare vulnerabilità privatamente a `security@example.invalid`; non aprire issue pubbliche con token, dati o exploit. Non usare dati reali nei seed.

I secret vivono in Nhost Secrets. Le operazioni sensibili passano dal Run Service; Hasura non espone `encrypted_payload`. I log applicano redazione a token, cookie, certificati e payload cifrati. Documenti e audit hanno vincoli di immutabilità nel database.

La procedura di risposta è: contenimento, rotazione credenziali, analisi audit, correzione, verifica multi-tenant e comunicazione agli interessati secondo le policy applicabili.
