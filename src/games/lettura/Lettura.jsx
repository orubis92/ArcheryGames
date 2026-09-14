import { useEffect, useState } from 'react';
import { CAUSE, generaRosata, valoreFreccia } from './letture.js';
import { leggi, scrivi } from '../../lib/storage.js';
import Esito from '../../components/Esito.jsx';
import Condividi from '../../components/Condividi.jsx';
import { registraSessioneProfilo } from '../../lib/profilo.js';

const PER_SESSIONE = 10;
const CHIAVE = 'lettura.statistiche.v1';

export default function Lettura({ onEsci }) {
  const [stats, setStats] = useState(() => leggi(CHIAVE, { migliore: 0, sessioni: 0, perCausa: {} }));
  const [sessione, setSessione] = useState(null);
  const [metodo, setMetodo] = useState(false);

  const avvia = () => setSessione({ rosate: Array.from({ length: PER_SESSIONE }, generaRosata), indice: 0, risposte: [] });

  if (metodo) return <Metodo onChiudi={() => setMetodo(false)} />;
  if (!sessione) {
    return (
      <section className="schermo">
        <header className="testata">
          <button className="btn-testo" onClick={onEsci}>‹ Giochi</button>
          <h1>Lettura del bersaglio</h1>
        </header>
        <p className="intro">
          Dodici frecce sul viso da 40 cm, tirate da un arciere destrimano. Che cosa racconta la rosata? Scegli la
          lettura più plausibile tra quattro; dopo la risposta trovi il ragionamento, il grado di accordo tra istruttori
          e cosa verificare sull'arciere prima di intervenire.
        </p>
        <div className="lista-livelli">
          <button className="card-livello" onClick={avvia}>
            <span className="numero">▶</span>
            <span className="testo">
              <strong>Dieci rosate</strong>
              <small>Sette schemi di lettura, sempre con rumore casuale.</small>
              {stats.sessioni > 0 && <small className="meta">miglior sessione {stats.migliore}/{PER_SESSIONE} · {stats.sessioni} sessioni</small>}
            </span>
          </button>
        </div>
        {Object.keys(stats.perCausa).length > 0 && (
          <div className="tendenza">
            <h3>Le tue letture</h3>
            <ul className="per-causa">
              {Object.entries(CAUSE).map(([k, c]) => {
                const s = stats.perCausa[k];
                if (!s) return null;
                return <li key={k}><span>{c.nome}</span><b>{s.giuste}/{s.viste}</b></li>;
              })}
            </ul>
          </div>
        )}
        <button className="btn-secondario" onClick={() => setMetodo(true)}>Nota di metodo</button>
      </section>
    );
  }

  const { rosate, indice, risposte } = sessione;
  if (indice >= rosate.length) {
    const giuste = risposte.filter((r) => r.corretta).length;
    return (
      <section className="schermo riepilogo">
        <header className="testata"><h1>Riepilogo</h1></header>
        <div className="punteggio-finale">
          <span className="grande">{giuste}<small>/{rosate.length}</small></span>
          <p>
            {giuste >= 9 ? 'Occhio da istruttore.' : giuste >= 7 ? 'Buona lettura; rivedi gli schemi sbagliati.' : giuste >= 5 ? 'Discreto: prima di diagnosticare, chiediti sempre se il gruppo è stretto o largo.' : 'Ripassa la nota di metodo: forma del gruppo prima, posizione dopo.'}
          </p>
        </div>
        <div className="errori">
          {rosate.map((r, i) => !risposte[i].corretta && (
            <details key={i}>
              <summary>Rosata {i + 1}: era «{CAUSE[r.causa].nome}», hai scelto «{CAUSE[risposte[i].scelta].nome}»</summary>
              <p>{CAUSE[r.causa].breve}</p>
            </details>
          ))}
        </div>
        <Condividi titolo="Lettura del bersaglio" punteggio={`${giuste}/${rosate.length}`} dettaglio="Diagnosi delle rosate" />
        <div className="azioni">
          <button className="btn-primario" onClick={avvia}>Nuova sessione</button>
          <button className="btn-secondario" onClick={() => { setStats(leggi(CHIAVE, stats)); setSessione(null); }}>Torna al menu</button>
        </div>
      </section>
    );
  }

  const r = rosate[indice];
  const rispondi = (scelta) => {
    const corretta = scelta === r.causa;
    const s = leggi(CHIAVE, { migliore: 0, sessioni: 0, perCausa: {} });
    const pc = s.perCausa[r.causa] || { viste: 0, giuste: 0 };
    pc.viste += 1;
    if (corretta) pc.giuste += 1;
    s.perCausa[r.causa] = pc;
    const nuove = [...risposte, { scelta, corretta }];
    if (nuove.length === rosate.length) {
      s.sessioni += 1;
      const giuste = nuove.filter((x) => x.corretta).length;
      s.migliore = Math.max(s.migliore, giuste);
      registraSessioneProfilo({
        gioco: 'lettura',
        punti: giuste,
        totale: rosate.length,
        errori: rosate.filter((ro, i) => !nuove[i].corretta).map((ro) => ro.causa),
      });
    }
    scrivi(CHIAVE, s);
    setSessione({ ...sessione, risposte: nuove });
  };

  return (
    <Rosata
      rosata={r}
      numero={indice + 1}
      totale={rosate.length}
      risposta={risposte[indice]}
      onRispondi={rispondi}
      onAvanti={() => setSessione({ ...sessione, indice: indice + 1 })}
      onEsci={() => setSessione(null)}
    />
  );
}

