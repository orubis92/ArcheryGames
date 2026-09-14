# Archery Games

App PWA (React + Vite) con quattro giochi a tema arcieristico, in italiano, pensata per smartphone, tablet e desktop.

| Gioco | Stato | Descrizione |
|---|---|---|
| **Il giudice** | giocabile | Situazioni di gara da decidere secondo il Regolamento CSAIn. Tre livelli (Punteggi, Procedure di tiro, Sanzioni e giudice) più allenamento misto. Spiegazione e riferimento normativo dopo ogni risposta. |
| Lettura del bersaglio | in arrivo | Diagnosi dell'errore tecnico da una rosata di 12 frecce. |
| Il tuner | in arrivo | Rompicapo di messa a punto (olimpico/barebow). |
| Piazzola 3D | in arrivo | Stima delle distanze da foto reali di sagome. |

## Avvio

```bash
npm install
npm run dev        # sviluppo, http://localhost:5173
npm run build      # produzione in dist/ (PWA con service worker)
npm run preview    # anteprima della build
```

La build usa percorsi relativi (`base: './'`), quindi `dist/` si può pubblicare in una sottocartella qualsiasi (Aruba, GitHub Pages, ecc.).

## Struttura

```
src/
  App.jsx                 routing minimale su hash (#/giudice)
  giochi.js               catalogo dei giochi (nome, stato, descrizione)
  components/             Hub, icone, schermata "in arrivo"
  lib/storage.js          localStorage con fallback
  games/giudice/
    scenari.js            le situazioni di gara (dati)
    Giudice.jsx           menu livelli, domanda, riepilogo
    Bersaglio.jsx         diagramma SVG del bersaglio 3D con lente
    statistiche.js        progressi per domanda/livello, selezione pesata
```

## Aggiungere situazioni a "Il giudice"

Ogni voce di `src/games/giudice/scenari.js` ha questa forma:

```js
{
  id: 'L1-esempio',            // stabile e unico: è la chiave delle statistiche
  livello: 1,                  // 1 Punteggi · 2 Procedure di tiro · 3 Sanzioni e giudice
  gara: '44 Fusion',
  situazione: 'Testo della situazione.',
  bersaglio: { x: 148, y: 118, nota: 'facoltativa' },   // facoltativo: posizione della freccia
  domanda: 'Quanti punti vale la freccia?',
  opzioni: ['A', 'B', 'C', 'D'],
  corretta: 1,                 // indice della risposta giusta (le opzioni vengono mescolate in gioco)
  spiegazione: 'La regola, spiegata.',
  fonte: 'RS Cap. III Par. VI comma 9',
}
```

Geometria del diagramma (`sagome.js`, viewBox 300×250): quattro sagome originali (cinghiale, cervo, volpe, lepre), ciascuna con il proprio Spot; Super Spot = 0,5 r; Perfect = 0,2 r; sezione dell'asta r 3. Le posizioni simboliche (perfect, superspot, spot, linea-tocca, linea-vicina, sagoma, corna, base) sono calcolate da `posizioneFreccia` in `sagome.js`; la pagina di servizio `#/sagome` mostra tutte le combinazioni.

## Fonti normative

- CSAIn – Regolamento Sportivo Tiro con l'arco 3D, rev. 6.6 (01/07/2026) → `RS`
- CSAIn – Regolamento Gare Outdoor 2026 → `RGO`

Le citazioni seguono lo schema Capitolo / Paragrafo / comma. In caso di dubbio fa fede il testo ufficiale.
