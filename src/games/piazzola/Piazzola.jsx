import { useEffect, useState } from 'react';
import { valuta, MAX_44_FUSION } from './punteggio.js';
import { carica, registraStima, registraSessione, azzera, tendenza } from './statistiche.js';

const PER_SESSIONE = 10;
const MIN = 5;
const MAX = 60;
const PASSO = 0.5;

function mescola(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Piazzola({ onEsci }) {
  const [archivio, setArchivio] = useState(null); // null = caricamento, [] = vuoto
  const [errore, setErrore] = useState(null);
  const [stats, setStats] = useState(carica);
  const [sessione, setSessione] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}piazzole/piazzole.json`, { cache: 'no-cache' })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((v) => setArchivio(Array.isArray(v) ? v : []))
      .catch((e) => {
        setErrore(e.message);
        setArchivio([]);
      });
  }, []);

  const avvia = (soloReali) => {
    const base = soloReali ? archivio.filter((p) => !p.esempio) : archivio;
    const scelte = mescola(base).slice(0, PER_SESSIONE);
    setSessione({ piazzole: scelte, indice: 0, risposte: [] });
  };

  if (!sessione) {
    return (
      <Menu
        archivio={archivio}
        errore={errore}
        stats={stats}
        onAvvia={avvia}
        onEsci={onEsci}
        onAzzera={() => {
          azzera();
          setStats(carica());
        }}
      />
    );
  }

  const { piazzole, indice, risposte } = sessione;
  if (indice >= piazzole.length) {
    return (
      <Riepilogo
        sessione={sessione}
        onRipeti={() => avvia(false)}
        onMenu={() => {
          setStats(carica());
          setSessione(null);
        }}
      />
    );
  }

  const p = piazzole[indice];
  const rispondi = (stima) => {
    const v = valuta(stima, p.distanza);
    setStats(registraStima(p.id, stima, p.distanza));
    setSessione({ ...sessione, risposte: [...risposte, { id: p.id, stima, ...v }] });
  };
  const avanti = () => {
    const prossimo = indice + 1;
    if (prossimo >= piazzole.length) {
      const punti = risposte.reduce((a, r) => a + r.punti, 0);
      registraSessione(punti, piazzole.length * 10);
    }
    setSessione({ ...sessione, indice: prossimo });
  };

  return (
    <Stima
      piazzola={p}
      numero={indice + 1}
      totale={piazzole.length}
      risposta={risposte[indice]}
      onRispondi={rispondi}
      onAvanti={avanti}
      onEsci={() => setSessione(null)}
    />
  );
}

function Menu({ archivio, errore, stats, onAvvia, onEsci, onAzzera }) {
  const reali = archivio ? archivio.filter((p) => !p.esempio).length : 0;
  const esempi = archivio ? archivio.length - reali : 0;
  const t = tendenza(stats);
  return (
    <section className="schermo">
      <header className="testata">
        <button className="btn-testo" onClick={onEsci}>‹ Giochi</button>
        <h1>Piazzola 3D</h1>
      </header>
      <p className="intro">
        Una sagoma nel bosco, vista dal picchetto: quanto è lontana? Dieci piazzole per sessione, punteggio in base
        allo scarto. Nel 3D la distanza non è nota e stimarla è metà del gioco.
      </p>
      {archivio === null && <p className="intro">Caricamento dell'archivio…</p>}
      {errore && <p className="avviso">Archivio non raggiungibile ({errore}).</p>}
      {archivio && archivio.length === 0 && !errore && (
        <p className="avviso">L'archivio è vuoto: aggiungi le foto in <code>public/piazzole/</code> (vedi README).</p>
      )}
      {archivio && archivio.length > 0 && (
        <div className="lista-livelli">
          <button className="card-livello" onClick={() => onAvvia(false)}>
            <span className="numero">▶</span>
            <span className="testo">
              <strong>Gioca</strong>
              <small>{archivio.length} piazzole in archivio{esempi > 0 ? ` (${esempi} di esempio)` : ''}</small>
              {stats.migliore && (
                <small className="meta">miglior sessione {stats.migliore.punti}/{stats.migliore.totale}</small>
              )}
            </span>
          </button>
          {reali > 0 && esempi > 0 && (
            <button className="card-livello misto" onClick={() => onAvvia(true)}>
              <span className="numero">📷</span>
              <span className="testo">
                <strong>Solo foto reali</strong>
                <small>{reali} piazzole fotografate al campo</small>
              </span>
            </button>
          )}
        </div>
      )}
      {t && (
        <div className="tendenza">
          <h3>La tua tendenza (ultime {t.n} stime)</h3>
          <p>
            Scarto medio {t.assoluta.toFixed(1)} m.{' '}
            {Math.abs(t.media) < 0.02
              ? 'Nessuna tendenza sistematica: bene.'
              : t.media > 0
                ? `Tendi a sovrastimare (in media +${(t.media * 100).toFixed(0)}%): le sagome sono più vicine di quanto ti sembrano.`
                : `Tendi a sottostimare (in media ${(t.media * 100).toFixed(0)}%): le sagome sono più lontane di quanto ti sembrano.`}
          </p>
        </div>
      )}
      <p className="nota-fonti">
        Punteggio: 10 se lo scarto è entro il 3% della distanza reale, 8 entro il 6%, 6 entro il 10%, 3 entro il 15%,
        altrimenti 0.
      </p>
      <button className="btn-testo piccolo" onClick={onAzzera}>Azzera i progressi</button>
    </section>
  );
}

function Stima({ piazzola, numero, totale, risposta, onRispondi, onAvanti, onEsci }) {
  // partenza casuale per non ancorare sempre allo stesso numero
  const iniziale = () => 12 + Math.round(Math.random() * 46) * PASSO;
  const [valore, setValore] = useState(iniziale);
  useEffect(() => {
    setValore(iniziale());
    window.scrollTo({ top: 0 });
  }, [piazzola.id]);

  const risposto = Boolean(risposta);
  const cambia = (v) => setValore(Math.min(MAX, Math.max(MIN, Math.round(v / PASSO) * PASSO)));
  const src = `${import.meta.env.BASE_URL}${piazzola.foto.replace(/^\//, '')}`;
  const max = MAX_44_FUSION[piazzola.gruppo];

  return (
    <section className="schermo domanda">
      <header className="testata">
        <button className="btn-testo" onClick={onEsci}>‹ Esci</button>
        <span className="progresso">{numero} / {totale}</span>
        {piazzola.gruppo && <span className="badge">Gruppo {piazzola.gruppo}</span>}
      </header>
      <div className="barra"><i style={{ width: `${((numero - 1) / totale) * 100}%` }} /></div>

      <article className="scenario piazzola">
        <figure className="foto">
          <a href={src} target="_blank" rel="noreferrer" title="Apri l'immagine a schermo intero">
            <img src={src} alt={`Piazzola: ${piazzola.sagoma || 'sagoma'}`} loading="eager" />
          </a>
          <figcaption>
            {piazzola.sagoma && <span>{piazzola.sagoma}</span>}
            {piazzola.esempio ? <span className="nota">Scena sintetica di esempio</span> : piazzola.campo && <span>{piazzola.campo}</span>}
          </figcaption>
        </figure>

        {!risposto ? (
          <div className="stima">
            <h2>Quanto è distante la sagoma?</h2>
            <div className="valore">
              <button className="btn-passo" onClick={() => cambia(valore - 1)} aria-label="meno un metro">−1</button>
              <button className="btn-passo piccolo" onClick={() => cambia(valore - PASSO)} aria-label="meno mezzo metro">−½</button>
              <output>{valore.toFixed(1).replace('.0', '')}<small> m</small></output>
              <button className="btn-passo piccolo" onClick={() => cambia(valore + PASSO)} aria-label="più mezzo metro">+½</button>
              <button className="btn-passo" onClick={() => cambia(valore + 1)} aria-label="più un metro">+1</button>
            </div>
            <input
              type="range"
              min={MIN}
              max={MAX}
              step={PASSO}
              value={valore}
              onChange={(e) => cambia(Number(e.target.value))}
              aria-label="distanza stimata in metri"
            />
            <div className="scala"><span>{MIN} m</span><span>{MAX} m</span></div>
            <button className="btn-primario" onClick={() => onRispondi(valore)}>Conferma {valore} m</button>
          </div>
        ) : (
          <aside className={`spiegazione ${risposta.punti >= 6 ? 'ok' : 'ko'}`}>
            <strong>
              {risposta.etichetta}: {risposta.punti} punti
            </strong>
            <p className="confronto">
              <span>La tua stima <b>{risposta.stima} m</b></span>
              <span>Distanza reale <b>{piazzola.distanza} m</b></span>
              <span>
                Scarto <b>{risposta.scarto > 0 ? '+' : ''}{risposta.scarto.toFixed(1)} m</b> ({(risposta.rel * 100).toFixed(0)}%)
              </span>
            </p>
            {max && (
              <p className="suggerimento">
                Indizio da regolamento: in una 44 Fusion una sagoma di gruppo {piazzola.gruppo} non può stare oltre{' '}
                {max.tradizionali} m dal picchetto giallo e {max.tecnologici} m dal picchetto bianco.
              </p>
            )}
            <button className="btn-primario" onClick={onAvanti}>
              {numero === totale ? 'Vedi il riepilogo' : 'Prossima piazzola'}
            </button>
          </aside>
        )}
      </article>
    </section>
  );
}

function Riepilogo({ sessione, onRipeti, onMenu }) {
  const { piazzole, risposte } = sessione;
  const punti = risposte.reduce((a, r) => a + r.punti, 0);
  const massimo = piazzole.length * 10;
  const scartoMedio = risposte.reduce((a, r) => a + Math.abs(r.scarto), 0) / risposte.length;
  const bias = risposte.reduce((a, r) => a + r.rel * Math.sign(r.scarto), 0) / risposte.length;
  const giudizio =
    punti >= massimo * 0.9 ? 'Occhio da telemetro.' :
    punti >= massimo * 0.7 ? 'Buona lettura del terreno.' :
    punti >= massimo * 0.5 ? 'Discreto: guarda i riferimenti (alberi, altezza della sagoma).' :
    'Serve allenamento: usa la dimensione della sagoma e i riferimenti del terreno.';
  return (
    <section className="schermo riepilogo">
      <header className="testata"><h1>Riepilogo</h1></header>
      <div className="punteggio-finale">
        <span className="grande">{punti}<small>/{massimo}</small></span>
        <p>{giudizio}</p>
        <p>
          Scarto medio {scartoMedio.toFixed(1)} m ·{' '}
          {Math.abs(bias) < 0.02 ? 'nessuna tendenza' : bias > 0 ? 'tendenza a sovrastimare' : 'tendenza a sottostimare'}
        </p>
      </div>
      <table className="tabella-stime">
        <thead><tr><th>Sagoma</th><th>Stima</th><th>Reale</th><th>Scarto</th><th>Punti</th></tr></thead>
        <tbody>
          {piazzole.map((p, i) => {
            const r = risposte[i];
            return (
              <tr key={p.id}>
                <td>{p.sagoma || p.id}</td>
                <td>{r.stima} m</td>
                <td>{p.distanza} m</td>
                <td>{r.scarto > 0 ? '+' : ''}{r.scarto.toFixed(1)}</td>
                <td>{r.punti}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="azioni">
        <button className="btn-primario" onClick={onRipeti}>Nuova sessione</button>
        <button className="btn-secondario" onClick={onMenu}>Torna al menu</button>
      </div>
    </section>
  );
}
