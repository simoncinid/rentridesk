import { useState } from 'react';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Cloud,
  ExternalLink,
  Fingerprint,
  Plus,
  RotateCw,
  ShieldCheck,
  UserPlus2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge, Button, DataTable, Field, PageHeader, SectionHeader } from '../components/ui.js';
import { activity } from '../data/demo.js';

export function RegistersPage() {
  return (
    <div className="page">
      <PageHeader
        title="Registri"
        description="Registri cronologici associati alle unità locali."
        actions={
          <Button variant="primary">
            <Plus size={16} /> Apri registro
          </Button>
        }
      />
      <div className="register-card">
        <header>
          <span className="register-icon">RG</span>
          <div>
            <h2>Registro rifiuti 2026</h2>
            <p>Sede di Bologna · Produttore</p>
          </div>
          <Badge tone="success" dot>
            Aperto
          </Badge>
        </header>
        <dl>
          <div>
            <dt>Riferimento RENTRI</dt>
            <dd>REG-DEMO-BO-2026-01</dd>
          </div>
          <div>
            <dt>Ultima sequenza</dt>
            <dd>67</dd>
          </div>
          <div>
            <dt>Da trasmettere</dt>
            <dd className="text-warning">3 movimenti</dd>
          </div>
          <div>
            <dt>Ultimo invio</dt>
            <dd>11 lug 2026, 18:04</dd>
          </div>
        </dl>
        <footer>
          <Link to="/app/registers/register-1">
            Apri registro <ArrowRight size={14} />
          </Link>
        </footer>
      </div>
    </div>
  );
}
export function AuthorizationsPage() {
  const items = [
    [
      'EcoTrasporti Emilia S.r.l.',
      'Albo gestori ambientali',
      'BO/000000',
      '5 ago 2026',
      'In scadenza',
    ],
    [
      'Recuperi Adriatica S.p.A.',
      'Autorizzazione impianto',
      'AIA/DEMO/2048',
      '18 mar 2027',
      'Valida',
    ],
    ['Logistica Verde S.r.l.', 'Albo gestori ambientali', 'MO/000000', '—', 'Documento mancante'],
  ];
  return (
    <div className="page">
      <PageHeader
        title="Autorizzazioni"
        description="Scadenze e coperture dei soggetti esterni. I controlli sono di supporto e non costituiscono garanzia legale."
        actions={
          <Button variant="primary">
            <Plus size={16} /> Aggiungi autorizzazione
          </Button>
        }
      />
      <div className="list-panel">
        <DataTable headers={['Soggetto', 'Tipo', 'Numero', 'Scadenza', 'Stato', '']}>
          {items.map((i) => (
            <tr key={i[0]}>
              <td>
                <b>{i[0]}</b>
              </td>
              <td>{i[1]}</td>
              <td>{i[2]}</td>
              <td>{i[3]}</td>
              <td>
                <Badge
                  tone={
                    i[4] === 'Valida' ? 'success' : i[4] === 'In scadenza' ? 'warning' : 'danger'
                  }
                  dot
                >
                  {i[4]}
                </Badge>
              </td>
              <td>
                <ChevronRight size={16} />
              </td>
            </tr>
          ))}
        </DataTable>
      </div>
    </div>
  );
}

