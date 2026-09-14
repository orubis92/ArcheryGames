// Condivisione del risultato: testo via Web Share (o copia negli appunti)
// e immagine PNG generata su canvas (condivisa come file, se il dispositivo
// lo consente, altrimenti scaricata).
import { useState } from 'react';

function disegnaCartolina({ titolo, punteggio, sottotitolo, dettaglio }) {
  const W = 1080;
  const H = 1080;
  const cv = document.createElement('canvas');
  cv.width = W;
  cv.height = H;
  const g = cv.getContext('2d');
  const fondo = g.createLinearGradient(0, 0, 0, H);
  fondo.addColorStop(0, '#1f3b2d');
  fondo.addColorStop(1, '#0f1f17');
  g.fillStyle = fondo;
  g.fillRect(0, 0, W, H);
  // bersaglio sullo sfondo
  const anelli = [['#f4f1ea', 300], ['#1d1d1d', 240], ['#3f7bd9', 180], ['#d9382b', 120], ['#e9c53a', 60]];
  g.globalAlpha = 0.18;
  for (const [c, r] of anelli) {
    g.beginPath();
    g.arc(W - 220, 260, r, 0, Math.PI * 2);
    g.fillStyle = c;
    g.fill();
  }
  g.globalAlpha = 1;
  g.fillStyle = '#c98a1b';
  g.font = 'bold 44px system-ui, sans-serif';
  g.fillText('ARCHERY GAMES', 80, 130);
  g.fillStyle = '#f4f1ea';
  g.font = 'bold 72px system-ui, sans-serif';
  g.fillText(titolo, 80, 230);
  g.font = '40px system-ui, sans-serif';
  g.fillStyle = '#cfd9d2';
  g.fillText(sottotitolo, 80, 300);
  g.fillStyle = '#e9c53a';
  g.font = 'bold 260px system-ui, sans-serif';
  g.fillText(punteggio, 80, 640);
  g.fillStyle = '#f4f1ea';
  g.font = '44px system-ui, sans-serif';
  const righe = dettaglio.split('\n');
  righe.forEach((r, i) => g.fillText(r, 80, 760 + i * 60));
  g.fillStyle = '#7fb896';
  g.font = '32px system-ui, sans-serif';
  g.fillText(new Date().toLocaleDateString('it-IT'), 80, H - 80);
  return cv;
}

export default function Condividi({ titolo, punteggio, sottotitolo = '', dettaglio = '' }) {
  const [stato, setStato] = useState('');
  const testo = `${titolo}: ${punteggio}${sottotitolo ? ` (${sottotitolo})` : ''}\n${dettaglio}\n#ArcheryGames`;

  const condividiTesto = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Archery Games', text: testo });
        setStato('condiviso');
      } else {
        await navigator.clipboard.writeText(testo);
        setStato('copiato');
      }
    } catch {
      setStato('');
    }
  };

  const condividiImmagine = async () => {
    const cv = disegnaCartolina({ titolo, punteggio, sottotitolo, dettaglio });
    const blob = await new Promise((res) => cv.toBlob(res, 'image/png'));
    const file = new File([blob], 'archery-games.png', { type: 'image/png' });
    try {
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: 'Archery Games', text: testo });
        setStato('condiviso');
        return;
      }
    } catch {
      /* annullato: si passa allo scaricamento */
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'archery-games.png';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    setStato('scaricato');
  };

  return (
    <div className="condividi">
      <button className="btn-secondario" onClick={condividiTesto}>Condividi il risultato</button>
      <button className="btn-secondario" onClick={condividiImmagine}>Immagine per la chat</button>
      {stato && (
        <small>
          {stato === 'copiato' && 'Testo copiato negli appunti.'}
          {stato === 'condiviso' && 'Condiviso.'}
          {stato === 'scaricato' && 'Immagine scaricata.'}
        </small>
      )}
    </div>
  );
}
