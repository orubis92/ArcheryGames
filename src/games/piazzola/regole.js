// Regole del gioco "Controllo piazzola".
// Fonti:
//  RS  = Regolamento Sportivo Tiro con l'arco 3D CSAIn rev. 6.6 (2026)
//  RGO = Regolamento Gare Outdoor 2026
//  RA  = Regolamento attuativo sicurezza campi gara e allenamento

// Distanze massime (m) dal primo picchetto, per gara e gruppo: [tradizionali (giallo), tecnologici (bianco)]
export const GARE = {
  '44 Fusion': {
    fonte: 'RGO Art. 1 comma i)',
    max: { 1: [35, 45], 2: [30, 40], 3: [25, 30], 4: [15, 20] },
    mobile: { 2: 25, 3: 20 },
  },
  '60 Track': {
    fonte: 'RGO Art. 3 comma h)',
    max: { 1: [40, 55], 2: [35, 45], 3: [25, 30], 4: [15, 20] },
  },
  '40 Round': {
    fonte: 'RGO Art. 5 comma e)',
    max: { 1: [30, 40], 2: [30, 40], 3: [25, 30], 4: [15, 20] },
    mobile: { 2: 30, 3: 20 },
  },
  '60 Target': {
    fonte: 'RGO Art. 7 comma h)',
    max: { 1: [40, 55], 2: [30, 45], 3: [25, 30], 4: [15, 20] },
  },
  '40 Free-Shot': {
    fonte: 'RGO Art. 9 comma d)',
    max: { 1: [30, 40], 2: [30, 40], 3: [30, 40], 4: [15, 20] },
  },
};

export const SPECIE_PER_GRUPPO = { 1: ['cinghiale', 'cervo'], 2: ['cinghiale', 'cervo'], 3: ['volpe'], 4: ['lepre'] };
export const NOMI_SPECIE = { cinghiale: 'Cinghiale', cervo: 'Cervo', volpe: 'Volpe', lepre: 'Lepre' };

// Catalogo delle irregolarità che il giocatore può segnalare.
export const IRREGOLARITA = {
  distanza: {
    nome: 'Distanza oltre il massimo consentito',
    fonte: (c) => `${GARE[c.gara].fonte}; RS Cap. V Par. I comma f) (tolleranza 5% solo per terreno o sicurezza)`,
  },
  rosso: {
    nome: 'Picchetto rosso (Prime Frecce/Lupetti) troppo lontano',
    fonte: () => 'RS Cap. V Par. VII comma a): non oltre il picchetto Master tradizionale e non oltre la metà della distanza massima del gruppo',
  },
  spot: {
    nome: 'Spot non completamente visibile',
    fonte: () => 'RS Cap. III Par. III comma 5: lo spot deve essere sempre completamente visibile e libero da qualsiasi ostacolo',
  },
  traiettoria: {
    nome: 'Ostacolo che limita la parabola di tiro',
    fonte: () => 'RS Cap. V Par. I comma h): gli ostacoli sulla traiettoria non devono limitare la parabola del volo né inficiare la sicurezza',
  },
  picchetto: {
    nome: 'Ostacolo troppo vicino al picchetto',
    fonte: () => "RA Cap. II Par. IV comma 3: l'ostacolo voluto deve stare in prossimità del bersaglio, non dei picchetti",
  },
  retro: {
    nome: 'Sentiero o strada dietro la sagoma senza protezione',
    fonte: () => 'RA Cap. II Par. III comma g) e Par. IV comma 2: nessun tiro verso sentieri o strade; dietro il bersaglio non devono esserci camminamenti non protetti',
  },
  dosso: {
    nome: 'Bersaglio su un dosso o presso una recinzione senza battifreccia',
    fonte: () => 'RA Cap. II Par. IV comma 5: ammesso solo con battifreccia compatti di 1 m per parte e 2 m sopra la visuale',
  },
  crinale: {
    nome: 'Tiro dall\'alto: bersaglio troppo vicino al crinale',
    fonte: () => 'RA Cap. II Par. IV comma 6: nei tiri alto/basso il bersaglio deve stare almeno 5 m sotto il crinale, misurati in verticale',
  },
};

