export const SITE_URL =
  (import.meta.env.VITE_PUBLIC_SITE_URL as string | undefined)?.replace(/\/$/, '') ??
  'https://rentridesk.it';

export type PublicFaq = {
  question: string;
  answer: string;
};

export type PublicSection = {
  kicker?: string;
  title: string;
  paragraphs: string[];
  items?: Array<{ title: string; text: string }>;
};

export type PublicPage = {
  path: string;
  breadcrumb: string;
  title: string;
  description: string;
  eyebrow: string;
  h1: string;
  intro: string;
  highlights: string[];
  sections: PublicSection[];
  faqs: PublicFaq[];
  related: string[];
};

export const officialSources = {
  requiredSubjects: 'https://www.rentri.gov.it/area-operatori',
  septemberDeadline:
    'https://www.rentri.gov.it/news/fir-chiusura-delle-modalita-operative-di-sicurezza',
  digitalFir:
    'https://supporto.rentri.gov.it/aswsWeb/getOnlyFaq?idCategory=top&idFaq=N43246&idProduct=RENTRI&previousPage=home&userRole=rentriud',
  signature:
    'https://supporto.rentri.gov.it/aswsWeb/getOnlyFaq?idCategory=top&idFaq=N43244&idProduct=RENTRI&previousPage=home&userRole=rentriud',
  interoperability:
    'https://supporto.rentri.gov.it/aswsWeb/getOnlyFaq?idCategory=evidenza&idFaq=N34118&idProduct=RENTRI&previousPage=home&userRole=rentriud',
};

export const searchedFaqs: PublicFaq[] = [
  {
    question: 'RENTRI è obbligatorio per le officine?',
    answer:
      'Dipende dai rifiuti prodotti e, per alcune categorie di rifiuti non pericolosi, dal numero di dipendenti. In generale sono tenute all’iscrizione le imprese produttrici di rifiuti pericolosi; per i rifiuti non pericolosi derivanti da lavorazioni industriali o artigianali l’obbligo riguarda i produttori con più di 10 dipendenti. Un’officina deve quindi verificare la propria situazione concreta, non affidarsi alla sola etichetta dell’attività.',
  },
  {
    question: 'Da quando il FIR digitale diventa obbligatorio?',
    answer:
      'Secondo le comunicazioni ufficiali RENTRI aggiornate al 14 luglio 2026, dal 16 settembre 2026 il FIR digitale diventa obbligatorio per tutti gli iscritti al RENTRI. Fino al 15 settembre 2026 il produttore o detentore iscritto può scegliere il formato cartaceo o digitale e l’intera filiera deve seguire la modalità scelta.',
  },
  {
    question: 'Quali rifiuti deve registrare un’officina?',
    answer:
      'La risposta dipende dai rifiuti effettivamente prodotti e dalla loro classificazione. In un’attività di autoriparazione possono ricorrere, per esempio, oli esausti, filtri, batterie, liquidi refrigeranti o dei freni, assorbenti contaminati, pneumatici e componenti fuori uso. L’elenco non è automatico né uguale per tutte le attività: classificazione, pericolosità e codice EER vanno verificati caso per caso.',
  },
  {
    question: 'Il portale RENTRI è gratuito?',
    answer:
      'RENTRI mette a disposizione gratuitamente servizi di supporto per registri e formulari. Restano però il contributo annuo e il diritto di segreteria previsti per l’iscrizione, quando dovuti. Un software esterno è un costo separato e facoltativo: serve a organizzare il lavoro quotidiano e a collegarsi a RENTRI tramite interoperabilità.',
  },
  {
    question: 'Serve un software esterno?',
    answer:
      'No, non è obbligatorio acquistare un software esterno: gli operatori possono usare i servizi di supporto RENTRI. Un gestionale interoperabile diventa utile quando si vogliono riutilizzare anagrafiche, coordinare più sedi o clienti, controllare giacenze e scadenze, collegare documenti e ridurre i passaggi manuali.',
  },
  {
    question: 'Come si firma un FIR digitale?',
    answer:
      'Il FIR digitale deve essere firmato digitalmente dagli operatori coinvolti nella movimentazione. RENTRI ammette certificati qualificati eIDAS, CIE o TS-CNS e il certificato di firma remota RENTRI. Quest’ultimo è riferito all’operatore e non va confuso con il certificato usato per l’interoperabilità.',
  },
  {
    question: 'Come si conserva il FIR digitale?',
    answer:
      'Il destinatario restituisce tramite RENTRI la copia completa del FIR digitale; gli operatori coinvolti devono scaricarla entro 90 giorni dalla restituzione. Il semplice fatto che il documento transiti sul portale non va confuso con un processo di conservazione digitale a norma: responsabilità, tempi e servizio di conservazione vanno definiti per la propria organizzazione.',
  },
  {
    question: 'Quanto costa un software RENTRI per officine?',
    answer:
      'Il costo dipende da sedi, utenti, volumi di movimenti e formulari, funzioni incluse e assistenza. rentridesk è in fase pilota: la demo e la valutazione iniziale sono gratuite, mentre il prezzo di attivazione viene comunicato prima di qualsiasi adesione, senza rinnovi o acquisti impliciti.',
  },
];

