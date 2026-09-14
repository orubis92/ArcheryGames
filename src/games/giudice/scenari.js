// Scenari del gioco "Il giudice".
// Fonti:
//  RS  = CSAIn - Regolamento Sportivo Tiro con l'arco 3D, rev. 6.6 (01/07/2026)
//  RGO = CSAIn - Regolamento Gare Outdoor 2026
// Le citazioni seguono lo schema Capitolo / Paragrafo / comma.
//
// Campi:
//  id        identificativo stabile (usato per le statistiche)
//  livello   1 = Punteggi, 2 = Procedure di tiro, 3 = Sanzioni e giudice
//  gara      formato di gara della situazione
//  situazione testo della situazione
//  bersaglio (opzionale) diagramma: { sagoma: 'cinghiale'|'cervo'|'volpe'|'lepre',
//            zona: 'perfect'|'superspot'|'spot'|'linea-tocca'|'linea-vicina'|'sagoma'|'corna'|'base',
//            nota? } (vedi sagome.js)
//  domanda   la domanda posta
//  opzioni   risposte possibili
//  corretta  indice della risposta corretta
//  spiegazione  regola spiegata
//  fonte     citazione

export const LIVELLI = {
  1: { nome: 'Punteggi', descrizione: 'Zone, linee, rimbalzi, passanti: quanto vale la freccia?' },
  2: { nome: 'Procedure di tiro', descrizione: 'Picchetti, sequenze, tempi, frecce cadute, binocolo.' },
  3: { nome: 'Sanzioni e giudice', descrizione: 'Ammonizioni, diffide, score, ricorsi, parità.' },
};

