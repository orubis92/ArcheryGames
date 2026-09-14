// Persistenza locale minimale (localStorage), con fallback in memoria.
const memoria = {};

export function leggi(chiave, predefinito) {
  try {
    const v = localStorage.getItem(chiave);
    return v === null ? predefinito : JSON.parse(v);
  } catch {
    return chiave in memoria ? memoria[chiave] : predefinito;
  }
}

export function scrivi(chiave, valore) {
  memoria[chiave] = valore;
  try {
    localStorage.setItem(chiave, JSON.stringify(valore));
  } catch {
    /* modalità privata o quota esaurita: si resta in memoria */
  }
}
