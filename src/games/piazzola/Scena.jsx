// Scena sintetica di una piazzola 3D vista dal picchetto, con prospettiva reale
// (altezza apparente ∝ 1/distanza) e i difetti da individuare disegnati.
import { SAGOME } from '../giudice/sagome.js';

const W = 900;
const H = 560;
const F = 780; // "focale" in px
const H_CAM = 1.6; // altezza dell'occhio in m
const ORIZZONTE = 250;
const ALTEZZE = { cinghiale: 0.9, cervo: 1.4, volpe: 0.45, lepre: 0.35 }; // altezza reale (m) delle sagome
const TOP = { cinghiale: 72, cervo: 52, volpe: 80, lepre: 82 }; // y minimo del path nel viewBox 300x250

function rng(seed) {
  let s = (seed * 2654435761) >>> 0 || 1;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function Albero({ x, dist, r }) {
  const scala = F / dist;
  const yBase = ORIZZONTE + H_CAM * scala;
  const hT = 6 * scala;
  const wT = 0.35 * scala;
  const rC = (1.6 + r * 1.2) * scala;
  const tinta = 30 + Math.min(40, dist * 0.8);
  return (
    <g>
      <rect x={x - wT / 2} y={yBase - hT} width={wT} height={hT} fill={`hsl(28 30% ${tinta}%)`} />
      <circle cx={x} cy={yBase - hT} r={rC} fill={`hsl(${110 + r * 30} 35% ${tinta + 5}%)`} />
    </g>
  );
}

function Cespuglio({ x, y, s, tinta = '#4c7a3c' }) {
  return (
    <g>
      <ellipse cx={x} cy={y} rx={s} ry={s * 0.7} fill={tinta} />
      <ellipse cx={x - s * 0.6} cy={y + s * 0.15} rx={s * 0.7} ry={s * 0.5} fill={tinta} />
      <ellipse cx={x + s * 0.6} cy={y + s * 0.1} rx={s * 0.75} ry={s * 0.55} fill={tinta} />
      <ellipse cx={x} cy={y - s * 0.35} rx={s * 0.6} ry={s * 0.45} fill="#5d8c48" />
    </g>
  );
}

function Battifreccia({ x, y, w, h }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="#8c7a5b" stroke="#4a3f2c" strokeWidth="1.5" />
      <path d={`M${x} ${y + h * 0.33} h${w} M${x} ${y + h * 0.66} h${w}`} stroke="#4a3f2c" strokeWidth="1" />
    </g>
  );
}

