// Modello del gioco "Il tuner" — arco olimpico, arciere destrimano.
//
// È un modello didattico volutamente semplificato. Ogni regolazione è a scatti
// (interi) rispetto al valore corretto (0). Le regole sono tutte in questo
// file, così si correggono senza toccare l'interfaccia.
//
// Asse orizzontale (rigidità dinamica R): positivo = freccia troppo rigida.
//   spine    +1 rigida       peso 1
//   punta    +1 più pesante  peso -0.5   (la punta pesante rende la freccia più debole)
//   bottone  +1 più duro     peso +0.5
//   brace    +1 più alta     peso +0.5   (corsa utile più corta → la freccia si comporta più rigida)
// Asse verticale (V): nocking +1 alto → strappo alto in carta, nuda bassa.
// Brace fuori intervallo (|brace| ≥ 1): arco rumoroso, rosata più larga,
//   senza indicazione di direzione: va dedotta dagli altri test.

export const PARAMETRI = {
  spine: {
    nome: 'Spine',
    unita: 'gruppo di spine',
    meno: 'Aste più deboli',
    piu: 'Aste più rigide',
    pesoR: 1,
    pesoV: 0,
  },
  punta: {
    nome: 'Punta',
    unita: '~20 grani',
    meno: 'Punta più leggera',
    piu: 'Punta più pesante',
    pesoR: -0.5,
    pesoV: 0,
  },
  brace: {
    nome: 'Brace height',
    unita: '~3 giri di corda',
    meno: 'Abbassa la brace',
    piu: 'Alza la brace',
    pesoR: 0.5,
    pesoV: 0,
  },
  bottone: {
    nome: 'Bottone',
    unita: 'un giro di molla',
    meno: 'Bottone più morbido',
    piu: 'Bottone più duro',
    pesoR: 0.5,
    pesoV: 0,
  },
  nocking: {
    nome: 'Nocking point',
    unita: '~1 mm',
    meno: 'Abbassa il nocking point',
    piu: 'Alza il nocking point',
    pesoR: 0,
    pesoV: 1,
  },
};

export const LIVELLI = {
  1: { nome: 'Apprendista', descrizione: 'Un solo parametro fuori posto, 4 regolazioni.', fuori: 1, mosse: 4, candidati: ['spine', 'nocking', 'punta'] },
  2: { nome: 'Arciere', descrizione: 'Due parametri fuori posto, 6 regolazioni.', fuori: 2, mosse: 6, candidati: ['spine', 'nocking', 'punta', 'bottone', 'brace'] },
  3: { nome: 'Tecnico', descrizione: 'Tre parametri fuori posto, anche la brace, 8 regolazioni.', fuori: 3, mosse: 8, candidati: ['spine', 'nocking', 'punta', 'bottone', 'brace'], braceObbligata: true },
};

export const LIMITE = 2; // ogni parametro va da -2 a +2

// Stato: { spine, punta, brace, bottone, nocking } interi in [-LIMITE, LIMITE]
export function statoCasuale(livello) {
  const L = LIVELLI[livello];
  const stato = { spine: 0, punta: 0, brace: 0, bottone: 0, nocking: 0 };
  let scelti = [];
  if (L.braceObbligata) scelti.push('brace');
  const resto = L.candidati.filter((k) => !scelti.includes(k));
  while (scelti.length < L.fuori && resto.length) {
    const i = Math.floor(Math.random() * resto.length);
    scelti.push(resto.splice(i, 1)[0]);
  }
  for (const k of scelti) {
    const segno = Math.random() < 0.5 ? -1 : 1;
    const amp = livello === 3 && Math.random() < 0.4 ? 2 : 1;
    stato[k] = segno * amp;
  }
  // se per combinazione R risultasse 0 con parametri fuori posto, va comunque bene: il gioco è "far tornare i test puliti"
  return stato;
}

export function assi(stato) {
  let R = 0;
  let V = 0;
  for (const [k, p] of Object.entries(PARAMETRI)) {
    R += stato[k] * p.pesoR;
    V += stato[k] * p.pesoV;
  }
  return { R, V, rumore: Math.abs(stato.brace) };
}

export function messoAPunto(stato) {
  const { R, V, rumore } = assi(stato);
  return Math.abs(R) < 0.01 && Math.abs(V) < 0.01 && rumore === 0;
}

// Un po' di rumore casuale sulle letture, per non renderle un oracolo perfetto.
function disturbo(scala) {
  return (Math.random() - 0.5) * scala;
}

function intensita(x) {
  const a = Math.abs(x);
  if (a < 0.26) return 'nullo';
  if (a < 0.76) return 'leggero';
  if (a < 1.26) return 'netto';
  return 'forte';
}

export const TEST = {
  carta: {
    nome: 'Carta strappata',
    descrizione: 'Tiri una freccia impennata attraverso un foglio a 2 m.',
    esegui(stato) {
      const { R, V } = assi(stato);
      const oriz = R + disturbo(0.2);
      const vert = V + disturbo(0.2);
      const iO = intensita(oriz);
      const iV = intensita(vert);
      const parti = [];
      if (iO !== 'nullo') parti.push(`strappo ${iO} verso ${oriz > 0 ? 'sinistra' : 'destra'}`);
      if (iV !== 'nullo') parti.push(`strappo ${iV} verso ${vert > 0 ? "l'alto" : 'il basso'}`);
      const testo = parti.length ? parti.join(', ') + '.' : 'Foro pulito: solo il buco della punta e le tre alette.';
      return { tipo: 'carta', oriz, vert, testo };
    },
  },
  nuda: {
    nome: 'Freccia nuda',
    descrizione: 'Tre frecce impennate e una nuda a 18 m.',
    esegui(stato) {
      const { R, V } = assi(stato);
      // spostamento della nuda rispetto al gruppo delle impennate, in "cm" simbolici
      const dx = -(R + disturbo(0.2)) * 10; // rigida → nuda a sinistra
      const dy = (V + disturbo(0.2)) * 10; // nocking alto → nuda bassa (y verso il basso)
      const iO = intensita(R);
      const iV = intensita(V);
      const parti = [];
      if (iO !== 'nullo') parti.push(`nuda ${iO === 'leggero' ? 'un po\'' : 'chiaramente'} a ${R > 0 ? 'sinistra' : 'destra'} delle impennate`);
      if (iV !== 'nullo') parti.push(`nuda ${iV === 'leggero' ? 'un po\'' : 'chiaramente'} ${V > 0 ? 'più bassa' : 'più alta'}`);
      const testo = parti.length ? parti.join(', ') + '.' : 'La nuda è nel gruppo delle impennate.';
      return { tipo: 'nuda', dx, dy, testo };
    },
  },
  rosata: {
    nome: 'Rosata a 30 m',
    descrizione: 'Dodici frecce impennate a 30 m: ampiezza del gruppo e comportamento dell\'arco.',
    esegui(stato) {
      const { R, V, rumore } = assi(stato);
      const base = 1;
      const raggio = base + 0.6 * Math.abs(R) + 0.4 * Math.abs(V) + 0.9 * rumore;
      const parti = [];
      if (rumore >= 1) parti.push(rumore >= 2 ? "l'arco è molto rumoroso e vibra al rilascio" : "l'arco è rumoroso al rilascio");
      if (raggio < 1.3) parti.push('gruppo stretto');
      else if (raggio < 2.2) parti.push('gruppo discreto');
      else parti.push('gruppo largo');
      const dxG = -R * 4;
      const dyG = V * 4;
      return { tipo: 'rosata', raggio, dx: dxG, dy: dyG, rumore, testo: parti.join('; ') + '.' };
    },
  },
};
