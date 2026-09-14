// Sagome originali (stilizzate) delle specie più comuni nei bersagli 3D di gara.
// Non sono riproduzioni di bersagli commerciali: servono a rendere leggibili le
// zone di punteggio (Sagoma, Spot, Super Spot, Perfect), la base e le corna.
//
// Coordinate in viewBox 0 0 300 250. Ogni sagoma è vista di profilo, rivolta a
// destra; la zona vitale (Spot) sta dietro la spalla anteriore.
//
// Campi:
//  nome         nome della specie
//  gruppo       gruppo indicativo del bersaglio (dimensione dello spot)
//  corpo        path della sagoma (zona di punteggio "Sagoma")
//  corna        path delle corna (escluse dal punteggio), facoltativo
//  spot         centro e raggio dello Spot; Super Spot = 0.5 r; Perfect = 0.2 r
//  base         rettangolo di supporto [x, y, larghezza, altezza]
//  puntoSagoma  punto "sicuro" nella sagoma lontano dallo spot (coscia posteriore)
//  puntoCorna   punto sulle corna, se presenti

export const SAGOME = {
  cinghiale: {
    nome: 'Cinghiale',
    gruppo: 1,
    corpo:
      'M58,150 C50,118 68,92 110,80 L122,72 L134,80 L150,74 L160,80 C190,72 218,82 238,100 C254,112 264,126 272,142 C276,150 280,158 274,164 L262,166 C258,172 250,174 244,170 L236,164 C230,172 222,176 214,178 L214,212 L200,212 L198,180 L186,182 L182,212 L168,212 L170,182 C150,186 130,185 108,180 L104,212 L90,212 L92,178 L80,176 L76,212 L62,212 L64,172 C54,166 54,158 58,150 Z',
    dettagli: 'M262,164 L270,170',
    spot: { cx: 196, cy: 134, r: 32 },
    base: [30, 212, 240, 16],
    puntoSagoma: { x: 100, y: 140 },
  },
  cervo: {
    nome: 'Cervo',
    gruppo: 1,
    corpo:
      'M62,140 C58,110 80,88 118,84 C150,80 180,84 206,92 L222,72 C228,60 240,52 254,54 C266,56 274,64 276,74 L284,82 C286,86 282,88 276,88 L268,90 C262,102 254,110 246,114 L236,150 C236,160 230,168 222,172 L224,212 L212,212 L208,174 L196,176 L194,212 L182,212 L184,178 C160,182 138,180 116,176 L114,212 L102,212 L104,174 L88,172 L86,212 L74,212 L76,166 C64,160 60,150 62,140 Z',
    corna:
      'M246,58 L240,34 M240,34 L228,22 M240,34 L246,18 M240,34 L256,30 M256,58 L262,30 M262,30 L254,14 M262,30 L272,16 M262,30 L278,28',
    spot: { cx: 194, cy: 130, r: 28 },
    base: [30, 212, 240, 16],
    puntoSagoma: { x: 104, y: 136 },
    puntoCorna: { x: 262, y: 30 },
  },
  volpe: {
    nome: 'Volpe',
    gruppo: 3,
    corpo:
      'M70,150 C62,128 76,108 104,104 C130,100 158,104 182,112 L196,98 L200,80 L212,94 L224,92 L246,102 C256,106 262,112 262,116 L246,120 C242,130 234,144 218,152 L218,212 L206,212 L202,156 L188,160 L188,212 L176,212 L176,162 C154,166 130,164 110,158 L108,212 L96,212 L98,156 L84,152 L82,212 L70,212 L72,160 C58,164 40,166 28,160 C18,156 20,146 30,144 C46,142 58,146 70,150 Z',
    spot: { cx: 176, cy: 138, r: 24 },
    base: [30, 212, 240, 16],
    puntoSagoma: { x: 108, y: 134 },
  },
  lepre: {
    nome: 'Lepre',
    gruppo: 4,
    corpo:
      'M96,164 C86,144 100,120 128,114 C156,108 182,116 198,132 L206,100 C208,88 214,80 220,82 C226,84 226,96 222,110 L232,104 C240,90 248,84 254,86 C258,90 254,104 244,116 L236,128 C238,142 232,156 222,164 L226,212 L214,212 L210,168 L196,170 L196,212 L184,212 L184,172 C164,176 146,176 130,172 L128,212 L116,212 L118,170 L108,168 L106,212 L94,212 L96,164 Z',
    spot: { cx: 178, cy: 146, r: 24 },
    base: [30, 212, 240, 16],
    puntoSagoma: { x: 122, y: 140 },
  },
};

export const RAGGIO_ASTA = 3;

// Calcola la posizione della sezione dell'asta per una zona simbolica.
// zone: 'perfect' | 'superspot' | 'spot' | 'linea-tocca' | 'linea-vicina' | 'sagoma' | 'corna' | 'base'
export function posizioneFreccia(sagoma, zona) {
  const s = SAGOME[sagoma];
  const { cx, cy, r } = s.spot;
  // le zone circolari vengono colpite sul lato sinistro (verso la coda), dove non ci sono altri contorni
  const aSinistra = (d) => ({ x: cx - d, y: cy });
  switch (zona) {
    case 'perfect':
      return { x: cx, y: cy };
    case 'superspot':
      return { x: cx - r * 0.35, y: cy };
    case 'spot':
      return { x: cx - r * 0.75, y: cy - r * 0.08 };
    case 'linea-tocca':
      return aSinistra(r + RAGGIO_ASTA); // l'asta è tangente alla linea esterna dello Spot
    case 'linea-vicina':
      return aSinistra(r + RAGGIO_ASTA + 6); // vicina, ma con un filo di sagoma in mezzo
    case 'sagoma':
      return s.puntoSagoma;
    case 'corna':
      return s.puntoCorna || s.puntoSagoma;
    case 'base':
      return { x: s.base[0] + s.base[2] / 2, y: s.base[1] + s.base[3] / 2 + 2 };
    default:
      return { x: cx, y: cy };
  }
}
