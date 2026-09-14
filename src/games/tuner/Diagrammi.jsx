// Diagrammi SVG dei test del tuner.

function Viso({ r = 90 }) {
  // viso di bersaglio semplificato (5 anelli)
  const colori = ['#f4f1ea', '#1d1d1d', '#3f7bd9', '#d9382b', '#e9c53a'];
  return (
    <g>
      {colori.map((c, i) => (
        <circle key={i} cx="100" cy="100" r={r - i * (r / 5)} fill={c} stroke="#333" strokeWidth="0.6" />
      ))}
    </g>
  );
}

export function DiagrammaCarta({ oriz, vert }) {
  // strappo: dal foro centrale verso la direzione (oriz>0 = sinistra, vert>0 = alto)
  const len = Math.min(70, Math.hypot(oriz, vert) * 32);
  const ang = Math.atan2(-vert, -oriz); // in SVG y cresce verso il basso; oriz>0 → sinistra
  const ex = 100 + Math.cos(ang) * len;
  const ey = 100 + Math.sin(ang) * len;
  const px = -Math.sin(ang) * 6;
  const py = Math.cos(ang) * 6;
  return (
    <svg viewBox="0 0 200 200" className="diagramma">
      <rect x="10" y="10" width="180" height="180" fill="#fbfaf6" stroke="#b9b2a2" />
      {len > 8 && (
        <polygon points={`${100 + px},${100 + py} ${ex},${ey} ${100 - px},${100 - py}`} fill="#d9d2c2" stroke="#6b6253" strokeWidth="0.8" />
      )}
      {/* foro: punta + tre alette */}
      <circle cx="100" cy="100" r="4" fill="#2b2b2b" />
      {[90, 210, 330].map((a) => (
        <line
          key={a}
          x1="100"
          y1="100"
          x2={100 + Math.cos((a * Math.PI) / 180) * 16}
          y2={100 + Math.sin((a * Math.PI) / 180) * 16}
          stroke="#2b2b2b"
          strokeWidth="2"
          strokeLinecap="round"
        />
      ))}
      <text x="100" y="196" textAnchor="middle" className="d-testo">carta a 2 m · vista dall'arciere</text>
    </svg>
  );
}

export function DiagrammaNuda({ dx, dy }) {
  const impennate = [
    [-5, -3],
    [4, -1],
    [0, 5],
  ];
  return (
    <svg viewBox="0 0 200 200" className="diagramma">
      <Viso />
      {impennate.map(([x, y], i) => (
        <circle key={i} cx={100 + x} cy={100 + y} r="4" fill="#1f3b2d" stroke="#fff" strokeWidth="1" />
      ))}
      <circle cx={100 + dx * 2.2} cy={100 + dy * 2.2} r="4.5" fill="#c98a1b" stroke="#fff" strokeWidth="1" />
      <text x="100" y="196" textAnchor="middle" className="d-testo">18 m · verde impennate, ambra nuda</text>
    </svg>
  );
}

export function DiagrammaRosata({ punti }) {
  return (
    <svg viewBox="0 0 200 200" className="diagramma">
      <Viso />
      {punti.map(([x, y], i) => (
        <circle key={i} cx={100 + x} cy={100 + y} r="3.5" fill="#1f3b2d" stroke="#fff" strokeWidth="0.8" />
      ))}
      <text x="100" y="196" textAnchor="middle" className="d-testo">30 m · 12 frecce</text>
    </svg>
  );
}

// genera i 12 punti della rosata (in unità del viso) da un risultato
export function puntiRosata({ raggio, dx, dy }) {
  const pts = [];
  for (let i = 0; i < 12; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = Math.sqrt(Math.random()) * raggio * 22;
    pts.push([dx * 2.2 + Math.cos(a) * r, dy * 2.2 + Math.sin(a) * r * 0.9]);
  }
  return pts;
}
