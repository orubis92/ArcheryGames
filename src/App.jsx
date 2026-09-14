import { useEffect, useState } from 'react';
import Hub from './components/Hub.jsx';
import InArrivo from './components/InArrivo.jsx';
import Giudice from './games/giudice/Giudice.jsx';
import GalleriaSagome from './games/giudice/GalleriaSagome.jsx';
import Piazzola from './games/piazzola/Piazzola.jsx';
import Tuner from './games/tuner/Tuner.jsx';
import Lettura from './games/lettura/Lettura.jsx';
import Profilo from './components/Profilo.jsx';
import { GIOCHI } from './giochi.js';

// Routing minimale basato sull'hash (#/giudice), così il tasto "indietro"
// del telefono funziona e gli URL sono condivisibili.
function leggiRotta() {
  const h = window.location.hash.replace(/^#\/?/, '');
  return h || 'hub';
}

export default function App() {
  const [rotta, setRotta] = useState(leggiRotta);

  useEffect(() => {
    const onHash = () => setRotta(leggiRotta());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const vai = (id) => {
    window.location.hash = id === 'hub' ? '' : `/${id}`;
  };

  if (rotta === 'hub') return <Hub onApri={vai} />;
  if (rotta === 'giudice') return <Giudice onEsci={() => vai('hub')} />;
  if (rotta === 'profilo') return <Profilo onEsci={() => vai('hub')} />;
  if (rotta === 'lettura') return <Lettura onEsci={() => vai('hub')} />;
  if (rotta === 'tuner') return <Tuner onEsci={() => vai('hub')} />;
  if (rotta === 'piazzola') return <Piazzola onEsci={() => vai('hub')} />;
  if (rotta === 'sagome') return <GalleriaSagome onEsci={() => vai('hub')} />;
  if (GIOCHI.some((g) => g.id === rotta)) return <InArrivo id={rotta} onEsci={() => vai('hub')} />;
  return <Hub onApri={vai} />;
}
