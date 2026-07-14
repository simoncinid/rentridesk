# Gestione certificati

Le chiavi private non entrano in PostgreSQL in chiaro, bundle frontend o log. Il bridge riceve un riferimento al secret e applica envelope encryption: DEK casuale per record, master key da Nhost Secret, fingerprint per riconoscimento e rotazione esplicita.

La rotazione crea una nuova credenziale, marca la precedente `rotated` e registra audit. Revoca e scadenza bloccano nuovi invii senza eliminare i riferimenti storici.
