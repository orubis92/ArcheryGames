// Suoni sintetizzati con WebAudio (nessun file audio): il "tonfo" della
// freccia che si pianta e un breve suono sordo per l'errore.
import { impostazione } from './profilo.js';

let ctx = null;
function contesto() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

function rumore(c, durata) {
  const buf = c.createBuffer(1, Math.floor(c.sampleRate * durata), c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
  const src = c.createBufferSource();
  src.buffer = buf;
  return src;
}

export function suonoCorretto() {
  if (!impostazione('suoni')) return;
  const c = contesto();
  if (!c) return;
  const t = c.currentTime;
  // "thunk": colpo di rumore filtrato + tono basso che decade (la vibrazione dell'asta)
  const n = rumore(c, 0.08);
  const f = c.createBiquadFilter();
  f.type = 'lowpass';
  f.frequency.value = 900;
  const g1 = c.createGain();
  g1.gain.setValueAtTime(0.5, t);
  g1.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
  n.connect(f).connect(g1).connect(c.destination);
  n.start(t);

  const o = c.createOscillator();
  o.type = 'triangle';
  o.frequency.setValueAtTime(180, t);
  o.frequency.exponentialRampToValueAtTime(70, t + 0.25);
  const g2 = c.createGain();
  g2.gain.setValueAtTime(0.0001, t);
  g2.gain.exponentialRampToValueAtTime(0.35, t + 0.01);
  g2.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
  o.connect(g2).connect(c.destination);
  o.start(t);
  o.stop(t + 0.32);
}

export function suonoErrore() {
  if (!impostazione('suoni')) return;
  const c = contesto();
  if (!c) return;
  const t = c.currentTime;
  const o = c.createOscillator();
  o.type = 'square';
  o.frequency.setValueAtTime(140, t);
  o.frequency.linearRampToValueAtTime(95, t + 0.22);
  const f = c.createBiquadFilter();
  f.type = 'lowpass';
  f.frequency.value = 500;
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.18, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
  o.connect(f).connect(g).connect(c.destination);
  o.start(t);
  o.stop(t + 0.26);
}
