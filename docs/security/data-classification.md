# Classificazione dati

- **Pubblici**: testi applicativi e documentazione.
- **Interni**: configurazioni non segrete e metriche aggregate.
- **Riservati**: anagrafiche, FIR, registri, autorizzazioni e documenti.
- **Critici**: token, master key, certificati e payload cifrati.

I dati critici non sono leggibili via Hasura. I dati riservati richiedono tenant attivo e vengono minimizzati nei log.