export const publicPages: Record<string, PublicPage> = {
  '/software-rentri-officine': {
    path: '/software-rentri-officine',
    breadcrumb: 'Software RENTRI per officine',
    title: 'Software RENTRI per officine semplice | rentridesk',
    description:
      'Software RENTRI per officine, elettrauto e gommisti: registro rifiuti, giacenze, FIR digitale, documenti e collegamento interoperabile in un solo flusso.',
    eyebrow: 'Software RENTRI per autoriparatori',
    h1: 'Il software RENTRI per officine che parte dal lavoro quotidiano.',
    intro:
      'rentridesk organizza registro cronologico, carichi e scarichi, giacenze, FIR digitali, soggetti, autorizzazioni e copie complete. I dati vengono preparati una volta, controllati prima dei passaggi critici e, quando previsto, scambiati con RENTRI tramite interoperabilità.',
    highlights: ['Officine, elettrauto e gommisti', 'Registro e FIR nello stesso flusso', 'Demo guidata senza impegno'],
    sections: [
      {
        kicker: 'A chi serve',
        title: 'Obbligo RENTRI: conta ciò che produci, non solo l’insegna.',
        paragraphs: [
          'Un’autofficina può produrre rifiuti pericolosi e non pericolosi. I produttori di rifiuti pericolosi organizzati come impresa rientrano in generale tra i soggetti tenuti a iscriversi; per determinati rifiuti non pericolosi da lavorazioni industriali o artigianali rileva anche la soglia di più di 10 dipendenti.',
          'rentridesk non assegna automaticamente la classificazione e non sostituisce il consulente. Permette invece di configurare i profili verificati dall’impresa, applicarli con coerenza e mantenere collegate le evidenze.',
        ],
        items: [
          { title: 'Registro rifiuti', text: 'Carichi, scarichi, rettifiche e riferimenti conservati in una cronologia leggibile.' },
          { title: 'Giacenze', text: 'Quantità disponibili per profilo rifiuto, con origine di ogni variazione.' },
          { title: 'FIR digitale', text: 'Preparazione, controlli, firme, stati e recupero della copia completa.' },
          { title: 'Documenti', text: 'Autorizzazioni, ricevute e allegati associati al soggetto e alla pratica corretti.' },
        ],
      },
      {
        kicker: 'Operatività',
        title: 'Meno ricopiature tra registro, formulario e portale.',
        paragraphs: [
          'Sede, trasportatori, destinatari, intermediari e rifiuti ricorrenti diventano dati riutilizzabili. Quando prepari uno scarico, il formulario riprende le informazioni già disponibili e il sistema segnala i campi ancora da confermare.',
          'La coda “Da fare” raccoglie copie da recuperare, anomalie, documenti in scadenza e trasmissioni da completare. In questo modo il controllo non dipende da cartelle sparse, e-mail o memoria delle persone.',
        ],
      },
      {
        kicker: 'Interoperabilità',
        title: 'rentridesk e RENTRI: due ruoli diversi, collegati.',
        paragraphs: [
          'RENTRI è il sistema pubblico di tracciabilità. rentridesk è lo strumento operativo con cui l’officina prepara e controlla il proprio lavoro. Il collegamento usa i servizi applicativi ufficiali: il software invia o recupera i dati previsti, mostra l’esito e mantiene visibile ciò che resta da completare.',
          'L’interoperabilità non elimina le responsabilità dell’operatore. Firma, classificazione del rifiuto e conferme restano azioni esplicite; nessun invio reale viene trattato come una scatola nera.',
        ],
      },
      {
        kicker: 'Scadenza',
        title: 'Prepararsi al FIR digitale del 16 settembre 2026.',
        paragraphs: [
          'Dal 16 settembre 2026 il FIR digitale diventa obbligatorio per tutti gli iscritti al RENTRI. Conviene arrivarci con soggetti, dispositivi, firme, ruoli e flussi già provati, non limitarsi a cambiare formato il giorno della scadenza.',
          'La demo di rentridesk serve a ricostruire un caso reale, individuare i dati mancanti e definire un percorso di attivazione compatibile con i tempi dell’officina.',
        ],
      },
    ],
    faqs: searchedFaqs.slice(0, 5),
    related: ['/fir-digitale-officina', '/obbligo-rentri-officine', '/prezzi'],
  },

  '/fir-digitale-officina': {
    path: '/fir-digitale-officina',
    breadcrumb: 'FIR digitale in officina',
    title: 'FIR digitale officina: come funziona | rentridesk',
    description:
      'Guida operativa al FIR digitale per officine: compilazione, firma, trasporto, copia completa, trasmissione RENTRI e software interoperabile.',
    eyebrow: 'Dal formulario cartaceo all’xFIR',
    h1: 'FIR digitale in officina: preparalo, firmalo e seguilo senza perdere passaggi.',
    intro:
      'Il FIR digitale non è un PDF da stampare: nasce digitale, viene aggiornato dagli operatori della filiera e deve restare digitale fino alla conclusione. rentridesk mette in ordine dati, responsabilità e stati prima, durante e dopo il ritiro.',
    highlights: ['Flusso xFIR spiegato passo per passo', 'Firme e copia completa sotto controllo', 'Collegamento tramite API RENTRI'],
    sections: [
      {
        kicker: 'Prima del ritiro',
        title: 'Preparare un FIR digitale significa arrivare alla partenza con dati completi.',
        paragraphs: [
          'Prima dell’avvio del trasporto devono essere presenti produttore o detentore, trasportatore, destinatario, eventuale intermediario, caratteristiche del rifiuto, data e ora, conducente e targa. Produttore e trasportatore firmano digitalmente il formulario.',
          'rentridesk riutilizza le anagrafiche già verificate, collega il formulario allo scarico e segnala informazioni mancanti. La classificazione e la conferma dei dati restano in carico all’impresa.',
        ],
        items: [
          { title: '1. Compila', text: 'Parti da soggetti e profili rifiuto già organizzati, evitando moduli vuoti.' },
          { title: '2. Controlla', text: 'Verifica i campi richiesti e le autorizzazioni prima dell’arrivo del mezzo.' },
          { title: '3. Firma', text: 'Apponi la firma ammessa da RENTRI nel momento previsto dal flusso.' },
          { title: '4. Segui', text: 'Controlla accettazione, restituzione della copia e attività ancora aperte.' },
        ],
      },
      {
        kicker: 'Durante e dopo',
        title: 'La filiera aggiorna lo stesso formulario digitale.',
        paragraphs: [
          'Dopo la firma iniziale i dati principali non sono più modificabili e il FIR non può essere annullato. Trasportatore e destinatario integrano le informazioni di propria competenza; il destinatario firma l’accettazione o il respingimento e restituisce la copia completa tramite RENTRI entro due giorni lavorativi dalla presa in carico.',
          'Gli operatori coinvolti devono scaricare la copia completa entro 90 giorni dalla restituzione. rentridesk rende questa attività visibile nella coda operativa e associa la copia al movimento corretto.',
        ],
      },
      {
        kicker: 'Firma digitale',
        title: 'Firma RENTRI e certificato di interoperabilità non sono la stessa cosa.',
        paragraphs: [
          'Per il FIR digitale sono ammessi certificati qualificati eIDAS, CIE o TS-CNS e il certificato di firma remota RENTRI. Il certificato di interoperabilità serve invece al gestionale per comunicare con le API ufficiali.',
          'Separare chiaramente utenti, dispositivi, permessi e certificati evita di attribuire alla tecnologia azioni che devono essere consapevolmente autorizzate dall’operatore.',
        ],
      },
      {
        kicker: 'Dal 16 settembre 2026',
        title: 'Per gli iscritti RENTRI il formulario diventa digitale.',
        paragraphs: [
          'Fino al 15 settembre 2026 il produttore o detentore iscritto può scegliere tra cartaceo e digitale, e tutta la filiera segue la scelta. Dal giorno successivo il formato digitale diventa obbligatorio per tutti gli iscritti RENTRI, secondo l’avviso ufficiale pubblicato il 31 marzo 2026.',
        ],
      },
    ],
    faqs: searchedFaqs.slice(1, 7),
    related: ['/software-rentri-officine', '/obbligo-rentri-officine', '/faq-rentri-officine'],
  },

  '/rentri-carrozzerie': {
    path: '/rentri-carrozzerie',
    breadcrumb: 'RENTRI per carrozzerie',
    title: 'RENTRI carrozzeria: rifiuti, registro e FIR | rentridesk',
    description:
      'RENTRI per carrozzerie: organizza rifiuti, registro di carico e scarico, giacenze, FIR digitale, trasportatori e documenti con rentridesk.',
    eyebrow: 'Gestione rifiuti per carrozzerie',
    h1: 'RENTRI per carrozzerie, dal rifiuto prodotto alla copia completa del FIR.',
    intro:
      'Una carrozzeria gestisce materiali e residui diversi, spesso con caratteristiche che richiedono attenzione. rentridesk collega profili rifiuto, movimenti, giacenze, formulari e documenti senza trasformare il processo ambientale in un secondo gestionale d’officina.',
    highlights: ['Flusso dedicato alla carrozzeria', 'Controllo per sede e profilo rifiuto', 'Condivisione ordinata con il consulente'],
    sections: [
      {
        kicker: 'Perimetro',
        title: 'Vernici, solventi, filtri e imballaggi non si gestiscono per abitudine.',
        paragraphs: [
          'Tra i rifiuti ricorrenti possono esserci residui di verniciatura, solventi, filtri, assorbenti contaminati, imballaggi, parti metalliche e altri componenti. È un elenco esemplificativo: codice EER e pericolosità dipendono dal processo e dalle caratteristiche reali del rifiuto.',
          'Il software conserva i profili confermati dall’impresa o dal consulente, impedisce di confondere una proposta con una classificazione approvata e mantiene le evidenze collegate.',
        ],
        items: [
          { title: 'Profili rifiuto', text: 'Descrizione, classificazione confermata, unità di misura e documenti di supporto.' },
          { title: 'Aree di deposito', text: 'Giacenze e movimenti leggibili per sede e tipologia gestita.' },
          { title: 'Fornitori autorizzati', text: 'Trasportatori e destinatari con documenti e scadenze nello stesso contesto.' },
          { title: 'Ritiri', text: 'Scarico e FIR collegati per ricostruire quantità, date ed esito del conferimento.' },
        ],
      },
      {
        kicker: 'Obbligo',
        title: 'Quando una carrozzeria deve iscriversi al RENTRI.',
        paragraphs: [
          'La verifica parte dai rifiuti prodotti. Le imprese produttrici di rifiuti pericolosi sono in generale soggette all’iscrizione; per i produttori di specifici rifiuti non pericolosi da lavorazioni artigianali o industriali rileva la soglia di più di 10 dipendenti.',
          'Non basta quindi dire “le carrozzerie sono obbligate” o “non lo sono”: occorre verificare organizzazione, rifiuti e soglie applicabili alla singola attività.',
        ],
      },
      {
        kicker: 'Lavoro quotidiano',
        title: 'Dal registro al FIR senza ricostruire ogni volta la pratica.',
        paragraphs: [
          'Il carico aggiorna la giacenza. Lo scarico richiama il materiale disponibile. Il FIR riutilizza soggetti e dati già verificati. La copia completa chiude il ciclo e resta associata al ritiro. Ogni passaggio alimenta il successivo, riducendo duplicazioni e controlli tardivi.',
        ],
      },
      {
        kicker: 'Consulente',
        title: 'Il consulente vede ciò che serve senza ricevere cartelle disordinate.',
        paragraphs: [
          'Accessi e ruoli separano chi registra, chi verifica e chi conferma. Il consulente ambientale può controllare anomalie e documenti dei clienti autorizzati, mentre la carrozzeria mantiene la responsabilità e la visibilità delle operazioni.',
        ],
      },
    ],
    faqs: [searchedFaqs[0]!, searchedFaqs[1]!, searchedFaqs[2]!, searchedFaqs[4]!, searchedFaqs[7]!],
    related: ['/software-rentri-officine', '/software-rentri-consulenti', '/prezzi'],
  },

  '/software-rentri-consulenti': {
    path: '/software-rentri-consulenti',
    breadcrumb: 'Software RENTRI per consulenti',
    title: 'Software RENTRI per consulenti ambientali | rentridesk',
    description:
      'Software RENTRI per consulenti ambientali e partner: clienti autorizzati, anomalie, documenti, registri e FIR in una vista organizzata e tracciabile.',
    eyebrow: 'Portale partner per consulenti ambientali',
    h1: 'Un software RENTRI per seguire più officine senza lavorare al posto loro.',
    intro:
      'rentridesk offre a consulenti e partner una vista aggregata dei clienti che hanno concesso l’accesso. Ogni impresa conserva ruoli e responsabilità; il consulente individua ciò che richiede verifica e interviene con un contesto completo.',
    highlights: ['Vista multi-cliente autorizzata', 'Ruoli e attività tracciati', 'Template proposti, mai applicati di nascosto'],
    sections: [
      {
        kicker: 'Portafoglio clienti',
        title: 'Priorità trasversali senza entrare e uscire da decine di strumenti.',
        paragraphs: [
          'La vista partner riunisce stato di onboarding, trasmissioni in attesa, documenti mancanti, autorizzazioni in scadenza e copie FIR da recuperare. I dati restano separati per organizzazione e sono visibili solo nei limiti autorizzati dal cliente.',
        ],
        items: [
          { title: 'Clienti collegati', text: 'Stato operativo e problemi aperti per ciascuna organizzazione.' },
          { title: 'Coda verifiche', text: 'Anomalie raggruppate per urgenza, cliente e tipo di adempimento.' },
          { title: 'Documenti', text: 'Evidenze collegate a soggetti, movimenti e autorizzazioni.' },
          { title: 'Audit', text: 'Autore, momento e origine delle azioni rilevanti ricostruibili.' },
        ],
      },
      {
        kicker: 'Metodo',
        title: 'Standardizzare dove aiuta, lasciare esplicite le decisioni.',
        paragraphs: [
          'Il consulente può proporre configurazioni ricorrenti per tipologia di attività, ma ogni cliente deve verificare e confermare i propri dati. Un profilo rifiuto suggerito non diventa automaticamente una classificazione valida per tutte le officine.',
          'Questo confine riduce il rischio di riuso indiscriminato e rende chiaro chi ha approvato cosa.',
        ],
      },
      {
        kicker: 'Collaborazione',
        title: 'L’officina inserisce i fatti; il consulente controlla con continuità.',
        paragraphs: [
          'Gli operatori registrano il lavoro vicino al momento in cui avviene. Il consulente riceve una base più ordinata, può chiedere integrazioni puntuali e concentra il tempo sui casi che richiedono giudizio professionale.',
          'rentridesk non sostituisce la consulenza: elimina il rumore operativo che spesso la rende tardiva.',
        ],
      },
      {
        kicker: 'Partnership',
        title: 'Percorsi dedicati per reti, associazioni e studi.',
        paragraphs: [
          'La fase pilota è aperta a consulenti ambientali, società di servizi e partner che seguono attività di autoriparazione. La demo parte dal numero di clienti, dai ruoli desiderati e dal processo attuale, così la proposta economica riflette l’uso reale.',
        ],
      },
    ],
    faqs: [
      { question: 'Il consulente può operare per conto del cliente?', answer: 'Solo nei limiti dei ruoli e delle autorizzazioni attribuite. rentridesk distingue consultazione, preparazione, verifica e conferma, e registra le azioni rilevanti.' },
      { question: 'I dati dei clienti sono separati?', answer: 'Sì. Ogni organizzazione costituisce un perimetro distinto; la vista partner mostra soltanto i clienti e le informazioni per cui esiste un accesso autorizzato.' },
      { question: 'È possibile proporre configurazioni comuni?', answer: 'Sì, come template da sottoporre al cliente. Classificazioni, profili e dati specifici diventano operativi solo dopo una verifica esplicita.' },
      { question: 'Come funziona il prezzo per i consulenti?', answer: 'Il piano partner viene dimensionato su clienti collegati, utenti e funzioni necessarie. Durante la fase pilota la valutazione e la demo sono gratuite; il preventivo arriva prima di qualsiasi attivazione.' },
    ],
    related: ['/software-rentri-officine', '/rentri-carrozzerie', '/prezzi'],
  },

  '/obbligo-rentri-officine': {
    path: '/obbligo-rentri-officine',
    breadcrumb: 'Obbligo RENTRI per officine',
    title: 'Obbligo RENTRI officine e scadenza 2026 | rentridesk',
    description:
      'Obbligo RENTRI per officine: chi deve iscriversi, registro digitale, FIR digitale dal 16 settembre 2026 e preparazione operativa senza allarmismi.',
    eyebrow: 'Guida aggiornata al 14 luglio 2026',
    h1: 'Obbligo RENTRI per officine: cosa verificare prima del 16 settembre 2026.',
    intro:
      'L’obbligo non dipende semplicemente dal fatto di essere officina, carrozzeria, elettrauto o gommista. Dipende dalla natura dei rifiuti prodotti, dall’organizzazione e, per specifici rifiuti non pericolosi, dal numero di dipendenti.',
    highlights: ['Criteri spiegati senza semplificazioni rischiose', 'Scadenza FIR digitale verificata', 'Checklist pratica per arrivare pronti'],
    sections: [
      {
        kicker: 'Chi è obbligato',
        title: 'La verifica parte dai rifiuti pericolosi e dalla soglia dei dipendenti.',
        paragraphs: [
          'Sono tenuti all’iscrizione, tra gli altri, i produttori di rifiuti pericolosi. Per i produttori iniziali di rifiuti non pericolosi derivanti da lavorazioni industriali e artigianali l’obbligo riguarda le imprese con più di 10 dipendenti. Esistono esclusioni e modalità alternative che vanno valutate sul caso concreto.',
          'Un’attività piccola non è automaticamente esclusa se produce rifiuti pericolosi. Allo stesso modo non ogni rifiuto generato in officina comporta da solo l’iscrizione: serve una ricognizione documentata.',
        ],
        items: [
          { title: '1. Mappa i rifiuti', text: 'Elenca ciò che viene realmente prodotto e come è stato classificato.' },
          { title: '2. Verifica l’organizzazione', text: 'Considera forma dell’attività, unità locali e numero di dipendenti.' },
          { title: '3. Controlla l’iscrizione', text: 'Accerta categoria, unità locali e dati presenti nell’area operatori.' },
          { title: '4. Definisci il flusso', text: 'Stabilisci chi registra, chi firma, chi trasmette e chi controlla.' },
        ],
      },
      {
        kicker: 'Registro',
        title: 'Per gli iscritti il registro cronologico è gestito in formato digitale.',
        paragraphs: [
          'Le tempistiche di iscrizione si sono concluse per le categorie di produttori previste. Gli operatori iscritti tengono il registro con i servizi di supporto RENTRI oppure con un sistema gestionale interoperabile.',
          'Il software non modifica termini o responsabilità: rende più semplice collegare movimenti, giacenze, formulari e ricevute e mostra ciò che non è ancora completato.',
        ],
      },
      {
        kicker: '16 settembre 2026',
        title: 'Il cambio non riguarda solo il supporto del formulario.',
        paragraphs: [
          'Dal 16 settembre 2026 il FIR digitale è obbligatorio per tutti gli iscritti RENTRI. Il formulario deve essere gestito digitalmente dalla filiera, firmato dagli operatori coinvolti e completato con accettazione o respingimento del destinatario.',
          'Prepararsi significa verificare anagrafiche, dispositivi, certificati, ruoli, connettività, trasportatori e destinatari. Una prova su un ritiro reale è più utile di una configurazione fatta senza coinvolgere la filiera.',
        ],
      },
      {
        kicker: 'Avvertenza',
        title: 'Una guida operativa non sostituisce la verifica normativa della tua impresa.',
        paragraphs: [
          'Le regole possono cambiare e alcune casistiche richiedono valutazioni specifiche. Questa pagina sintetizza fonti ufficiali consultate il 14 luglio 2026; per decisioni sulla tua posizione confrontati con il consulente e con il portale RENTRI.',
        ],
      },
    ],
    faqs: searchedFaqs.slice(0, 4),
    related: ['/fir-digitale-officina', '/software-rentri-officine', '/faq-rentri-officine'],
  },

  '/prezzi': {
    path: '/prezzi',
    breadcrumb: 'Prezzi',
    title: 'Prezzi software RENTRI per officine | rentridesk',
    description:
      'Scopri come vengono definiti i prezzi di rentridesk per officine e consulenti. Demo e valutazione gratuite, costi trasparenti prima dell’attivazione.',
    eyebrow: 'Prezzi trasparenti, senza acquisti impliciti',
    h1: 'Un prezzo proporzionato al lavoro da gestire, comunicato prima dell’attivazione.',
    intro:
      'rentridesk è in fase pilota e il listino definitivo non è ancora pubblicato. La demo e l’analisi iniziale sono gratuite; dopo aver capito sedi, utenti e volumi ricevi una proposta chiara prima di decidere.',
    highlights: [],
    sections: [
      {
        kicker: 'Piani in definizione',
        title: 'Tre esigenze diverse, senza funzioni nascoste.',
        paragraphs: [
          'Non pubblichiamo un prezzo fittizio mentre il prodotto è ancora in validazione. Gli importi definitivi saranno indicati qui appena stabiliti. Nel frattempo ogni contatto riceve per iscritto perimetro, costo, durata e condizioni prima di aderire.',
        ],
        items: [
          { title: 'Pilota — gratuito', text: 'Intervista, demo e accesso selezionato alla fase di prova. Nessun rinnovo automatico.' },
          { title: 'Officina — su proposta', text: 'Per una o più unità locali, in base a utenti, movimenti, FIR e assistenza necessaria.' },
          { title: 'Partner — su proposta', text: 'Per consulenti e reti, dimensionato su clienti collegati, ruoli e funzioni condivise.' },
        ],
      },
      {
        kicker: 'Cosa incide',
        title: 'Il costo dipende dal perimetro, non dalla complessità della normativa.',
        paragraphs: [
          'Consideriamo numero di unità locali, utenti, volumi di registrazioni e FIR, spazio documentale, necessità di onboarding e vista multi-cliente. L’obiettivo è evitare che una piccola officina paghi per funzioni costruite per una rete di consulenza.',
        ],
      },
      {
        kicker: 'Cosa include',
        title: 'Il valore è nel flusso completo, non nel singolo invio.',
        paragraphs: [
          'La proposta può includere configurazione guidata, registro, giacenze, FIR, anagrafiche, documenti, autorizzazioni, coda delle attività e collegamento interoperabile. Contributo RENTRI, diritto di segreteria e servizi professionali esterni non fanno parte del canone del software.',
        ],
      },
      {
        kicker: 'Attivazione',
        title: 'Prima vedi la demo, poi valuti il tuo caso.',
        paragraphs: [
          'La demo parte da un rifiuto ricorrente e da un ritiro tipo. Se il flusso risponde alle esigenze, definiamo configurazione, tempi e costo. Se non è adatto, non ci sono acquisti, carte registrate o abbonamenti da annullare.',
        ],
      },
    ],
    faqs: [searchedFaqs[7]!, searchedFaqs[3]!, searchedFaqs[4]!],
    related: ['/software-rentri-officine', '/software-rentri-consulenti', '/faq-rentri-officine'],
  },

  '/faq-rentri-officine': {
    path: '/faq-rentri-officine',
    breadcrumb: 'FAQ RENTRI officine',
    title: 'FAQ RENTRI officine: obbligo, FIR e software | rentridesk',
    description:
      'Risposte alle domande frequenti su RENTRI per officine: obbligo, FIR digitale, rifiuti da registrare, firma, conservazione, portale e software.',
    eyebrow: 'Risposte aggiornate al 14 luglio 2026',
    h1: 'FAQ RENTRI per officine, carrozzerie, elettrauto e gommisti.',
    intro:
      'Risposte sintetiche alle domande più frequenti, con i limiti che contano: la classificazione dipende dal rifiuto reale, l’obbligo va verificato sulla singola impresa e le fonti ufficiali prevalgono sempre su una guida commerciale.',
    highlights: ['8 risposte operative', 'Fonti RENTRI verificate', 'Niente risposte assolute fuori contesto'],
    sections: [
      {
        kicker: 'Come usare questa pagina',
        title: 'Parti dalla domanda, poi verifica il tuo caso.',
        paragraphs: [
          'Le FAQ aiutano a orientarsi tra iscrizione, registro e formulario digitale. Non possono stabilire da sole se un determinato residuo è pericoloso o quale codice EER applicare: per questo servono informazioni sul processo e una valutazione competente.',
          'Le risposte sono presenti integralmente nell’HTML della pagina e possono essere lette anche senza JavaScript.',
        ],
      },
      {
        kicker: 'Approfondimenti',
        title: 'Dall’obbligo al flusso operativo.',
        paragraphs: [
          'Se devi capire chi è soggetto all’obbligo, consulta la guida dedicata. Se stai preparando il passaggio operativo, parti dal flusso FIR digitale. Per confrontare gestione gratuita e software interoperabile, visita la pagina del prodotto.',
        ],
      },
    ],
    faqs: searchedFaqs,
    related: ['/obbligo-rentri-officine', '/fir-digitale-officina', '/software-rentri-officine'],
  },
};

