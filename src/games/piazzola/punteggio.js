// Punteggio della stima: si valuta lo scarto relativo, perché sbagliare di 2 m
// a 12 m è molto più grave che sbagliare di 2 m a 40 m.
export const FASCE = [
  { max: 0.03, punti: 10, etichetta: 'Perfetta' },
  { max: 0.06, punti: 8, etichetta: 'Ottima' },
  { max: 0.1, punti: 6, etichetta: 'Buona' },
  { max: 0.15, punti: 3, etichetta: 'Approssimativa' },
  { max: Infinity, punti: 0, etichetta: 'Fuori' },
];

export function valuta(stima, reale) {
  const scarto = stima - reale;
  const rel = Math.abs(scarto) / reale;
  const fascia = FASCE.find((f) => rel <= f.max);
  return { scarto, rel, punti: fascia.punti, etichetta: fascia.etichetta };
}

// Distanze massime (m) dal primo picchetto per gruppo, 44 Fusion (RGO Art. 1 comma i)
export const MAX_44_FUSION = {
  1: { tecnologici: 45, tradizionali: 35 },
  2: { tecnologici: 40, tradizionali: 30 },
  3: { tecnologici: 30, tradizionali: 25 },
  4: { tecnologici: 20, tradizionali: 15 },
};
