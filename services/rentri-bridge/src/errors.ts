export class AppError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode: number,
    public readonly retryable = false,
    public readonly suggestedAction?: string,
  ) {
    super(message);
    this.name = new.target.name;
  }
}
export class AuthenticationError extends AppError {
  constructor() {
    super(
      'AUTHENTICATION_REQUIRED',
      'Sessione non valida o scaduta',
      401,
      false,
      'Accedi nuovamente.',
    );
  }
}
export class AuthorizationError extends AppError {
  constructor() {
    super('NOT_AUTHORIZED', 'Non hai i permessi per questa operazione', 403);
  }
}
export class ConflictError extends AppError {
  constructor(message = 'I dati sono stati modificati da un altro utente') {
    super('CONFLICT', message, 409, false, 'Ricarica i dati e riprova.');
  }
}
export class UnsupportedRentriOperationError extends AppError {
  constructor(operation: string) {
    super(
      'RENTRI_OPERATION_UNSUPPORTED',
      `L’operazione ${operation} non è disponibile nell’ambiente configurato`,
      422,
      false,
      'Usa il flusso ufficiale RENTRI o contatta l’assistenza.',
    );
  }
}
export class RentriUnavailableError extends AppError {
  constructor() {
    super(
      'RENTRI_UNAVAILABLE',
      'RENTRI non è al momento disponibile',
      503,
      true,
      'L’invio è stato messo in coda.',
    );
  }
}
export class IdempotencyConflictError extends AppError {
  constructor() {
    super(
      'IDEMPOTENCY_CONFLICT',
      'La chiave di idempotenza è già associata a una richiesta diversa',
      409,
    );
  }
}
