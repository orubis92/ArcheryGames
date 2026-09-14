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
      'Dodici frecce sul bersaglio: diagnostica l\'errore tecnico tra le cause plausibili.',
    stato: 'in-arrivo',
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
    nome: 'Piazzola 3D',
    sottotitolo: 'Stima delle distanze',
    descrizione:
      'Una sagoma nel bosco vista dal picchetto: quanto è lontana? Punteggio in base allo scarto, archivio del vostro campo.',
    stato: 'pronto',
    icona: 'piazzola',
  },
];
