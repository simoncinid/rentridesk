import { useEffect } from 'react';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../styles/legal.css';

const controller = {
  name: 'Diego Simoncini',
  vat: '02524780505',
  taxCode: 'SMNDGI04L29G843I',
  email: 'simoncinidiego10@gmail.com',
  phone: '+39 339 179 7616',
  whatsapp: 'https://wa.me/393391797616',
};

function LegalLayout({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    document.title = `${title} — rentridesk`;
  }, [title]);

  return (
    <div className="legal-page">
      <header>
        <Link to="/" className="legal-brand">
          <img src="/logo.png" alt="" width="36" height="36" />
          <span>
            <b>rentridesk</b>
            <small>Informazioni legali</small>
          </span>
        </Link>
        <Link to="/">
          <ArrowLeft /> Torna al sito
        </Link>
      </header>
      <main>
        <div className="legal-intro">
          <span>Aggiornamento: 14 luglio 2026</span>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        <article>{children}</article>
      </main>
      <footer>
        <p>
          <b>{controller.name}</b> · P. IVA {controller.vat} · C.F. {controller.taxCode}
        </p>
        <a href={`mailto:${controller.email}`}>{controller.email}</a>
        <a href={controller.whatsapp} target="_blank" rel="noreferrer">
          <MessageCircle /> {controller.phone}
        </a>
        <nav>
          <Link to="/privacy">Privacy</Link>
          <Link to="/cookie">Cookie</Link>
          <Link to="/termini">Termini</Link>
        </nav>
      </footer>
    </div>
  );
}

export function PrivacyPage() {
  return (
    <LegalLayout
      title="Informativa privacy"
      description="Informazioni sul trattamento dei dati personali raccolti tramite il sito pubblico di rentridesk, ai sensi degli articoli 13 e 14 del Regolamento (UE) 2016/679."
    >
      <section>
        <h2>1. Titolare del trattamento</h2>
        <p>
          Il titolare del trattamento è <strong>{controller.name}</strong>, P. IVA{' '}
          {controller.vat}, codice fiscale {controller.taxCode}. Puoi contattare il titolare
          via e-mail all’indirizzo{' '}
          <a href={`mailto:${controller.email}`}>{controller.email}</a> oppure telefonicamente o
          tramite WhatsApp al <a href={controller.whatsapp}>{controller.phone}</a>.
        </p>
      </section>

      <section>
        <h2>2. Dati trattati</h2>
        <p>Attraverso il modulo di contatto possono essere raccolti:</p>
        <ul>
          <li>nome e cognome;</li>
          <li>indirizzo e-mail professionale;</li>
          <li>numero di telefono o WhatsApp, se fornito;</li>
          <li>tipo di attività e modalità attuale di gestione di registri e FIR;</li>
          <li>eventuali informazioni inserite liberamente nel messaggio;</li>
          <li>
            informazioni tecniche essenziali generate dalla richiesta, come data, ora e log di
            sicurezza del server.
          </li>
        </ul>
        <p>
          Non inserire nel modulo categorie particolari di dati personali, credenziali RENTRI,
          dati di terzi, documenti o informazioni non necessarie alla richiesta.
        </p>
      </section>

      <section>
        <h2>3. Finalità e base giuridica</h2>
        <dl>
          <div>
            <dt>Rispondere alla richiesta e valutare l’accesso alla fase pilota</dt>
            <dd>
              Il trattamento si basa sul consenso espresso tramite il modulo (art. 6, par. 1,
              lett. a GDPR) e, quando richiesto dall’interessato, sull’esecuzione di misure
              precontrattuali (art. 6, par. 1, lett. b GDPR).
            </dd>
          </div>
          <div>
            <dt>Proteggere il sito da abusi e garantire la sicurezza</dt>
            <dd>
              Il trattamento dei log tecnici si basa sul legittimo interesse del titolare alla
              sicurezza dei sistemi (art. 6, par. 1, lett. f GDPR).
            </dd>
          </div>
          <div>
            <dt>Adempiere a obblighi di legge</dt>
            <dd>
              Quando applicabile, il trattamento si basa sull’adempimento di un obbligo legale
              (art. 6, par. 1, lett. c GDPR).
            </dd>
          </div>
        </dl>
        <p>
          I dati non saranno usati per newsletter o comunicazioni promozionali ricorrenti senza
          uno specifico consenso ulteriore.
        </p>
      </section>

      <section>
        <h2>4. Conferimento dei dati</h2>
        <p>
          Nome, e-mail, tipo di attività, processo attuale e accettazione dell’informativa sono
          necessari per inviare la richiesta. Telefono e messaggio sono facoltativi. Il mancato
          conferimento dei dati obbligatori impedisce l’invio del modulo.
        </p>
      </section>

      <section>
        <h2>5. Modalità, destinatari e responsabili</h2>
        <p>
          Il trattamento avviene con strumenti informatici e misure ragionevoli di sicurezza. I
          dati possono essere trattati da fornitori tecnici di hosting, database, infrastruttura e
          assistenza nominati responsabili del trattamento ai sensi dell’art. 28 GDPR, nella misura
          necessaria a erogare il servizio. I dati non sono diffusi né venduti.
        </p>
        <p>
          L’elenco aggiornato dei responsabili può essere richiesto al titolare utilizzando i
          recapiti indicati sopra.
        </p>
      </section>

      <section>
        <h2>6. Trasferimenti fuori dallo Spazio Economico Europeo</h2>
        <p>
          Il titolare privilegia fornitori e regioni di elaborazione nello Spazio Economico
          Europeo. Qualora un fornitore comporti un trasferimento verso un Paese terzo, questo
          avverrà sulla base di una decisione di adeguatezza o di garanzie appropriate previste
          dagli articoli 44 e seguenti del GDPR, incluse le clausole contrattuali standard.
        </p>
      </section>

      <section>
        <h2>7. Conservazione</h2>
        <p>
          Le richieste non convertite in un rapporto contrattuale sono conservate per un massimo di
          12 mesi dall’ultimo contatto, salvo revoca anticipata del consenso o necessità di
          conservazione ulteriore per obblighi di legge o tutela di un diritto. I log tecnici sono
          conservati per il tempo strettamente necessario alla sicurezza e, di regola, non oltre 90
          giorni.
        </p>
      </section>

      <section>
        <h2>8. Diritti dell’interessato</h2>
        <p>
          Puoi chiedere accesso, rettifica, cancellazione, limitazione, portabilità, opposizione e
          revocare il consenso in qualsiasi momento, senza pregiudicare la liceità del trattamento
          precedente. Puoi esercitare i diritti contattando il titolare.
        </p>
        <p>
          Hai inoltre diritto di proporre reclamo al Garante per la protezione dei dati personali
          tramite <a href="https://www.garanteprivacy.it">garanteprivacy.it</a>.
        </p>
      </section>

      <section>
        <h2>9. Processi decisionali automatizzati</h2>
        <p>
          I dati raccolti dalla landing non sono sottoposti a decisioni esclusivamente
          automatizzate né a profilazione con effetti giuridici o analogamente significativi.
        </p>
      </section>

      <section>
        <h2>10. Aggiornamenti</h2>
        <p>
          Questa informativa può essere aggiornata in seguito a modifiche del servizio o dei
          fornitori. La data di aggiornamento è indicata all’inizio della pagina.
        </p>
      </section>
    </LegalLayout>
  );
}

