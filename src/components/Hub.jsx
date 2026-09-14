import { GIOCHI } from '../giochi.js';
import Icona from './Icone.jsx';

function Intestazione() {
  return (
    <div className="hero" aria-hidden="true">
      <svg viewBox="0 0 320 160" className="hero-svg">
        <defs>
          <radialGradient id="hero-luce" cx="50%" cy="40%" r="60%">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.55" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="320" height="160" fill="url(#hero-luce)" />
        {/* alberi sullo sfondo */}
        {[20, 55, 250, 290].map((x, i) => (
          <g key={x} className="hero-albero" style={{ animationDelay: `${i * 0.4}s` }}>
            <rect x={x - 3} y="70" width="6" height="70" fill="#5c4a33" />
            <circle cx={x} cy="66" r={22 + (i % 2) * 6} fill="#2f5a43" opacity="0.85" />
          </g>
        ))}
        {/* bersaglio */}
        <g className="hero-bersaglio">
          {[['#f4f1ea', 44], ['#1d1d1d', 35], ['#3f7bd9', 26], ['#d9382b', 17], ['#e9c53a', 8]].map(([c, r]) => (
            <circle key={r} cx="160" cy="80" r={r} fill={c} stroke="#333" strokeWidth="1" />
          ))}
          <circle className="hero-anello" cx="160" cy="80" r="8" fill="none" stroke="#e9c53a" strokeWidth="3" />
        </g>
        {/* freccia che arriva */}
        <g className="hero-freccia">
          <line x1="0" y1="80" x2="120" y2="80" stroke="#2b2b2b" strokeWidth="3.5" strokeLinecap="round" />
          <polygon points="120,80 110,75 110,85" fill="#555" />
          <polygon points="0,80 12,73 22,80 12,87" fill="#d9382b" />
        </g>
      </svg>
    </div>
  );
}

export default function Hub({ onApri }) {
  return (
    <section className="schermo hub">
      <Intestazione />
      <header className="hub-testata">
        <button className="btn-profilo" onClick={() => onApri('profilo')} aria-label="Profilo e progressi">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          Profilo
        </button>
        <h1>Archery Games</h1>
        <p>Quattro giochi per arcieri: regolamento, tecnica, messa a punto e sopralluogo delle piazzole.</p>
      </header>
      <div className="griglia-giochi">
        {GIOCHI.map((g, i) => (
          <button
            key={g.id}
            className={`card-gioco ${g.stato}`}
            style={{ animationDelay: `${0.15 + i * 0.09}s` }}
            onClick={() => onApri(g.id)}
            aria-label={`${g.nome}${g.stato === 'in-arrivo' ? ' (in arrivo)' : ''}`}
          >
            <span className="icona"><Icona nome={g.icona} /></span>
            <span className="testo">
              <strong>{g.nome}</strong>
              <em>{g.sottotitolo}</em>
              <small>{g.descrizione}</small>
            </span>
            {g.stato === 'in-arrivo' && <span className="etichetta">In arrivo</span>}
          </button>
        ))}
      </div>
    </section>
  );
}
