# Recupero job

Ispezionare `last_error_code`, tentativi, entità e correlation ID. Correggere prima la causa. I job dead-letter non vengono riprovati automaticamente: usare il pannello admin o `CONFIRM_DEAD_LETTER_RETRY=yes pnpm jobs:retry-dead-letter` come guardia operativa, poi l’endpoint autorizzato.
