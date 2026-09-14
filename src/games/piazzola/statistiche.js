import { leggi, scrivi } from '../../lib/storage.js';

const CHIAVE = 'piazzola.statistiche.v1';

// { stime: [{ id, stima, reale, quando }], migliore: { punti, totale } }
export function carica() {
  return leggi(CHIAVE, { stime: [], migliore: null });
}

export function registraStima(id, stima, reale) {
  const s = carica();
  s.stime.push({ id, stima, reale, quando: Date.now() });
  if (s.stime.length > 500) s.stime = s.stime.slice(-500);
  scrivi(CHIAVE, s);
  return s;
}

export function registraSessione(punti, totale) {
  const s = carica();
  if (!s.migliore || punti / totale > s.migliore.punti / s.migliore.totale) s.migliore = { punti, totale };
  scrivi(CHIAVE, s);
  return s;
}

export function azzera() {
  scrivi(CHIAVE, { stime: [], migliore: null });
}

// Tendenza: scarto relativo medio con segno (positivo = sovrastimi).
export function tendenza(s, ultime = 30) {
  const st = s.stime.slice(-ultime);
  if (st.length < 3) return null;
  const rel = st.map((x) => (x.stima - x.reale) / x.reale);
  const media = rel.reduce((a, b) => a + b, 0) / rel.length;
  const assoluta = st.map((x) => Math.abs(x.stima - x.reale)).reduce((a, b) => a + b, 0) / st.length;
  return { n: st.length, media, assoluta };
}
