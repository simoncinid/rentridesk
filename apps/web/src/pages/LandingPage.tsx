import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import {
  ArrowRight,
  BellRing,
  BookOpenCheck,
  Check,
  CheckCircle2,
  CircleAlert,
  Clock3,
  FileCheck2,
  Menu,
  MessageCircle,
  MousePointer2,
  PackageCheck,
  Recycle,
  Sparkles,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { SeoHead } from '../seo/SeoHead.js';
import { buildStructuredData, officialSources, searchedFaqs } from '../seo/publicPages.js';
import '../styles/landing.css';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

const whatsappUrl =
  'https://wa.me/393391797616?text=Ciao%20Diego%2C%20vorrei%20saperne%20di%20pi%C3%B9%20su%20rentridesk.';

const productBenefits = [
  {
    icon: BookOpenCheck,
    title: 'Registro guidato',
    text: 'Carichi e scarichi seguono un percorso chiaro. Le informazioni ricorrenti sono già pronte e i movimenti restano collegati.',
    result: 'Meno ricopiature e meno passaggi dimenticati.',
  },
  {
    icon: PackageCheck,
    title: 'Giacenze leggibili',
    text: 'Vedi quanto rifiuto hai disponibile per codice EER e ritrovi subito l’ultimo movimento che ha modificato la quantità.',
    result: 'Decidi quando organizzare il ritiro con dati aggiornati.',
  },
  {
    icon: FileCheck2,
    title: 'FIR passo per passo',
    text: 'Produttore, rifiuto, trasportatore e destinatario sono raccolti in una procedura unica con controlli prima dell’invio.',
    result: 'Meno dati mancanti quando il mezzo è già in officina.',
  },
  {
    icon: BellRing,
    title: 'Una coda “Da fare”',
    text: 'Anomalie, autorizzazioni in scadenza, copie da recuperare e trasmissioni da completare arrivano in un’unica lista.',
    result: 'Apri la dashboard e sai subito da dove iniziare.',
  },
];

const workflow = [
  {
    number: '01',
    title: 'Configuri una volta i dati ricorrenti',
    text: 'Sede, profili rifiuto, trasportatori, destinatari e autorizzazioni diventano una base ordinata da riutilizzare.',
  },
  {
    number: '02',
    title: 'Registri ciò che succede',
    text: 'Carico, scarico e formulario condividono le stesse informazioni: non riparti ogni volta da un documento vuoto.',
  },
  {
    number: '03',
    title: 'rentridesk controlla il flusso',
    text: 'Evidenzia campi mancanti, incongruenze operative, attività in ritardo e documenti da recuperare.',
  },
  {
    number: '04',
    title: 'Tu confermi e mantieni il controllo',
    text: 'Il software non decide la classificazione del rifiuto e non sostituisce il consulente: rende visibile ciò che stai facendo.',
  },
];

const faqs = searchedFaqs;

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="landing-logo">
      <img src="/logo.png" alt="" width="36" height="36" />
      {!compact && (
        <span>
          <b>rentridesk</b>
          <small>Gestione rifiuti per autoriparatori</small>
        </span>
      )}
    </span>
  );
}

function DashboardShowcase() {
  const [interactions, setInteractions] = useState(0);
  const isLocked = interactions >= 3;

  function preparePreview(iframe: HTMLIFrameElement) {
    try {
      const document = iframe.contentDocument;
      if (!document) return;

      const style = document.createElement('style');
      style.dataset.landingPreview = 'true';
      style.textContent = `
        html, body, #root {
          max-width: 100% !important;
          overflow-x: hidden !important;
        }
        .app-shell, .main-column, .main-content, .page {
          min-width: 0 !important;
          max-width: 100% !important;
          overflow-x: hidden !important;
        }
        * { scrollbar-color: #c7cbd0 transparent; }
      `;
      document.head.querySelector('[data-landing-preview]')?.remove();
      document.head.appendChild(style);
      document.addEventListener(
        'click',
        () => setInteractions((current) => Math.min(current + 1, 3)),
        { capture: true },
      );
    } catch {
      // L'anteprima resta visibile anche se il browser blocca l'accesso al documento incorporato.
    }
  }

  return (
    <div className={`dashboard-showcase${isLocked ? ' is-locked' : ''}`} data-reveal>
      <div className="showcase-browserbar" aria-hidden="true">
        <span />
        <span />
        <span />
        <p>app.rentridesk.it/panoramica</p>
      </div>
      <div className="showcase-viewport">
        <iframe
          src="/app/dashboard"
          title="Anteprima fedele della dashboard rentridesk"
          loading="lazy"
          onLoad={(event) => preparePreview(event.currentTarget)}
        />
        {interactions === 0 && (
          <span className="showcase-interaction-cue" aria-hidden="true">
            <MousePointer2 />
          </span>
        )}
        {isLocked && (
          <div className="showcase-gate">
            <Sparkles aria-hidden="true" />
            <h3>Continua con il tuo caso reale.</h3>
            <p>In 30 minuti ricostruiamo insieme un ritiro della tua officina.</p>
            <a className="landing-button landing-button-primary" href="#contatto">
              Richiedi la demo <ArrowRight />
            </a>
          </div>
        )}
      </div>
      <div className="showcase-caption">
        <span>
          <Sparkles /> Interfaccia reale del prodotto
        </span>
        <p>Dati dimostrativi. Nessun invio a RENTRI.</p>
      </div>
    </div>
  );
}

