import { useEffect, useMemo, useState } from 'react';
import Scena from './Scena.jsx';
import { LIVELLI, IRREGOLARITA, NOMI_SPECIE, generaCaso, spiegaDistanza, valuta, casoDaFoto } from './regole.js';
import { leggi, scrivi } from '../../lib/storage.js';
import Esito from '../../components/Esito.jsx';
import Condividi from '../../components/Condividi.jsx';
import { registraSessioneProfilo } from '../../lib/profilo.js';

const PER_SESSIONE = 8;
const CHIAVE = 'piazzola.controllo.v1';

export default function Piazzola({ onEsci }) {
  const [stats, setStats] = useState(() => leggi(CHIAVE, {}));
  const [sessione, setSessione] = useState(null);
  const [foto, setFoto] = useState(null); // archivio fotografico: null = non caricato

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}piazzole/foto.json`, { cache: 'no-cache' })
      .then((r) => (r.ok ? r.json() : []))
      .then((v) => setFoto(Array.isArray(v) ? v : []))
      .catch(() => setFoto([]));
  }, []);

  const avvia = (livello) => {
    let casi;
    if (livello === 'foto') {
      casi = foto.map(casoDaFoto).sort(() => Math.random() - 0.5).slice(0, PER_SESSIONE);
    } else {
      casi = Array.from({ length: PER_SESSIONE }, () => ({ ...generaCaso(livello), seed: Math.floor(Math.random() * 1e6) }));
    }
    setSessione({ livello, casi, indice: 0, risposte: [] });
  };

  if (!sessione) {
    return (
      <Menu
        stats={stats}
        foto={foto}
        onAvvia={avvia}
        onEsci={onEsci}
        onAzzera={() => {
          scrivi(CHIAVE, {});
          setStats({});
        }}
      />
    );
  }

  const { casi, indice, risposte, livello } = sessione;
  if (indice >= casi.length) {
    return (
      <Riepilogo
        sessione={sessione}
        onRipeti={() => avvia(livello)}
        onMenu={() => {
          setStats(leggi(CHIAVE, {}));
          setSessione(null);
        }}
      />
    );
  }

  const c = casi[indice];
  const rispondi = (scelte) => {
    const v = valuta(c, scelte);
    setSessione({ ...sessione, risposte: [...risposte, { scelte, ...v }] });
  };
  const avanti = () => {
    const prossimo = indice + 1;
    if (prossimo >= casi.length) {
      const punti = risposte.reduce((a, r) => a + r.punti, 0);
      const s = leggi(CHIAVE, {});
      const l = s[livello] || { migliore: 0, totale: casi.length * 10, sessioni: 0 };
      l.sessioni += 1;
      l.totale = casi.length * 10;
      if (punti > l.migliore) l.migliore = punti;
      s[livello] = l;
      scrivi(CHIAVE, s);
      registraSessioneProfilo({
        gioco: 'piazzola',
        punti,
        totale: casi.length * 10,
        etichetta: LIVELLI[livello].nome,
        errori: casi.flatMap((c, i) => (risposte[i].punti < 10 ? c.difetti.filter((k) => !risposte[i].scelte.includes(k)) : [])),
      });
    }
    setSessione({ ...sessione, indice: prossimo });
  };

  return (
    <Controllo
      caso={c}
      numero={indice + 1}
      totale={casi.length}
      risposta={risposte[indice]}
      onRispondi={rispondi}
      onAvanti={avanti}
      onEsci={() => setSessione(null)}
    />
  );
}

function Menu({ stats, foto, onAvvia, onEsci, onAzzera }) {
  const nFoto = foto ? foto.length : 0;
  return (
    <section className="schermo">
      <header className="testata">
        <button className="btn-testo" onClick={onEsci}>‹ Giochi</button>
        <h1>Controllo piazzola</h1>
      </header>
      <p className="intro">
        Sei il Giudice di Gara al sopralluogo. Per ogni piazzola vedi la scena dal picchetto e la tabella: gara, gruppo,
        picchetto, distanza misurata. Decidi se è regolare o segnala cosa non va. Otto piazzole per sessione.
      </p>
      <div className="lista-livelli">
        {Object.entries(LIVELLI).map(([n, l]) => {
          const s = stats[n];
          const isFoto = n === 'foto';
          if (isFoto && nFoto === 0) return null;
          return (
            <button key={n} className={`card-livello ${isFoto ? 'misto' : ''}`} onClick={() => onAvvia(isFoto ? 'foto' : Number(n))}>
              <span className="numero">{isFoto ? '📷' : n}</span>
              <span className="testo">
                <strong>{l.nome}</strong>
                <small>{l.descrizione}{isFoto ? ` ${nFoto} in archivio.` : ''}</small>
                {s && <small className="meta">miglior sessione {s.migliore}/{s.totale} · {s.sessioni} sessioni</small>}
              </span>
            </button>
          );
        })}
      </div>
      {nFoto === 0 && (
        <p className="nota-fonti">
          Livello "Foto del campo": aggiungi le foto delle vostre piazzole in <code>public/piazzole/</code> e descrivile in{' '}
          <code>foto.json</code> (vedi README); comparirà qui.
        </p>
      )}
      <p className="nota-fonti">
        Fonti: Regolamento Sportivo 3D rev. 6.6 (Cap. III e V), Regolamento Gare Outdoor 2026 (tabelle delle distanze),
        Regolamento attuativo sicurezza campi gara (Cap. II Par. III–IV). Punteggio: 10 se la valutazione è esatta, 5 se
        hai visto l'irregolarità ma non tutti i motivi, 2 se irregolare per un motivo sbagliato, 0 se hai promosso una
        piazzola irregolare o bocciato una regolare.
      </p>
      <button className="btn-testo piccolo" onClick={onAzzera}>Azzera i progressi</button>
    </section>
  );
}

function Controllo({ caso, numero, totale, risposta, onRispondi, onAvanti, onEsci }) {
  const { scena, livello } = caso;
  const chiavi = LIVELLI[livello].chiavi;
  const [scelte, setScelte] = useState([]);
  useEffect(() => {
    setScelte([]);
    window.scrollTo({ top: 0 });
  }, [caso.seed]);

  const risposto = Boolean(risposta);
  const toggle = (k) => setScelte((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]));
  const righeDistanza = useMemo(() => spiegaDistanza(scena), [scena]);

  return (
    <section className="schermo domanda">
      <header className="testata">
        <button className="btn-testo" onClick={onEsci}>‹ Esci</button>
        <span className="progresso">{numero} / {totale}</span>
        <span className="badge">{LIVELLI[livello].nome}</span>
      </header>
      <div className="barra"><i style={{ width: `${((numero - 1) / totale) * 100}%` }} /></div>

      <article className="scenario piazzola">
        {scena.foto ? (
          <figure className="foto">
            <a href={`${import.meta.env.BASE_URL}${scena.foto.replace(/^\//, '')}`} target="_blank" rel="noreferrer" title="Apri a schermo intero">
              <img src={`${import.meta.env.BASE_URL}${scena.foto.replace(/^\//, '')}`} alt="Piazzola fotografata dal picchetto" />
            </a>
            {scena.campo && <figcaption>{scena.campo}</figcaption>}
          </figure>
        ) : (
          <Scena scena={scena} seed={caso.seed} />
        )}

        <dl className="tabella-piazzola">
          <div><dt>Gara</dt><dd>{scena.gara}</dd></div>
          <div><dt>Gruppo</dt><dd>{scena.gruppo}{scena.specie ? ` · ${NOMI_SPECIE[scena.specie]}` : scena.nomeSagoma ? ` · ${scena.nomeSagoma}` : ''}</dd></div>
          <div><dt>Picchetto</dt><dd className={`pic-${scena.picchetto}`}>{scena.picchetto}</dd></div>
          <div className="dist"><dt>Distanza misurata</dt><dd>{scena.distanza} m</dd></div>
          {scena.picchetto === 'rosso' && <div><dt>Picchetto giallo</dt><dd>{scena.distanzaGiallo} m</dd></div>}
          {scena.motivoTolleranza && <div className="largo"><dt>Nota</dt><dd>Picchetto arretrato per la conformazione del terreno</dd></div>}
          {scena.altana && <div className="largo"><dt>Postazione</dt><dd>Tiro dall'alto da palchetto; crinale dietro la sagoma {scena.crinaleMetri} m sopra il bersaglio</dd></div>}
        </dl>

        {!risposto ? (
          <div className="verdetto">
            <h2>La piazzola è regolare?</h2>
            <ul className="checklist">
              {chiavi.map((k) => (
                <li key={k}>
                  <label className={scelte.includes(k) ? 'attiva' : ''}>
                    <input type="checkbox" checked={scelte.includes(k)} onChange={() => toggle(k)} />
                    <span>{IRREGOLARITA[k].nome}</span>
                  </label>
                </li>
              ))}
            </ul>
            <div className="azioni">
              <button className="btn-primario" onClick={() => onRispondi([])} disabled={scelte.length > 0}>Regolare</button>
              <button className="btn-primario ko" onClick={() => onRispondi(scelte)} disabled={scelte.length === 0}>
                Irregolare ({scelte.length})
              </button>
            </div>
          </div>
        ) : (
          <>
          <Esito tipo={risposta.punti >= 10 ? 'ok' : 'ko'} chiave={caso.seed} />
          <aside className={`spiegazione ${risposta.punti >= 10 ? 'ok' : 'ko'}`}>
            <strong>
              {risposta.esito === 'esatto' && `Valutazione esatta: ${risposta.punti} punti.`}
              {risposta.esito === 'falso-allarme' && 'Falso allarme: la piazzola era regolare. 0 punti.'}
              {risposta.esito === 'mancato' && 'Piazzola irregolare promossa. 0 punti.'}
              {risposta.esito === 'parziale' && `Irregolarità vista, ma motivi incompleti o sbagliati: ${risposta.punti} punti.`}
            </strong>
            {caso.difetti.length === 0 ? (
              <p><b>Piazzola regolare.</b></p>
            ) : (
              <ul className="motivi">
                {caso.difetti.map((k) => (
                  <li key={k}>
                    <b>{IRREGOLARITA[k].nome}.</b> <cite>{IRREGOLARITA[k].fonte(scena)}</cite>
                  </li>
                ))}
              </ul>
            )}
            <div className="dettaglio">
              {righeDistanza.map((t, i) => <p key={i}>{t}</p>)}
              {caso.note.map((t, i) => <p key={'n' + i}>{t}</p>)}
            </div>
            <button className="btn-primario" onClick={onAvanti}>
              {numero === totale ? 'Vedi il riepilogo' : 'Prossima piazzola'}
            </button>
          </aside>
          </>
        )}
      </article>
    </section>
  );
}

