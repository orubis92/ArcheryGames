import { GIOCHI } from '../giochi.js';

export default function InArrivo({ id, onEsci }) {
  const g = GIOCHI.find((x) => x.id === id);
  return (
    <section className="schermo">
      <header className="testata">
        <button className="btn-testo" onClick={onEsci}>‹ Giochi</button>
        <h1>{g?.nome ?? 'Gioco'}</h1>
      </header>
      <p className="intro">{g?.descrizione}</p>
      <p className="intro">Questo gioco non è ancora disponibile.</p>
    </section>
  );
}
