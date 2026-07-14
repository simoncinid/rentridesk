# Contratto adapter

`RentriAdapter` usa metodi di dominio: connessione, capability, validazione, numerazione, firma e copia completa. Un metodo privo di controparte ufficiale verificata deve restituire `UnsupportedRentriOperationError`.

La capability matrix usa `supported`, `unsupported`, `mock_only`, `demo_verified`, `production_verified`, con data e versione documentale. Nessun dettaglio HTTP viene esposto ai componenti React.
