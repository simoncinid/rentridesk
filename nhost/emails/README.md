# Template e-mail

I template sono volutamente neutrali e in italiano. `verify-email.html`, `password-reset.html` e `organization-invite.html` coprono Auth e inviti. `notification.html` è la base server-side per: FIR che richiede azione, errore RENTRI, autorizzazione o certificato in scadenza, riepilogo settimanale e pagamento fallito. Il bridge deve fornire titolo, messaggio, azione e URL già autorizzati; non includere documenti o dati sensibili nell’e-mail.
