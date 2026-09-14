// Pagina di servizio (non collegata dall'hub): #/sagome
// Mostra tutte le sagome con le zone simboliche, per controllare i disegni.
import Bersaglio from './Bersaglio.jsx';
import { SAGOME } from './sagome.js';

const ZONE = ['perfect', 'superspot', 'spot', 'linea-tocca', 'linea-vicina', 'sagoma', 'corna', 'base'];

export default function GalleriaSagome({ onEsci }) {
  return (
    <section className="schermo">
      <header className="testata">
        <button className="btn-testo" onClick={onEsci}>‹ Giochi</button>
        <h1>Galleria sagome</h1>
      </header>
      <p className="intro">Controllo visivo delle silhouette e delle posizioni simboliche della freccia usate negli scenari.</p>
      {Object.keys(SAGOME).map((k) => (
        <div key={k} className="galleria-specie">
          <h2>{SAGOME[k].nome}</h2>
          <div className="galleria">
            {ZONE.filter((z) => z !== 'corna' || SAGOME[k].corna).map((z) => (
              <Bersaglio key={z} bersaglio={{ sagoma: k, zona: z, nota: z }} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