export function RentriConnectionPage() {
  const [checking, setChecking] = useState(false);
  return (
    <div className="page settings-page">
      <PageHeader
        title="Connessione RENTRI"
        description="Stato dell’interoperabilità per l’organizzazione e le unità locali."
      />
      <div className="environment-warning">
        <CircleAlert />
        <div>
          <b>Ambiente dimostrativo</b>
          <span>
            Questa connessione usa risposte simulate. Nessun certificato o invio reale è attivo.
          </span>
        </div>
      </div>
      <div className="settings-grid">
        <section className="panel connection-main">
          <header>
            <div className="large-status">
              <Cloud />
            </div>
            <div>
              <Badge tone="success" dot>
                Connessione operativa
              </Badge>
              <h2>Mock RENTRI</h2>
              <p>Ultimo controllo riuscito oggi alle 11:32</p>
            </div>
            <Button
              onClick={() => {
                setChecking(true);
                setTimeout(() => setChecking(false), 700);
              }}
            >
              <RotateCw size={15} className={checking ? 'spin' : ''} />
              {checking ? 'Controllo…' : 'Verifica ora'}
            </Button>
          </header>
          <dl className="detail-grid">
            <div>
              <dt>Ambiente</dt>
              <dd>Mock locale</dd>
            </div>
            <div>
              <dt>Operatore</dt>
              <dd>DEMO-OP-09281</dd>
            </div>
            <div>
              <dt>Unità locale</dt>
              <dd>DEMO-UL-BO-001</dd>
            </div>
            <div>
              <dt>Adapter</dt>
              <dd>MockRentriAdapter</dd>
            </div>
            <div>
              <dt>Versione documentazione</dt>
              <dd>1.1.1290</dd>
            </div>
            <div>
              <dt>Certificato</dt>
              <dd>Simulato · non esportabile</dd>
            </div>
          </dl>
        </section>
        <aside className="panel">
          <SectionHeader title="Passa all’ambiente demo" />
          <p>Servono accreditamento, boarding e certificato di interoperabilità RENTRI.</p>
          <ol className="requirements">
            <li>
              <Check /> Configurazione applicativa pronta
            </li>
            <li>
              <CircleAlert /> Certificato non configurato
            </li>
            <li>
              <CircleAlert /> Test in ambiente demo non eseguito
            </li>
          </ol>
          <Button disabled>Attiva ambiente demo</Button>
          <a href="https://www.rentri.gov.it/demo/area-operatori" target="_blank" rel="noreferrer">
            Apri portale RENTRI <ExternalLink size={14} />
          </a>
        </aside>
      </div>
      <section className="panel capability-table">
        <SectionHeader title="Capability di integrazione" meta="Aggiornate il 14 lug 2026" />
        <DataTable headers={['Funzione', 'Mock', 'Demo', 'Produzione']}>
          {[
            'Sincronizzazione codifiche',
            'Apertura registro',
            'Trasmissione movimenti',
            'Numerazione FIR',
            'Creazione FIR digitale',
            'Firma remota',
            'Copia completa',
            'Conservazione',
          ].map((name, index) => (
            <tr key={name}>
              <td>
                <b>{name}</b>
              </td>
              <td>
                <Badge tone="success">Disponibile</Badge>
              </td>
              <td>
                <Badge tone={index < 2 ? 'warning' : 'neutral'}>
                  {index < 2 ? 'Da verificare' : 'Credenziali richieste'}
                </Badge>
              </td>
              <td>
                <Badge>Non attiva</Badge>
              </td>
            </tr>
          ))}
        </DataTable>
      </section>
    </div>
  );
}

export function TeamPage() {
  const people = [
    ['Diego Amato', 'diego@officina.example', 'Responsabile ambientale', 'Attivo'],
    ['Laura Bianchi', 'laura@officina.example', 'Titolare', 'Attivo'],
    ['Marco Verdi', 'marco@consulenza.example', 'Consulente', 'Attivo'],
    ['Sara Neri', 'sara@officina.example', 'Operatore', 'Invito in attesa'],
  ];
  return (
    <div className="page">
      <PageHeader
        title="Persone e accessi"
        description="Ruoli e autorizzazioni per Officina Aurora S.r.l."
        actions={
          <Button variant="primary">
            <UserPlus2 size={16} /> Invita persona
          </Button>
        }
      />
      <div className="security-note">
        <ShieldCheck />
        <div>
          <b>MFA obbligatoria per i ruoli privilegiati</b>
          <span>3 di 3 utenti obbligati hanno completato la configurazione.</span>
        </div>
        <Link to="#">Gestisci sicurezza</Link>
      </div>
      <div className="list-panel">
        <DataTable headers={['Persona', 'Ruolo', 'Stato', 'MFA', 'Ultimo accesso', '']}>
          {people.map((p, index) => (
            <tr key={p[1]}>
              <td>
                <div className="person">
                  <span>
                    {p[0]!
                      .split(' ')
                      .map((x) => x[0])
                      .join('')}
                  </span>
                  <p>
                    <b>{p[0]}</b>
                    <small>{p[1]}</small>
                  </p>
                </div>
              </td>
              <td>{p[2]}</td>
              <td>
                <Badge tone={p[3] === 'Attivo' ? 'success' : 'warning'} dot>
                  {p[3]}
                </Badge>
              </td>
              <td>
                {index < 3 ? <Badge tone="success">Attiva</Badge> : <Badge>Non richiesta</Badge>}
              </td>
              <td>{index === 0 ? 'Ora' : index === 1 ? 'Ieri' : '8 lug 2026'}</td>
              <td>•••</td>
            </tr>
          ))}
        </DataTable>
      </div>
    </div>
  );
}

