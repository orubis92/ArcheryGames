// Effetto a schermo intero, breve, per risposta corretta o sbagliata.
// Corretta: freccia che entra nel bersaglio + raggiera di particelle.
// Sbagliata: lampo rosso ai bordi e scossa; la scossa è applicata via classe sul body.
import { useEffect, useState } from 'react';

const PARTICELLE = Array.from({ length: 14 }, (_, i) => ({
  angolo: (360 / 14) * i + (i % 2 ? 12 : -8),
  ritardo: (i % 4) * 30,
  colore: ['#e9c53a', '#d9382b', '#3f7bd9', '#f4f1ea'][i % 4],
}));

export default function Esito({ tipo, chiave }) {
  const [attivo, setAttivo] = useState(false);
  useEffect(() => {
    if (!tipo) return undefined;
    setAttivo(true);
    if (tipo === 'ko') {
      document.body.classList.add('scossa');
      setTimeout(() => document.body.classList.remove('scossa'), 450);
    }
    const t = setTimeout(() => setAttivo(false), 1100);
    return () => {
      clearTimeout(t);
      document.body.classList.remove('scossa');
    };
  }, [tipo, chiave]);

  if (!attivo || !tipo) return null;
  if (tipo === 'ko') return <div className="esito esito-ko" aria-hidden="true" />;
  return (
    <div className="esito esito-ok" aria-hidden="true">
      <div className="esito-bersaglio">
        <svg viewBox="0 0 120 120">
          {[['#f4f1ea', 56], ['#1d1d1d', 45], ['#3f7bd9', 34], ['#d9382b', 23], ['#e9c53a', 12]].map(([c, r]) => (
            <circle key={r} cx="60" cy="60" r={r} fill={c} stroke="#333" strokeWidth="1" />
          ))}
        </svg>
        <svg className="esito-freccia" viewBox="0 0 200 20">
          <line x1="0" y1="10" x2="170" y2="10" stroke="#2b2b2b" strokeWidth="4" strokeLinecap="round" />
          <polygon points="170,10 158,4 158,16" fill="#555" />
          <polygon points="0,10 14,2 26,10 14,18" fill="#d9382b" />
        </svg>
        {PARTICELLE.map((p, i) => (
          <i key={i} className="particella" style={{ '--a': `${p.angolo}deg`, '--d': `${p.ritardo}ms`, background: p.colore }} />
        ))}
      </div>
    </div>
  );
}
