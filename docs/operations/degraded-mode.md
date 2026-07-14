# Modalità degradata

Se RENTRI non risponde, l’interfaccia mostra “Invio in attesa”; non mostra mai “completato”. I comandi idempotenti restano nella coda PostgreSQL, il circuit breaker limita ulteriori chiamate e gli utenti autorizzati possono riprovare dopo la verifica.

Le procedure ufficiali di indisponibilità devono essere applicate solo secondo decreti e istruzioni RENTRI correnti; il software non le inventa.
