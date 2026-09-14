// Modalità esame: 30 situazioni miste, tempo limitato, nessuna spiegazione
// fino alla fine, soglia di superamento, attestato stampabile.
import { useEffect, useMemo, useState } from 'react';
import { LIVELLI, SCENARI } from './scenari.js';
import Bersaglio from './Bersaglio.jsx';
import { leggi, scrivi } from '../../lib/storage.js';
import { caricaProfilo, salvaProfilo, registraSessioneProfilo } from '../../lib/profilo.js';
import Esito from '../../components/Esito.jsx';
import Condividi from '../../components/Condividi.jsx';

export const ESAME = { domande: 30, minuti: 25, soglia: 0.8 };
const CHIAVE = 'giudice.esami.v1';

function mescola(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function mescolaOpzioni(sc) {
  const idx = mescola(sc.opzioni.map((_, i) => i));
  return { ...sc, opzioni: idx.map((i) => sc.opzioni[i]), corretta: idx.indexOf(sc.corretta) };
}

// 30 domande bilanciate sui tre livelli (10 + 10 + 10 se disponibili)
function componiEsame() {
  const perLivello = [1, 2, 3].map((l) => mescola(SCENARI.filter((s) => s.livello === l)));
  const quota = Math.floor(ESAME.domande / 3);
  let scelte = perLivello.flatMap((arr) => arr.slice(0, quota));
  const resto = mescola(SCENARI.filter((s) => !scelte.includes(s)));
  while (scelte.length < ESAME.domande && resto.length) scelte.push(resto.shift());
  return mescola(scelte).map(mescolaOpzioni);
}

export function storicoEsami() {
  return leggi(CHIAVE, []);
}

export default function Esame({ onEsci }) {
  const [fase, setFase] = useState('intro'); // intro | corso | esito
  const [domande, setDomande] = useState([]);
  const [indice, setIndice] = useState(0);
  const [risposte, setRisposte] = useState([]);
  const [scadenza, setScadenza] = useState(0);
  const [ora, setOra] = useState(Date.now());
  const [attestato, setAttestato] = useState(false);

  useEffect(() => {
    if (fase !== 'corso') return undefined;
    const t = setInterval(() => setOra(Date.now()), 1000);
    return () => clearInterval(t);
  }, [fase]);

  const avvia = () => {
    setDomande(componiEsame());
    setIndice(0);
    setRisposte([]);
    setScadenza(Date.now() + ESAME.minuti * 60000);
    setFase('corso');
  };

  const chiudi = (rispFinali) => {
    const giuste = rispFinali.filter((r) => r.corretta).length;
    const esito = { quando: Date.now(), giuste, totale: domande.length, superato: giuste / domande.length >= ESAME.soglia };
    scrivi(CHIAVE, [...storicoEsami(), esito].slice(-50));
    registraSessioneProfilo({
      gioco: 'esame',
      punti: giuste,
      totale: domande.length,
      etichetta: esito.superato ? 'superato' : 'non superato',
      errori: rispFinali.filter((r) => !r.corretta).map((r) => r.fonte),
    });
    setFase('esito');
  };

  useEffect(() => {
    if (fase === 'corso' && ora >= scadenza) chiudi(risposte);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ora]);

  const rispondi = (scelta) => {
    const d = domande[indice];
    const nuove = [...risposte, { id: d.id, scelta, corretta: scelta === d.corretta, fonte: d.fonte }];
    setRisposte(nuove);
    if (indice + 1 >= domande.length) chiudi(nuove);
    else {
      setIndice(indice + 1);
      window.scrollTo({ top: 0 });
    }
  };

  if (fase === 'intro') {
    const storico = storicoEsami();
    return (
      <section className="schermo">
        <header className="testata">
          <button className="btn-testo" onClick={onEsci}>‹ Indietro</button>
          <h1>Esame giudice</h1>
        </header>
        <div className="riquadro">
          <p><b>{ESAME.domande} situazioni</b> miste sui tre livelli, <b>{ESAME.minuti} minuti</b>, nessuna spiegazione durante la prova.</p>
          <p>Si supera con almeno il <b>{Math.round(ESAME.soglia * 100)}%</b> di risposte esatte ({Math.ceil(ESAME.domande * ESAME.soglia)} su {ESAME.domande}). Alla fine trovi la revisione di tutte le domande e, se superato, l'attestato da stampare.</p>
          <p className="intro piccolo">L'attestato è un riconoscimento dell'app, non un titolo federale: la qualifica di Giudice di Gara si ottiene solo con i corsi CSAIn.</p>
        </div>
        {storico.length > 0 && (
          <div className="riquadro">
            <strong>Prove precedenti</strong>
            <ul className="storico">
              {storico.slice(-5).reverse().map((e, i) => (
                <li key={i}>
                  <span>{new Date(e.quando).toLocaleDateString('it-IT')}</span>
                  <span>{e.giuste}/{e.totale}</span>
                  <b className={e.superato ? 'ok' : 'ko'}>{e.superato ? 'superato' : 'non superato'}</b>
                </li>
              ))}
            </ul>
          </div>
        )}
        <button className="btn-primario" onClick={avvia}>Inizia l'esame</button>
      </section>
    );
  }

  if (fase === 'corso') {
    const d = domande[indice];
    const rimasti = Math.max(0, Math.floor((scadenza - ora) / 1000));
    const mm = String(Math.floor(rimasti / 60)).padStart(2, '0');
    const ss = String(rimasti % 60).padStart(2, '0');
    return (
      <section className="schermo domanda">
        <header className="testata">
          <button className="btn-testo" onClick={() => { if (window.confirm('Abbandonare l\'esame? Non verrà registrato.')) onEsci(); }}>‹ Abbandona</button>
          <span className="progresso">{indice + 1} / {domande.length}</span>
          <span className={`badge timer ${rimasti < 120 ? 'urgente' : ''}`}>{mm}:{ss}</span>
        </header>
        <div className="barra"><i style={{ width: `${(indice / domande.length) * 100}%` }} /></div>
        <article className="scenario">
          <span className="gara">{d.gara} · {LIVELLI[d.livello].nome}</span>
          <p className="situazione">{d.situazione}</p>
          {d.bersaglio && <Bersaglio bersaglio={d.bersaglio} />}
          <h2>{d.domanda}</h2>
          <ul className="opzioni">
            {d.opzioni.map((op, i) => (
              <li key={i}>
                <button className="opzione" onClick={() => rispondi(i)}>
                  <span className="lettera">{String.fromCharCode(65 + i)}</span>
                  <span>{op}</span>
                </button>
              </li>
            ))}
          </ul>
        </article>
      </section>
    );
  }

  // esito
  const giuste = risposte.filter((r) => r.corretta).length;
  const superato = giuste / domande.length >= ESAME.soglia;
  if (attestato) return <Attestato giuste={giuste} totale={domande.length} onChiudi={() => setAttestato(false)} />;
  return (
    <section className="schermo riepilogo">
      <Esito tipo={superato ? 'ok' : 'ko'} chiave="esame" />
      <header className="testata"><h1>Esito dell'esame</h1></header>
      <div className="punteggio-finale">
        <span className="grande">{giuste}<small>/{domande.length}</small></span>
        <p className={superato ? 'ok-testo' : 'ko-testo'}>
          {superato ? 'Esame superato.' : `Non superato: servono almeno ${Math.ceil(domande.length * ESAME.soglia)} risposte esatte.`}
          {risposte.length < domande.length && ` Tempo scaduto dopo ${risposte.length} risposte.`}
        </p>
      </div>
      {superato && <button className="btn-primario" onClick={() => setAttestato(true)}>Vedi e stampa l'attestato</button>}
      <Condividi
        titolo="Esame giudice"
        punteggio={`${giuste}/${domande.length}`}
        sottotitolo={superato ? 'superato' : 'non superato'}
        dettaglio={`${ESAME.domande} situazioni sul Regolamento CSAIn 3D`}
      />
      <div className="errori">
        <h3>Revisione</h3>
        {domande.map((d, i) => {
          const r = risposte[i];
          return (
            <details key={d.id} className={r?.corretta ? 'giusta' : 'sbagliata'}>
              <summary>{i + 1}. {d.gara} · {d.domanda} {r ? (r.corretta ? '✓' : '✗') : '—'}</summary>
              <p className="situazione">{d.situazione}</p>
              <p><strong>Risposta corretta:</strong> {d.opzioni[d.corretta]}</p>
              {r && !r.corretta && <p><strong>La tua risposta:</strong> {d.opzioni[r.scelta]}</p>}
              <p>{d.spiegazione}</p>
              <cite>{d.fonte}</cite>
            </details>
          );
        })}
      </div>
      <div className="azioni">
        <button className="btn-primario" onClick={avvia}>Ripeti l'esame</button>
        <button className="btn-secondario" onClick={onEsci}>Torna al gioco</button>
      </div>
    </section>
  );
}

function Attestato({ giuste, totale, onChiudi }) {
  const [p, setP] = useState(caricaProfilo);
  const data = useMemo(() => new Date().toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' }), []);
  const cambiaNome = (nome) => setP(salvaProfilo({ ...p, nome }));
  return (
    <section className="schermo attestato-pagina">
      <header className="testata no-stampa">
        <button className="btn-testo" onClick={onChiudi}>‹ Indietro</button>
        <h1>Attestato</h1>
      </header>
      <label className="campo no-stampa">
        <span>Nome sull'attestato</span>
        <input type="text" value={p.nome} onChange={(e) => cambiaNome(e.target.value)} placeholder="Nome e cognome" />
      </label>
      <div className="attestato">
        <div className="attestato-bordo">
          <svg viewBox="0 0 120 120" className="attestato-logo" aria-hidden="true">
            {[['#f4f1ea', 56], ['#1d1d1d', 45], ['#3f7bd9', 34], ['#d9382b', 23], ['#e9c53a', 12]].map(([c, r]) => (
              <circle key={r} cx="60" cy="60" r={r} fill={c} stroke="#333" strokeWidth="1" />
            ))}
          </svg>
          <p className="attestato-sopra">Archery Games · Il giudice</p>
          <h2>Attestato di superamento</h2>
          <p className="attestato-nome">{p.nome || '________________________'}</p>
          <p>
            ha superato la prova simulata sul <b>Regolamento Sportivo Tiro con l'arco 3D CSAIn</b> (rev. 6.6, 2026)
            e sul Regolamento Gare Outdoor 2026 con <b>{giuste} risposte esatte su {totale}</b>
            {' '}({Math.round((giuste / totale) * 100)}%), su una soglia del {Math.round(ESAME.soglia * 100)}%.
          </p>
          <p className="attestato-data">{data}</p>
          <p className="attestato-nota">Prova simulata di autoformazione. Non costituisce qualifica federale di Giudice di Gara.</p>
        </div>
      </div>
      <div className="azioni no-stampa">
        <button className="btn-primario" onClick={() => window.print()}>Stampa o salva in PDF</button>
        <button className="btn-secondario" onClick={onChiudi}>Chiudi</button>
      </div>
    </section>
  );
}