export const publicRoutes = ['/', ...Object.keys(publicPages)];

export function getPublicPage(path: string): PublicPage | undefined {
  const normalized = path !== '/' ? path.replace(/\/$/, '') : path;
  return publicPages[normalized];
}

export function getPageName(path: string): string {
  if (path === '/') return 'rentridesk';
  return publicPages[path]?.breadcrumb ?? path;
}

export function buildStructuredData(page?: PublicPage) {
  const path = page?.path ?? '/';
  const canonical = `${SITE_URL}${path === '/' ? '' : path}`;
  const organization = {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: 'rentridesk',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    founder: { '@type': 'Person', name: 'Diego Simoncini' },
  };
  const software = {
    '@type': 'SoftwareApplication',
    '@id': `${SITE_URL}/#software`,
    name: 'rentridesk',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: SITE_URL,
    description:
      'Software web per registro rifiuti, giacenze, FIR digitale, documenti e interoperabilità RENTRI dedicato alle attività di autoriparazione.',
    audience: {
      '@type': 'BusinessAudience',
      audienceType: 'Officine, carrozzerie, elettrauto, gommisti e consulenti ambientali',
    },
    publisher: { '@id': `${SITE_URL}/#organization` },
  };
  const breadcrumb = {
    '@type': 'BreadcrumbList',
    itemListElement:
      path === '/'
        ? [{ '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL }]
        : [
            { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
            { '@type': 'ListItem', position: 2, name: page!.breadcrumb, item: canonical },
          ],
  };
  const website = {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: 'rentridesk',
    inLanguage: 'it-IT',
    publisher: { '@id': `${SITE_URL}/#organization` },
  };
  const graph: Record<string, unknown>[] = [organization, software, website, breadcrumb, {
    '@type': 'WebPage',
    '@id': `${canonical}#webpage`,
    url: canonical,
    name: page?.title ?? 'rentridesk — Software RENTRI semplice per officine',
    description:
      page?.description ??
      'Software RENTRI per officine, carrozzerie, elettrauto e gommisti: registro rifiuti, FIR digitale e gestione quotidiana in un unico flusso.',
    inLanguage: 'it-IT',
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@id': `${SITE_URL}/#software` },
  }];

  if (page?.faqs.length) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: page.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      })),
    });
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}
