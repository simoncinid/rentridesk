import { useState } from 'react';
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Badge, Button, Field } from '../components/ui.js';

function AuthLayout({ children, aside }: { children: React.ReactNode; aside: string }) {
  return (
    <div className="auth-layout">
      <main>
        <Link className="auth-brand" to="/">
          <span className="brand-mark">RD</span>
          <b>rentridesk</b>
        </Link>
        {children}
        <footer>
          © 2026 rentridesk · <a href="#">Privacy</a> · <a href="#">Termini</a>
        </footer>
      </main>
      <aside>
        <Badge tone="purple">AMBIENTE DIMOSTRATIVO</Badge>
        <h2>
          Il processo rifiuti,
          <br />
          più semplice da seguire.
        </h2>
        <p>{aside}</p>
        <ul>
          <li>
            <Check /> Giacenze sempre aggiornate
          </li>
          <li>
            <Check /> FIR guidati passo per passo
          </li>
          <li>
            <Check /> Errori e scadenze in una sola coda
          </li>
        </ul>
        <div className="auth-testimonial">
          <p>“Finalmente sappiamo subito cosa manca e chi deve intervenire.”</p>
          <span>Officina dimostrativa · dati fittizi</span>
        </div>
      </aside>
    </div>
  );
}
export function LoginPage() {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  return (
    <AuthLayout aside="Prova tutti i flussi senza inviare dati ufficiali a RENTRI.">
      <div className="auth-card">
        <div>
          <p className="eyebrow">BENTORNATO</p>
          <h1>Accedi alla tua officina</h1>
          <span>Usa l’account demo oppure le tue credenziali.</span>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void navigate('/app/dashboard');
          }}
        >
          <Field label="E-mail">
            <div className="input-icon">
              <Mail />
              <input required type="email" defaultValue="demo@rentridesk.example" />
            </div>
          </Field>
          <Field label="Password">
            <div className="input-icon password">
              <LockKeyhole />
              <input required type={show ? 'text' : 'password'} defaultValue="Demo-2026!" />
              <button type="button" onClick={() => setShow(!show)} aria-label="Mostra password">
                {show ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </Field>
          <div className="form-between">
            <label>
              <input type="checkbox" /> Ricordami
            </label>
            <Link to="/forgot-password">Password dimenticata?</Link>
          </div>
          <Button variant="primary" type="submit">
            Accedi <ArrowRight />
          </Button>
        </form>
        <div className="auth-divider">
          <span>oppure</span>
        </div>
        <Button onClick={() => void navigate('/app/dashboard')}>
          <ShieldCheck /> Entra nella demo
        </Button>
        <p>
          Non hai un account? <Link to="/register">Crea l’organizzazione</Link>
        </p>
      </div>
    </AuthLayout>
  );
}
export function RegisterPage() {
  return (
    <AuthLayout aside="La configurazione guidata salva ogni passaggio e puoi riprenderla quando vuoi.">
      <div className="auth-card">
        <div>
          <p className="eyebrow">INIZIA ORA</p>
          <h1>Crea la tua organizzazione</h1>
          <span>14 giorni di prova. Nessun dato inviato senza attivazione.</span>
        </div>
        <form>
          <Field label="Nome e cognome">
            <input placeholder="Mario Rossi" />
          </Field>
          <Field label="E-mail di lavoro">
            <input type="email" placeholder="mario@officina.it" />
          </Field>
          <Field label="Password" hint="Almeno 12 caratteri">
            <input type="password" />
          </Field>
          <Link to="/verify-email">
            <Button variant="primary" type="button">
              Crea account <ArrowRight />
            </Button>
          </Link>
        </form>
        <p>
          Hai già un account? <Link to="/login">Accedi</Link>
        </p>
      </div>
    </AuthLayout>
  );
}
export function MfaPage() {
  const navigate = useNavigate();
  return (
    <div className="standalone-auth">
      <span className="security-icon">
        <KeyRound />
      </span>
      <p className="eyebrow">VERIFICA IN DUE PASSAGGI</p>
      <h1>Inserisci il codice di sicurezza</h1>
      <p>Apri l’app di autenticazione e inserisci il codice a 6 cifre.</p>
      <div className="otp-inputs">
        {Array.from({ length: 6 }).map((_, i) => (
          <input key={i} inputMode="numeric" maxLength={1} aria-label={`Cifra ${i + 1}`} />
        ))}
      </div>
      <Button variant="primary" onClick={() => void navigate('/app/dashboard')}>
        Verifica e accedi
      </Button>
      <a href="#">Usa un codice di recupero</a>
    </div>
  );
}
export function SimpleAuthPage({ type }: { type: 'forgot' | 'verify' | 'reset' }) {
  const config = {
    forgot: ['Recupera la password', 'Inserisci l’e-mail: ti invieremo un collegamento sicuro.'],
    verify: [
      'Controlla la tua e-mail',
      'Abbiamo inviato il link di verifica. Scade tra 30 minuti.',
    ],
    reset: [
      'Scegli una nuova password',
      'Usa almeno 12 caratteri e non riutilizzare password precedenti.',
    ],
  }[type];
  return (
    <div className="standalone-auth">
      <span className="security-icon">{type === 'verify' ? <Mail /> : <LockKeyhole />}</span>
      <h1>{config[0]}</h1>
      <p>{config[1]}</p>
      {type !== 'verify' && (
        <input
          type={type === 'reset' ? 'password' : 'email'}
          placeholder={type === 'reset' ? 'Nuova password' : 'nome@azienda.it'}
        />
      )}
      <Button variant="primary">
        {type === 'forgot'
          ? 'Invia collegamento'
          : type === 'verify'
            ? 'Ho verificato l’e-mail'
            : 'Aggiorna password'}
      </Button>
      <Link to="/login">Torna all’accesso</Link>
    </div>
  );
}
