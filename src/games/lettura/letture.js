// "Lettura del bersaglio": rosate di 12 frecce e diagnosi.
// Arciere destrimano. Coordinate in cm su un viso da 40 cm (raggio 20), y positivo = alto.
//
// Il gioco si limita alle letture su cui l'accordo tra istruttori è largo e le
// dichiara come indizi da verificare, non come sentenze. Le correlazioni più
// discusse (diagonali, gruppi "a virgola", ecc.) sono volutamente escluse.

export const CAUSE = {
  mira: {
    nome: 'Mira o regolazione',
    breve: 'Il gruppo è stretto ma spostato: non è un errore di esecuzione, è il punto di mira (o il mirino) da correggere.',
    verifica: 'Sposta il mirino "seguendo la freccia" (gruppo a destra → mirino a destra). Prima, però, controlla che non dipenda dal vento o dalla luce.',
    accordo: 'alto',
  },
  verticale: {
    nome: 'Ancoraggio o allungo incostante',
    breve: 'Dispersione verticale con buona tenuta laterale: cambia da freccia a freccia il riferimento in altezza (ancoraggio, allungo, angolo della testa).',
    verifica: 'Guarda l\'ancoraggio da vicino per alcune frecce: contatto della mano sotto la mandibola, corda su naso e mento, allungo pieno al clicker.',
    accordo: 'alto',
  },
  orizzontale: {
    nome: 'Rilascio o pressione sull\'impugnatura incostante',
    breve: 'Dispersione orizzontale con buona tenuta verticale: la variabilità laterale nasce da rilascio, torsione dell\'impugnatura o allineamento della spalla dell\'arco.',
    verifica: 'Osserva la mano dell\'arco (torsione del polso, presa che cambia) e la mano della corda al rilascio (dita che si aprono in modo diverso, rilascio "strappato").',
    accordo: 'medio: la separazione tra rilascio e impugnatura non si legge dal bersaglio, va osservata sull\'arciere',
  },
  dueGruppi: {
    nome: 'Due riferimenti diversi',
    breve: 'Due gruppi distinti e stretti: l\'arciere alterna due ancoraggi, due punti di mira o due allunghi, ciascuno ripetibile.',
    verifica: 'Chiedi all\'arciere se "sente" due modi di ancorare o due immagini di mira; controlla anche che non stia mescolando due lotti di frecce.',
    accordo: 'alto',
  },
  flyer: {
    nome: 'Errori occasionali, gruppo di base buono',
    breve: 'Dieci frecce raggruppate e due isolate lontane: la tecnica regge, alcune frecce sono partite male (rilascio strappato, distrazione) o le aste hanno un problema.',
    verifica: 'Prima di cambiare qualcosa nella tecnica, controlla le due frecce: rettilineità, cocca, impennaggio. Poi ritira e vedi se sono sempre le stesse.',
    accordo: 'alto',
  },
  deriva: {
    nome: 'Affaticamento nel corso della serie',
    breve: 'Le prime frecce sono buone e via via il gruppo scende e si apre: la tenuta cala con la fatica (allungo che si accorcia, spalla che cede).',
    verifica: 'Confronta le prime e le ultime frecce per numero. Se il calo è sistematico, agisci su preparazione fisica, ritmo tra le frecce o libbraggio, non sulla tecnica.',
    accordo: 'medio: la deriva si legge solo con le frecce numerate e ripetuta in più serie',
  },
  ampio: {
    nome: 'Base tecnica instabile',
    breve: 'Dispersione ampia in tutte le direzioni, senza una struttura riconoscibile: nessun errore singolo domina, la ripetibilità generale è bassa.',
    verifica: 'Con un principiante non cercare "l\'errore": consolida la sequenza di tiro. Con un arciere esperto, verifica prima l\'attrezzatura (messa a punto, corda, rest).',
    accordo: 'alto',
  },
};

const gauss = () => {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
};
const scegli = (arr) => arr[Math.floor(Math.random() * arr.length)];
const limita = (p) => {
  const r = Math.hypot(p.x, p.y);
  if (r <= 19) return p;
  return { ...p, x: (p.x / r) * 19, y: (p.y / r) * 19 };
};

function nuvola(n, cx, cy, sx, sy, primo = 1) {
  return Array.from({ length: n }, (_, i) => limita({ n: primo + i, x: cx + gauss() * sx, y: cy + gauss() * sy }));
}

export const ROSATE = {
  mira() {
    const ang = Math.random() * Math.PI * 2;
    const d = 6 + Math.random() * 4;
    return { frecce: nuvola(12, Math.cos(ang) * d, Math.sin(ang) * d, 2, 2), causa: 'mira', numerate: false };
  },
  verticale() {
    return { frecce: nuvola(12, gauss() * 1, gauss() * 1, 1.7, 6), causa: 'verticale', numerate: false };
  },
  orizzontale() {
    return { frecce: nuvola(12, gauss() * 1, gauss() * 1, 6, 1.7), causa: 'orizzontale', numerate: false };
  },
  dueGruppi() {
    const ang = Math.random() * Math.PI * 2;
    const d = 4.5 + Math.random() * 1.5;
    const a = nuvola(6, Math.cos(ang) * d, Math.sin(ang) * d, 1.6, 1.6, 1);
    const b = nuvola(6, -Math.cos(ang) * d, -Math.sin(ang) * d, 1.6, 1.6, 7);
    // mescola i numeri: l'alternanza non è ordinata
    const tutte = [...a, ...b].sort(() => Math.random() - 0.5).map((p, i) => ({ ...p, n: i + 1 }));
    return { frecce: tutte, causa: 'dueGruppi', numerate: false };
  },
  flyer() {
    const base = nuvola(10, gauss(), gauss(), 2, 2);
    const isolate = Array.from({ length: 2 }, () => {
      const ang = Math.random() * Math.PI * 2;
      const d = 12 + Math.random() * 6;
      return limita({ x: Math.cos(ang) * d, y: Math.sin(ang) * d });
    });
    const tutte = [...base, ...isolate].sort(() => Math.random() - 0.5).map((p, i) => ({ ...p, n: i + 1 }));
    return { frecce: tutte, causa: 'flyer', numerate: false };
  },
  deriva() {
    const frecce = Array.from({ length: 12 }, (_, i) => {
      const k = i / 11;
      return limita({ n: i + 1, x: gauss() * (1.6 + k * 2.5), y: 3 - k * 12 + gauss() * (1.4 + k * 2) });
    });
    return { frecce, causa: 'deriva', numerate: true };
  },
  ampio() {
    return { frecce: nuvola(12, gauss(), gauss(), 6, 6), causa: 'ampio', numerate: false };
  },
};

export function generaRosata() {
  const chiave = scegli(Object.keys(ROSATE));
  const r = ROSATE[chiave]();
  const altre = Object.keys(CAUSE).filter((k) => k !== r.causa).sort(() => Math.random() - 0.5).slice(0, 3);
  const opzioni = [r.causa, ...altre].sort(() => Math.random() - 0.5);
  return { ...r, opzioni, seed: Math.random() };
}

// Punteggio in anelli (viso 40 cm, 10 zone da 2 cm)
export function valoreFreccia(p) {
  const r = Math.hypot(p.x, p.y);
  return Math.max(0, Math.min(10, 10 - Math.floor(r / 2)));
}
