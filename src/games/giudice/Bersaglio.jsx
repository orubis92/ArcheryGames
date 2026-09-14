// Diagramma di un bersaglio 3D con le zone di punteggio (Sagoma, Spot,
// Super Spot, Perfect), la base di supporto ed eventuali corna.
// La freccia è rappresentata dalla sezione dell'asta (cerchio) più un tratto
// di asta e impennaggio: il cerchio è ciò che conta per la tangenza.
// Le silhouette sono definite in sagome.js.
import { SAGOME, RAGGIO_ASTA, posizioneFreccia } from './sagome.js';

function Sagoma({ def }) {
  const [bx, by, bw, bh] = def.base;
  const { cx, cy, r } = def.spot;
  return (
    <g>
      {/* base di supporto, delimitata da una riga ben definita */}
      <rect x={bx} y={by} width={bw} height={bh} className="b-base" />
      <line x1={bx} y1={by} x2={bx + bw} y2={by} className="b-riga" />
      {/* corna: escluse dal punteggio */}
      {def.corna && <path d={def.corna} className="b-corna" />}
      {/* sagoma */}
      <path d={def.corpo} className="b-corpo" />
      {def.dettagli && <path d={def.dettagli} className="b-dettagli" />}
      {/* zone di punteggio */}
      <circle cx={cx} cy={cy} r={r} className="b-spot" />
      <circle cx={cx} cy={cy} r={r * 0.5} className="b-superspot" />
      <circle cx={cx} cy={cy} r={r * 0.2} className="b-perfect" />
    </g>
  );
}

function Freccia({ x, y }) {
  // Tratto di asta che "esce" dal bersaglio verso l'osservatore, in prospettiva.
  // Va verso l'alto a sinistra, salvo quando la freccia è vicina al bordo superiore.
  const giu = y < 50;
  const dx = -14;
  const dy = giu ? 22 : -22;
  const ex = x + dx;
  const ey = y + dy;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  const px = -uy;
  const py = ux;
  const punti = [
    [ex, ey],
    [ex + px * 5 + ux * 4, ey + py * 5 + uy * 4],
    [ex + ux * 10, ey + uy * 10],
    [ex - px * 5 + ux * 4, ey - py * 5 + uy * 4],
  ];
  return (
    <g className="b-freccia">
      <line x1={x} y1={y} x2={ex} y2={ey} className="b-asta" />
      <polygon points={punti.map((p) => p.map((v) => v.toFixed(1)).join(',')).join(' ')} className="b-impennaggio" />
      <circle cx={x} cy={y} r={RAGGIO_ASTA} className="b-sezione" />
    </g>
  );
}

/**
 * props.bersaglio: { sagoma: 'cinghiale'|'cervo'|'volpe'|'lepre', zona: <vedi sagome.js>, nota? }
 */
export default function Bersaglio({ bersaglio }) {
  const def = SAGOME[bersaglio.sagoma] || SAGOME.cinghiale;
  const freccia = posizioneFreccia(bersaglio.sagoma in SAGOME ? bersaglio.sagoma : 'cinghiale', bersaglio.zona);
  // Lente d'ingrandimento nell'angolo in alto a sinistra (zona libera dalle sagome).
  const L = { cx: 40, cy: 40, r: 34, scala: 2.4 };
  return (
    <figure className="bersaglio">
      <svg viewBox="0 0 300 250" role="img" aria-label={`Bersaglio 3D (${def.nome}) con la posizione della freccia`}>
        <defs>
          <clipPath id="lente-clip">
            <circle cx={L.cx} cy={L.cy} r={L.r - 1} />
          </clipPath>
        </defs>
        <Sagoma def={def} />
        <Freccia x={freccia.x} y={freccia.y} />
        <g className="b-lente">
          <circle cx={L.cx} cy={L.cy} r={L.r} className="b-lente-bordo" />
          <g clipPath="url(#lente-clip)">
            <rect x={L.cx - L.r} y={L.cy - L.r} width={2 * L.r} height={2 * L.r} className="b-lente-fondo" />
            <g transform={`translate(${L.cx} ${L.cy}) scale(${L.scala}) translate(${-freccia.x} ${-freccia.y})`}>
              <Sagoma def={def} />
              <circle cx={freccia.x} cy={freccia.y} r={RAGGIO_ASTA} className="b-sezione" />
            </g>
          </g>
          <circle cx={L.cx} cy={L.cy} r={L.r} className="b-lente-anello" />
        </g>
        <text x="294" y="244" textAnchor="end" className="b-specie">{def.nome} · gruppo {def.gruppo}</text>
      </svg>
      <figcaption>
        <span className="legenda"><i className="sw perfect" /> Perfect</span>
        <span className="legenda"><i className="sw superspot" /> Super Spot</span>
        <span className="legenda"><i className="sw spot" /> Spot</span>
        <span className="legenda"><i className="sw sagoma" /> Sagoma</span>
        {bersaglio.nota && <span className="nota">{bersaglio.nota}</span>}
      </figcaption>
    </figure>
  );
}