export const LIVELLI = {
  1: { nome: 'Distanze', descrizione: 'Solo la tabella delle distanze: gara, gruppo, picchetto, tolleranza.', chiavi: ['distanza', 'rosso'] },
  2: { nome: 'Visibilità e ostacoli', descrizione: 'Spot coperto, rami sulla traiettoria, ostacoli vicino al picchetto.', chiavi: ['distanza', 'rosso', 'spot', 'traiettoria', 'picchetto'] },
  3: { nome: 'Sicurezza', descrizione: 'Sentieri, dossi, recinzioni, crinali. Anche più difetti insieme.', chiavi: Object.keys(IRREGOLARITA) },
};

const scegli = (arr) => arr[Math.floor(Math.random() * arr.length)];
const caso = (p) => Math.random() < p;
const arrotonda = (x) => Math.round(x * 2) / 2;

// Genera un caso: descrizione della piazzola + insieme delle irregolarità reali + note per la spiegazione.
export function generaCaso(livello) {
  const L = LIVELLI[livello];
  const gara = scegli(Object.keys(GARE));
  const gruppo = scegli([1, 2, 3, 4]);
  const specie = scegli(SPECIE_PER_GRUPPO[gruppo]);
  const picchetto = scegli(['giallo', 'bianco', 'bianco', 'giallo', 'rosso']);
  const [maxTrad, maxTec] = GARE[gara].max[gruppo];
  const difetti = new Set();
  const note = [];
  const scena = { specie, gruppo };

  // ---- distanza
  let limite;
  let motivoTolleranza = false;
  if (picchetto === 'rosso') {
    // il rosso non può superare né il picchetto giallo né metà del massimo tradizionale
    scena.distanzaGiallo = arrotonda(maxTrad * (0.7 + Math.random() * 0.3));
    limite = Math.min(scena.distanzaGiallo, maxTrad / 2);
  } else {
    limite = picchetto === 'giallo' ? maxTrad : maxTec;
    if (livello >= 2 && caso(0.25)) motivoTolleranza = true; // "picchetto arretrato per conformazione del terreno"
  }
  const irregolareDistanza = caso(0.45);
  let distanza;
  if (irregolareDistanza) {
    const extra = motivoTolleranza ? 0.06 + Math.random() * 0.12 : 0.03 + Math.random() * 0.2;
    distanza = arrotonda(limite * (1 + extra));
    if (livello === 1 && distanza - limite < 1) distanza = limite + 1;
  } else if (motivoTolleranza && caso(0.6)) {
    distanza = arrotonda(limite * (1 + Math.random() * 0.045)); // entro il 5%, giustificato
  } else {
    distanza = arrotonda(limite * (0.55 + Math.random() * 0.45));
  }
  const tolleranza = motivoTolleranza ? limite * 1.05 : limite;
  if (distanza > tolleranza + 1e-9) difetti.add(picchetto === 'rosso' ? 'rosso' : 'distanza');
  scena.distanza = distanza;
  scena.picchetto = picchetto;
  scena.gara = gara;
  scena.motivoTolleranza = motivoTolleranza;
  scena.limite = limite;
  scena.maxTrad = maxTrad;
  scena.maxTec = maxTec;

  // ---- visibilità e ostacoli (livello ≥ 2)
  if (livello >= 2) {
    const r = Math.random();
    if (r < 0.2) {
      scena.copertura = 'spot';
      difetti.add('spot');
    } else if (r < 0.4) {
      scena.copertura = 'sagoma'; // parzialmente nascosta ma spot libero: regolare
      note.push('La sagoma è parzialmente nascosta dalla vegetazione, ma lo spot è completamente visibile: è ammesso (RS Cap. III Par. III commi 4 e 5).');
    }
    const o = Math.random();
    if (o < 0.18) {
      scena.ramo = 'traiettoria';
      difetti.add('traiettoria');
    } else if (o < 0.32) {
      scena.ramo = 'alto'; // ramo alto, fuori dalla parabola: regolare
      note.push('Il ramo è ben sopra la traiettoria e non limita la parabola: regolare (RS Cap. V Par. I comma h).');
    }
    const p = Math.random();
    if (p < 0.18) {
      scena.ostacolo = 'picchetto';
      difetti.add('picchetto');
    } else if (p < 0.34) {
      scena.ostacolo = 'bersaglio'; // ostacolo voluto vicino al bersaglio: regolare
      note.push("L'ostacolo che rende difficile il tiro è in prossimità del bersaglio, non del picchetto: è la collocazione prevista (RA Cap. II Par. IV comma 3).");
    }
  }

  // ---- sicurezza (livello 3)
  if (livello >= 3) {
    const s = Math.random();
    if (s < 0.18) {
      scena.retro = 'sentiero';
      difetti.add('retro');
    } else if (s < 0.36) {
      scena.retro = 'terrapieno';
      note.push('Dietro la sagoma c\'è un terrapieno naturale che trattiene le frecce: è la soluzione raccomandata (RS Cap. V Par. VIII comma j).');
    } else if (s < 0.5) {
      scena.retro = 'sentiero-protetto';
      note.push('Il sentiero dietro la sagoma è interdetto con nastro e protetto da battifreccia: regolare (RA Cap. II Par. III comma c; Par. IV comma 2).');
    }
    const d = Math.random();
    if (d < 0.16) {
      scena.dosso = 'nudo';
      difetti.add('dosso');
    } else if (d < 0.3) {
      scena.dosso = 'protetto';
      note.push('Il bersaglio è su un dosso, ma dietro ci sono battifreccia compatti che superano la visuale di 1 m per parte e 2 m in altezza: regolare (RA Cap. II Par. IV comma 5).');
    }
    if (!scena.dosso && caso(0.22)) {
      scena.altana = true;
      scena.crinaleMetri = scegli([2, 3, 4, 5, 6, 8]);
      if (scena.crinaleMetri < 5) difetti.add('crinale');
      else note.push(`Tiro dall'alto: il bersaglio è ${scena.crinaleMetri} m sotto il crinale, almeno i 5 m richiesti (RA Cap. II Par. IV comma 6).`);
    }
  }

  return { livello, scena, difetti: [...difetti], note };
}

