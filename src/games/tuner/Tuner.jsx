import { useState } from 'react';
import { PARAMETRI, LIVELLI, LIMITE, TEST, statoCasuale, messoAPunto, assi } from './modello.js';
import { DiagrammaCarta, DiagrammaNuda, DiagrammaRosata, puntiRosata } from './Diagrammi.jsx';
import { leggi, scrivi } from '../../lib/storage.js';
import EffettoEsito from '../../components/Esito.jsx';

const CHIAVE = 'tuner.statistiche.v1';

export default function Tuner({ onEsci }) {
  const [stats, setStats] = useState(() => leggi(CHIAVE, {}));
  const [partita, setPartita] = useState(null);
  const [regole, setRegole] = useState(false);

  const avvia = (livello) => {
    setPartita({
      livello,
      stato: statoCasuale(livello),
      iniziale: null,
      mosse: 0,
      frecce: 0,
      risultati: {}, // ultimo risultato per test
      registro: [], // cronologia di regolazioni e test
      esito: null, // 'vinta' | 'persa'
    });
  };

  const chiudi = (esito, p) => {
    const s = leggi(CHIAVE, {});
    const l = s[p.livello] || { vinte: 0, giocate: 0, minMosse: null };
    l.giocate += 1;
    if (esito === 'vinta') {
      l.vinte += 1;
      if (l.minMosse === null || p.mosse < l.minMosse) l.minMosse = p.mosse;
    }
    s[p.livello] = l;
    scrivi(CHIAVE, s);
    setStats(s);
  };

  if (regole) return <Regole onChiudi={() => setRegole(false)} />;
  if (!partita) return <Menu stats={stats} onAvvia={avvia} onEsci={onEsci} onRegole={() => setRegole(true)} />;

  const L = LIVELLI[partita.livello];
  const mosseRimaste = L.mosse - partita.mosse;

  const esegui = (chiave) => {
    const r = TEST[chiave].esegui(partita.stato);
    if (r.tipo === 'rosata') r.punti = puntiRosata(r);
    setPartita({
      ...partita,
      frecce: partita.frecce + (chiave === 'rosata' ? 12 : chiave === 'nuda' ? 4 : 1),
      risultati: { ...partita.risultati, [chiave]: r },
      registro: [...partita.registro, { tipo: 'test', chiave, testo: r.testo }],
    });
  };

  const regola = (chiave, delta) => {
    if (partita.esito || mosseRimaste <= 0) return;
    const nuovo = Math.max(-LIMITE, Math.min(LIMITE, partita.stato[chiave] + delta));
    if (nuovo === partita.stato[chiave]) return;
    const stato = { ...partita.stato, [chiave]: nuovo };
    const p = {
      ...partita,
      stato,
      mosse: partita.mosse + 1,
      risultati: {}, // dopo una regolazione i vecchi test non valgono più
      registro: [...partita.registro, { tipo: 'regolazione', testo: delta > 0 ? PARAMETRI[chiave].piu : PARAMETRI[chiave].meno }],
    };
    setPartita(p);
  };

  const dichiara = () => {
    const ok = messoAPunto(partita.stato);
    const esito = ok ? 'vinta' : 'persa';
    chiudi(esito, partita);
    setPartita({ ...partita, esito });
  };

  return (
    <section className="schermo tuner">
      <header className="testata">
        <button className="btn-testo" onClick={() => setPartita(null)}>‹ Esci</button>
        <span className="progresso">regolazioni {partita.mosse}/{L.mosse} · frecce {partita.frecce}</span>
        <span className="badge">{L.nome}</span>
      </header>

      {partita.esito ? (
        <Esito partita={partita} onRipeti={() => avvia(partita.livello)} onMenu={() => setPartita(null)} />
      ) : (
        <>
          <div className="pannello-test">
            <h2>Test</h2>
            <div className="griglia-test">
              {Object.entries(TEST).map(([k, t]) => {
                const r = partita.risultati[k];
                return (
                  <div key={k} className={`card-test ${r ? 'fatto' : ''}`}>
                    <strong>{t.nome}</strong>
                    {r ? (
                      <>
                        {r.tipo === 'carta' && <DiagrammaCarta oriz={r.oriz} vert={r.vert} />}
                        {r.tipo === 'nuda' && <DiagrammaNuda dx={r.dx} dy={r.dy} />}
                        {r.tipo === 'rosata' && <DiagrammaRosata punti={r.punti} />}
                        <p className="lettura">{r.testo}</p>
                      </>
                    ) : (
                      <p className="lettura vuota">{t.descrizione}</p>
                    )}
                    <button className="btn-secondario piccolo" onClick={() => esegui(k)}>
                      {r ? 'Ripeti il test' : 'Esegui'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pannello-regolazioni">
            <h2>Regolazioni <small>({mosseRimaste} rimaste)</small></h2>
            <p className="intro piccolo">Ogni regolazione consuma una mossa e invalida i test già fatti.</p>
            <ul className="lista-regolazioni">
              {Object.entries(PARAMETRI).map(([k, p]) => (
                <li key={k}>
                  <button className="btn-reg" disabled={mosseRimaste <= 0} onClick={() => regola(k, -1)}>{p.meno}</button>
                  <span className="nome-reg"><strong>{p.nome}</strong><small>{p.unita}</small></span>
                  <button className="btn-reg" disabled={mosseRimaste <= 0} onClick={() => regola(k, +1)}>{p.piu}</button>
                </li>
              ))}
            </ul>
            <button className="btn-primario" onClick={dichiara}>Dichiaro l'arco messo a punto</button>
          </div>

          {partita.registro.length > 0 && (
            <details className="registro">
              <summary>Cronologia ({partita.registro.length})</summary>
              <ol>
                {partita.registro.map((v, i) => (
                  <li key={i} className={v.tipo}>{v.tipo === 'test' ? `${TEST[v.chiave].nome}: ${v.testo}` : `Regolazione: ${v.testo}`}</li>
                ))}
              </ol>
            </details>
          )}
        </>
      )}
    </section>
  );
}

function Esito({ partita, onRipeti, onMenu }) {
  const vinta = partita.esito === 'vinta';
  const { R, V, rumore } = assi(partita.stato);
  const fuori = Object.entries(partita.stato).filter(([, v]) => v !== 0);
  return (
    <div className="riepilogo">
      <EffettoEsito tipo={vinta ? 'ok' : 'ko'} chiave={partita.mosse} />
      <div className="punteggio-finale">
        <span className="grande">{vinta ? '✓' : '✗'}</span>
        <p>
          {vinta
            ? `Arco a punto in ${partita.mosse} regolazioni e ${partita.frecce} frecce.`
            : 'Non è a punto: i test lo avrebbero mostrato.'}
        </p>
      </div>
      <div className="spiegazione ok" style={{ borderLeftColor: vinta ? undefined : 'var(--ko)' }}>
        <strong>Stato finale delle regolazioni</strong>
        <p>
          {fuori.length === 0
            ? 'Tutti i parametri sono al valore nominale.'
            : fuori.map(([k, v]) => `${PARAMETRI[k].nome} ${v > 0 ? '+' : ''}${v}`).join(' · ')}
        </p>
        <p>
          Rigidità dinamica {R > 0 ? '+' : ''}{R} {Math.abs(R) < 0.01 ? '(neutra)' : R > 0 ? '(rigida)' : '(debole)'} ·
          verticale {V > 0 ? '+' : ''}{V} · brace {rumore === 0 ? 'nell\'intervallo' : 'fuori intervallo'}
        </p>
        {vinta && fuori.length > 0 && (
          <p>Hai chiuso con una compensazione: è legittimo, ma ricorda che punta, bottone e brace agiscono a metà scatto rispetto allo spine.</p>
        )}
      </div>
      <div className="azioni">
        <button className="btn-primario" onClick={onRipeti}>Nuova partita</button>
        <button className="btn-secondario" onClick={onMenu}>Torna ai livelli</button>
      </div>
    </div>
  );
}

function Menu({ stats, onAvvia, onEsci, onRegole }) {
  return (
    <section className="schermo">
      <header className="testata">
        <button className="btn-testo" onClick={onEsci}>‹ Giochi</button>
        <h1>Il tuner</h1>
      </header>
      <p className="intro">
        Un arco olimpico con qualcosa fuori posto. Fai i test, leggi gli indizi, regola: hai un numero limitato di
        regolazioni. Le frecce tirate contano solo per l'onore.
      </p>
      <div className="lista-livelli">
        {Object.entries(LIVELLI).map(([n, l]) => {
          const s = stats[n];
          return (
            <button key={n} className="card-livello" onClick={() => onAvvia(Number(n))}>
              <span className="numero">{n}</span>
              <span className="testo">
                <strong>{l.nome}</strong>
                <small>{l.descrizione}</small>
                {s && (
                  <small className="meta">
                    vinte {s.vinte}/{s.giocate}{s.minMosse !== null ? ` · minimo ${s.minMosse} regolazioni` : ''}
                  </small>
                )}
              </span>
            </button>
          );
        })}
      </div>
      <button className="btn-secondario" onClick={onRegole}>Come si leggono i test</button>
      <p className="nota-fonti">Modello semplificato per arciere destrimano; per un mancino le indicazioni destra/sinistra si invertono.</p>
    </section>
  );
}

function Regole({ onChiudi }) {
  return (
    <section className="schermo">
      <header className="testata">
        <button className="btn-testo" onClick={onChiudi}>‹ Indietro</button>
        <h1>Come si leggono i test</h1>
      </header>
      <div className="regole">
        <h3>Carta strappata (2 m)</h3>
        <p>Strappo verso <b>sinistra</b>: freccia troppo <b>rigida</b>. Verso <b>destra</b>: troppo <b>debole</b>. Verso l'<b>alto</b>: nocking point <b>alto</b>; verso il basso: nocking point basso. Uno strappo "leggero" indica mezzo scatto di squilibrio.</p>
        <h3>Freccia nuda (18 m)</h3>
        <p>Nuda a <b>sinistra</b> delle impennate: rigida. A <b>destra</b>: debole. Nuda <b>bassa</b>: nocking point alto. Nuda alta: nocking point basso.</p>
        <h3>Rosata (30 m)</h3>
        <p>Il gruppo si allarga con qualsiasi squilibrio, ma è l'unico test che parla della <b>brace height</b>: se è fuori intervallo l'arco è <b>rumoroso</b>. Non dice però se è alta o bassa: va dedotto dal fatto che una brace alta rende la freccia più rigida e una brace bassa più debole.</p>
        <h3>Cosa fa ogni regolazione</h3>
        <ul>
          <li><b>Spine</b>: uno scatto = uno scatto intero di rigidità.</li>
          <li><b>Punta</b>: più pesante → più debole (mezzo scatto).</li>
          <li><b>Bottone</b>: più duro → più rigida (mezzo scatto).</li>
          <li><b>Brace</b>: più alta → più rigida (mezzo scatto) e, se esce dall'intervallo, rumore.</li>
          <li><b>Nocking point</b>: agisce solo sull'asse verticale.</li>
        </ul>
        <p>Si vince quando i tre test tornano puliti. Compensare (per esempio spine rigido e punta pesante) è ammesso: è messa a punto anche quella.</p>
        <p className="nota-fonti">Il modello è didattico e semplificato: nella realtà pesano anche allungo, libbraggio, clearance e forma di rilascio, e le letture della carta sono meno lineari di così.</p>
      </div>
      <button className="btn-primario" onClick={onChiudi}>Ho capito</button>
    </section>
  );
}