export function AuditPage() {
  return (
    <div className="page">
      <PageHeader
        title="Registro attività"
        description="Cronologia verificabile delle operazioni rilevanti."
        actions={<Button>Esporta registro</Button>}
      />
      <div className="audit-verify">
        <Fingerprint />
        <div>
          <b>Catena di integrità verificata</b>
          <span>1.284 eventi concatenati · ultimo controllo 5 minuti fa</span>
        </div>
        <Badge tone="success">Integra</Badge>
      </div>
      <div className="list-panel">
        <DataTable
          headers={['Data e ora', 'Attività', 'Entità', 'Autore', 'Origine', 'ID correlazione']}
        >
          {activity
            .concat([['Accesso completato con MFA', 'Sessione', '14 lug, 08:37', 'Diego A.']])
            .map((row, index) => (
              <tr key={`${row[0]}${index}`}>
                <td>{row[2]}</td>
                <td>
                  <b>{row[0]}</b>
                </td>
                <td>
                  <Link to="#">{row[1]}</Link>
                </td>
                <td>{row[3]}</td>
                <td>{index === 0 ? 'Bridge' : 'Web app'}</td>
                <td>
                  <code>req_{String(index + 1032)}</code>
                </td>
              </tr>
            ))}
        </DataTable>
      </div>
    </div>
  );
}

const onboardingSteps = [
  ['company', 'Dati aziendali', 'Ragione sociale, contatti e sede legale'],
  ['unit', 'Unità locale', 'Sede operativa e riferimenti'],
  ['activity', 'Tipo di attività', 'Template per officina meccanica'],
  ['rentri', 'Iscrizione RENTRI', 'Riferimenti operatore e unità'],
  ['connection', 'Connessione interoperabilità', 'Ambiente mock attivo'],
  ['register', 'Registro', 'Registro rifiuti 2026'],
  ['wastes', 'Rifiuti ricorrenti', '4 profili configurati'],
  ['parties', 'Trasportatori e destinatari', '4 soggetti collegati'],
  ['auth', 'Autorizzazioni', '1 verifica richiesta'],
  ['team', 'Utenti', '4 persone'],
  ['review', 'Verifica finale', 'Controllo dati e attivazione'],
];
export function OnboardingPage() {
  const [selected, setSelected] = useState(8);
  const complete = 7;
  return (
    <div className="onboarding-page">
      <header>
        <div>
          <span className="brand-mark">FO</span>
          <b>Configurazione di rentridesk</b>
        </div>
        <Badge tone="purple">Modalità demo</Badge>
      </header>
      <main>
        <div className="onboarding-head">
          <div>
            <p>OFFICINA AURORA S.R.L.</p>
            <h1>Completa la configurazione</h1>
            <span>Puoi uscire e riprendere in qualsiasi momento.</span>
          </div>
          <div className="completion-ring">
            <b>{Math.round((complete / onboardingSteps.length) * 100)}%</b>
            <span>completato</span>
          </div>
        </div>
        <div className="onboarding-layout">
          <nav>
            {onboardingSteps.map(([code, title, detail], index) => (
              <button
                className={selected === index ? 'selected' : ''}
                onClick={() => setSelected(index)}
                key={code}
              >
                <span
                  className={index < complete ? 'complete' : index === complete ? 'current' : ''}
                >
                  {index < complete ? <Check /> : index + 1}
                </span>
                <p>
                  <b>{title}</b>
                  <small>{detail}</small>
                </p>
                <ChevronRight />
              </button>
            ))}
          </nav>
          <section className="onboarding-content">
            <Badge
              tone={selected < complete ? 'success' : selected === complete ? 'warning' : 'neutral'}
            >
              {selected < complete
                ? 'Completato'
                : selected === complete
                  ? 'Richiede attenzione'
                  : 'Da completare'}
            </Badge>
            <h2>{onboardingSteps[selected]?.[1]}</h2>
            <p>
              {selected === 8
                ? 'Controlla validità, documenti e codici EER coperti per i soggetti esterni.'
                : 'Rivedi i dati salvati per questo passaggio.'}
            </p>
            {selected === 8 ? (
              <div className="check-cards">
                <div>
                  <CheckCircle2 />
                  <p>
                    <b>3 autorizzazioni verificate</b>
                    <span>Documenti presenti e non scaduti</span>
                  </p>
                </div>
                <div className="check-problem">
                  <CircleAlert />
                  <p>
                    <b>1 documento mancante</b>
                    <span>Logistica Verde S.r.l. · Albo gestori ambientali</span>
                  </p>
                  <Button>Aggiungi documento</Button>
                </div>
              </div>
            ) : (
              <div className="completed-card">
                <CheckCircle2 />
                <h3>Passaggio completato</h3>
                <p>I dati sono salvati e possono essere aggiornati.</p>
              </div>
            )}
            <footer>
              <Button>Salta per ora</Button>
              <Button variant="primary">
                Salva e continua <ArrowRight />
              </Button>
            </footer>
          </section>
        </div>
      </main>
    </div>
  );
}

