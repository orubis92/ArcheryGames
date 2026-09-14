// Genera scene sintetiche di esempio per "Piazzola 3D" in public/piazzole/.
// Le scene usano una prospettiva reale (altezza apparente ∝ 1/distanza) per
// dare indizi credibili; vanno sostituite con foto vere del campo.
//
//   node scripts/genera-piazzole-esempio.mjs
//
// Sovrascrive public/piazzole/piazzole.json con le sole voci di esempio.
import { writeFileSync, mkdirSync } from 'node:fs';

const W = 900;
const H = 560;
const F = 780; // "focale" in px
const H_CAM = 1.6; // altezza dell'occhio, m
const ORIZZONTE = 250;

// altezza reale (m) al garrese delle sagome stilizzate e path (viewBox 300x250, base a y=212)
const SPECIE = {
  cinghiale: {
    h: 0.9,
    d: 'M58,150 C50,118 68,92 110,80 L122,72 L134,80 L150,74 L160,80 C190,72 218,82 238,100 C254,112 264,126 272,142 C276,150 280,158 274,164 L262,166 C258,172 250,174 244,170 L236,164 C230,172 222,176 214,178 L214,212 L200,212 L198,180 L186,182 L182,212 L168,212 L170,182 C150,186 130,185 108,180 L104,212 L90,212 L92,178 L80,176 L76,212 L62,212 L64,172 C54,166 54,158 58,150 Z',
    top: 72,
  },
  cervo: {
    h: 1.4,
    d: 'M62,140 C58,110 80,88 118,84 C150,80 180,84 206,92 L222,72 C228,60 240,52 254,54 C266,56 274,64 276,74 L284,82 C286,86 282,88 276,88 L268,90 C262,102 254,110 246,114 L236,150 C236,160 230,168 222,172 L224,212 L212,212 L208,174 L196,176 L194,212 L182,212 L184,178 C160,182 138,180 116,176 L114,212 L102,212 L104,174 L88,172 L86,212 L74,212 L76,166 C64,160 60,150 62,140 Z',
    corna: 'M246,58 L240,34 M240,34 L228,22 M240,34 L246,18 M240,34 L256,30 M256,58 L262,30 M262,30 L254,14 M262,30 L272,16 M262,30 L278,28',
    top: 52,
  },
  volpe: {
    h: 0.45,
    d: 'M70,150 C62,128 76,108 104,104 C130,100 158,104 182,112 L196,98 L200,80 L212,94 L224,92 L246,102 C256,106 262,112 262,116 L246,120 C242,130 234,144 218,152 L218,212 L206,212 L202,156 L188,160 L188,212 L176,212 L176,162 C154,166 130,164 110,158 L108,212 L96,212 L98,156 L84,152 L82,212 L70,212 L72,160 C58,164 40,166 28,160 C18,156 20,146 30,144 C46,142 58,146 70,150 Z',
    top: 80,
  },
  lepre: {
    h: 0.35,
    d: 'M96,164 C86,144 100,120 128,114 C156,108 182,116 198,132 L206,100 C208,88 214,80 220,82 C226,84 226,96 222,110 L232,104 C240,90 248,84 254,86 C258,90 254,104 244,116 L236,128 C238,142 232,156 222,164 L226,212 L214,212 L210,168 L196,170 L196,212 L184,212 L184,172 C164,176 146,176 130,172 L128,212 L116,212 L118,170 L108,168 L106,212 L94,212 L96,164 Z',
    top: 82,
  },
};

// generatore pseudo-casuale deterministico
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function albero(x, dist, r) {
  // tronco alto ~6 m, chioma
  const scala = F / dist;
  const yBase = ORIZZONTE + H_CAM * scala;
  const hT = 6 * scala;
  const wT = 0.35 * scala;
  const rC = (1.6 + r() * 1.2) * scala;
  const tinta = 30 + Math.min(40, dist * 0.8);
  return `<rect x="${(x - wT / 2).toFixed(1)}" y="${(yBase - hT).toFixed(1)}" width="${wT.toFixed(1)}" height="${hT.toFixed(1)}" fill="hsl(28 30% ${tinta}%)"/>
<circle cx="${x.toFixed(1)}" cy="${(yBase - hT).toFixed(1)}" r="${rC.toFixed(1)}" fill="hsl(${110 + r() * 30} 35% ${tinta + 5}%)"/>`;
}