export function CookiePage() {
  return (
    <LegalLayout
      title="Cookie policy"
      description="Informazioni sulle tecnologie utilizzate dal sito pubblico di rentridesk."
    >
      <section>
        <h2>1. Cosa sono cookie e tecnologie simili</h2>
        <p>
          I cookie sono piccoli file memorizzati dal browser. Il sito può utilizzare anche
          tecnologie con finalità analoghe, come localStorage, per ricordare impostazioni tecniche.
        </p>
      </section>

      <section>
        <h2>2. Tecnologie utilizzate su questa landing</h2>
        <p>
          La landing pubblica non installa cookie pubblicitari, di profilazione o analitici di
          terze parti. Utilizza esclusivamente una preferenza tecnica locale:
        </p>
        <div className="legal-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Tipo</th>
                <th>Finalità</th>
                <th>Durata</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>fo-cookie-notice</code>
                </td>
                <td>localStorage tecnico</td>
                <td>Ricorda la chiusura dell’avviso informativo</td>
                <td>Fino alla cancellazione dei dati del browser</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Questa tecnologia è necessaria a ricordare una scelta dell’utente e non richiede consenso
          preventivo. Il sito non usa il numero WhatsApp per tracciare la navigazione; il
          collegamento verso WhatsApp si attiva solo quando viene selezionato.
        </p>
      </section>

      <section>
        <h2>3. Area applicativa e servizi esterni</h2>
        <p>
          L’area riservata può utilizzare strumenti tecnici di autenticazione e sicurezza
          strettamente necessari all’accesso. Eventuali funzioni future di analisi o marketing non
          saranno attivate sulla landing senza aggiornare questa informativa e, quando richiesto,
          raccogliere preventivamente il consenso.
        </p>
      </section>

      <section>
        <h2>4. Come gestire i dati locali</h2>
        <p>
          Puoi eliminare cookie e dati locali dalle impostazioni del browser. La cancellazione
          della preferenza farà ricomparire l’avviso informativo alla visita successiva.
        </p>
      </section>

      <section>
        <h2>5. Contatti</h2>
        <p>
          Per domande sull’uso di cookie e tecnologie simili puoi contattare {controller.name} via
          e-mail all’indirizzo <a href={`mailto:${controller.email}`}>{controller.email}</a> o al{' '}
          <a href={controller.whatsapp}>{controller.phone}</a>.
        </p>
      </section>
    </LegalLayout>
  );
}

