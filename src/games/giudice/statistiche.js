import { leggi, scrivi } from '../../lib/storage.js';

const CHIAVE = 'giudice.statistiche.v1';

// Struttura: { domande: { [id]: { giuste, sbagliate } }, livelli: { [livello]: { migliore, sessioni } } }
export function caricaStatistiche() {
  return leggi(CHIAVE, { domande: {}, livelli: {} });
}

export function registraRisposta(id, corretta) {
  const s = caricaStatistiche();
  const d = s.domande[id] || { giuste: 0, sbagliate: 0 };
  if (corretta) d.giuste += 1;
  else d.sbagliate += 1;
  s.domande[id] = d;
  scrivi(CHIAVE, s);
  return s;
}

export function registraSessione(livello, punteggio, totale) {
  const s = caricaStatistiche();
  const l = s.livelli[livello] || { migliore: 0, sessioni: 0, totale };
  l.sessioni += 1;
  l.totale = totale;
  if (punteggio > l.migliore) l.migliore = punteggio;
  s.livelli[livello] = l;
  scrivi(CHIAVE, s);
  return s;
}

export function azzeraStatistiche() {
  scrivi(CHIAVE, { domande: {}, livelli: {} });
}

// Ordina gli scenari privilegiando quelli mai visti o sbagliati più spesso,
// con una componente casuale per non rendere la sequenza prevedibile.
export function selezionaScenari(scenari, n, stats) {
  const peso = (sc) => {
    const d = stats.domande[sc.id];
    if (!d) return 3; // mai visto
    const tot = d.giuste + d.sbagliate;
    return 1 + (d.sbagliate / tot) * 2; // da 1 (sempre giusto) a 3 (sempre sbagliato)
  };
  const conPeso = scenari.map((sc) => ({ sc, k: Math.random() * peso(sc) }));
  conPeso.sort((a, b) => b.k - a.k);
  return conPeso.slice(0, n).map((x) => x.sc);
}
