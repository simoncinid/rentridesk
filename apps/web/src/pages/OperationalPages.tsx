import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  CircleAlert,
  CloudUpload,
  Download,
  FileCheck2,
  FilePlus2,
  MoreHorizontal,
  Plus,
  Save,
  Send,
  SlidersHorizontal,
  Truck,
  Upload,
  XCircle,
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { alerts, documents, firs, movements, parties, wasteProfiles } from '../data/demo.js';
import {
  Badge,
  Breadcrumbs,
  Button,
  DataTable,
  Field,
  FilterBar,
  PageHeader,
  SectionHeader,
} from '../components/ui.js';

const toneFor = (value: string) =>
  value.includes('correggere') || value.includes('mancante') || value.includes('Scaduta')
    ? 'danger'
    : value.includes('scadenza') ||
        value.includes('Da trasmettere') ||
        value.includes('Da rivedere') ||
        value.includes('conservare')
      ? 'warning'
      : value.includes('Trasmesso') ||
          value.includes('Confermato') ||
          value.includes('Conservato') ||
          value.includes('ricevuta') ||
          value.includes('Valida') ||
          value.includes('Valido') ||
          value.includes('Protetto')
        ? 'success'
        : value.includes('viaggio')
          ? 'info'
          : 'neutral';

export function MovementsPage() {
  const [tab, setTab] = useState('Tutti');
  const filtered =
    tab === 'Tutti'
      ? movements
      : movements.filter((item) => item.type === tab || item.transmission === tab);
  return (
    <div className="page">
      <PageHeader
        eyebrow="Registro rifiuti 2026"
        title="Movimenti"
        description="Carichi, scarichi e trasmissioni del registro cronologico."
        actions={
          <>
            <Button>
              <Download size={16} /> Esporta
            </Button>
            <Link to="/app/movements/new">
              <Button variant="primary">
                <Plus size={16} /> Registra movimento
              </Button>
            </Link>
          </>
        }
      />
      <div className="summary-strip">
        <div>
          <span>Giacenza complessiva</span>
          <b>1.248 kg</b>
        </div>
        <div>
          <span>Da trasmettere</span>
          <b className="text-warning">3 movimenti</b>
        </div>
        <div>
          <span>Ultima trasmissione</span>
          <b>11 lug, 18:04</b>
        </div>
      </div>
      <div className="list-panel">
        <div className="tabs" role="tablist">
          {['Tutti', 'Carico', 'Scarico', 'Da trasmettere'].map((item) => (
            <button role="tab" aria-selected={tab === item} onClick={() => setTab(item)} key={item}>
              {item}
              <span>
                {item === 'Tutti'
                  ? movements.length
                  : item === 'Carico'
                    ? 3
                    : item === 'Scarico'
                      ? 2
                      : 3}
              </span>
            </button>
          ))}
        </div>
        <FilterBar placeholder="Cerca numero, EER o rifiuto…">
          <select aria-label="Periodo">
            <option>Luglio 2026</option>
            <option>Giugno 2026</option>
          </select>
        </FilterBar>
        <DataTable
          headers={[
            'Movimento',
            'Tipo',
            'Data operazione',
            'Rifiuto',
            'Quantità',
            'Stato',
            'Trasmissione',
            '',
          ]}
        >
          {filtered.map((movement) => (
            <tr key={movement.id}>
              <td>
                <Link className="strong-link" to={`/app/movements/${movement.id}`}>
                  {movement.sequence}
                </Link>
              </td>
              <td>
                <Badge tone={movement.type === 'Carico' ? 'info' : 'purple'}>{movement.type}</Badge>
              </td>
              <td>{movement.date}</td>
              <td>
                <b className="code">{movement.wasteCode}</b>
                <span>{movement.waste}</span>
              </td>
              <td className="numeric">
                <b>{movement.quantity}</b> {movement.unit}
              </td>
              <td>
                <Badge tone={toneFor(movement.status)} dot>
                  {movement.status}
                </Badge>
              </td>
              <td>
                <Badge tone={toneFor(movement.transmission)}>{movement.transmission}</Badge>
              </td>
              <td>
                <button className="icon-button">
                  <MoreHorizontal size={16} />
                </button>
              </td>
            </tr>
          ))}
        </DataTable>
        <div className="pagination">
          <span>
            1–{filtered.length} di {filtered.length} movimenti
          </span>
          <div>
            <Button disabled>Precedente</Button>
            <Button disabled>Successiva</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

const movementFormSchema = z.object({
  type: z.enum(['load', 'unload']),
  wasteProfile: z.string().min(1, 'Seleziona un rifiuto'),
  quantity: z.number().positive('Inserisci una quantità maggiore di zero'),
  date: z.string().min(1, 'Inserisci la data'),
  notes: z.string().max(500).optional(),
});
type MovementForm = z.infer<typeof movementFormSchema>;
export function NewMovementPage() {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<MovementForm>({
    resolver: zodResolver(movementFormSchema),
    defaultValues: { type: 'load', date: '2026-07-14' },
  });
  const onSubmit = () => {
    setSaved(true);
    window.setTimeout(() => navigate('/app/movements'), 650);
  };
  return (
    <div className="page form-page">
      <Breadcrumbs items={['Movimenti', 'Nuovo movimento']} />
      <PageHeader
        title="Registra un movimento"
        description="Inserisci solo i dati essenziali. Potrai completare e bloccare il movimento in seguito."
      />
      <form onSubmit={(event) => void handleSubmit(onSubmit)(event)}>
        <section className="form-card">
          <div className="form-card-header">
            <span>1</span>
            <div>
              <h2>Tipo e rifiuto</h2>
              <p>Indica cosa è successo e quale rifiuto riguarda.</p>
            </div>
          </div>
          <div className="form-grid">
            <fieldset className="form-field full">
              <legend className="field-label">Tipo di movimento *</legend>
              <div className="choice-cards">
                <label>
                  <input type="radio" value="load" {...register('type')} />
                  <span>
                    <CloudUpload /> <b>Carico</b>
                    <small>Il rifiuto entra in giacenza</small>
                  </span>
                </label>
                <label>
                  <input type="radio" value="unload" {...register('type')} />
                  <span>
                    <Truck /> <b>Scarico</b>
                    <small>Il rifiuto lascia l’unità locale</small>
                  </span>
                </label>
              </div>
            </fieldset>
            <Field label="Rifiuto configurato" required error={errors.wasteProfile?.message}>
              <select {...register('wasteProfile')}>
                <option value="">Seleziona codice EER e rifiuto</option>
                {wasteProfiles.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.code} — {item.name}
                  </option>
                ))}
              </select>
            </Field>
            <div className="context-hint">
              <CheckCircle2 />
              <div>
                <b>Classificazione confermata</b>
                <span>Il codice sarà copiato nel movimento come dato storico.</span>
              </div>
            </div>
          </div>
        </section>
        <section className="form-card">
          <div className="form-card-header">
            <span>2</span>
            <div>
              <h2>Quantità e data</h2>
              <p>Usa l’unità prevista dal profilo rifiuto.</p>
            </div>
          </div>
          <div className="form-grid">
            <Field label="Quantità" required error={errors.quantity?.message}>
              <div className="input-suffix">
                <input
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  {...register('quantity', { valueAsNumber: true })}
                />
                <span>kg</span>
              </div>
            </Field>
            <Field label="Data operazione" required error={errors.date?.message}>
              <input type="date" {...register('date')} />
            </Field>
            <Field label="Note" hint={`${watch('notes')?.length ?? 0}/500 caratteri`}>
              <textarea
                rows={3}
                placeholder="Informazioni utili, senza dati non necessari"
                {...register('notes')}
              />
            </Field>
          </div>
        </section>
        <div className="form-actions">
          <Link to="/app/movements">
            <Button type="button">Annulla</Button>
          </Link>
          <span>Il movimento sarà salvato come bozza</span>
          <Button type="submit" variant="primary" disabled={isSubmitting || saved}>
            {saved ? (
              <>
                <Check size={16} /> Salvato
              </>
            ) : (
              <>
                <Save size={16} /> Salva movimento
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export function FirsPage() {
  return (
    <div className="page">
      <PageHeader
        title="Formulari FIR"
        description="Segui ogni formulario dalla bozza alla conservazione."
        actions={
          <>
            <Button>
              <Download size={16} /> Esporta elenco
            </Button>
            <Link to="/app/firs/new">
              <Button variant="primary">
                <FilePlus2 size={16} /> Nuovo FIR
              </Button>
            </Link>
          </>
        }
      />
      <div className="status-overview">
        {[
          ['In preparazione', '2', 'neutral'],
          ['In attesa di altri', '3', 'info'],
          ['Richiedono intervento', '1', 'danger'],
          ['Completati questo mese', '8', 'success'],
        ].map(([label, count, tone]) => (
          <div key={label}>
            <span className={`status-icon status-${tone}`} />
            <p>{label}</p>
            <b>{count}</b>
          </div>
        ))}
      </div>
      <div className="list-panel">
        <FilterBar placeholder="Cerca numero FIR, EER o soggetto…">
          <select>
            <option>Tutti gli stati</option>
            <option>Da correggere</option>
            <option>In viaggio</option>
          </select>
          <select>
            <option>Tutte le unità locali</option>
          </select>
        </FilterBar>
        <DataTable
          headers={[
            'Formulario',
            'Rifiuto',
            'Trasportatore → Destinatario',
            'Quantità',
            'Stato',
            'Aggiornato',
            '',
          ]}
        >
          {firs.map((fir) => (
            <tr key={fir.id}>
              <td>
                <Link className="strong-link" to={`/app/firs/${fir.id}`}>
                  {fir.internalNumber}
                </Link>
                <small>{fir.officialNumber}</small>
              </td>
              <td>
                <b className="code">{fir.wasteCode}</b>
                <span>{fir.waste}</span>
              </td>
              <td>
                <span>{fir.carrier}</span>
                <small>→ {fir.destination}</small>
              </td>
              <td className="numeric">
                <b>{fir.quantity}</b> {fir.unit}
              </td>
              <td>
                <Badge tone={toneFor(fir.status)} dot>
                  {fir.status}
                </Badge>
              </td>
              <td>
                {fir.updatedAt}
                <small>da {fir.actor}</small>
              </td>
              <td>
                <MoreHorizontal size={16} />
              </td>
            </tr>
          ))}
        </DataTable>
      </div>
    </div>
  );
}

const firFormSchema = z.object({
  waste: z.string().min(1, 'Seleziona un rifiuto'),
  quantity: z.number().positive('La quantità deve essere positiva'),
  carrier: z.string().min(1, 'Seleziona il trasportatore'),
  destination: z.string().min(1, 'Seleziona il destinatario'),
  operation: z.string().min(1, 'Seleziona l’operazione'),
  departure: z.string().min(1, 'Indica la partenza prevista'),
});
type FirForm = z.infer<typeof firFormSchema>;
export function NewFirPage() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const {
    register,
    trigger,
    handleSubmit,
    formState: { errors },
  } = useForm<FirForm>({
    resolver: zodResolver(firFormSchema),
    defaultValues: { departure: '2026-07-15T09:00' },
  });
  const next = async () => {
    const fields =
      step === 1
        ? (['waste', 'quantity'] as const)
        : (['carrier', 'destination', 'operation', 'departure'] as const);
    if (await trigger(fields)) setStep(step + 1);
  };
  return (
    <div className="page form-page wide">
      <Breadcrumbs items={['Formulari FIR', 'Nuovo FIR']} />
      <PageHeader
        title="Prepara un nuovo FIR"
        description="La procedura controlla i dati prima di qualsiasi operazione RENTRI."
      />
      <div className="stepper">
        {['Rifiuto e quantità', 'Trasporto', 'Controllo'].map((label, index) => (
          <div className={step > index ? 'step-active' : ''} key={label}>
            <span>{step > index + 1 ? <Check /> : index + 1}</span>
            <p>
              {label}
              <small>
                {index === 0
                  ? 'Cosa viene ritirato'
                  : index === 1
                    ? 'Chi e quando'
                    : 'Verifica finale'}
              </small>
            </p>
          </div>
        ))}
      </div>
      <form onSubmit={(event) => void handleSubmit(() => navigate('/app/firs/fir-3'))(event)}>
        <section className="form-card wizard-card">
          {step === 1 && (
            <>
              <div className="form-card-header">
                <span>1</span>
                <div>
                  <h2>Quale rifiuto viene ritirato?</h2>
                  <p>I dati confermati del profilo verranno riportati nel FIR.</p>
                </div>
              </div>
              <div className="form-grid">
                <Field label="Profilo rifiuto" required error={errors.waste?.message}>
                  <select {...register('waste')}>
                    <option value="">Seleziona un rifiuto</option>
                    {wasteProfiles.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.code} — {item.name}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Quantità alla partenza" required error={errors.quantity?.message}>
                  <div className="input-suffix">
                    <input
                      type="number"
                      placeholder="0"
                      {...register('quantity', { valueAsNumber: true })}
                    />
                    <span>kg</span>
                  </div>
                </Field>
                <div className="stock-callout full">
                  <span>Giacenza disponibile</span>
                  <b>620 kg</b>
                  <small>38 kg già impegnati in FIR aperti</small>
                </div>
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <div className="form-card-header">
                <span>2</span>
                <div>
                  <h2>Organizza il trasporto</h2>
                  <p>Seleziona soggetti già verificati e la partenza prevista.</p>
                </div>
              </div>
              <div className="form-grid">
                <Field label="Trasportatore" required error={errors.carrier?.message}>
                  <select {...register('carrier')}>
                    <option value="">Seleziona trasportatore</option>
                    {parties
                      .filter((p) => p.roles === 'Trasportatore')
                      .map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                  </select>
                </Field>
                <Field label="Destinatario" required error={errors.destination?.message}>
                  <select {...register('destination')}>
                    <option value="">Seleziona destinatario</option>
                    {parties
                      .filter((p) => p.roles === 'Destinatario')
                      .map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                  </select>
                </Field>
                <Field label="Operazione prevista" required error={errors.operation?.message}>
                  <select {...register('operation')}>
                    <option value="">Seleziona</option>
                    <option value="R13">R13 — Messa in riserva</option>
                    <option value="R9">R9 — Rigenerazione oli</option>
                  </select>
                </Field>
                <Field label="Partenza prevista" required error={errors.departure?.message}>
                  <input type="datetime-local" {...register('departure')} />
                </Field>
              </div>
            </>
          )}
          {step === 3 && (
            <>
              <div className="form-card-header">
                <span>
                  <FileCheck2 />
                </span>
                <div>
                  <h2>Controlli prima del salvataggio</h2>
                  <p>Il FIR resta una bozza e non riceve ancora un numero ufficiale.</p>
                </div>
              </div>
              <ul className="validation-list">
                <li>
                  <CheckCircle2 />
                  <div>
                    <b>Unità locale attiva</b>
                    <span>Sede di Bologna · BO-001</span>
                  </div>
                </li>
                <li>
                  <CheckCircle2 />
                  <div>
                    <b>Profilo e classificazione presenti</b>
                    <span>La classificazione è stata confermata dal responsabile</span>
                  </div>
                </li>
                <li>
                  <CheckCircle2 />
                  <div>
                    <b>Connessione RENTRI disponibile</b>
                    <span>Ambiente demo · nessun invio reale</span>
                  </div>
                </li>
                <li className="validation-warning">
                  <CircleAlert />
                  <div>
                    <b>Verifica consigliata</b>
                    <span>L’autorizzazione del trasportatore scade tra 22 giorni</span>
                  </div>
                </li>
              </ul>
            </>
          )}
        </section>
        <div className="form-actions">
          <Button
            type="button"
            onClick={() => (step === 1 ? navigate('/app/firs') : setStep(step - 1))}
          >
            {step === 1 ? 'Annulla' : 'Indietro'}
          </Button>
          <span>Passaggio {step} di 3</span>
          {step < 3 ? (
            <Button type="button" variant="primary" onClick={() => void next()}>
              Continua <ArrowRight size={16} />
            </Button>
          ) : (
            <Button type="submit" variant="primary">
              <Save size={16} /> Salva bozza FIR
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

export function FirDetailPage() {
  const { firId } = useParams();
  const fir = firs.find((item) => item.id === firId) ?? firs[0]!;
  const isError = fir.statusKey === 'validation_failed';
  const steps = [
    ['Bozza', '12 lug, 15:44'],
    ['Numerato', fir.officialNumber === '—' ? 'In attesa' : '12 lug, 16:03'],
    ['Produttore', isError ? 'Bloccato' : 'Firmato 12 lug'],
    ['Trasporto', fir.status === 'In viaggio' ? 'In corso' : 'Completato'],
    [
      'Destinazione',
      fir.status === 'Copia ricevuta' || fir.status === 'Conservato' ? 'Firmato' : 'In attesa',
    ],
    [
      'Copia completa',
      fir.status === 'Copia ricevuta' || fir.status === 'Conservato' ? 'Ricevuta' : 'In attesa',
    ],
  ];
  return (
    <div className="page detail-page">
      <Breadcrumbs items={['Formulari FIR', fir.internalNumber]} />
      <PageHeader
        title={fir.internalNumber}
        description={
          fir.officialNumber === '—'
            ? 'Bozza senza numero ufficiale'
            : `Numero RENTRI ${fir.officialNumber}`
        }
        actions={
          <>
            <Button>
              <Download size={16} /> Scarica
            </Button>
            <Button>
              <MoreHorizontal size={16} /> Altre azioni
            </Button>
            {isError ? (
              <Button variant="primary">Correggi dati</Button>
            ) : (
              <Button variant="primary">
                <Send size={16} /> Aggiorna stato
              </Button>
            )}
          </>
        }
      />
      {isError && (
        <div className="error-banner">
          <XCircle />
          <div>
            <b>Il formulario non supera i controlli</b>
            <span>
              Aggiungi il numero di autorizzazione del destinatario prima di richiedere la
              numerazione.
            </span>
          </div>
          <Button>Apri il soggetto</Button>
        </div>
      )}
      <div className="fir-progress">
        {steps.map(([label, status], index) => (
          <div
            className={
              index === 0 || (!isError && index < 3)
                ? 'done'
                : status === 'In corso'
                  ? 'current'
                  : ''
            }
            key={label}
          >
            <span>{index === 0 || (!isError && index < 3) ? <Check /> : index + 1}</span>
            <p>
              {label}
              <small>{status}</small>
            </p>
          </div>
        ))}
      </div>
      <div className="detail-layout">
        <div>
          <section className="panel detail-section">
            <SectionHeader
              title="Rifiuto e quantità"
              action={<Button variant="ghost">Modifica</Button>}
            />
            <dl className="detail-grid">
              <div>
                <dt>Codice EER</dt>
                <dd>
                  <b>{fir.wasteCode}</b> <Badge tone="danger">Pericoloso</Badge>
                </dd>
              </div>
              <div>
                <dt>Descrizione</dt>
                <dd>{fir.waste}</dd>
              </div>
              <div>
                <dt>Quantità alla partenza</dt>
                <dd>
                  <b>
                    {fir.quantity} {fir.unit}
                  </b>
                </dd>
              </div>
              <div>
                <dt>Operazione</dt>
                <dd>R13 — Messa in riserva</dd>
              </div>
              <div>
                <dt>Stato fisico</dt>
                <dd>Liquido</dd>
              </div>
              <div>
                <dt>Imballaggio</dt>
                <dd>Fusti</dd>
              </div>
            </dl>
          </section>
          <section className="panel detail-section">
            <SectionHeader title="Soggetti e trasporto" />
            <div className="party-route">
              <div>
                <span>PR</span>
                <p>
                  <small>Produttore</small>
                  <b>Officina Aurora S.r.l.</b>
                  <em>Bologna (BO)</em>
                </p>
              </div>
              <i />
              <div>
                <span>TR</span>
                <p>
                  <small>Trasportatore</small>
                  <b>{fir.carrier}</b>
                  <em>Autorizzazione verificata</em>
                </p>
              </div>
              <i />
              <div>
                <span>DE</span>
                <p>
                  <small>Destinatario</small>
                  <b>{fir.destination}</b>
                  <em>Ravenna (RA)</em>
                </p>
              </div>
            </div>
          </section>
          <section className="panel detail-section">
            <SectionHeader title="Registro delle attività" />
            <ol className="event-log">
              <li>
                <CheckCircle2 />
                <div>
                  <b>Controlli automatici eseguiti</b>
                  <span>7 controlli superati, 1 segnalazione</span>
                  <small>12 lug 2026, 16:20 · Sistema</small>
                </div>
              </li>
              <li>
                <FilePlus2 />
                <div>
                  <b>Bozza FIR creata</b>
                  <span>Versione 1 salvata</span>
                  <small>12 lug 2026, 15:44 · Diego Amato</small>
                </div>
              </li>
            </ol>
          </section>
        </div>
        <aside>
          <section className="panel next-action">
            <span className={isError ? 'danger-icon' : 'info-icon'}>
              {isError ? <CircleAlert /> : <Truck />}
            </span>
            <p>PROSSIMA AZIONE</p>
            <h2>{isError ? 'Completa i dati mancanti' : 'Attendi il trasportatore'}</h2>
            <span>
              {isError
                ? 'Serve il numero di autorizzazione del destinatario.'
                : 'Il FIR è stato condiviso ed è pronto per la firma del trasportatore.'}
            </span>
            <Button variant="primary">
              {isError ? 'Correggi ora' : 'Controlla aggiornamenti'}
            </Button>
          </section>
          <section className="panel compact-details">
            <SectionHeader title="Dettagli" />
            <dl>
              <div>
                <dt>Creato da</dt>
                <dd>Diego Amato</dd>
              </div>
              <div>
                <dt>Unità locale</dt>
                <dd>Sede di Bologna</dd>
              </div>
              <div>
                <dt>Versione</dt>
                <dd>1</dd>
              </div>
              <div>
                <dt>Ambiente</dt>
                <dd>
                  <Badge tone="purple">Demo</Badge>
                </dd>
              </div>
              <div>
                <dt>Ultima modifica</dt>
                <dd>{fir.updatedAt}</dd>
              </div>
            </dl>
          </section>
        </aside>
      </div>
    </div>
  );
}

export function WasteProfilesPage() {
  return (
    <div className="page">
      <PageHeader
        title="Rifiuti configurati"
        description="Profili ricorrenti dell’officina. La classificazione resta sotto la responsabilità dell’azienda."
        actions={
          <Link to="/app/waste-profiles/new">
            <Button variant="primary">
              <Plus size={16} /> Nuovo profilo
            </Button>
          </Link>
        }
      />
      <div className="advisory">
        <CircleAlert />
        <div>
          <b>La piattaforma non certifica la classificazione EER</b>
          <span>Ogni profilo deve essere confermato dal responsabile o dal consulente.</span>
        </div>
      </div>
      <div className="list-panel">
        <FilterBar placeholder="Cerca codice EER o descrizione…" />
        <DataTable
          headers={[
            'Codice EER e rifiuto',
            'Pericolosità',
            'Giacenza',
            'Unità locale',
            'Classificazione',
            'Ultimo movimento',
            '',
          ]}
        >
          {wasteProfiles.map((item) => (
            <tr key={item.id}>
              <td>
                <Link to={`/app/waste-profiles/${item.id}`} className="strong-link">
                  {item.code}
                </Link>
                <span>{item.name}</span>
              </td>
              <td>
                {item.hazardous ? (
                  <Badge tone="danger">Pericoloso</Badge>
                ) : (
                  <Badge>Non pericoloso</Badge>
                )}
              </td>
              <td className="numeric">
                <b>{item.stock}</b> {item.unit}
              </td>
              <td>Sede di Bologna</td>
              <td>
                <Badge tone={toneFor(item.status)} dot>
                  {item.status}
                </Badge>
              </td>
              <td>{item.lastMovement}</td>
              <td>
                <MoreHorizontal size={16} />
              </td>
            </tr>
          ))}
        </DataTable>
      </div>
    </div>
  );
}
export function PartiesPage() {
  return (
    <div className="page">
      <PageHeader
        title="Soggetti"
        description="Trasportatori, destinatari e altri soggetti esterni."
        actions={
          <>
            <Button>
              <Upload size={16} /> Importa
            </Button>
            <Button variant="primary">
              <Plus size={16} /> Nuovo soggetto
            </Button>
          </>
        }
      />
      <div className="list-panel">
        <FilterBar placeholder="Cerca ragione sociale, P. IVA o città…" />
        <DataTable headers={['Soggetto', 'Ruolo', 'Partita IVA', 'Sede', 'Autorizzazione', '']}>
          {parties.map((item) => (
            <tr key={item.id}>
              <td>
                <Link to={`/app/parties/${item.id}`} className="strong-link">
                  {item.name}
                </Link>
              </td>
              <td>
                <Badge>{item.roles}</Badge>
              </td>
              <td>{item.vat}</td>
              <td>{item.city}</td>
              <td>
                <Badge tone={item.tone} dot>
                  {item.auth}
                </Badge>
              </td>
              <td>
                <MoreHorizontal size={16} />
              </td>
            </tr>
          ))}
        </DataTable>
      </div>
    </div>
  );
}
export function DocumentsPage() {
  return (
    <div className="page">
      <PageHeader
        title="Documenti"
        description="Documenti, copie complete e ricevute collegati alle attività."
        actions={
          <Button variant="primary">
            <Upload size={16} /> Carica documento
          </Button>
        }
      />
      <div className="storage-card">
        <div>
          <span>Spazio utilizzato</span>
          <b>
            1,8 GB <small>di 10 GB</small>
          </b>
        </div>
        <div className="progress">
          <i style={{ width: '18%' }} />
        </div>
        <p>I documenti legali protetti non possono essere sostituiti o eliminati.</p>
      </div>
      <div className="list-panel">
        <FilterBar placeholder="Cerca documento o collegamento…" />
        <DataTable
          headers={[
            'Nome documento',
            'Tipo',
            'Collegato a',
            'Caricato il',
            'Dimensione',
            'Stato',
            '',
          ]}
        >
          {documents.map((item) => (
            <tr key={item.name}>
              <td>
                <span className="document-name">
                  <FileCheck2 />
                  {item.name}
                </span>
              </td>
              <td>{item.type}</td>
              <td>
                <Link to="#">{item.entity}</Link>
              </td>
              <td>{item.date}</td>
              <td>{item.size}</td>
              <td>
                <Badge tone={toneFor(item.status)}>{item.status}</Badge>
              </td>
              <td>
                <Download size={16} />
              </td>
            </tr>
          ))}
        </DataTable>
      </div>
    </div>
  );
}
export function AlertsPage() {
  return (
    <div className="page">
      <PageHeader
        title="Da fare"
        description="Una coda unica per errori, scadenze e attività che richiedono il tuo intervento."
        actions={
          <Button>
            <SlidersHorizontal size={16} /> Preferenze
          </Button>
        }
      />
      <div className="queue-layout">
        <nav className="queue-filters">
          <button className="active">
            Tutte <Badge>4</Badge>
          </button>
          <button>
            Urgenti <Badge tone="danger">1</Badge>
          </button>
          <button>
            Entro 7 giorni <Badge tone="warning">2</Badge>
          </button>
          <button>Completate</button>
        </nav>
        <section className="queue-list">
          {alerts.map((alert) => (
            <Link to={alert.href} key={alert.id}>
              <span className={`queue-marker severity-${alert.severity}`} />
              <div>
                <div>
                  <Badge tone={alert.severity}>{alert.due}</Badge>
                  <small>Officina Aurora</small>
                </div>
                <h2>{alert.title}</h2>
                <p>{alert.detail}</p>
                <em>
                  Apri attività <ArrowRight size={14} />
                </em>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
}