export function SettingsPage() {
  return (
    <div className="page settings-page">
      <PageHeader
        title="Impostazioni"
        description="Configurazione dell’organizzazione e preferenze operative."
      />
      <div className="settings-layout">
        <nav>
          <button className="active">Organizzazione</button>
          <button>Unità locali</button>
          <button>Notifiche</button>
          <button>Sicurezza</button>
          <button>Conservazione</button>
          <button>Fatturazione</button>
        </nav>
        <section className="panel settings-form">
          <SectionHeader title="Dati dell’organizzazione" />
          <div className="form-grid">
            <Field label="Ragione sociale">
              <input defaultValue="Officina Aurora S.r.l." />
            </Field>
            <Field label="Nome commerciale">
              <input defaultValue="Officina Aurora" />
            </Field>
            <Field label="Partita IVA">
              <input defaultValue="IT00000000001" />
            </Field>
            <Field label="Codice fiscale">
              <input defaultValue="00000000001" />
            </Field>
            <Field label="E-mail">
              <input type="email" defaultValue="amministrazione@officina.example" />
            </Field>
            <Field label="PEC">
              <input type="email" defaultValue="officina@pec.example" />
            </Field>
          </div>
          <footer>
            <Button variant="primary">Salva modifiche</Button>
          </footer>
        </section>
      </div>
    </div>
  );
}

export function BillingPage() {
  return (
    <div className="page">
      <PageHeader
        title="Piano e utilizzo"
        description="Il mancato pagamento non blocca l’accesso ai documenti legali."
      />
      <section className="billing-plan">
        <div>
          <Badge tone="purple">Officina Pro</Badge>
          <h2>
            €49 <small>/ mese</small>
          </h2>
          <p>Rinnovo simulato il 1 agosto 2026</p>
        </div>
        <Button>Gestisci piano</Button>
      </section>
      <section className="panel">
        <SectionHeader title="Utilizzo di luglio" />
        <div className="usage-grid">
          {[
            ['Movimenti', '67', '500'],
            ['Formulari FIR', '12', '100'],
            ['Persone', '4', '10'],
            ['Storage', '1,8 GB', '10 GB'],
          ].map(([label, value, total]) => (
            <div key={label}>
              <span>{label}</span>
              <b>
                {value} <small>di {total}</small>
              </b>
              <div className="progress">
                <i style={{ width: '18%' }} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export function ModulePage({ title, description }: { title: string; description: string }) {
  return (
    <div className="page">
      <PageHeader
        title={title}
        description={description}
        actions={
          <Button variant="primary">
            <Plus size={16} /> Nuova attività
          </Button>
        }
      />
      <div className="status-overview">
        <div>
          <span className="status-icon status-success" />
          <p>Configurazione</p>
          <b>Attiva</b>
        </div>
        <div>
          <span className="status-icon status-info" />
          <p>Elementi recenti</p>
          <b>4</b>
        </div>
        <div>
          <span className="status-icon status-neutral" />
          <p>In lavorazione</p>
          <b>2</b>
        </div>
        <div>
          <span className="status-icon status-danger" />
          <p>Da verificare</p>
          <b>1</b>
        </div>
      </div>
      <section className="panel">
        <SectionHeader title="Attività del modulo" meta="Dati dimostrativi" />
        <DataTable headers={['Attività', 'Stato', 'Responsabile', 'Aggiornato', '']}>
          <tr>
            <td>
              <b>Verifica configurazione e permessi</b>
              <span>Controllo periodico del modulo</span>
            </td>
            <td>
              <Badge tone="success" dot>
                Completata
              </Badge>
            </td>
            <td>Diego Amato</td>
            <td>Oggi, 10:42</td>
            <td>
              <ChevronRight size={16} />
            </td>
          </tr>
          <tr>
            <td>
              <b>Aggiorna dati operativi</b>
              <span>Modifica salvabile con audit</span>
            </td>
            <td>
              <Badge tone="warning" dot>
                Da fare
              </Badge>
            </td>
            <td>Laura Bianchi</td>
            <td>Ieri, 16:18</td>
            <td>
              <ChevronRight size={16} />
            </td>
          </tr>
          <tr>
            <td>
              <b>Esporta riepilogo</b>
              <span>Generazione asincrona protetta</span>
            </td>
            <td>
              <Badge>Disponibile</Badge>
            </td>
            <td>Sistema</td>
            <td>11 lug 2026</td>
            <td>
              <ChevronRight size={16} />
            </td>
          </tr>
        </DataTable>
      </section>
    </div>
  );
}