function Viso({ frecce, numerate }) {
  const S = 9; // px per cm
  const C = 200;
  const anelli = [
    ['#f4f1ea', 20], ['#f4f1ea', 18], ['#1d1d1d', 16], ['#1d1d1d', 14], ['#3f7bd9', 12],
    ['#3f7bd9', 10], ['#d9382b', 8], ['#d9382b', 6], ['#e9c53a', 4], ['#e9c53a', 2],
  ];
  return (
    <svg viewBox="0 0 400 400" className="viso" role="img" aria-label="Rosata di 12 frecce">
      {anelli.map(([col, r], i) => (
        <circle key={i} cx={C} cy={C} r={r * S} fill={col} stroke="#333" strokeWidth="0.8" />
      ))}
      <circle cx={C} cy={C} r={1 * S} fill="none" stroke="#333" strokeWidth="0.8" />
      {frecce.map((p) => (
        <g key={p.n}>
          <circle cx={C + p.x * S} cy={C - p.y * S} r="5.5" fill="#1f3b2d" stroke="#fff" strokeWidth="1.5" />
          {numerate && <text x={C + p.x * S + 7} y={C - p.y * S - 6} className="viso-n">{p.n}</text>}
        </g>
      ))}
    </svg>
  );
}

function Rosata({ rosata, numero, totale, risposta, onRispondi, onAvanti, onEsci }) {
  useEffect(() => { window.scrollTo({ top: 0 }); }, [rosata.seed]);
  const risposto = Boolean(risposta);
  const punti = rosata.frecce.reduce((a, p) => a + valoreFreccia(p), 0);
  const c = CAUSE[rosata.causa];
  return (
    <section className="schermo domanda">
      <header className="testata">
        <button className="btn-testo" onClick={onEsci}>‹ Esci</button>
        <span className="progresso">{numero} / {totale}</span>
        <span className="badge">{punti} punti</span>
      </header>
      <div className="barra"><i style={{ width: `${((numero - 1) / totale) * 100}%` }} /></div>
      <article className="scenario lettura">
        <Viso frecce={rosata.frecce} numerate={rosata.numerate} />
        <p className="didascalia">
          Viso da 40 cm, 12 frecce, arciere destrimano{rosata.numerate ? ', frecce numerate in ordine di tiro' : ''}.
        </p>
        <h2>Qual è la lettura più plausibile?</h2>
        <ul className="opzioni">
          {rosata.opzioni.map((k, i) => {
            let cls = 'opzione';
            if (risposto) {
              if (k === rosata.causa) cls += ' giusta';
              else if (k === risposta.scelta) cls += ' sbagliata';
              else cls += ' spenta';
            }
            return (
              <li key={k}>
                <button className={cls} disabled={risposto} onClick={() => onRispondi(k)}>
                  <span className="lettera">{String.fromCharCode(65 + i)}</span>
                  <span>{CAUSE[k].nome}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </article>
      {risposto && <Esito tipo={risposta.corretta ? 'ok' : 'ko'} chiave={rosata.seed} />}
      {risposto && (
        <aside className={`spiegazione ${risposta.corretta ? 'ok' : 'ko'}`}>
          <strong>{risposta.corretta ? 'Lettura corretta.' : `Lettura sbagliata: era «${c.nome}».`}</strong>
          <p>{c.breve}</p>
          <p><b>Cosa verificare:</b> {c.verifica}</p>
          <cite>Accordo tra istruttori: {c.accordo}.</cite>
          <button className="btn-primario" onClick={onAvanti}>{numero === totale ? 'Vedi il riepilogo' : 'Prossima rosata'}</button>
        </aside>
      )}
    </section>
  );
}

function Metodo({ onChiudi }) {
  return (
    <section className="schermo">
      <header className="testata">
        <button className="btn-testo" onClick={onChiudi}>‹ Indietro</button>
        <h1>Nota di metodo</h1>
      </header>
      <div className="regole">
        <p>Il bersaglio non dice <i>quale</i> errore fa l'arciere: dice <i>che tipo</i> di variabilità c'è. Da lì si va a guardare l'arciere. Questo gioco allena il primo passo, non il secondo.</p>
        <h3>L'ordine delle domande</h3>
        <ul>
          <li><b>Il gruppo è stretto?</b> Se sì e spostato, è mira o regolazione, non tecnica.</li>
          <li><b>In che direzione si apre?</b> Verticale → riferimenti in altezza (ancoraggio, allungo). Orizzontale → rilascio, impugnatura, allineamento.</li>
          <li><b>È un gruppo o due?</b> Due gruppi stretti = due modi di fare la stessa cosa.</li>
          <li><b>Le frecce lontane sono poche?</b> Allora il gruppo di base è buono: guarda le frecce e i singoli tiri, non la tecnica.</li>
          <li><b>Cambia nel tempo?</b> Serve la numerazione: senza, la deriva non si legge.</li>
        </ul>
        <h3>Cosa il gioco non fa</h3>
        <p>Non usa le letture "fini" (gruppi diagonali, forme a virgola, distinzioni tra rilascio e presa sul bersaglio) perché su quelle gli istruttori non concordano e dipendono dall'arciere, dall'arco e dalla distanza. Ogni spiegazione riporta il grado di accordo: <b>alto</b> quando la lettura è condivisa, <b>medio</b> quando è un indizio da confermare guardando l'arciere.</p>
        <p className="nota-fonti">Le rosate sono generate con rumore casuale: la stessa causa non produce mai due figure uguali, e a volte il caso rende ambigua la figura. È voluto: anche al campo succede.</p>
      </div>
      <button className="btn-primario" onClick={onChiudi}>Ho capito</button>
    </section>
  );
}
