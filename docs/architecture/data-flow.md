# Flusso dati

1. Il browser invia JWT e organizzazione selezionata.
2. Hasura filtra le query attraverso membership attive; il bridge ricarica la membership dal database.
3. Un comando sensibile produce record di idempotenza, modifica atomica ed evento audit.
4. Le operazioni esterne diventano job persistenti. Il risultato RENTRI viene validato e mappato prima di aggiornare il dominio.
5. XML xFIR, copie complete e ricevute vengono hashati, salvati privatamente e collegati all’entità.

Raw payload, secret e certificati non raggiungono il browser.
