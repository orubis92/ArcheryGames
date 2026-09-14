// Profilo unico: registro delle sessioni di tutti i giochi, impostazioni,
// esportazione e importazione. Le statistiche interne di ciascun gioco
// restano nelle rispettive chiavi; qui si aggiunge il registro trasversale.
import { leggi, scrivi, rimuovi } from './storage.js';

const CHIAVE = 'profilo.v1';
const CHIAVI_GIOCHI = [
  'giudice.statistiche.v1',
  'piazzola.controllo.v1',
  'tuner.statistiche.v1',
  'lettura.statistiche.v1',
  'giudice.esami.v1',
];

const predefinito = () => ({
  nome: '',
  impostazioni: { suoni: true },
  sessioni: [], // { gioco, quando, punti, totale, etichetta, errori: [chiave, ...] }
});

export function caricaProfilo() {
  const p = leggi(CHIAVE, null);
  return p ? { ...predefinito(), ...p, impostazioni: { ...predefinito().impostazioni, ...(p.impostazioni || {}) } } : predefinito();
}

export function salvaProfilo(p) {
  scrivi(CHIAVE, p);
  return p;
}

export function impostazione(chiave) {
  return caricaProfilo().impostazioni[chiave];
}

export function aggiornaImpostazione(chiave, valore) {
  const p = caricaProfilo();
  p.impostazioni[chiave] = valore;
  return salvaProfilo(p);
}

// Registra una sessione conclusa. `errori` è una lista di chiavi (es. fonte
// normativa, causa) usata per i punti deboli.
export function registraSessioneProfilo({ gioco, punti, totale, etichetta = '', errori = [] }) {
  const p = caricaProfilo();
  p.sessioni.push({ gioco, quando: Date.now(), punti, totale, etichetta, errori: errori.slice(0, 40) });
  if (p.sessioni.length > 400) p.sessioni = p.sessioni.slice(-400);
  return salvaProfilo(p);
}

const giornoDi = (t) => Math.floor((t + new Date(t).getTimezoneOffset() * -60000) / 86400000);

// Serie di giorni consecutivi con almeno una sessione, fino a oggi (o ieri).
export function streak(p) {
  const giorni = new Set(p.sessioni.map((s) => giornoDi(s.quando)));
  if (giorni.size === 0) return 0;
  let g = giornoDi(Date.now());
  if (!giorni.has(g)) g -= 1;
  let n = 0;
  while (giorni.has(g)) {
    n += 1;
    g -= 1;
  }
  return n;
}

export function riepilogoPerGioco(p) {
  const out = {};
  for (const s of p.sessioni) {
    const r = out[s.gioco] || { sessioni: 0, punti: 0, totale: 0, migliore: 0, ultima: 0 };
    r.sessioni += 1;
    r.punti += s.punti;
    r.totale += s.totale;
    r.migliore = Math.max(r.migliore, s.totale ? s.punti / s.totale : 0);
    r.ultima = Math.max(r.ultima, s.quando);
    out[s.gioco] = r;
  }
  return out;
}

// Punti deboli: chiavi d'errore più frequenti per gioco (ultime 30 sessioni).
export function puntiDeboli(p, gioco, n = 5) {
  const conteggio = {};
  for (const s of p.sessioni.filter((x) => x.gioco === gioco).slice(-30)) {
    for (const e of s.errori) conteggio[e] = (conteggio[e] || 0) + 1;
  }
  return Object.entries(conteggio).sort((a, b) => b[1] - a[1]).slice(0, n);
}

// Esporta tutto (profilo + statistiche dei giochi) come oggetto serializzabile.
export function esporta() {
  const dati = { versione: 1, esportato: new Date().toISOString(), profilo: caricaProfilo(), giochi: {} };
  for (const k of CHIAVI_GIOCHI) {
    const v = leggi(k, null);
    if (v !== null) dati.giochi[k] = v;
  }
  return dati;
}

// Importa un oggetto esportato; sostituisce i dati correnti. Ritorna true se valido.
export function importa(dati) {
  if (!dati || dati.versione !== 1 || !dati.profilo) return false;
  salvaProfilo({ ...predefinito(), ...dati.profilo });
  for (const [k, v] of Object.entries(dati.giochi || {})) if (CHIAVI_GIOCHI.includes(k)) scrivi(k, v);
  return true;
}

export function azzeraTutto() {
  salvaProfilo(predefinito());
  for (const k of CHIAVI_GIOCHI) rimuovi(k);
}