function LeadForm() {
  const [status, setStatus] = useState<FormStatus>('idle');

  async function submitLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('submitting');
    const form = event.currentTarget;
    const data = new FormData(form);
    const query = new URLSearchParams(window.location.search);
    const endpoint =
      (import.meta.env.VITE_LEAD_ENDPOINT as string | undefined)?.trim() ||
      (import.meta.env.DEV
        ? `${(import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:3001'}/v1/public/leads`
        : '/api/leads');

    const payload = {
      name: data.get('name'),
      email: data.get('email'),
      phone: data.get('phone'),
      businessType: data.get('businessType'),
      currentProcess: data.get('currentProcess'),
      message: data.get('message'),
      website: data.get('website'),
      source: 'landing-page',
      privacyAccepted: data.get('privacyAccepted') === 'accepted',
      privacyVersion: '2026-07-14',
      utmSource: query.get('utm_source') ?? undefined,
      utmMedium: query.get('utm_medium') ?? undefined,
      utmCampaign: query.get('utm_campaign') ?? undefined,
    };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Invio non riuscito');
      form.reset();
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="lead-success" role="status">
        <CheckCircle2 />
        <span>Richiesta ricevuta</span>
        <h3>Grazie, ci sentiamo presto.</h3>
        <p>Diego ti contatterà per capire come gestisci oggi registri e formulari.</p>
        <a href={whatsappUrl} target="_blank" rel="noreferrer">
          Preferisci scrivere subito su WhatsApp? <ArrowRight />
        </a>
      </div>
    );
  }

  return (
    <form className="lead-form" onSubmit={submitLead}>
      <div className="lead-form-heading">
        <span>Richiedi una demo</span>
        <h2>Partiamo da un ritiro reale.</h2>
        <p>Compila il modulo: bastano circa 60 secondi.</p>
      </div>
      <div className="lead-fields">
        <label>
          <span>Nome e cognome</span>
          <input name="name" autoComplete="name" required placeholder="Mario Rossi" />
        </label>
        <label>
          <span>E-mail di lavoro</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="mario@officina.it"
          />
        </label>
        <label>
          <span>Tipo di attività</span>
          <select name="businessType" required defaultValue="">
            <option value="" disabled>
              Seleziona la tua attività
            </option>
            <option>Officina meccanica</option>
            <option>Carrozzeria</option>
            <option>Elettrauto</option>
            <option>Gommista</option>
            <option>Centro revisioni</option>
            <option>Altra attività di autoriparazione</option>
          </select>
        </label>
        <label>
          <span>Come gestisci oggi registri e FIR?</span>
          <select name="currentProcess" required defaultValue="">
            <option value="" disabled>
              Seleziona una risposta
            </option>
            <option>Fogli di calcolo o documenti</option>
            <option>Portale o strumenti gratuiti</option>
            <option>Gestionale a pagamento</option>
            <option>Se ne occupa il consulente</option>
            <option>Più strumenti insieme</option>
          </select>
        </label>
        <label>
          <span>Telefono o WhatsApp <small>(facoltativo)</small></span>
          <input name="phone" type="tel" autoComplete="tel" placeholder="+39 333 1234567" />
        </label>
        <label>
          <span>Il problema più scomodo <small>(facoltativo)</small></span>
          <textarea
            name="message"
            rows={3}
            placeholder="Es. recuperare le copie complete, controllare le scadenze…"
          />
        </label>
      </div>
      <label className="lead-honeypot" aria-hidden="true">
        Sito web
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <label className="lead-consent">
        <input name="privacyAccepted" type="checkbox" value="accepted" required />
        <span>
          Ho letto l’<Link to="/privacy">informativa privacy</Link> e acconsento a essere
          ricontattato in merito a rentridesk.
        </span>
      </label>
      <button className="landing-button landing-button-primary" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Invio in corso…' : 'Richiedi la demo gratuita'}
        {status !== 'submitting' && <ArrowRight />}
      </button>
      {status === 'error' && (
        <div className="lead-message lead-message-error" role="alert">
          <CircleAlert />
          <span>
            Il modulo non è raggiungibile. Puoi riprovare o{' '}
            <a href={whatsappUrl} target="_blank" rel="noreferrer">
              scrivere su WhatsApp
            </a>
            .
          </span>
        </div>
      )}
      <small className="lead-reassurance">
        Nessun impegno, nessuna carta richiesta. I dati servono solo a ricontattarti.
      </small>
    </form>
  );
}

function CookieNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setVisible(localStorage.getItem('fo-cookie-notice') !== 'seen');
    }, 0);
    return () => window.clearTimeout(timeout);
  }, []);

  if (!visible) return null;
  return (
    <aside className="cookie-notice" aria-label="Informativa cookie">
      <p>
        Questo sito usa solo tecnologie tecniche necessarie al funzionamento. Nessun cookie
        pubblicitario o di profilazione. <Link to="/cookie">Leggi la cookie policy</Link>.
      </p>
      <button
        type="button"
        onClick={() => {
          localStorage.setItem('fo-cookie-notice', 'seen');
          setVisible(false);
        }}
      >
        Ho capito
      </button>
    </aside>
  );
}

export function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const structuredData = buildStructuredData({
    path: '/',
    breadcrumb: 'rentridesk',
    title: 'rentridesk — Software RENTRI semplice per officine',
    description:
      'Software RENTRI per officine, carrozzerie, elettrauto e gommisti: registro rifiuti, FIR digitale e gestione quotidiana in un unico flusso.',
    eyebrow: '',
    h1: '',
    intro: '',
    highlights: [],
    sections: [],
    faqs,
    related: [],
  });

  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>('[data-reveal]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="landing">
      <SeoHead />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <header className="landing-nav">
        <div className="landing-container landing-nav-inner">
          <a className="landing-brand" href="#inizio" aria-label="rentridesk, torna all’inizio">
            <Logo />
          </a>
          <nav className={menuOpen ? 'landing-nav-links is-open' : 'landing-nav-links'}>
            <a href="#prodotto" onClick={() => setMenuOpen(false)}>
              Cosa fa
            </a>
            <a href="#come-funziona" onClick={() => setMenuOpen(false)}>
              Come funziona
            </a>
            <a href="#confronto" onClick={() => setMenuOpen(false)}>
              Confronto
            </a>
            <Link to="/prezzi" onClick={() => setMenuOpen(false)}>
              Prezzi
            </Link>
            <a href="#domande" onClick={() => setMenuOpen(false)}>
              FAQ
            </a>
            <Link to="/login" onClick={() => setMenuOpen(false)}>
              Accedi
            </Link>
            <a
              className="landing-mobile-whatsapp"
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle /> WhatsApp
            </a>
          </nav>
          <a className="landing-button landing-button-primary landing-nav-cta" href="#contatto">
            Richiedi demo
          </a>
          <button
            className="landing-menu-button"
            type="button"
            aria-label={menuOpen ? 'Chiudi menu' : 'Apri menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <main id="inizio">
        <section className="landing-hero">
          <div className="landing-container">
            <div className="hero-copy" data-reveal>
              <span className="landing-eyebrow">
                <Recycle /> Software RENTRI per officine e autoriparatori
              </span>
              <h1>Registro rifiuti e FIR digitale per officine, collegati a RENTRI.</h1>
              <p className="hero-subtitle hero-subtitle-mobile">
                Registro, giacenze e FIR in un solo flusso. Vedi subito cosa manca e cosa fare
                dopo.
              </p>
              <p className="hero-subtitle hero-subtitle-desktop">
                Se produci rifiuti pericolosi, l’iscrizione al RENTRI riguarda in generale anche
                la tua impresa; per alcuni rifiuti non pericolosi conta la soglia dei dipendenti.
                rentridesk collega registro, giacenze, FIR digitali e documenti in un unico
                flusso operativo, con interoperabilità verso RENTRI e controlli prima dell’invio.
              </p>
              <div className="hero-actions">
                <a className="landing-button landing-button-primary" href="#contatto">
                  Richiedi una demo <ArrowRight />
                </a>
                <a
                  className="landing-button landing-button-whatsapp"
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle /> Scrivi su WhatsApp
                </a>
              </div>
            </div>
            <DashboardShowcase />
          </div>
        </section>

        <section className="landing-section product-section" id="prodotto">
          <div className="landing-container">
            <div className="landing-section-heading" data-reveal>
              <span className="landing-kicker">Cosa fa, concretamente</span>
              <h2>Un software RENTRI semplice per la gestione rifiuti in officina.</h2>
              <p>
                rentridesk non gestisce fatture, ricambi o appuntamenti. Organizza il processo
                ambientale che oggi vive tra portale RENTRI, file, e-mail, raccoglitori e memoria
                delle persone: registro, giacenze, formulari, autorizzazioni e copie complete.
              </p>
            </div>
            <div className="benefit-grid">
              {productBenefits.map(({ icon: Icon, title, text, result }) => (
                <article key={title} data-reveal>
                  <span className="benefit-icon">
                    <Icon />
                  </span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                  <strong>
                    <CheckCircle2 /> {result}
                  </strong>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="landing-section workflow-section" id="come-funziona">
          <div className="landing-container workflow-layout">
            <div className="workflow-copy" data-reveal>
              <span className="landing-kicker">Come lo fa</span>
              <h2>Dal movimento alla copia completa, con il collegamento RENTRI visibile.</h2>
              <p>
                Invece di chiederti di conoscere il software, rentridesk segue il lavoro reale:
                prepara i dati, registra l’operazione, controlla gli stati e raccoglie le evidenze.
                Le API ufficiali scambiano i dati previsti con RENTRI; firma, classificazione e
                conferme restano azioni esplicite dell’operatore.
              </p>
              <a className="landing-text-link" href="#contatto">
                Raccontaci il tuo processo <ArrowRight />
              </a>
            </div>
            <ol className="workflow-list">
              {workflow.map((step) => (
                <li key={step.number} data-reveal>
                  <span>{step.number}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="landing-section real-product-section">
          <div className="landing-container">
            <div className="landing-section-heading split-heading" data-reveal>
              <div>
                <span className="landing-kicker">Il prodotto, non un’illustrazione</span>
                <h2>La dashboard che vedi è quella vera.</h2>
              </div>
            </div>
            <DashboardShowcase />
          </div>
        </section>

        <section className="landing-section comparison-section" id="confronto">
          <div className="landing-container">
            <div className="landing-section-heading" data-reveal>
              <span className="landing-kicker">rentridesk o portale RENTRI?</span>
              <h2>Il portale ufficiale gestisce l’adempimento. Il software organizza il lavoro quotidiano.</h2>
              <p>
                I servizi di supporto RENTRI sono gratuiti e possono essere usati senza acquistare
                un gestionale. rentridesk non li sostituisce: collega ciò che accade prima e dopo
                l’adempimento per ridurre ricopiature, errori e passaggi manuali.
              </p>
            </div>
            <div className="comparison-grid" data-reveal>
              <article>
                <span>Servizi di supporto RENTRI</span>
                <h3>Le funzioni ufficiali per operare</h3>
                <ul>
                  <li>Iscrizione e unità locali</li>
                  <li>Registro digitale e formulari</li>
                  <li>Vidimazione, firma e trasmissione</li>
                  <li>Servizi gratuiti accessibili direttamente</li>
                  <li>Adempimento verso il sistema pubblico</li>
                </ul>
              </article>
              <article className="comparison-featured">
                <span>rentridesk</span>
                <h3>Ogni attività aggiorna il processo</h3>
                <ul>
                  <li>
                    <Check /> Anagrafiche e profili rifiuto riutilizzabili
                  </li>
                  <li>
                    <Check /> Registro, giacenze e FIR collegati
                  </li>
                  <li>
                    <Check /> Coda operativa con scadenze e copie mancanti
                  </li>
                  <li>
                    <Check /> Documenti e autorizzazioni nel loro contesto
                  </li>
                  <li>
                    <Check /> Esiti delle operazioni RENTRI sempre visibili
                  </li>
                </ul>
              </article>
            </div>
          </div>
        </section>

        <section className="compact-paths-section" aria-label="Approfondimenti">
          <div className="landing-container">
            <div className="compact-paths-heading" data-reveal>
              <span className="landing-kicker">Guide e approfondimenti</span>
              <h2>Vai dritto all’informazione che ti serve.</h2>
              <p>
                Se ti serve anche stimare quantità e fabbisogni di cantiere, puoi consultare i{' '}
                <a href="https://www.buildcalclab.com/">construction material calculators</a>.
              </p>
            </div>
            <div className="compact-paths">
              <Link to="/obbligo-rentri-officine" data-reveal>
                <BellRing aria-hidden="true" />
                <span>
                  <small>SCADENZA VERIFICATA</small>
                  <strong>FIR digitale dal 16 settembre 2026</strong>
                </span>
                <ArrowRight aria-hidden="true" />
              </Link>
              <Link to="/prezzi" data-reveal>
                <Sparkles aria-hidden="true" />
                <span>
                  <small>PREZZI</small>
                  <strong>Demo gratuita e fase pilota</strong>
                </span>
                <ArrowRight aria-hidden="true" />
              </Link>
              <Link to="/software-rentri-consulenti" data-reveal>
                <MessageCircle aria-hidden="true" />
                <span>
                  <small>PARTNER</small>
                  <strong>Portale per consulenti ambientali</strong>
                </span>
                <ArrowRight aria-hidden="true" />
              </Link>
              <Link to="/software-rentri-officine" data-reveal>
                <Clock3 aria-hidden="true" />
                <span>
                  <small>DEMO OPERATIVA</small>
                  <strong>Un ritiro reale in circa 30 minuti</strong>
                </span>
                <ArrowRight aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        <section className="landing-section contact-section" id="contatto">
          <div className="landing-container contact-layout">
            <div className="contact-copy" data-reveal>
              <span className="landing-kicker">Demo e attivazione</span>
              <h2>Vediamo se rentridesk riduce davvero i tuoi passaggi.</h2>
              <p>
                Lascia i riferimenti e descrivi in breve come lavori oggi. Non riceverai una
                sequenza automatica di e-mail: ti contatterà direttamente Diego.
              </p>
              <div className="contact-person">
                <img src="/logo.png" alt="" />
                <div className="contact-person-details">
                  <div>
                    <b>Diego Simoncini</b>
                    <a href={whatsappUrl} target="_blank" rel="noreferrer">
                      <MessageCircle /> +39 339 179 7616
                    </a>
                  </div>
                  <span>Ideatore e sviluppatore di rentridesk</span>
                </div>
              </div>
            </div>
            <LeadForm />
          </div>
        </section>

        <section className="landing-section faq-section" id="domande">
          <div className="landing-container faq-layout">
            <div data-reveal>
              <span className="landing-kicker">Domande frequenti</span>
              <h2>Prima di sentirci.</h2>
              <p>Obbligo, FIR digitale, portale, firma, conservazione e costi.</p>
            </div>
            <div className="faq-list">
              {faqs.map((faq) => (
                <details key={faq.question} data-reveal>
                  <summary>
                    {faq.question}
                    <span>+</span>
                  </summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="landing-section public-sources home-sources">
          <div className="landing-container">
            <span className="landing-kicker">Fonti ufficiali</span>
            <h2>Informazioni normative verificate il 14 luglio 2026.</h2>
            <p>
              Le regole e la situazione dell’impresa prevalgono su questa sintesi. rentridesk
              non assegna codici EER e non sostituisce la consulenza ambientale.
            </p>
            <div className="source-links">
              <a href={officialSources.requiredSubjects}>Chi deve iscriversi al RENTRI</a>
              <a href={officialSources.septemberDeadline}>Scadenza FIR digitale</a>
              <a href={officialSources.digitalFir}>Gestione operativa xFIR</a>
              <a href={officialSources.signature}>Firma del FIR digitale</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="landing-container">
          <div className="landing-footer-main">
            <a className="landing-brand" href="#inizio">
              <Logo />
            </a>
          </div>
          <div className="landing-footer-bottom">
            <div>
              <b>Diego Simoncini</b>
              <span>P. IVA 02524780505</span>
              <span>C.F. SMNDGI04L29G843I</span>
              <a href="mailto:simoncinidiego10@gmail.com">simoncinidiego10@gmail.com</a>
            </div>
            <nav aria-label="Informazioni legali">
              <Link to="/software-rentri-officine">Software RENTRI officine</Link>
              <Link to="/fir-digitale-officina">FIR digitale</Link>
              <Link to="/rentri-carrozzerie">Carrozzerie</Link>
              <Link to="/faq-rentri-officine">FAQ RENTRI</Link>
              <Link to="/privacy">Privacy policy</Link>
              <Link to="/cookie">Cookie policy</Link>
              <Link to="/termini">Termini e condizioni</Link>
              <Link to="/login">Area riservata</Link>
            </nav>
            <small>© 2026 rentridesk · Prodotto in fase di sviluppo</small>
          </div>
        </div>
      </footer>

      <a
        className="whatsapp-float"
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Scrivi a rentridesk su WhatsApp"
      >
        <MessageCircle />
        <span>Scrivici</span>
      </a>
      <CookieNotice />
    </div>
  );
}
