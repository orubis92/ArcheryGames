import { useRef, useState } from 'react';
import { GIOCHI } from '../giochi.js';
import {
  caricaProfilo, salvaProfilo, aggiornaImpostazione, streak, riepilogoPerGioco, puntiDeboli, esporta, importa, azzeraTutto,
} from '../lib/profilo.js';
import { CAUSE } from '../games/lettura/letture.js';
import { IRREGOLARITA } from '../games/piazzola/regole.js';

const NOMI = Object.fromEntries(GIOCHI.map((g) => [g.id, g.nome]));
NOMI.esame = 'Esame giudice';

function etichettaErrore(gioco, chiave) {
  if (gioco === 'lettura') return CAUSE[chiave]?.nome || chiave;
  if (gioco === 'piazzola') return IRREGOLARITA[chiave]?.nome || chiave;
  return chiave; // giudice/esame: la fonte normativa
}

export default function Profilo({ onEsci }) {
  const [p, setP] = useState(caricaProfilo);
  const [msg, setMsg] = useState('');
  const fileRef = useRef(null);
  const per = riepilogoPerGioco(p);
  const giorni = streak(p);
  const totaleSessioni = p.sessioni.length;

  const cambiaNome = (nome) => setP(salvaProfilo({ ...p, nome }));
  const toggleSuoni = () => setP(aggiornaImpostazione('suoni', !p.impostazioni.suoni));

  const scarica = () => {
    const blob = new Blob([JSON.stringify(esporta(), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `archery-games-progressi-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    setMsg('File dei progressi scaricato.');
  };

  const carica = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      const dati = JSON.parse(await f.text());
      if (importa(dati)) {
        setP(caricaProfilo());
        setMsg('Progressi importati. I dati precedenti sono stati sostituiti.');
      } else setMsg('File non riconosciuto.');
    } catch {
      setMsg('File non leggibile.');
    }
    e.target.value = '';
  };

  const azzera = () => {
    if (!window.confirm('Cancellare tutti i progressi di tutti i giochi su questo dispositivo?')) return;
    azzeraTutto();
    setP(caricaProfilo());
    setMsg('Progressi azzerati.');
  };

  return (
    <section className="schermo profilo">
      <header className="testata">
        <button className="btn-testo" onClick={onEsci}>‹ Giochi</button>
        <h1>Profilo</h1>
      </header>

      <div className="riquadro">
        <label className="campo">
          <span>Nome (per l'attestato d'esame)</span>
          <input type="text" value={p.nome} onChange={(e) => cambiaNome(e.target.value)} placeholder="Nome e cognome" />
        </label>
        <label className="campo riga">
          <input type="checkbox" checked={p.impostazioni.suoni} onChange={toggleSuoni} />
          <span>Suoni (freccia che si pianta, errore)</span>
        </label>
      </div>

      <div className="tessere">
        <div className="tessera"><b>{giorni}</b><small>{giorni === 1 ? 'giorno di fila' : 'giorni di fila'}</small></div>
        <div className="tessera"><b>{totaleSessioni}</b><small>sessioni</small></div>
        <div className="tessera">
          <b>{Object.values(per).reduce((a, r) => a + r.punti, 0)}</b>
          <small>punti totali</small>
        </div>
      </div>

      <h2>Per gioco</h2>
      {Object.keys(per).length === 0 && <p className="intro">Nessuna sessione registrata: gioca una sessione completa e torna qui.</p>}
      {Object.entries(per).map(([g, r]) => {
        const deboli = puntiDeboli(p, g);
        return (
          <div key={g} className="riquadro gioco-stat">
            <div className="riga-stat">
              <strong>{NOMI[g] || g}</strong>
              <span>{r.sessioni} sessioni · media {r.totale ? Math.round((r.punti / r.totale) * 100) : 0}% · migliore {Math.round(r.migliore * 100)}%</span>
            </div>
            {deboli.length > 0 && (
              <div className="deboli">
                <small>Dove sbagli più spesso (ultime sessioni)</small>
                <ul>
                  {deboli.map(([k, n]) => <li key={k}><span>{etichettaErrore(g, k)}</span><b>×{n}</b></li>)}
                </ul>
              </div>
            )}
          </div>
        );
      })}

      <h2>Dati</h2>
      <p className="intro piccolo">I progressi stanno solo su questo dispositivo. Esportali per portarli su un altro telefono o per non perderli.</p>
      <div className="azioni">
        <button className="btn-secondario" onClick={scarica}>Esporta progressi</button>
        <button className="btn-secondario" onClick={() => fileRef.current?.click()}>Importa progressi</button>
        <input ref={fileRef} type="file" accept="application/json" hidden onChange={carica} />
      </div>
      {msg && <p className="intro piccolo">{msg}</p>}
      <button className="btn-testo piccolo" onClick={azzera}>Azzera tutti i progressi</button>
    </section>
  );
}