export const SCENARI = [
  // ---------------------------------------------------------------- LIVELLO 1
  {
    id: 'L1-spot-pulito',
    livello: 1,
    gara: '44 Fusion',
    situazione:
      "Gara 44 Fusion, piazzola di gruppo 2. La freccia di un arciere RT è conficcata nello Spot, chiaramente distante dalla linea del Super Spot e da quella della sagoma.",
    bersaglio: { sagoma: 'cinghiale', zona: 'spot' },
    domanda: 'Quanti punti vale la freccia?',
    opzioni: ['6 punti', '10 punti', '12 punti', '14 punti'],
    corretta: 1,
    spiegazione:
      'Nella 44 Fusion i valori sono: Perfect 14, Super Spot 12, Spot 10, Sagoma 6. La freccia è nello Spot senza toccare alcuna linea, quindi vale 10.',
    fonte: 'RGO Art. 1 comma o)',
  },
  {
    id: 'L1-perfect',
    livello: 1,
    gara: '44 Fusion',
    situazione:
      'Gara 44 Fusion. La freccia è conficcata al centro del Perfect.',
    bersaglio: { sagoma: 'cervo', zona: 'perfect' },
    domanda: 'Quanti punti vale la freccia?',
    opzioni: ['10 punti', '12 punti', '14 punti', '16 punti'],
    corretta: 2,
    spiegazione:
      'Il Perfect è la zona più interna del Super Spot e nella 44 Fusion vale 14 punti (il massimo).',
    fonte: 'RGO Art. 1 comma o); RS Cap. III Par. III comma 3',
  },
  {
    id: 'L1-sagoma',
    livello: 1,
    gara: '44 Fusion',
    situazione:
      'Gara 44 Fusion. La freccia è conficcata nella coscia posteriore della sagoma, lontano dallo Spot.',
    bersaglio: { sagoma: 'volpe', zona: 'sagoma' },
    domanda: 'Quanti punti vale la freccia?',
    opzioni: ['0 punti', '4 punti', '6 punti', '10 punti'],
    corretta: 2,
    spiegazione:
      "Tutta la figura dell'animale (escluse le corna) è zona di punteggio valida. Fuori dallo Spot la freccia vale il punteggio 'Sagoma', che nella 44 Fusion è 6.",
    fonte: 'RS Cap. III Par. III comma 3; RGO Art. 1 comma o)',
  },
  {
    id: 'L1-corna',
    livello: 1,
    gara: '44 Fusion',
    situazione:
      "Bersaglio 3D raffigurante un cervo. La freccia è conficcata saldamente in un palco delle corna.",
    bersaglio: { sagoma: 'cervo', zona: 'corna', nota: 'Freccia nel palco delle corna' },
    domanda: 'Quanti punti vale la freccia?',
    opzioni: ['0 punti', '6 punti (Sagoma)', '10 punti (Spot)', 'Decide il Giudice di Gara'],
    corretta: 0,
    spiegazione:
      "Nei bersagli tridimensionali la zona di punteggio valida è tutta la figura dell'animale ESCLUSE le corna. Una freccia nelle corna non vale nulla.",
    fonte: 'RS Cap. III Par. III comma 3',
  },
  {
    id: 'L1-base',
    livello: 1,
    gara: '60 Target',
    situazione:
      'Sagoma di cinghiale montata su una base di polistirolo delimitata da una riga ben definita. La freccia è conficcata nella base, sotto la pancia della sagoma.',
    bersaglio: { sagoma: 'cinghiale', zona: 'base', nota: 'Freccia nella base di supporto' },
    domanda: 'Quanti punti vale la freccia?',
    opzioni: ['0 punti', 'Punteggio Sagoma', 'Punteggio Spot se la base è dentro la riga', 'Metà del punteggio Sagoma'],
    corretta: 0,
    spiegazione:
      "La base del bersaglio ed eventuali altri supporti o figure che esulano dalla sagoma dell'animale non sono zona di punteggio e devono essere delimitati da una riga ben definita. La freccia vale 0.",
    fonte: 'RS Cap. III Par. III comma 3',
  },
  {
    id: 'L1-linea-tocca',
    livello: 1,
    gara: '44 Fusion',
    situazione:
      "Gara 44 Fusion. La freccia è conficcata nella sagoma appena fuori dallo Spot: guardando da vicino, l'asta tocca la linea esterna dello Spot (tangenza), senza però attraversarla.",
    bersaglio: { sagoma: 'lepre', zona: 'linea-tocca', nota: "L'asta è tangente alla linea dello Spot" },
    domanda: 'Quanti punti vale la freccia?',
    opzioni: ['6 punti (Sagoma)', '10 punti (Spot)', '8 punti (media)', 'Decide il responsabile di piazzola a occhio'],
    corretta: 1,
    spiegazione:
      "Quando viene colpita la linea di delimitazione fra due zone, per assegnare il punteggio superiore l'asta deve almeno toccare (tangenza) la linea esterna. Qui la tocca: vale lo Spot, 10 punti.",
    fonte: 'RS Cap. III Par. VI comma 9',
  },
  {
    id: 'L1-linea-vicina',
    livello: 1,
    gara: '44 Fusion',
    situazione:
      "Gara 44 Fusion. La freccia è conficcata nella sagoma a un paio di millimetri dalla linea dello Spot. L'arciere sostiene che 'praticamente la tocca'. Osservando bene, tra l'asta e la linea si vede un filo di sagoma.",
    bersaglio: { sagoma: 'cinghiale', zona: 'linea-vicina', nota: "L'asta NON tocca la linea dello Spot" },
    domanda: 'Quanti punti vale la freccia?',
    opzioni: ['10 punti (Spot)', '6 punti (Sagoma)', '10 punti se la maggioranza della squadra è d\'accordo', 'Si annulla la freccia per contestazione'],
    corretta: 1,
    spiegazione:
      "Il criterio è la tangenza: se l'asta non tocca la linea esterna della zona superiore, vale la zona in cui è conficcata. Vicino non basta: 6 punti (Sagoma).",
    fonte: 'RS Cap. III Par. VI comma 9',
  },
  {
    id: 'L1-passante',
    livello: 1,
    gara: '40 Round',
    situazione:
      'Un arciere CO tira su una sagoma di gruppo 4 ormai molto usurata. La freccia trapassa completamente la sagoma e viene ritrovata a terra dietro il bersaglio. Il foro di ingresso è chiaramente nello Spot.',
    domanda: 'Come si comporta il responsabile di piazzola?',
    opzioni: [
      'Assegna lo Spot: il foro è evidente',
      'Assegna il punteggio Sagoma come compromesso',
      'La freccia non è valida e l\'evento va subito segnalato al Giudice di Gara',
      'Fa ritirare la freccia all\'arciere',
    ],
    corretta: 2,
    spiegazione:
      "Le frecce devono rimanere conficcate nel bersaglio, penetrandovi con la punta, fino alla registrazione del punteggio. Le frecce che trapassano il bersaglio senza rimanere impiantate non sono valide e l'evento deve essere immediatamente segnalato al Giudice di Gara (che può far sostituire il bersaglio).",
    fonte: 'RS Cap. III Par. VI comma 5; Par. III comma 8',
  },
  {
    id: 'L1-rimbalzo-master',
    livello: 1,
    gara: '44 Fusion',
    situazione:
      "Un arciere Master LB tira sulla sagoma: la freccia colpisce lo Spot ma rimbalza indietro verso l'arciere e cade a terra. Tutti in piazzola hanno visto chiaramente il punto di impatto.",
    domanda: 'Quanti punti vale la freccia?',
    opzioni: ['10 punti (Spot): l\'impatto è stato visto da tutti', '6 punti (Sagoma) come punteggio più basso', '0 punti', 'Si ripete il tiro'],
    corretta: 2,
    spiegazione:
      "Le frecce devono rimanere conficcate nel bersaglio. L'eccezione del punteggio 'Sagoma' per la freccia che rimbalza vale SOLO per la categoria Prime Frecce. Per un Master la freccia rimbalzata vale 0.",
    fonte: 'RS Cap. III Par. VI comma 5',
  },
  {
    id: 'L1-rimbalzo-pf',
    livello: 1,
    gara: '44 Fusion',
    situazione:
      "Un bambino della classe Prime Frecce tira dal picchetto rosso: la freccia colpisce la sagoma e rimbalza in direzione dell'arciere. Il responsabile di piazzola e i marcatori concordano che ha colpito la sagoma.",
    domanda: 'Quanti punti si registrano?',
    opzioni: ['0 punti: la freccia non è rimasta conficcata', 'Il punteggio più basso, Sagoma', 'Lo Spot se il rimbalzo è avvenuto sullo Spot', 'Si ripete il tiro'],
    corretta: 1,
    spiegazione:
      "Solo per la categoria Prime Frecce è ammesso segnare come punteggio più basso 'Sagoma' quando la freccia rimbalza sul bersaglio in direzione dell'arciere. Il responsabile di piazzola, in accordo con i marcatori, assegna il punteggio.",
    fonte: 'RS Cap. III Par. VI comma 5',
  },
  {
    id: 'L1-deviata',
    livello: 1,
    gara: '60 Track',
    situazione:
      'La freccia di un arciere urta un ramoscello lungo la traiettoria, devia e si conficca nel Super Spot.',
    bersaglio: { sagoma: 'volpe', zona: 'superspot' },
    domanda: 'La freccia è valida?',
    opzioni: ['No: è stata deviata da un ostacolo', 'Sì, vale il Super Spot', 'Sì, ma vale solo Sagoma', 'Si ripete il tiro'],
    corretta: 1,
    spiegazione:
      'Una freccia che colpisce il bersaglio deviata da un ostacolo qualsiasi, o in seguito a un rimbalzo sul terreno, è considerata valida: vale la zona in cui si è conficcata.',
    fonte: 'RS Cap. III Par. VI comma 6',
  },
  {
    id: 'L1-rimbalzo-terra',
    livello: 1,
    gara: '40 Free-Shot',
    situazione:
      'La freccia tocca terra poco prima del bersaglio, rimbalza e si conficca nella sagoma.',
    bersaglio: { sagoma: 'lepre', zona: 'sagoma' },
    domanda: 'Come va conteggiata?',
    opzioni: ['0 punti: ha toccato terra', 'Vale la zona colpita (Sagoma)', 'Metà punteggio', 'Decide il Giudice di Gara'],
    corretta: 1,
    spiegazione:
      'Il regolamento è esplicito: la freccia che colpisce il bersaglio in seguito a un rimbalzo sul terreno è considerata valida.',
    fonte: 'RS Cap. III Par. VI comma 6',
  },
  {
    id: 'L1-robin-hood',
    livello: 1,
    gara: '44 Fusion',
    situazione:
      "La seconda freccia di un arciere si conficca nella cocca della freccia di un compagno di squadra, già piantata nello Spot, e vi rimane infissa (il classico 'Robin Hood').",
    domanda: 'Quanti punti vale la seconda freccia?',
    opzioni: ['0 punti: non ha toccato il bersaglio', 'Lo stesso punteggio della freccia colpita (Spot)', 'Sagoma', 'Si ripete il tiro'],
    corretta: 1,
    spiegazione:
      "Una freccia che penetra nella cocca di un'altra rimanendovi infissa ha lo stesso punteggio di quella colpita.",
    fonte: 'RS Cap. III Par. VI comma 8',
  },
  {
    id: 'L1-primo-impatto',
    livello: 1,
    gara: '60 Target',
    situazione:
      "Sagoma 3D vista di tre quarti. La freccia entra nella zampa anteriore (zona Sagoma), attraversa il polistirolo e la punta riesce dentro lo Spot, dove rimane visibile.",
    domanda: 'Quanti punti si assegnano?',
    opzioni: ['Spot: la punta è nello Spot', 'Sagoma: conta il primo punto di impatto', 'Il punteggio più alto tra i due', 'La freccia è nulla'],
    corretta: 1,
    spiegazione:
      'Nei bersagli 3D, per determinare la validità del punteggio si considera il primo punto di impatto sulla sagoma. La freccia è entrata nella zona Sagoma.',
    fonte: 'RS Cap. III Par. VI comma 7',
  },
  {
    id: 'L1-track-prima',
    livello: 1,
    gara: '60 Track',
    situazione:
      'Gara 60 Track, piazzola con tre picchetti sulla stessa sagoma. La prima freccia manca il bersaglio, la seconda colpisce lo Spot, la terza il Perfect.',
    domanda: 'Quanti punti registra la piazzola?',
    opzioni: ['16 punti', '8 + 12 = 20 punti', '24 punti', '28 punti'],
    corretta: 0,
    spiegazione:
      "Nel 60 Track è valido il solo punteggio della prima freccia a punto. La prima freccia a punto è la seconda scoccata, e lo Spot con la seconda freccia vale 16. La terza freccia non conta.",
    fonte: 'RGO Art. 3 commi n) e o)',
  },
  {
    id: 'L1-round-somma',
    livello: 1,
    gara: '40 Round',
    situazione:
      'Gara 40 Round. Prima freccia nello Spot, seconda freccia nel Super Spot.',
    domanda: 'Quanti punti registra la piazzola?',
    opzioni: ['12 + 12 = 24 punti', '12 + 14 = 26 punti', '10 + 12 = 22 punti', 'Solo la prima freccia: 12 punti'],
    corretta: 0,
    spiegazione:
      'Nel 40 Round si sommano i punti delle due frecce. Prima freccia: Spot 12. Seconda freccia: Super Spot 12. Totale 24.',
    fonte: 'RGO Art. 5 commi k) e l)',
  },
  {
    id: 'L1-freeshot-stessa',
    livello: 1,
    gara: '40 Free-Shot',
    situazione:
      "Gara 40 Free-Shot, piazzola con due bersagli. Un arciere, distratto, tira entrambe le frecce sulla stessa sagoma: una nello Spot e una nel Perfect.",
    domanda: 'Cosa si registra?',
    opzioni: ['15 + 20 = 35 punti', 'Solo la freccia migliore', 'Serie annullata: 0 punti', 'Solo la prima freccia'],
    corretta: 2,
    spiegazione:
      "Nel Free-Shot si scoccano due frecce su due bersagli diversi, senza sequenza obbligata. La presenza di entrambe le frecce su uno stesso bersaglio comporta l'annullamento della serie e del punteggio ottenuto.",
    fonte: 'RGO Art. 9 comma c)',
  },
  {
    id: 'L1-anelli',
    livello: 1,
    gara: '44 Fusion',
    situazione:
      "Al controllo in piazzola si nota che una delle frecce conficcate nello Spot non riporta gli anelli di numerazione progressiva sull'asta.",
    domanda: 'Quanti punti vale quella freccia?',
    opzioni: ['Vale lo Spot: la numerazione è una formalità', '0 punti: senza anelli di riferimento non acquisisce punteggio', 'Sagoma', 'Ammonizione ma punteggio valido'],
    corretta: 1,
    spiegazione:
      "Le frecce usate in gara devono riportare una numerazione progressiva con anelli ben definiti in prossimità dell'impennaggio. Le frecce senza anelli di riferimento non acquisiscono punteggio.",
    fonte: 'RS Cap. II (Le frecce) Par. I commi 4 e 5',
  },
  {
    id: 'L1-indoor-trophy',
    livello: 1,
    gara: '25 3D Round&Trophy',
    situazione:
      'Fase Trophy di un 25 3D Round&Trophy in linea: unica freccia per corsia. La freccia è nel Super Spot.',
    domanda: 'Quanti punti vale?',
    opzioni: ['12 punti', '18 punti', '22 punti', '26 punti'],
    corretta: 2,
    spiegazione:
      'Nel Trophy la freccia unica vale: Perfect 26, Super Spot 22, Spot 18, Sagoma 12.',
    fonte: 'RGO Art. 11 comma 8',
  },

  // ---------------------------------------------------------------- LIVELLO 2
  {
    id: 'L2-caduta-recupero',
    livello: 2,
    gara: '44 Fusion',
    situazione:
      "Un arciere RT, a trazione avvenuta, lascia scivolare la freccia che cade a terra a mezzo metro davanti al picchetto. Allungando il braccio la recupera senza spostare i piedi oltre il picchetto.",
    domanda: 'La freccia è da considerarsi scoccata?',
    opzioni: ['Sì: dopo la trazione ogni freccia caduta è scoccata', 'No: può recuperarla e ritirarla', 'Sì, ma può sostituirla con un\'altra', 'Decide il responsabile di piazzola'],
    corretta: 1,
    spiegazione:
      "A trazione avvenuta, se una freccia cade a terra è da considerarsi scoccata solo se l'arciere non riesce a recuperarla senza superare con i piedi il picchetto di tiro (o la linea/area di tiro). Qui la recupera regolarmente: può ritirarla.",
    fonte: 'RS Cap. III Par. V comma 5',
  },
  {
    id: 'L2-caduta-irraggiungibile',
    livello: 2,
    gara: '44 Fusion',
    situazione:
      "Stessa situazione: a trazione avvenuta la freccia cade a terra, ma finisce tre metri avanti al picchetto, in una zona raggiungibile solo superando il picchetto con i piedi.",
    domanda: 'Cosa succede?',
    opzioni: ['La freccia è considerata scoccata (0 punti)', 'L\'arciere può usarne un\'altra', 'Il responsabile la recupera e la restituisce', 'L\'arciere può recuperarla superando il picchetto'],
    corretta: 0,
    spiegazione:
      "A trazione avvenuta, la freccia caduta che non può essere recuperata senza superare con i piedi il picchetto di tiro è considerata scoccata. Diverso è il caso della freccia che cade dal rest PRIMA di iniziare la trazione.",
    fonte: 'RS Cap. III Par. V comma 5',
  },
  {
    id: 'L2-caduta-prima-trazione',
    livello: 2,
    gara: '60 Target',
    situazione:
      "Un arciere già sul picchetto sta incoccando: la freccia cade dal rest prima che abbia iniziato la trazione e rotola giù per un pendio, irraggiungibile.",
    domanda: 'Cosa può fare l\'arciere?',
    opzioni: ['Nulla: la freccia è scoccata', 'Può utilizzare un\'altra freccia', 'Deve recuperarla anche superando il picchetto', 'Perde il tiro ma non la serie'],
    corretta: 1,
    spiegazione:
      "Se la freccia cade dal supporto (rest o tappetino) prima di aver iniziato la trazione, non si applica la regola della freccia scoccata; se è irraggiungibile l'arciere potrà utilizzarne un'altra.",
    fonte: 'RS Cap. III Par. V comma 6',
  },
  {
    id: 'L2-cade-dal-rest',
    livello: 2,
    gara: '44 Fusion',
    situazione:
      'A trazione iniziata la freccia salta via dal rest e rimane appesa alla corda. L\'arciere scarica l\'arco.',
    domanda: 'Può ripetere la trazione?',
    opzioni: ['Sì', 'No: una sola trazione per freccia', 'Solo con autorizzazione del Giudice di Gara', 'Solo nelle categorie tradizionali'],
    corretta: 0,
    spiegazione:
      'A trazione iniziata, se una freccia cade dal supporto (rest o tappetino), la trazione può essere ripetuta. In ogni caso i tempi devono essere rispettati.',
    fonte: 'RS Cap. III Par. V commi 3 e 4',
  },
  {
    id: 'L2-ripetere-trazione',
    livello: 2,
    gara: '44 Fusion',
    situazione:
      'Un arciere AN arriva all\'ancoraggio, non è convinto della mira e scarica l\'arco. Ritenta, scarica di nuovo. Alla terza trazione scocca.',
    domanda: 'La sequenza è regolare?',
    opzioni: ['Sì: non ci sono limiti alle trazioni', 'No: la trazione può essere ripetuta una sola volta per freccia (salvo sicurezza)', 'Sì, purché entro il tempo', 'No: non si può mai ripetere la trazione'],
    corretta: 1,
    spiegazione:
      'La trazione può essere ripetuta una sola volta per ogni freccia, salvo il caso in cui debba essere ripetuta per evidenti motivi di sicurezza. Due scarichi e un terzo tiro non sono ammessi.',
    fonte: 'RS Cap. III Par. V comma 2',
  },
  {
    id: 'L2-frecce-in-piu',
    livello: 2,
    gara: '44 Fusion',
    situazione:
      'Piazzola con due sagome (due frecce). Un arciere, convinto che sia una piazzola da tre, scocca una terza freccia.',
    domanda: 'Qual è la conseguenza?',
    opzioni: ['Si annulla solo la terza freccia', 'Si annulla il punteggio di tutta la serie; se è già zero, ammonizione', 'Squalifica', 'Nessuna: vale il meglio delle prime due'],
    corretta: 1,
    spiegazione:
      "Ad un arciere che scocchi un numero di frecce superiore a quello consentito è annullato il punteggio di tutta la serie; nel caso di punteggio uguale a zero l'arciere verrà ammonito.",
    fonte: 'RS Cap. III Par. V comma 8',
  },
  {
    id: 'L2-binocolo-tra-tiri',
    livello: 2,
    gara: '60 Target',
    situazione:
      'Piazzola con tre sagome. Dopo aver scoccato la prima freccia, un arciere prende il binocolo per controllare dove è finita, poi tira la seconda e la terza.',
    domanda: 'Qual è la conseguenza?',
    opzioni: ['Nessuna: il binocolo è consentito', 'Annullamento del punteggio di tutta la serie', 'Annullamento della sola prima freccia', 'Ammonizione verbale'],
    corretta: 1,
    spiegazione:
      "Prima della sequenza di tiro è consentito l'uso del binocolo; l'utilizzo del binocolo tra i tiri della stessa sequenza comporta l'annullamento del punteggio di tutta la serie.",
    fonte: 'RS Cap. V Par. VIII comma d)',
  },
  {
    id: 'L2-binocolo-prima',
    livello: 2,
    gara: '60 Target',
    situazione:
      'Un arciere, superata la tabella di piazzola, osserva le tre sagome con il binocolo per un minuto, poi ripone il binocolo e scocca le tre frecce.',
    domanda: 'È regolare?',
    opzioni: ['No: il binocolo è vietato in gara', 'Sì, e il tempo del binocolo rientra nei 3 minuti della serie', 'Sì, e il tempo del binocolo non conta', 'Solo per le categorie tecnologiche'],
    corretta: 1,
    spiegazione:
      "Il binocolo è consentito prima della sequenza di tiro. Il tempo a disposizione per ogni serie di frecce è comprensivo dell'utilizzo del binocolo, e il tempo si calcola da quando l'arciere supera la tabella di piazzola.",
    fonte: 'RS Cap. V Par. VIII commi b) e d)',
  },
  {
    id: 'L2-tempo-serie',
    livello: 2,
    gara: '60 Target',
    situazione:
      'Piazzola con tre sagome, non a tempo limitato. Un arciere è lento: la squadra si chiede quanto tempo ha a disposizione e da quando si conta.',
    domanda: 'Qual è la regola?',
    opzioni: ['1 minuto per freccia, contato da ogni incocco', '3 minuti in totale, da quando supera la tabella di piazzola', '2 minuti dal picchetto', 'Nessun limite se la piazzola non è a tempo'],
    corretta: 1,
    spiegazione:
      "Ogni serie va completata in un tempo calcolato da quando l'arciere supera la tabella di piazzola: 1 minuto per una freccia, 2 per due, 3 per tre. Il tempo non si divide per freccia: l'arciere lo usa come vuole entro il massimo della sequenza.",
    fonte: 'RS Cap. V Par. VIII comma b)',
  },
  {
    id: 'L2-tempo-limitato-durata',
    livello: 2,
    gara: '60 Target',
    situazione:
      'Piazzola a tempo limitato con tre picchetti sulla stessa sagoma (tre frecce). La tabella indica 30 secondi.',
    domanda: 'Il tempo indicato è corretto?',
    opzioni: ['No: sono 25 secondi', 'Sì: 30 secondi con due o tre picchetti', 'No: 1 minuto per freccia', 'No: 20 secondi'],
    corretta: 1,
    spiegazione:
      "Nelle piazzole a tempo limitato il tempo è di 25 secondi con un solo picchetto e di 30 secondi in presenza di due o tre picchetti. Per motivi di sicurezza può essere esteso fino a un massimo di ulteriori 10 secondi.",
    fonte: 'RS Cap. V Par. IV comma a); RGO Art. 7 comma o)',
  },
  {
    id: 'L2-tempo-esenti',
    livello: 2,
    gara: '44 Fusion',
    situazione:
      "Piazzola a tempo limitato (25 secondi per 2 frecce). Un arciere Arco Nudo (AN) scocca la seconda freccia due secondi dopo lo 'Stop' del cronometrista.",
    domanda: 'Qual è la conseguenza?',
    opzioni: ['Annullamento della serie', 'Nessuna: la categoria AN è esentata dal tempo limitato', 'Annullamento della sola seconda freccia', 'Ammonizione'],
    corretta: 1,
    spiegazione:
      "Sono esentate dal rispetto dei tempi nelle piazzole a tempo limitato le classi Prime Frecce e Lupetti e le categorie AN, CO, SL, SI, FS e RI. Per un AN lo 'Stop' non ha conseguenze.",
    fonte: 'RS Cap. V Par. IV commi a) e g); RGO Art. 1 comma e)',
  },
  {
    id: 'L2-tempo-stop-rt',
    livello: 2,
    gara: '44 Fusion',
    situazione:
      "Stessa piazzola a tempo limitato. Un arciere Ricurvo Tradizionale (RT) scocca la seconda freccia dopo lo 'Stop'. La prima freccia era nel Perfect.",
    domanda: 'Qual è la conseguenza?',
    opzioni: ['Vale solo la prima freccia (14 punti)', 'Annullamento dell\'intera serie', 'Annullamento della sola seconda freccia', 'Nessuna, se il ritardo è di pochi secondi'],
    corretta: 1,
    spiegazione:
      "Qualsiasi errore nella sequenza di tiro o irregolarità compiuta in una piazzola a tempo limitato implica l'annullamento dell'intera serie di frecce, ad eccezione delle categorie AN, RI, CO, SL, SI, FS. RT non è tra le esenti.",
    fonte: 'RS Cap. V Par. IV comma g)',
  },
  {
    id: 'L2-cronometrista-info',
    livello: 2,
    gara: '60 Target',
    situazione:
      "In una piazzola a tempo limitato il cronometrista, per aiutare un compagno di squadra, dice ad alta voce 'dieci secondi!' mentre l'arciere sta tirando.",
    domanda: 'È ammesso?',
    opzioni: ['Sì, è cortesia sportiva', 'No: il cronometrista non può dare informazioni sul tempo trascorso o residuo', 'Sì, ma solo a metà tempo', 'Solo se lo chiede l\'arciere'],
    corretta: 1,
    spiegazione:
      "Il cronometrista dà il 'Via' e allo scadere lo 'Stop'; non può dare nessuna informazione del tempo trascorso o residuo. Il cronometrista deve essere un atleta partecipante alla gara della medesima piazzola.",
    fonte: 'RS Cap. V Par. IV commi b) e c)',
  },
  {
    id: 'L2-tempo-interruzione-sicurezza',
    livello: 2,
    gara: '60 Target',
    situazione:
      "Piazzola a tempo limitato. Dopo la prima freccia, un escursionista attraversa dietro il bersaglio: il tiro viene interrotto per sicurezza. Passato il pericolo, l'arciere vuole continuare.",
    domanda: 'Come si procede?',
    opzioni: ['La serie è annullata', 'Il cronometraggio si interrompe e l\'arciere prosegue con il tempo residuo', 'Si ricomincia da capo con tempo pieno', 'Vale solo la freccia già tirata'],
    corretta: 1,
    spiegazione:
      "Se l'interruzione avviene per motivi di sicurezza non imputabili all'arciere, il cronometraggio si interrompe e, risolto il problema, l'arciere può proseguire la sequenza utilizzando il tempo residuo. Se invece l'interruzione è imputabile all'arciere o a elementi fortuiti che impediscono la serie nel tempo, la serie è annullata.",
    fonte: 'RS Cap. V Par. IV comma f)',
  },
  {
    id: 'L2-picchetti-superati',
    livello: 2,
    gara: '60 Track',
    situazione:
      "Piazzola con tre picchetti in avvicinamento alla sagoma. Un arciere tira la prima freccia dal picchetto più lontano, poi per sbaglio supera il secondo e tira la seconda freccia dal terzo. Si accorge dell'errore e torna al secondo picchetto per la terza freccia.",
    domanda: 'Quali frecce sono valide?',
    opzioni: ['Tutte e tre', 'Solo la prima', 'La prima e quella dal terzo picchetto', 'Nessuna: serie annullata'],
    corretta: 1,
    spiegazione:
      "La sequenza deve essere in avvicinamento. Il superamento di uno o più picchetti prima di avere scoccato le frecce implica l'annullamento dei relativi punteggi; nel Track vengono annullate le frecce scoccate dai picchetti sbagliati. Tornando indietro non si sana l'errore: il picchetto 2 era già stato superato.",
    fonte: 'RS Cap. V Par. I comma d); Par. VIII comma h) lett. a)',
  },
  {
    id: 'L2-sequenza-abc',
    livello: 2,
    gara: '60 Target',
    situazione:
      "Piazzola con tre sagome e sequenza obbligatoria A-B-C. Un arciere tira la prima freccia sulla sagoma B (Spot), poi si accorge dell'errore, tira la seconda su A e la terza su C.",
    domanda: 'Cosa si registra?',
    opzioni: ['Tutte e tre valide', 'Valida solo C: annullati i punteggi di B e di A', 'Valide A e C, annullata B', 'Serie annullata'],
    corretta: 1,
    spiegazione:
      "Nell'errore di sequenza è annullato il punteggio tirato sul bersaglio sbagliato (B) come anche il punteggio del bersaglio sul quale si sarebbe dovuto tirare (A). La freccia su C, tirata nell'ordine corretto, resta valida.",
    fonte: 'RS Cap. V Par. VIII comma h) lett. b)',
  },
  {
    id: 'L2-sequenza-gia-colpita',
    livello: 2,
    gara: '60 Target',
    situazione:
      'Sequenza A-B-C. La prima freccia colpisce correttamente A (Super Spot). Con la seconda freccia, per errore, l\'arciere tira di nuovo su A.',
    domanda: 'Cosa succede al punteggio su A?',
    opzioni: ['Si annulla tutto su A', 'Il Super Spot ottenuto con la prima freccia resta valido', 'Vale la freccia migliore delle due', 'Serie annullata'],
    corretta: 1,
    spiegazione:
      'Se l\'errore di sequenza viene commesso tirando ad una sagoma già correttamente colpita, il punteggio precedentemente acquisito su quest\'ultima è considerato valido. La seconda freccia (quella sbagliata) non vale.',
    fonte: 'RS Cap. V Par. VIII comma h) lett. b)',
  },
  {
    id: 'L2-progressione-frecce',
    livello: 2,
    gara: '60 Target',
    situazione:
      "Un arciere si accorge di aver tirato la freccia n. 3 al posto della n. 2. Lo comunica subito al responsabile di piazzola, prima di incoccare la successiva.",
    domanda: 'Può continuare validamente la serie?',
    opzioni: ['No: la serie è annullata', 'Sì, purché la comunicazione sia immediatamente successiva all\'errore', 'Sì, ma la freccia sbagliata vale zero', 'Solo con il consenso del Giudice di Gara'],
    corretta: 1,
    spiegazione:
      "Se un arciere si accorge di aver sbagliato la progressione numerica delle frecce, può comunicarlo al responsabile di piazzola e continuare validamente la serie, purché la comunicazione sia immediatamente successiva all'errore.",
    fonte: 'RS Cap. V Par. VIII comma h) lett. c)',
  },
  {
    id: 'L2-contatto-picchetto',
    livello: 2,
    gara: '44 Fusion',
    situazione:
      "Un arciere, per evitare un ramo, si sposta di lato e tira con entrambi i piedi dietro il picchetto ma senza toccarlo.",
    domanda: 'La freccia è valida?',
    opzioni: ['Sì: i piedi sono dietro il picchetto', 'No: deve mantenere il contatto con il picchetto in tutte le fasi del tiro', 'Sì, se il responsabile di piazzola è d\'accordo', 'Solo nelle categorie tecnologiche'],
    corretta: 1,
    spiegazione:
      "Il tiro deve essere effettuato con entrambi i piedi dietro il picchetto e l'arciere deve mantenere obbligatoriamente il contatto con il picchetto in tutte le fasi del tiro. In caso di inadempienza è annullata la freccia scoccata.",
    fonte: 'RS Cap. V Par. VIII comma i)',
  },
  {
    id: 'L2-area-tiro',
    livello: 2,
    gara: '40 Free-Shot',
    situazione:
      "Piazzola con area di tiro delimitata a 'C' da bindella gialla. Un arciere tradizionale si posiziona con la punta del piede appoggiata sopra la bindella.",
    domanda: 'La posizione è regolare?',
    opzioni: ['Sì: il piede non ha oltrepassato la bindella', 'No: non deve oltrepassare né toccare i limiti dell\'area', 'Sì, purché l\'altro piede sia dentro', 'Sì, nelle aree di tiro non ci sono vincoli'],
    corretta: 1,
    spiegazione:
      "L'area di tiro è delimitata su tre lati e l'arciere deve posizionarsi obbligatoriamente all'interno delle delimitazioni senza oltrepassarle e senza toccarne i limiti. In caso di inadempienza è annullata la freccia scoccata.",
    fonte: 'RS Cap. V Par. III comma 5; Par. VIII comma i)',
  },
  {
    id: 'L2-picchetto-colore',
    livello: 2,
    gara: '44 Fusion',
    situazione:
      'Piazzola con picchetto bianco e picchetto giallo. Un arciere Compound (CO) tira dal picchetto giallo, più vicino.',
    domanda: 'È corretto?',
    opzioni: ['Sì: può scegliere il picchetto', 'No: CO/SL/SI/FS tirano dal picchetto bianco', 'Sì, se è un Master', 'No: il giallo è per Prime Frecce'],
    corretta: 1,
    spiegazione:
      "Nelle piazzole le categorie CO/SL/SI/FS tirano dal picchetto bianco; AN/RT/RM/AS/LB/RI dal picchetto giallo. Il picchetto rosso è per Prime Frecce e Lupetti. Gli Scout tirano sempre dai picchetti Master tradizionali.",
    fonte: 'RGO Art. 1 commi j), k), l), m)',
  },
  {
    id: 'L2-mobile-ferma',
    livello: 2,
    gara: '44 Fusion',
    situazione:
      "Piazzola con sagoma mobile. La sagoma completa la corsa ed esce dallo spazio delimitato; per un difetto del carrello torna indietro e si ferma di nuovo visibile. L'arciere, che non aveva ancora tirato, scocca e colpisce lo Spot.",
    domanda: 'Qual è la conseguenza?',
    opzioni: ['Vale lo Spot', 'La freccia a punto viene annullata', 'Si ripete la manovra', 'Vale Sagoma'],
    corretta: 1,
    spiegazione:
      "Per ogni freccia la possibilità di tiro si esaurisce quando la sagoma supera lo spazio delimitato. Se la sagoma torna visibile nello spazio di tiro è vietato cercare di colpirla: in caso di inadempienza sono annullate le frecce a punto. È inoltre vietato colpire sagome non in movimento.",
    fonte: 'RS Cap. V Par. V commi h) e i)',
  },
  {
    id: 'L2-mobile-ripetere',
    livello: 2,
    gara: '44 Fusion',
    situazione:
      "Piazzola con sagoma mobile. Al 'Via' l'arciere RT si accorge di non aver incoccato bene, perde tempo e la sagoma esce dalla finestra senza che abbia tirato. Chiede di ripetere la manovra.",
    domanda: 'La manovra va ripetuta?',
    opzioni: ['Sì, sempre', 'No: non si ripete se l\'arciere non ha tirato per propria responsabilità', 'Sì, una sola volta', 'Decide il manovratore'],
    corretta: 1,
    spiegazione:
      "La manovra di mobilità del bersaglio non può essere ripetuta se l'arciere non riesce a eseguire il tiro a causa di proprie responsabilità; può essere ripetuta solo per cause non dipendenti dall'arciere.",
    fonte: 'RS Cap. V Par. V comma f)',
  },
  {
    id: 'L2-mobile-pronto-carico',
    livello: 2,
    gara: '44 Fusion',
    situazione:
      "Piazzola mobile. Un arciere Compound tende l'arco, arriva all'ancoraggio e solo allora dice 'Pronto'. Un compagno protesta: il 'Pronto' va dato ad arco non teso.",
    domanda: 'Chi ha ragione?',
    opzioni: ['Il compagno: il Pronto si dà sempre ad arco non teso', 'L\'arciere CO: le categorie AN, CO, SL, SI, FS, RI possono dare il Pronto ad arco carico', 'Nessuno: nelle mobili non c\'è il Pronto', 'Il compagno, ma solo per i Master'],
    corretta: 1,
    spiegazione:
      "Nelle piazzole mobili l'arciere dà il 'Pronto' sul primo picchetto con la freccia incoccata e l'arco non teso; gli arcieri delle categorie AN, CO, SL, SI, FS, RI possono però tendere l'arco e dare il 'Pronto' ad arco carico.",
    fonte: 'RS Cap. V Par. V comma d)',
  },
  {
    id: 'L2-indoor-corsia-vicina',
    livello: 2,
    gara: '25 3D Round&Trophy',
    situazione:
      'Gara in linea indoor. Un arciere sbaglia e colpisce la sagoma della corsia accanto, nello Spot.',
    domanda: 'Qual è la conseguenza?',
    opzioni: ['Vale lo Spot', 'La freccia è annullata, senza altre conseguenze sul punteggio', 'Serie annullata', 'Annullato anche il punteggio della propria sagoma'],
    corretta: 1,
    spiegazione:
      'Nelle gare in linea, se un arciere colpisce erroneamente una sagoma di una piazzola vicina, quella freccia viene annullata, senza nessun\'altra conseguenza per il punteggio.',
    fonte: 'RS Cap. VI Par. IV comma 7; Par. V comma 4',
  },
  {
    id: 'L2-indoor-tempo',
    livello: 2,
    gara: '25 3D Round&Trophy',
    situazione:
      'Fase Round in linea: due frecce per corsia con semaforo e timer.',
    domanda: 'Quanto tempo hanno gli arcieri?',
    opzioni: ['60 secondi', '90 secondi', '120 secondi', '2 minuti + 10 secondi di ingresso'],
    corretta: 1,
    spiegazione:
      'Gli arcieri hanno a disposizione 90 secondi per scoccare 2 frecce e 60 secondi per una freccia. Il semaforo diventa arancione a 15 secondi dallo stop.',
    fonte: 'RS Cap. VI Par. IV comma 2 lett. d) ed e)',
  },
  {
    id: 'L2-indoor-rosso',
    livello: 2,
    gara: '40 3D Round&Trophy',
    situazione:
      "Gara in linea. Al segnale acustico di fine tempo il semaforo diventa rosso; un arciere, già in trazione, scocca la seconda freccia un istante dopo. È la prima volta che gli capita.",
    domanda: 'Qual è la conseguenza?',
    opzioni: ['Annullata solo la seconda freccia', 'Annullamento dell\'intero punteggio della volée e richiamo ufficiale', 'Squalifica immediata', 'Nessuna, se era già in trazione'],
    corretta: 1,
    spiegazione:
      "L'arciere che scocca una freccia prima del verde o oltre il tempo limite subisce l'annullamento dell'intero punteggio della volée. Alla prima infrazione riceve un richiamo ufficiale; alla seconda viene squalificato.",
    fonte: 'RS Cap. VI Par. IV comma 3',
  },

  // ---------------------------------------------------------------- LIVELLO 3
  {
    id: 'L3-tocca-frecce',
    livello: 3,
    gara: '44 Fusion',
    situazione:
      "Arrivati al bersaglio, un arciere impaziente estrae le proprie frecce prima che i marcatori abbiano registrato i punti di tutti.",
    domanda: 'Qual è la conseguenza?',
    opzioni: ['Nessuna, se i marcatori ricordano i punteggi', 'Annullamento del punteggio dell\'arciere inadempiente', 'Ammonizione verbale', 'Squalifica'],
    corretta: 1,
    spiegazione:
      "Né il bersaglio né le frecce devono essere toccati fino a che tutti i punti siano stati registrati. L'inosservanza implica l'annullamento del punteggio dell'arciere inadempiente.",
    fonte: 'RS Cap. III Par. VI comma 11',
  },
  {
    id: 'L3-freccia-sotto-sagoma',
    livello: 3,
    gara: '60 Target',
    situazione:
      'Una freccia è conficcata sotto la pancia della sagoma, in un punto dove non si capisce se è entrata nella figura o nella base. Le altre frecce sono ancora nel bersaglio.',
    domanda: 'Come si procede?',
    opzioni: [
      'Si assegna Sagoma per il dubbio',
      'Il responsabile registra prima tutte le altre frecce, poi muove leggermente la sagoma per verificare',
      'Si estraggono le altre frecce per vedere meglio',
      'Si chiama sempre il Giudice di Gara',
    ],
    corretta: 1,
    spiegazione:
      "Se una freccia impatta al di sotto della sagoma, il responsabile di piazzola può muovere leggermente quest'ultima per verificarne il punteggio. L'operazione avviene comunque dopo la registrazione del punteggio di tutte le altre frecce.",
    fonte: 'RS Cap. III Par. VI comma 11',
  },
  {
    id: 'L3-frecce-responsabile',
    livello: 3,
    gara: '44 Fusion',
    situazione:
      'In piazzola c\'è disaccordo sul valore di una freccia del responsabile di piazzola stesso.',
    domanda: 'Chi decide?',
    opzioni: ['Il responsabile di piazzola, come per tutte le frecce', 'I componenti della squadra a maggioranza; in caso di parità il Giudice di Gara', 'I due marcatori', 'Sempre il Giudice di Gara'],
    corretta: 1,
    spiegazione:
      'Il responsabile di piazzola attribuisce i punteggi delle frecce, eccetto le proprie, che vengono valutate a maggioranza dai componenti della squadra (in caso di parità dal Giudice di Gara).',
    fonte: 'RS Cap. III Par. IV comma 4',
  },
  {
    id: 'L3-avvicinarsi-bersaglio',
    livello: 3,
    gara: '44 Fusion',
    situazione:
      "Un arciere, dopo aver tirato, si avvicina al bersaglio superando i picchetti per vedere la propria freccia mentre due compagni devono ancora tirare. È la prima volta.",
    domanda: 'Qual è la conseguenza?',
    opzioni: ['Richiamo verbale', 'Annullamento del punteggio di quella piazzola; se recidivo, squalifica', 'Squalifica immediata', 'Nessuna, se non intralcia'],
    corretta: 1,
    spiegazione:
      'Non è consentito avvicinarsi ad un bersaglio e superare i picchetti di tiro fino a che tutti gli arcieri della squadra abbiano eseguito i tiri. Ai trasgressori è annullato il punteggio di quella piazzola; se recidivi vengono squalificati.',
    fonte: 'RS Cap. III Par. VI comma 4',
  },
  {
    id: 'L3-tende-fuori-turno',
    livello: 3,
    gara: '44 Fusion',
    situazione:
      "Mentre aspetta il proprio turno, un arciere tende l'arco con una freccia incoccata 'per provare l'ancoraggio', puntando verso il terreno.",
    domanda: 'Qual è la conseguenza?',
    opzioni: ['Ammonizione', 'Diffida', 'Squalifica', 'Annullamento della piazzola'],
    corretta: 2,
    spiegazione:
      "Un arciere, al di fuori del proprio turno di tiro, non può per nessun motivo tendere l'arco con una freccia incoccata, né tanto meno scoccarla. In caso di inadempienza l'arciere viene squalificato.",
    fonte: 'RS Cap. III Par. V comma 12',
  },
  {
    id: 'L3-prova-materiale',
    livello: 3,
    gara: '60 Target',
    situazione:
      "A un arciere RI si rompe il rest. Lo sostituisce e chiede di provare il nuovo materiale tirando qualche freccia su una sagoma dove la squadra ha già concluso i tiri.",
    domanda: 'È consentito?',
    opzioni: ['No, mai fuori turno', 'Sì: al massimo tre frecce, previa autorizzazione del responsabile di piazzola', 'Sì, senza limiti di frecce', 'Solo con autorizzazione del Giudice di Gara'],
    corretta: 1,
    spiegazione:
      "Unica eccezione al divieto di tendere l'arco fuori turno (gare outdoor): in caso di rottura di arco, corda, rest, regolatore di pressione o mirino, l'arciere può provare il materiale sostituito tirando al massimo tre frecce su un bersaglio dove ha già concluso il turno, previa autorizzazione del responsabile di piazzola.",
    fonte: 'RS Cap. III Par. V comma 12',
  },
  {
    id: 'L3-telemetro',
    livello: 3,
    gara: '44 Fusion',
    situazione:
      'Un arciere viene sorpreso a usare il telemetro dello smartphone per misurare la distanza della sagoma.',
    domanda: 'Qual è il provvedimento?',
    opzioni: ['Annullamento della piazzola', 'Ammonizione immediata; in caso di recidiva squalifica', 'Squalifica immediata', 'Diffida'],
    corretta: 1,
    spiegazione:
      "È vietato usare strumenti destinati alla rilevazione o stima delle distanze, così come trasmettere informazioni sulle distanze. In caso di violazione l'arciere è immediatamente ammonito e, in caso di recidiva, squalificato.",
    fonte: 'RS Cap. III Par. V comma 16',
  },
  {
    id: 'L3-modifica-carico',
    livello: 3,
    gara: '60 Track',
    situazione:
      "A metà gara un arciere Compound, vedendo che le distanze sono lunghe, aumenta il carico dell'arco di due giri di vite.",
    domanda: 'È consentito?',
    opzioni: ['Sì, l\'attrezzatura è dell\'arciere', 'No: non si può modificare carico o taratura in gara; solo ripristino ai valori iniziali, autorizzato, se l\'arco perde la taratura', 'Sì, previa comunicazione al responsabile', 'Solo se resta entro i 300 fps'],
    corretta: 1,
    spiegazione:
      "Non è consentito modificare il carico dell'arco né la taratura dell'arco e dei suoi accessori durante la gara. È possibile solo ripristinare i valori corretti, previa autorizzazione del responsabile di piazzola, se l'arco perde la taratura iniziale o serve manutenzione di parti danneggiate.",
    fonte: 'RS Cap. III Par. V comma 14',
  },
  {
    id: 'L3-score-discrepanza',
    livello: 3,
    gara: '44 Fusion',
    situazione:
      'A fine gara i due score cartacei di un arciere riportano totali diversi: 402 e 408.',
    domanda: 'Quale punteggio vale?',
    opzioni: ['408', '402: il più basso', 'La media, 405', 'Si ricontano le frecce con il Giudice di Gara'],
    corretta: 1,
    spiegazione:
      'Se vengono utilizzati due score cartacei e si rileva una discrepanza, viene considerato valido il punteggio più basso. Lo stesso principio vale tra score cartaceo ed elettronico.',
    fonte: 'RS Cap. III Par. VII bis',
  },
  {
    id: 'L3-score-senza-firma',
    livello: 3,
    gara: '44 Fusion',
    situazione:
      'Uno score viene consegnato senza la firma dell\'arciere e l\'errore non viene corretto al momento della consegna.',
    domanda: 'Cosa deve fare il Giudice di Gara?',
    opzioni: ['Accettarlo se i totali coincidono', 'Inserire l\'arciere in classifica con punteggio zero', 'Cercare l\'arciere per farlo firmare in premiazione', 'Escluderlo dalla classifica'],
    corretta: 1,
    spiegazione:
      'Se lo score cartaceo non viene consegnato, oppure viene consegnato privo di firma e non corretto al momento della consegna, il Giudice di Gara deve procedere all\'inserimento in classifica con punteggio uguale a zero.',
    fonte: 'RS Cap. III Par. VII comma 4',
  },
  {
    id: 'L3-parita',
    livello: 3,
    gara: '60 Target',
    situazione:
      'Due arcieri della stessa categoria chiudono a pari punteggio. A: 12 Spot, 5 Super Spot, 2 Perfect. B: 12 Spot, 4 Super Spot, 4 Perfect.',
    domanda: 'Chi vince?',
    opzioni: ['A: ha più Super Spot', 'B: ha più Perfect', 'Ex aequo', 'Chi ha tirato per primo'],
    corretta: 0,
    spiegazione:
      "A parità di punteggio vince chi ha più Spot; se persiste la parità, chi ha più Super Spot; poi chi ha più Perfect; infine ex aequo. Gli Spot sono pari (12), i Super Spot decidono: A ne ha 5 contro 4.",
    fonte: 'RS Cap. III Par. VI comma 13',
  },
  {
    id: 'L3-contestazione',
    livello: 3,
    gara: '44 Fusion',
    situazione:
      'La classifica viene pubblicata alle 15:00 e la premiazione inizia alle 15:45. Un arciere contesta il proprio punteggio alle 15:40.',
    domanda: 'La contestazione è ammissibile?',
    opzioni: ['Sì: è prima delle premiazioni', 'No: sono passati più di 30 minuti dalla pubblicazione', 'Sì, purché per iscritto', 'No: dopo la firma dello score nessun reclamo sul proprio punteggio'],
    corretta: 1,
    spiegazione:
      'Le contestazioni possono essere presentate al Giudice di Gara entro 30 minuti dalla pubblicazione della classifica e comunque prima dell\'inizio delle premiazioni. Alle 15:40 il termine dei 30 minuti è scaduto.',
    fonte: 'RS Cap. III Par. VII comma 2',
  },
  {
    id: 'L3-ricorso-piazzola',
    livello: 3,
    gara: '60 Target',
    situazione:
      "Un arciere ritiene che il picchetto bianco di una piazzola sia oltre la distanza massima. Tira comunque le sue tre frecce (male), poi a fine gara presenta ricorso scritto.",
    domanda: 'Il ricorso può essere accolto?',
    opzioni: ['Sì, se la misura è davvero irregolare', 'No: un\'irregolarità valutabile a priori va segnalata prima di tirare, chiedendo l\'intervento del Giudice di Gara', 'Sì, entro 30 minuti', 'No: i ricorsi sono solo verbali'],
    corretta: 1,
    spiegazione:
      "I ricorsi su irregolarità di allestimento valutabili a priori (prima dei tiri) possono essere presi in esame solo se l'arciere non ha tirato in quella piazzola e ha chiesto, tramite il responsabile di piazzola, l'intervento del Giudice di Gara.",
    fonte: 'RS Cap. III Par. IX comma b)',
  },
  {
    id: 'L3-diffida',
    livello: 3,
    gara: '44 Fusion',
    situazione:
      'Il Giudice di Gara commina una diffida a un arciere che ha tirato con l\'arco non rivolto verso il bersaglio.',
    domanda: 'Cosa comporta la diffida?',
    opzioni: ['Solo un richiamo verbale ufficiale', 'L\'annullamento immediato della piazzola; se non ripristina la regolarità, squalifica', 'La squalifica immediata', 'L\'annullamento della gara'],
    corretta: 1,
    spiegazione:
      "I provvedimenti sono tre: ammonizione (richiamo verbale ufficiale; se l'arciere non ripristina la regolarità si annulla la piazzola), diffida (annullamento immediato della piazzola; se non ripristina, squalifica) e squalifica (allontanamento dal campo).",
    fonte: 'RS Cap. III Par. X comma b); Par. V comma 1',
  },
  {
    id: 'L3-allenarsi-percorso',
    livello: 3,
    gara: '60 Target',
    situazione:
      "La mattina della gara, prima dell'inizio ufficiale, un arciere iscritto viene visto tirare qualche freccia alla sagoma della piazzola 1.",
    domanda: 'Qual è la conseguenza?',
    opzioni: ['Ammonizione', 'Annullamento della piazzola 1', 'Squalifica immediata e allontanamento dalla gara', 'Nessuna, se prima dell\'inizio'],
    corretta: 2,
    spiegazione:
      "Prima della gara nessun arciere può esercitarsi sul percorso allestito per la gara. La violazione comporta l'immediata squalifica e l'allontanamento dalla gara. Il riscaldamento si fa solo sull'eventuale Practice Range.",
    fonte: 'RS Cap. III Par. II commi 1 e 2; Cap. V Par. I comma i)',
  },
  {
    id: 'L3-squadra-stessa-asd',
    livello: 3,
    gara: '44 Fusion',
    situazione:
      'Quattro arcieri della stessa associazione chiedono di essere messi tutti nella stessa squadra.',
    domanda: 'È consentito?',
    opzioni: ['Sì, se sono d\'accordo', 'No: una squadra non può essere integralmente formata da arcieri della stessa associazione', 'Sì, se la squadra ha almeno sei arcieri', 'Solo per le Prime Frecce'],
    corretta: 1,
    spiegazione:
      'Le squadre sono composte da un minimo di tre a un massimo di sei arcieri e non possono essere integralmente formate da arcieri della stessa associazione. Due/tre arcieri della stessa associazione possono essere ammessi a discrezione del presidente dell\'associazione organizzatrice.',
    fonte: 'RS Cap. III Par. IV comma 8',
  },
  {
    id: 'L3-segnali-acustici',
    livello: 3,
    gara: '60 Track',
    situazione:
      'Durante la gara, per un temporale, si sentono tre segnali acustici.',
    domanda: 'Cosa significano?',
    opzioni: ['Sospensione temporanea', 'Ripresa della gara', 'Sospensione definitiva: ritorno obbligato al punto di ritrovo', 'Fine del tempo di piazzola'],
    corretta: 2,
    spiegazione:
      'Un segnale acustico indica la sospensione temporanea, un ulteriore segnale la ripresa, tre segnali la sospensione definitiva della gara con ritorno obbligato degli arcieri al punto di ritrovo.',
    fonte: 'RS Cap. V Par. I comma k)',
  },
  {
    id: 'L3-prime-frecce-altana',
    livello: 3,
    gara: '44 Fusion',
    situazione:
      'Una piazzola prevede il tiro da un palchetto sopraelevato e un\'altra è a tempo limitato. In squadra c\'è un Lupetto.',
    domanda: 'Come si comporta il Lupetto?',
    opzioni: ['Tira come tutti', 'È esentato sia dal tiro sopraelevato sia dal tempo limitato', 'Tira solo dal palchetto', 'Salta la piazzola e perde i punti'],
    corretta: 1,
    spiegazione:
      "Prime Frecce e Lupetti sono esentati dai tiri da postazioni sopraelevate e dai tiri a tempo limitato; tirano dal picchetto rosso o area rossa e, all'interno della squadra, sempre per ultimi.",
    fonte: 'RS Cap. V Par. VII commi a), c), d)',
  },
  {
    id: 'L3-minore-accompagnatore',
    livello: 3,
    gara: '44 Fusion',
    situazione:
      'Uno Scout di 15 anni si presenta in piazzola da solo: il genitore lo aspetta al ritrovo.',
    domanda: 'È regolare?',
    opzioni: ['Sì: gli Scout sono autonomi', 'No: i minori di 16 anni devono sempre avere in piazzola un accompagnatore tesserato CSAIn', 'Sì, se il responsabile di piazzola acconsente', 'No: serve un accompagnatore, anche non tesserato'],
    corretta: 1,
    spiegazione:
      'I minori di anni sedici devono sempre avere un accompagnatore in piazzola. L\'accompagnatore deve essere in regola con il tesseramento in CSAIn.',
    fonte: 'RS Cap. III Par. IV comma 7',
  },
  {
    id: 'L3-annullamento-solo-a-punto',
    livello: 3,
    gara: '44 Fusion',
    situazione:
      "In una piazzola un arciere commette un'infrazione che prevede l'annullamento delle frecce; le sue frecce in quella piazzola hanno però mancato tutte il bersaglio (0 punti).",
    domanda: 'Come si applica il provvedimento?',
    opzioni: ['Si annulla la piazzola successiva', 'Si applica solo se le frecce hanno ottenuto punti o non sono state ancora tirate: qui non c\'è nulla da annullare', 'Si toglie il punteggio della piazzola precedente', 'Si squalifica l\'arciere'],
    corretta: 1,
    spiegazione:
      "I provvedimenti che comportano l'annullamento del punteggio di una o più frecce si applicano nella piazzola in cui si è verificata l'infrazione, solo se dette frecce hanno ottenuto punti o non sono state ancora tirate. Non si trasferiscono ad altre piazzole.",
    fonte: 'RS Cap. III Par. V comma 15',
  },
  {
    id: 'L3-abbandono-temporaneo',
    livello: 3,
    gara: '60 Target',
    situazione:
      "Un arciere si allontana temporaneamente dalla gara per un valido motivo, dopo averlo comunicato al Giudice di Gara. Rientra dopo che la squadra ha completato due piazzole.",
    domanda: 'Può recuperare le due piazzole?',
    opzioni: ['Sì, a fine gara', 'No: può tornare in squadra ma non recupera le piazzole già ultimate', 'Sì, con un\'altra squadra', 'No: è escluso dalla gara'],
    corretta: 1,
    spiegazione:
      "L'arciere può abbandonare temporaneamente la gara previa comunicazione al Presidente dell'associazione o al Giudice di Gara; la squadra prosegue e l'arciere potrà ritornare, ma non potrà recuperare le piazzole già ultimate dalla squadra.",
    fonte: 'RS Cap. III Par. V comma 13',
  },
];

export function scenariPerLivello(livello) {
  return SCENARI.filter((s) => s.livello === livello);
}