function Riepilogo({ sessione, onRipeti, onMenu }) {
  const { casi, risposte } = sessione;
  const punti = risposte.reduce((a, r) => a + r.punti, 0);
  const massimo = casi.length * 10;
  const falsi = risposte.filter((r) => r.esito === 'falso-allarme').length;
  const mancati = risposte.filter((r) => r.esito === 'mancato').length;
  const giudizio =
    punti >= massimo * 0.9 ? 'Sopralluogo da manuale.' :
    punti >= massimo * 0.7 ? 'Buon occhio; rivedi i motivi mancati.' :
    punti >= massimo * 0.5 ? 'Discreto: le tabelle delle distanze vanno sapute a memoria.' :
    'Prima del prossimo sopralluogo rileggi Cap. V del Regolamento Sportivo e il Regolamento attuativo sicurezza.';
  return (
    <section className="schermo riepilogo">
      <header className="testata"><h1>Riepilogo</h1></header>
      <div className="punteggio-finale">
        <span className="grande">{punti}<small>/{massimo}</small></span>
        <p>{giudizio}</p>
        <p>
          {mancati > 0 && `${mancati} piazzol${mancati === 1 ? 'a irregolare promossa' : 'e irregolari promosse'}`}
          {mancati > 0 && falsi > 0 && ' · '}
          {falsi > 0 && `${falsi} fals${falsi === 1 ? 'o allarme' : 'i allarmi'}`}
          {mancati === 0 && falsi === 0 && 'Nessuna promozione indebita e nessun falso allarme.'}
        </p>
      </div>
      <table className="tabella-stime">
        <thead><tr><th>Piazzola</th><th>Distanza</th><th>Esito</th><th>Punti</th></tr></thead>
        <tbody>
          {casi.map((c, i) => (
            <tr key={c.seed}>
              <td>{c.scena.gara} · G{c.scena.gruppo} · {c.scena.picchetto}</td>
              <td>{c.scena.distanza} m</td>
              <td>{c.difetti.length === 0 ? 'regolare' : c.difetti.map((k) => IRREGOLARITA[k].nome.split(' ')[0].toLowerCase()).join(', ')}</td>
              <td>{risposte[i].punti}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Condividi titolo="Controllo piazzola" punteggio={`${punti}/${massimo}`} sottotitolo={LIVELLI[sessione.livello].nome} dettaglio="Sopralluogo del giudice di gara" />
      <div className="azioni">
        <button className="btn-primario" onClick={onRipeti}>Nuova sessione</button>
        <button className="btn-secondario" onClick={onMenu}>Torna ai livelli</button>
      </div>
    </section>
  );
}
