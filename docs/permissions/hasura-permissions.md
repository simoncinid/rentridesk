# Permessi Hasura

I metadata in `nhost/metadata` adottano deny-by-default. Il ruolo `user` legge esclusivamente tenant con membership attiva. Le column permissions escludono payload cifrati e dati tecnici sensibili.

Insert diretti esistono solo per unità, anagrafiche e bozze con ruoli espliciti. Non sono definite mutation dirette per firme, versioni, eventi, submission, credenziali, audit, job o operazioni ufficiali.