export default function Scena({ scena, seed = 1 }) {
  const r = rng(seed);
  const sp = SAGOME[scena.specie];
  const dist = scena.distanza;
  // Prospettiva compressa: la distanza è scritta in tabella, la scena deve restare leggibile.
  // Altezza apparente della sagoma tra ~95 e ~170 px, decrescente con la distanza.
  const hPx = Math.max(95, 175 - dist * 1.5);
  // profondità "di scena" usata per la posizione a terra e per gli alberi
  const distEff = 14 + dist * 0.3;
  const yBase = ORIZZONTE + (H_CAM * F) / distEff;
  const xC = W / 2 + (r() - 0.5) * 100;
  const hPath = 212 - TOP[scena.specie];
  const k = hPx / hPath;
  const wPath = 300 * k;
  const tx = xC - wPath / 2;
  const ty = yBase - 212 * k;
  const spotX = tx + sp.spot.cx * k;
  const spotY = ty + sp.spot.cy * k;
  const spotR = sp.spot.r * k;
  const metro = (hPx / ALTEZZE[scena.specie]) * 0.55; // un metro "di scena", compresso

  const alberi = [];
  for (let i = 0; i < 14; i++) {
    const d = distEff * (1.3 + r() * 3);
    let x = r() * W;
    // gli alberi poco più lontani della sagoma non devono coprirla
    if (d < distEff * 2.2 && Math.abs(x - xC) < wPath * 0.8) x = xC + Math.sign(x - xC || 1) * (wPath * 0.8 + r() * 200);
    alberi.push({ x, dist: d, r: r() });
  }
  for (let i = 0; i < 2; i++) alberi.push({ x: i === 0 ? r() * W * 0.12 : W - r() * W * 0.12, dist: distEff * (0.45 + r() * 0.25), r: r() });
  alberi.sort((a, b) => b.dist - a.dist);
  const nebbia = Math.min(0.35, dist / 160);

  const colorePicchetto = { giallo: '#e2c02a', bianco: '#f4f4f0', rosso: '#c9302c' }[scena.picchetto];
  const dosso = scena.dosso;
  const retro = scena.retro;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="scena" role="img" aria-label="Piazzola vista dal picchetto">
      <defs>
        <linearGradient id="s-cielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#cfd9d2" /><stop offset="1" stopColor="#e9ede4" /></linearGradient>
        <linearGradient id="s-terra" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6f7f4e" /><stop offset="1" stopColor="#4f5a36" /></linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#s-cielo)" />
      <rect y={ORIZZONTE} width={W} height={H - ORIZZONTE} fill="url(#s-terra)" />

      {/* crinale (tiro dall'alto): linea di cresta dietro la sagoma con quota */}
      {scena.altana && (
        <g>
          <path d={`M0 ${ORIZZONTE - 20} Q ${W / 2} ${ORIZZONTE - 60} ${W} ${ORIZZONTE - 10} L${W} ${ORIZZONTE} L0 ${ORIZZONTE} Z`} fill="#8a9a6a" />
          <line x1={xC + 120} y1={ORIZZONTE - 40} x2={xC + 120} y2={yBase - hPx} stroke="#fff" strokeWidth="2" strokeDasharray="6 4" />
          <text x={xC + 128} y={(ORIZZONTE - 40 + yBase - hPx) / 2} className="s-quota">{scena.crinaleMetri} m</text>
        </g>
      )}

      {alberi.filter((a) => a.dist > distEff).map((a, i) => <Albero key={i} {...a} />)}

      {/* retro della sagoma */}
      {retro === 'terrapieno' && (
        <ellipse cx={xC} cy={yBase - hPx * 0.1} rx={wPath * 0.95} ry={hPx * 0.85} fill="#7a6a4a" />
      )}
      {(retro === 'sentiero' || retro === 'sentiero-protetto') && (
        <g>
          <path d={`M${xC - wPath * 2} ${yBase - hPx * 0.3} Q ${xC} ${yBase - hPx * 0.8} ${xC + wPath * 2} ${yBase - hPx * 0.25}`} stroke="#c9b892" strokeWidth={hPx * 0.18} fill="none" strokeLinecap="round" />
          <g transform={`translate(${xC + wPath * 0.9} ${yBase - hPx * 0.45})`}>
            <rect x={-hPx * 0.5} y={-hPx * 1.3} width={hPx} height={hPx * 0.5} fill="#f4f1ea" stroke="#333" strokeWidth="1" />
            <line x1="0" y1={-hPx * 0.8} x2="0" y2="0" stroke="#333" strokeWidth="2" />
            <text x="0" y={-hPx * 0.95} textAnchor="middle" className="s-cartello" style={{ fontSize: hPx * 0.28 }}>sentiero</text>
          </g>
          {retro === 'sentiero-protetto' && (
            <g>
              <Battifreccia x={xC - wPath / 2 - metro} y={yBase - hPx - 2 * metro} w={wPath + 2 * metro} h={hPx + 2 * metro} />
              <line x1={xC - wPath * 1.6} y1={yBase - hPx * 1.05} x2={xC + wPath * 1.6} y2={yBase - hPx * 1.0} stroke="#d9382b" strokeWidth="3" strokeDasharray="12 8" />
              <line x1={xC - wPath * 1.6} y1={yBase - hPx * 1.05} x2={xC + wPath * 1.6} y2={yBase - hPx * 1.0} stroke="#fff" strokeWidth="3" strokeDasharray="12 8" strokeDashoffset="12" />
            </g>
          )}
        </g>
      )}
      {dosso && (
        <g>
          <ellipse cx={xC} cy={yBase + hPx * 0.35} rx={wPath * 1.3} ry={hPx * 0.7} fill="#7f8f5a" />
          <path d={`M${xC - wPath * 1.3} ${yBase + hPx * 0.35} Q ${xC} ${yBase - hPx * 0.5} ${xC + wPath * 1.3} ${yBase + hPx * 0.35}`} fill="#8a9a63" />
          {dosso === 'protetto' && <Battifreccia x={xC - wPath / 2 - metro} y={yBase - hPx - 2 * metro} w={wPath + 2 * metro} h={hPx + 2 * metro} />}
        </g>
      )}

      {/* ostacolo voluto vicino al bersaglio */}
      {scena.ostacolo === 'bersaglio' && (
        <rect x={xC + wPath * 0.55} y={yBase - hPx * 3.2} width={hPx * 0.22} height={hPx * 3.3} fill="#5a4630" />
      )}

      {/* sagoma con zone di punteggio */}
      <g transform={`translate(${tx.toFixed(1)} ${ty.toFixed(1)}) scale(${k.toFixed(4)})`}>
        <ellipse cx="150" cy="214" rx="120" ry="8" fill="#000" opacity="0.25" />
        {sp.corna && <path d={sp.corna} fill="none" stroke="#4a3418" strokeWidth="3" strokeLinecap="round" />}
        <path d={sp.corpo} fill="#8a6a44" stroke="#3f2d17" strokeWidth="1.5" />
        <circle cx={sp.spot.cx} cy={sp.spot.cy} r={sp.spot.r} fill="#e0c27a" stroke="#222" strokeWidth="1.5" />
        <circle cx={sp.spot.cx} cy={sp.spot.cy} r={sp.spot.r * 0.5} fill="#d9822b" stroke="#222" strokeWidth="1.5" />
        <circle cx={sp.spot.cx} cy={sp.spot.cy} r={sp.spot.r * 0.2} fill="#8f1d1d" stroke="#222" strokeWidth="1" />
      </g>

      {/* vegetazione che copre lo spot o la sagoma */}
      {scena.copertura === 'spot' && <Cespuglio x={spotX - spotR * 0.5} y={spotY + spotR * 0.4} s={Math.max(10, spotR * 1.3)} />}
      {scena.copertura === 'sagoma' && <Cespuglio x={tx + wPath * 0.22} y={yBase - hPx * 0.25} s={Math.max(12, hPx * 0.55)} />}

      {alberi.filter((a) => a.dist <= distEff).map((a, i) => <Albero key={'v' + i} {...a} />)}

      {/* ramo sulla traiettoria (a metà strada, all'altezza della parabola) o ben più in alto */}
      {scena.ramo && (
        <path
          d={
            scena.ramo === 'traiettoria'
              ? `M${W} ${ORIZZONTE - 40} C ${W * 0.8} ${ORIZZONTE - 30} ${W * 0.65} ${ORIZZONTE - 10} ${xC + 40} ${(ORIZZONTE + yBase - hPx) / 2 - 10}`
              : `M${W} 40 C ${W * 0.8} 30 ${W * 0.6} 20 ${W * 0.35} 60`
          }
          fill="none"
          stroke="#4a3a24"
          strokeWidth={scena.ramo === 'traiettoria' ? 9 : 14}
          strokeLinecap="round"
        />
      )}
      {scena.ramo === 'traiettoria' && (
        <path d={`M${xC + 40} ${(ORIZZONTE + yBase - hPx) / 2 - 10} l-30 -12 m30 12 l-22 14`} stroke="#4a3a24" strokeWidth="5" strokeLinecap="round" fill="none" />
      )}

      <rect y={ORIZZONTE} width={W} height={H - ORIZZONTE} fill="#e9ede4" opacity={nebbia} />

      {/* ostacolo vicino al picchetto */}
      {scena.ostacolo === 'picchetto' && <Cespuglio x={W / 2 + 130} y={H - 90} s={95} tinta="#3f6a33" />}

      {/* picchetto in primo piano */}
      <g transform={`translate(${W / 2 - 40} ${H - 30})`}>
        <rect x="-10" y="-90" width="20" height="90" fill={colorePicchetto} stroke="#333" strokeWidth="2" />
        <polygon points="-10,-90 0,-104 10,-90" fill={colorePicchetto} stroke="#333" strokeWidth="2" />
      </g>
    </svg>
  );
}
