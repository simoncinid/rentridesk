if (process.env['CONFIRM_DEAD_LETTER_RETRY'] !== 'yes') throw new Error('Imposta CONFIRM_DEAD_LETTER_RETRY=yes dopo avere verificato la causa del fallimento.');
console.log('Richiesta esplicita ricevuta. Il retry deve essere eseguito dal pannello admin o dal repository PostgreSQL autorizzato.');
