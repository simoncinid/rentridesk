import { ArrowRight, Check, ChevronRight, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SeoHead } from '../seo/SeoHead.js';
import {
  buildStructuredData,
  getPageName,
  officialSources,
  type PublicPage,
} from '../seo/publicPages.js';
import '../styles/landing.css';

const whatsappUrl =
  'https://wa.me/393391797616?text=Ciao%20Diego%2C%20vorrei%20vedere%20una%20demo%20di%20rentridesk.';

function PublicLogo() {
  return (
    <span className="landing-logo">
      <img src="/logo.png" alt="" width="36" height="36" />
      <span>
        <b>rentridesk</b>
        <small>Software RENTRI per autoriparatori</small>
      </span>
    </span>
  );
}

function PublicHeader() {
  return (
    <header className="landing-nav public-nav">
      <div className="landing-container landing-nav-inner">
        <Link className="landing-brand" to="/" aria-label="rentridesk, home">
          <PublicLogo />
        </Link>
        <nav className="public-nav-links" aria-label="Navigazione principale">
          <Link to="/software-rentri-officine">Software officine</Link>
          <Link to="/fir-digitale-officina">FIR digitale</Link>
          <Link to="/obbligo-rentri-officine">Obbligo 2026</Link>
          <Link to="/prezzi">Prezzi</Link>
          <Link to="/faq-rentri-officine">FAQ</Link>
        </nav>
        <Link className="landing-button landing-button-primary landing-nav-cta" to="/#contatto">
          Richiedi demo
        </Link>
      </div>
    </header>
  );
}

function PublicFooter() {
  return (
    <footer className="landing-footer public-footer">
      <div className="landing-container">
        <div className="landing-footer-main">
          <Link className="landing-brand" to="/">
            <PublicLogo />
          </Link>
        </div>
        <nav className="public-footer-links" aria-label="Pagine RENTRI">
          <Link to="/software-rentri-officine">Software RENTRI officine</Link>
          <Link to="/fir-digitale-officina">FIR digitale officina</Link>
          <Link to="/rentri-carrozzerie">RENTRI carrozzerie</Link>
          <Link to="/software-rentri-consulenti">Software consulenti</Link>
          <Link to="/obbligo-rentri-officine">Obbligo RENTRI officine</Link>
          <Link to="/prezzi">Prezzi</Link>
          <Link to="/faq-rentri-officine">FAQ RENTRI officine</Link>
        </nav>
        <div className="landing-footer-bottom">
          <div>
            <b>Diego Simoncini</b>
            <span>P. IVA 02524780505</span>
            <span>C.F. SMNDGI04L29G843I</span>
          </div>
          <nav aria-label="Informazioni legali">
            <Link to="/privacy">Privacy policy</Link>
            <Link to="/cookie">Cookie policy</Link>
            <Link to="/termini">Termini e condizioni</Link>
            <Link to="/login">Area riservata</Link>
          </nav>
          <small>© 2026 rentridesk · Prodotto in fase pilota</small>
        </div>
      </div>
    </footer>
  );
}

export function PublicSeoPage({ page }: { page: PublicPage }) {
  const structuredData = buildStructuredData(page);

  return (
    <div className="landing public-page">
      <SeoHead page={page} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <PublicHeader />
      <main>
        <section className="public-hero">
          <div className="landing-container">
            <nav className="public-breadcrumb" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <ChevronRight aria-hidden="true" />
              <span aria-current="page">{page.breadcrumb}</span>
            </nav>
            <span className="landing-eyebrow">{page.eyebrow}</span>
            <h1>{page.h1}</h1>
            <p>{page.intro}</p>
            <div className="hero-actions">
              <Link className="landing-button landing-button-primary" to="/#contatto">
                Richiedi una demo <ArrowRight />
              </Link>
              <a
                className="landing-button landing-button-secondary"
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle /> Parla con Diego
              </a>
            </div>
          </div>
        </section>

        {page.sections.map((section, sectionIndex) => (
          <section
            className={`landing-section public-content-section ${sectionIndex % 2 ? 'public-section-muted' : ''}`}
            key={section.title}
          >
            <div className="landing-container public-content-layout">
              <div className="public-content-heading">
                {section.kicker && <span className="landing-kicker">{section.kicker}</span>}
                <h2>{section.title}</h2>
              </div>
              <div className="public-content-body">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.items && (
                  <div className="public-item-grid">
                    {section.items.map((item) => (
                      <article key={item.title}>
                        <h3>{item.title}</h3>
                        <p>{item.text}</p>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        ))}

        {page.path === '/software-rentri-officine' && (
          <section className="landing-section comparison-section public-comparison">
            <div className="landing-container">
              <div className="landing-section-heading">
                <span className="landing-kicker">Confronto con i servizi di supporto</span>
                <h2>Il portale RENTRI adempie al sistema pubblico. rentridesk organizza il lavoro prima e dopo.</h2>
                <p>
                  I servizi ufficiali sono gratuiti e sufficienti per operare. Un software esterno
                  non è obbligatorio: è utile quando vuoi collegare dati, persone e controlli in un
                  processo continuativo.
                </p>
              </div>
              <div className="comparison-grid">
                <article>
                  <span>Servizi di supporto RENTRI</span>
                  <h3>Funzioni ufficiali per l’adempimento</h3>
                  <ul>
                    <li>Iscrizione e gestione delle unità locali</li>
                    <li>Registro e FIR tramite servizi web ufficiali</li>
                    <li>Vidimazione, firma e trasmissione dei dati</li>
                    <li>Uso diretto senza acquistare un gestionale</li>
                  </ul>
                </article>
                <article className="comparison-featured">
                  <span>rentridesk</span>
                  <h3>Flusso operativo collegato a RENTRI</h3>
                  <ul>
                    <li><Check /> Anagrafiche e profili riutilizzabili</li>
                    <li><Check /> Giacenze, registro e FIR collegati</li>
                    <li><Check /> Attività, scadenze e documenti in una coda</li>
                    <li><Check /> Interoperabilità con esiti sempre visibili</li>
                  </ul>
                </article>
              </div>
            </div>
          </section>
        )}

        <section className="landing-section faq-section" id="domande">
          <div className="landing-container faq-layout">
            <div>
              <span className="landing-kicker">Domande frequenti</span>
              <h2>Risposte senza scorciatoie.</h2>
              <p>Le domande più vicine all’intento di questa pagina.</p>
            </div>
            <div className="faq-list">
              {page.faqs.map((faq) => (
                <details key={faq.question}>
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

        <section className="landing-section public-related">
          <div className="landing-container">
            <span className="landing-kicker">Continua l’approfondimento</span>
            <div className="public-related-grid">
              {page.related.map((path) => (
                <Link to={path} key={path}>
                  <span>{getPageName(path)}</span>
                  <ArrowRight />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="landing-section public-final-cta">
          <div className="landing-container">
            <div>
              <span className="landing-kicker">Demo e attivazione</span>
              <h2>Prova il flusso su un caso reale della tua attività.</h2>
              <p>
                In 30 minuti ricostruiamo un ritiro tipico e verifichiamo se rentridesk può
                ridurre passaggi e controlli manuali. Nessuna carta richiesta.
              </p>
            </div>
            <Link className="landing-button landing-button-primary" to="/#contatto">
              Prenota la demo <ArrowRight />
            </Link>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}

