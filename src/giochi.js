// Catalogo dei giochi. `stato`: 'pronto' | 'in-arrivo'
export const GIOCHI = [
  {
    id: 'giudice',
    nome: 'Il giudice',
    sottotitolo: 'Deduzione sul regolamento',
    descrizione:
      'Una situazione di gara, una decisione da prendere. Punteggi, procedure di tiro, sanzioni: secondo il Regolamento CSAIn.',
    stato: 'pronto',
    icona: 'giudice',
  },
  {
    id: 'lettura',
    nome: 'Lettura del bersaglio',
    sottotitolo: 'Analisi della rosata',
    descrizione:
      'Dodici frecce sul viso: che tipo di variabilità racconta la rosata? Solo le letture su cui gli istruttori concordano.',
    stato: 'pronto',
    icona: 'rosata',
  },
  {
    id: 'tuner',
    nome: 'Il tuner',
    sottotitolo: 'Rompicapo di messa a punto',
    descrizione:
      'Arco olimpico con qualcosa fuori posto: carta, freccia nuda, rosata. Leggi i test e trova la regolazione giusta in poche mosse.',
    stato: 'pronto',
    icona: 'tuner',
  },
  {
    id: 'piazzola',
    nome: 'Controllo piazzola',
    sottotitolo: 'Il sopralluogo del giudice',
    descrizione:
      'Gara, gruppo, picchetto e distanza misurata: la piazzola è regolare? Distanze, visibilità dello spot, ostacoli e sicurezza.',
    stato: 'pronto',
    icona: 'piazzola',
  },
];
