const environment = process.env['RENTRI_ENVIRONMENT'] ?? 'mock';
if (environment === 'production') throw new Error('La sincronizzazione diretta in produzione è bloccata: usare staging e revisione manuale.');
console.log(JSON.stringify({ environment, status: environment === 'mock' ? 'mock_snapshot_retained' : 'requires_authenticated_official_client', message: 'Le codifiche demo incluse nei seed non sono presentate come fonte normativa.' }, null, 2));
