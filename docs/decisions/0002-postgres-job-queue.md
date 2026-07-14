# ADR 0002 — Coda PostgreSQL

Stato: accettata. I job sono dati persistenti acquisiti con `FOR UPDATE SKIP LOCKED`; i processi in memoria non sono fonte di verità. La scelta semplifica l’operatività Nhost e consente retry/dead-letter ispezionabili.