// Spiegazione della distanza, sempre mostrata.
export function spiegaDistanza(scena) {
  const g = GARE[scena.gara];
  const trad = scena.maxTrad;
  const tec = scena.maxTec;
  const righe = [];
  righe.push(`${scena.gara}, gruppo ${scena.gruppo}: massimo ${trad} m dal picchetto giallo (tradizionali) e ${tec} m dal bianco (tecnologici) — ${g.fonte}.`);
  if (scena.picchetto === 'rosso') {
    righe.push(
      `Picchetto rosso: non oltre il picchetto Master tradizionale (qui a ${scena.distanzaGiallo} m) e non oltre la metà del massimo del gruppo (${trad / 2} m): limite ${scena.limite} m. Qui è a ${scena.distanza} m.`,
    );
  } else {
    righe.push(`Limite per il picchetto ${scena.picchetto}: ${scena.limite} m. Qui è a ${scena.distanza} m.`);
    if (scena.motivoTolleranza) {
      righe.push(`La tabella segnala che il picchetto è stato arretrato per la conformazione del terreno: tolleranza massima 5%, cioè fino a ${arrotonda(scena.limite * 1.05)} m (RS Cap. V Par. I comma f).`);
    }
  }
  return righe;
}

// Valuta la risposta: insieme di chiavi scelte (vuoto = "regolare").
export function valuta(caso, scelte) {
  const reali = new Set(caso.difetti);
  const date = new Set(scelte);
  const esatto = reali.size === date.size && [...reali].every((k) => date.has(k));
  if (esatto) return { punti: 10, esito: 'esatto' };
  const regolareReale = reali.size === 0;
  const regolareDato = date.size === 0;
  if (regolareReale !== regolareDato) return { punti: 0, esito: regolareReale ? 'falso-allarme' : 'mancato' };
  // entrambi irregolari ma motivi diversi/incompleti
  const azzeccate = [...reali].filter((k) => date.has(k)).length;
  return { punti: azzeccate > 0 ? 5 : 2, esito: 'parziale' };
}