export function TermsPage() {
  return (
    <LegalLayout
      title="Termini e condizioni"
      description="Condizioni d’uso del sito pubblico e di partecipazione alla fase di ricerca e accesso anticipato di rentridesk."
    >
      <section>
        <h2>1. Titolare del sito</h2>
        <p>
          Il sito è gestito da {controller.name}, P. IVA {controller.vat}, codice fiscale{' '}
          {controller.taxCode}, contattabile all’indirizzo {controller.email} o al{' '}
          {controller.phone}.
        </p>
      </section>

      <section>
        <h2>2. Scopo del sito</h2>
        <p>
          Il sito presenta un prodotto software in fase di sviluppo e raccoglie manifestazioni di
          interesse per attività di ricerca, interviste e possibile accesso anticipato. I contenuti
          non costituiscono un’offerta vincolante di vendita, un preventivo o la promessa di
          disponibilità entro una data determinata.
        </p>
      </section>

      <section>
        <h2>3. Manifestazione di interesse</h2>
        <p>
          L’invio del modulo è gratuito e non comporta obblighi di acquisto, abbonamento o
          partecipazione. Il titolare può contattare l’utente, selezionare un numero limitato di
          tester o interrompere la fase pilota. L’accesso anticipato, quando disponibile, potrà
          essere disciplinato da condizioni separate.
        </p>
      </section>

      <section>
        <h2>4. Natura del prodotto</h2>
        <p>
          rentridesk è progettato come supporto organizzativo al processo rifiuti. Non fornisce
          consulenza legale, fiscale o ambientale, non sostituisce il consulente dell’impresa e non
          garantisce in autonomia la correttezza della classificazione EER o l’adempimento degli
          obblighi dell’utente.
        </p>
        <p>
          Le anteprime mostrate usano dati dimostrativi. Le funzioni di interoperabilità RENTRI
          dipendono da requisiti, accreditamenti, disponibilità dei servizi e configurazioni che
          saranno indicati prima dell’uso effettivo.
        </p>
      </section>

      <section>
        <h2>5. Uso corretto</h2>
        <p>L’utente si impegna a non:</p>
        <ul>
          <li>inviare dati falsi, illeciti o appartenenti a terzi senza titolo;</li>
          <li>tentare di compromettere, sovraccaricare o aggirare la sicurezza del sito;</li>
          <li>copiare o riutilizzare marchi, interfacce e contenuti oltre i limiti di legge;</li>
          <li>usare il sito per attività illecite o contrarie ai diritti di terzi.</li>
        </ul>
      </section>

      <section>
        <h2>6. Proprietà intellettuale</h2>
        <p>
          Nome, logo, interfacce, testi e materiali originali di rentridesk appartengono al
          titolare o sono utilizzati in base ai relativi diritti. La consultazione del sito non
          trasferisce alcun diritto di proprietà intellettuale.
        </p>
      </section>

      <section>
        <h2>7. Disponibilità e responsabilità</h2>
        <p>
          Il sito e le anteprime possono essere modificati, sospesi o non disponibili. Nei limiti
          consentiti dalla legge, il titolare non risponde di decisioni operative prese
          esclusivamente sulla base dei contenuti promozionali, di interruzioni temporanee o di
          problemi imputabili a servizi di terzi. Restano ferme le responsabilità inderogabili
          previste dalla legge.
        </p>
      </section>

      <section>
        <h2>8. Collegamenti esterni</h2>
        <p>
          Il sito può contenere collegamenti verso servizi esterni, incluso WhatsApp. Selezionando
          tali collegamenti l’utente accede a servizi regolati dalle condizioni e informative dei
          rispettivi fornitori.
        </p>
      </section>

      <section>
        <h2>9. Legge applicabile</h2>
        <p>
          I presenti termini sono regolati dalla legge italiana. Per utenti qualificabili come
          consumatori restano applicabili il foro e le tutele inderogabili previste dalla normativa
          vigente; negli altri casi la competenza è determinata secondo le regole ordinarie.
        </p>
      </section>

      <section>
        <h2>10. Modifiche</h2>
        <p>
          I termini possono essere aggiornati per riflettere modifiche del sito o del progetto. La
          versione vigente è quella pubblicata in questa pagina con la relativa data.
        </p>
      </section>
    </LegalLayout>
  );
}
