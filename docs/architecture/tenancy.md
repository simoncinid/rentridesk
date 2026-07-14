# Multi-tenancy

`organizations` è il tenant root. Ogni entità aziendale contiene `organization_id`; i link tra entità ripetono il tenant per consentire controlli e indici. Hasura richiede `organization.memberships.user_id = X-Hasura-User-Id` e membership `active`.

Il collegamento partner non nasce dall’inserimento di un cliente: richiede un `partner_client_relationships` attivo e permessi JSON autorizzati dal cliente. Il Run Service non accetta mai ruolo o tenant dichiarati dal browser senza rileggerli.