function scena({ id, specie, distanza, seed }) {
  const r = rng(seed);
  const sp = SPECIE[specie];
  const scala = F / distanza;
  const hPx = sp.h * scala; // altezza apparente della sagoma
  const yBase = ORIZZONTE + H_CAM * scala;
  const xC = W / 2 + (r() - 0.5) * 120;
  // scala del path: altezza del path dal top al 212 → hPx
  const hPath = 212 - sp.top;
  const k = hPx / hPath;
  const wPath = 300 * k;
  const tx = xC - wPath / 2;
  const ty = yBase - 212 * k;

  // alberi dietro (più lontani) e davanti ai lati
  const alberi = [];
  for (let i = 0; i < 14; i++) {
    const dist = distanza * (1.15 + r() * 2.5);
    const x = r() * W;
    alberi.push({ x, dist });
  }
  for (let i = 0; i < 4; i++) {
    const dist = 4 + r() * Math.max(2, distanza * 0.5);
    const x = r() < 0.5 ? r() * W * 0.22 : W - r() * W * 0.22;
    alberi.push({ x, dist });
  }
  alberi.sort((a, b) => b.dist - a.dist);

  const nebbia = Math.min(0.35, distanza / 160);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
<defs>
  <linearGradient id="cielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfd9d2"/><stop offset="1" stop-color="#e9ede4"/></linearGradient>
  <linearGradient id="terra" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6f7f4e"/><stop offset="1" stop-color="#4f5a36"/></linearGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#cielo)"/>
<rect y="${ORIZZONTE}" width="${W}" height="${H - ORIZZONTE}" fill="url(#terra)"/>
${alberi.map((a) => albero(a.x, a.dist, r)).join('\n')}
<rect y="${ORIZZONTE}" width="${W}" height="${H - ORIZZONTE}" fill="#e9ede4" opacity="${nebbia.toFixed(2)}"/>
<g transform="translate(${tx.toFixed(1)} ${ty.toFixed(1)}) scale(${k.toFixed(4)})">
  <ellipse cx="150" cy="214" rx="120" ry="8" fill="#000" opacity="0.25"/>
  ${sp.corna ? `<path d="${sp.corna}" fill="none" stroke="#4a3418" stroke-width="3" stroke-linecap="round"/>` : ''}
  <path d="${sp.d}" fill="#8a6a44" stroke="#3f2d17" stroke-width="1.5"/>
</g>
<text x="12" y="${H - 12}" font-family="sans-serif" font-size="16" fill="#fff" opacity="0.7">esempio sintetico ${id}</text>
</svg>
`;
}

const ESEMPI = [
  { id: 'es-01', specie: 'cinghiale', distanza: 14, gruppo: 1, seed: 11 },
  { id: 'es-02', specie: 'lepre', distanza: 12.5, gruppo: 4, seed: 12 },
  { id: 'es-03', specie: 'cervo', distanza: 33, gruppo: 1, seed: 13 },
  { id: 'es-04', specie: 'volpe', distanza: 21, gruppo: 3, seed: 14 },
  { id: 'es-05', specie: 'cinghiale', distanza: 27.5, gruppo: 1, seed: 15 },
  { id: 'es-06', specie: 'cervo', distanza: 42, gruppo: 1, seed: 16 },
  { id: 'es-07', specie: 'volpe', distanza: 16, gruppo: 3, seed: 17 },
  { id: 'es-08', specie: 'lepre', distanza: 9, gruppo: 4, seed: 18 },
  { id: 'es-09', specie: 'cinghiale', distanza: 36, gruppo: 1, seed: 19 },
  { id: 'es-10', specie: 'cervo', distanza: 24, gruppo: 2, seed: 20 },
];

mkdirSync('public/piazzole', { recursive: true });
const voci = [];
for (const e of ESEMPI) {
  const file = `piazzole/${e.id}.svg`;
  writeFileSync(`public/${file}`, scena(e));
  const nomi = { cinghiale: 'Cinghiale', cervo: 'Cervo', volpe: 'Volpe', lepre: 'Lepre' };
  voci.push({
    id: e.id,
    foto: file,
    distanza: e.distanza,
    sagoma: nomi[e.specie],
    gruppo: e.gruppo,
    campo: 'Esempio sintetico',
    esempio: true,
  });
}
writeFileSync('public/piazzole/piazzole.json', JSON.stringify(voci, null, 2) + '\n');
console.log(`Generate ${voci.length} scene di esempio in public/piazzole/`);
