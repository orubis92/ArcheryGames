import { GIOCHI } from '../giochi.js';
import Icona from './Icone.jsx';

export default function Hub({ onApri }) {
  return (
    <section className="schermo hub">
      <header className="hub-testata">
        <h1>Archery Games</h1>
        <p>Quattro giochi per arcieri: regolamento, tecnica, messa a punto e occhio per le distanze.</p>
      </header>
      <div className="griglia-giochi">
        {GIOCHI.map((g) => (
          <button
            key={g.id}
            className={`card-gioco ${g.stato}`}
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
