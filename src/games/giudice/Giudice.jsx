import { useEffect, useMemo, useState } from 'react';
import { LIVELLI, SCENARI, scenariPerLivello } from './scenari.js';
import Bersaglio from './Bersaglio.jsx';
import {
  caricaStatistiche,
  registraRisposta,
  registraSessione,
  azzeraStatistiche,
  selezionaScenari,
} from './statistiche.js';

const DOMANDE_PER_SESSIONE = 10;

// Mescola le opzioni di uno scenario mantenendo traccia dell'indice corretto.
function mescolaOpzioni(sc) {
  const idx = sc.opzioni.map((_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return {
    ...sc,
    opzioni: idx.map((i) => sc.opzioni[i]),
    corretta: idx.indexOf(sc.corretta),
  };
}

export default function Giudice({ onEsci }) {
  const [stats, setStats] = useState(caricaStatistiche);
  const [sessione, setSessione] = useState(null); // { livello, scenari, indice, risposte }

  const avvia = (livello) => {
    const base = livello === 'misto' ? SCENARI : scenariPerLivello(livello);
    const scelti = selezionaScenari(base, Math.min(DOMANDE_PER_SESSIONE, base.length), stats).map(mescolaOpzioni);
    setSessione({ livello, scenari: scelti, indice: 0, risposte: [] });
  };

  if (!sessione) {
    return (
      <MenuGiudice
        stats={stats}
        onAvvia={avvia}
        onEsci={onEsci}
        onAzzera={() => {
          azzeraStatistiche();
          setStats(caricaStatistiche());
        }}
      />
    );
  }

  const { scenari, indice, risposte } = sessione;

  if (indice >= scenari.length) {
    return (
      <Riepilogo
        sessione={sessione}
        onRipeti={() => avvia(sessione.livello)}
        onMenu={() => {
          setStats(caricaStatistiche());
          setSessione(null);
        }}
      />
    );
  }

  const scenario = scenari[indice];
  const rispondi = (scelta) => {
    const corretta = scelta === scenario.corretta;
    setStats(registraRisposta(scenario.id, corretta));
    setSessione({ ...sessione, risposte: [...risposte, { id: scenario.id, scelta, corretta }] });
  };
  const avanti = () => {
    const prossimo = indice + 1;
    if (prossimo >= scenari.length) {
      const punteggio = risposte.filter((r) => r.corretta).length;
      registraSessione(sessione.livello, punteggio, scenari.length);
    }
    setSessione({ ...sessione, indice: prossimo });
  };

  return (
    <Domanda
      scenario={scenario}
      numero={indice + 1}
      totale={scenari.length}
      risposta={risposte[indice]}
      onRispondi={rispondi}
      onAvanti={avanti}
      onEsci={() => setSessione(null)}
    />
  );
}

function MenuGiudice({ stats, onAvvia, onEsci, onAzzera }) {
  const totali = useMemo(
    () => Object.fromEntries(Object.keys(LIVELLI).map((l) => [l, scenariPerLivello(Number(l)).length])),
    [],
  );
  const viste = (livello) =>
    scenariPerLivello(livello).filter((s) => stats.domande[s.id]).length;

  return (
    <section className="schermo">
      <header className="testata">
        <button className="btn-testo" onClick={onEsci}>‹ Giochi</button>
        <h1>Il giudice</h1>
      </header>
      <p className="intro">
        Una situazione di gara, una decisione da prendere secondo il Regolamento CSAIn. Dopo ogni risposta
        trovi la regola e il riferimento al capitolo. Dieci situazioni per sessione.
      </p>
      <div className="lista-livelli">
        {Object.entries(LIVELLI).map(([num, l]) => {
          const n = Number(num);
          const st = stats.livelli[n];
          return (
            <button key={n} className="card-livello" onClick={() => onAvvia(n)}>
              <span className="numero">{n}</span>
              <span className="testo">
                <strong>{l.nome}</strong>
                <small>{l.descrizione}</small>
                <small className="meta">
                  {totali[n]} situazioni · viste {viste(n)}
                  {st ? ` · miglior sessione ${st.migliore}/${st.totale}` : ''}
                </small>
              </span>
            </button>
          );
        })}
        <button className="card-livello misto" onClick={() => onAvvia('misto')}>
          <span className="numero">∞</span>
          <span className="testo">
            <strong>Allenamento misto</strong>
            <small>Tutti i livelli insieme; le situazioni sbagliate tornano più spesso.</small>
          </span>
        </button>
      </div>
      <p className="nota-fonti">
        Fonti: Regolamento Sportivo Tiro con l'arco 3D CSAIn rev. 6.6 (2026) e Regolamento Gare Outdoor 2026.
        In caso di dubbio fa fede il testo ufficiale.
      </p>
      <button className="btn-testo piccolo" onClick={onAzzera}>Azzera i progressi</button>
    </section>
  );
}

function Domanda({ scenario, numero, totale, risposta, onRispondi, onAvanti, onEsci }) {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [scenario.id]);

  const risposto = Boolean(risposta);
  return (
    <section className="schermo domanda">
      <header className="testata">
        <button className="btn-testo" onClick={onEsci}>‹ Esci</button>
        <span className="progresso">{numero} / {totale}</span>
        <span className={`badge livello-${scenario.livello}`}>{LIVELLI[scenario.livello].nome}</span>
      </header>
      <div className="barra"><i style={{ width: `${((numero - 1) / totale) * 100}%` }} /></div>

      <article className="scenario">
        <span className="gara">{scenario.gara}</span>
        <p className="situazione">{scenario.situazione}</p>
        {scenario.bersaglio && <Bersaglio bersaglio={scenario.bersaglio} />}
        <h2>{scenario.domanda}</h2>
        <ul className="opzioni">
          {scenario.opzioni.map((op, i) => {
            let cls = 'opzione';
            if (risposto) {
              if (i === scenario.corretta) cls += ' giusta';
              else if (i === risposta.scelta) cls += ' sbagliata';
              else cls += ' spenta';
            }
            return (
              <li key={i}>
                <button className={cls} disabled={risposto} onClick={() => onRispondi(i)}>
                  <span className="lettera">{String.fromCharCode(65 + i)}</span>
                  <span>{op}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </article>

      {risposto && (
        <aside className={`spiegazione ${risposta.corretta ? 'ok' : 'ko'}`}>
          <strong>{risposta.corretta ? 'Decisione corretta.' : 'Decisione sbagliata.'}</strong>
          <p>{scenario.spiegazione}</p>
          <cite>{scenario.fonte}</cite>
          <button className="btn-primario" onClick={onAvanti}>
            {numero === totale ? 'Vedi il riepilogo' : 'Prossima situazione'}
          </button>
        </aside>
      )}
    </section>
  );
}

function Riepilogo({ sessione, onRipeti, onMenu }) {
  const { scenari, risposte } = sessione;
  const giuste = risposte.filter((r) => r.corretta).length;
  const sbagliate = scenari.filter((_, i) => !risposte[i]?.corretta);
  const pct = Math.round((giuste / scenari.length) * 100);
  const giudizio =
    pct === 100 ? 'Impeccabile: potresti arbitrare tu.' :
    pct >= 80 ? 'Ottimo: le regole le conosci, resta qualche dettaglio.' :
    pct >= 60 ? 'Discreto: rileggi le situazioni sbagliate qui sotto.' :
    'Il regolamento va ripassato: ogni spiegazione riporta il paragrafo da rileggere.';

  return (
    <section className="schermo riepilogo">
      <header className="testata"><h1>Riepilogo</h1></header>
      <div className="punteggio-finale">
        <span className="grande">{giuste}<small>/{scenari.length}</small></span>
        <p>{giudizio}</p>
      </div>
      {sbagliate.length > 0 && (
        <div className="errori">
          <h3>Da rivedere</h3>
          {sbagliate.map((sc) => (
            <details key={sc.id}>
              <summary>{sc.gara} · {sc.situazione.length > 90 ? sc.situazione.slice(0, 90).trimEnd() + '…' : sc.situazione}</summary>
              <p className="situazione">{sc.situazione}</p>
              <p><strong>Risposta corretta:</strong> {sc.opzioni[sc.corretta]}</p>
              <p>{sc.spiegazione}</p>
              <cite>{sc.fonte}</cite>
            </details>
          ))}
        </div>
      )}
      <div className="azioni">
        <button className="btn-primario" onClick={onRipeti}>Nuova sessione</button>
        <button className="btn-secondario" onClick={onMenu}>Torna ai livelli</button>
      </div>
    </section>
  );
}
