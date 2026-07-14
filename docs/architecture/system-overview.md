# Panoramica di sistema

La web app usa Nhost Auth per la sessione e Hasura per le letture autorizzate. Le mutation di bozze non sensibili possono passare da Hasura; registri aperti, movimenti bloccati, FIR numerati, credenziali, firme, trasmissioni e conservazione passano dal Run Service.

Il bridge verifica utente, membership e ruolo, avvia una transazione, registra idempotenza e audit, quindi chiama un `RentriAdapter`. I job rimangono in PostgreSQL e vengono acquisiti con `FOR UPDATE SKIP LOCKED`. Storage conserva file privati; la tabella `documents` è il confine di autorizzazione e conserva SHA-256 e legal lock.
