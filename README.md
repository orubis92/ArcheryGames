# Archery Games

App PWA (React + Vite) con quattro giochi a tema arcieristico, in italiano, pensata per smartphone, tablet e desktop.

| Gioco | Stato | Descrizione |
|---|---|---|
| **Il giudice** | giocabile | Situazioni di gara da decidere secondo il Regolamento CSAIn. Tre livelli (Punteggi, Procedure di tiro, Sanzioni e giudice) più allenamento misto. Spiegazione e riferimento normativo dopo ogni risposta. |
| Lettura del bersaglio | in arrivo | Diagnosi dell'errore tecnico da una rosata di 12 frecce. |
| Il tuner | in arrivo | Rompicapo di messa a punto (olimpico/barebow). |
| **Piazzola 3D** | giocabile | Stima della distanza di una sagoma da una foto scattata al picchetto. Punteggio sullo scarto relativo, tendenza personale (sovra/sottostima). Archivio di foto del campo nel repo; finché non ci sono foto vere usa scene sintetiche di esempio. |

## Avvio

```bash
npm install
npm run dev        # sviluppo, http://localhost:5173
npm run build      # produzione in dist/ (PWA con service worker)
npm run preview    # anteprima della build
```

La build usa percorsi relativi (`base: './'`), quindi `dist/` si può pubblicare in una sottocartella qualsiasi (Aruba, GitHub Pages, ecc.).

## Pubblicazione su GitHub Pages

Il workflow `.github/workflows/deploy.yml` compila e pubblica l'app a ogni push su `main`.

1. Crea il repository su GitHub e fai il push del progetto (senza `node_modules` e `dist`, già esclusi dal `.gitignore`).
2. Su GitHub: **Settings → Pages → Build and deployment → Source: "GitHub Actions"**.
3. Al primo push su `main` il workflow parte da solo; l'app sarà su `https://<utente>.github.io/<repo>/`.

Il routing è su hash (`#/giudice`), quindi non servono redirect né `404.html`. Il service worker della PWA si aggiorna da solo a ogni pubblicazione.

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
    sagome.js             silhouette originali delle specie e posizioni simboliche
    statistiche.js        progressi per domanda/livello, selezione pesata
  games/piazzola/
    Piazzola.jsx          menu, stima, riepilogo
    punteggio.js          fasce di punteggio e distanze massime per gruppo
    statistiche.js        stime salvate e tendenza
public/piazzole/
  piazzole.json           archivio delle piazzole (foto + distanza)
  *.jpg / *.svg           le foto (o le scene di esempio)
scripts/
  genera-piazzole-esempio.mjs   rigenera le scene sintetiche di esempio
```

## Aggiungere foto a "Piazzola 3D"

1. Al campo, dal picchetto di tiro, scatta la foto ad altezza occhi, in orizzontale, **senza zoom** (1x) e con la sagoma intera nell'inquadratura. Misura la distanza dal picchetto alla sagoma (rotella o telemetro).
2. Ridimensiona la foto a circa 1600 px di larghezza e salvala in `public/piazzole/` (es. `campo-01.jpg`). Oltre i 300–400 KB per foto l'app diventa lenta su rete mobile.
3. Aggiungi una voce a `public/piazzole/piazzole.json`:

```json
{
  "id": "campo-01",
  "foto": "piazzole/campo-01.jpg",
  "distanza": 27.5,
  "sagoma": "Cinghiale",
  "gruppo": 1,
  "campo": "Campo di Cremona, piazzola 7"
}
```

`gruppo` e `campo` sono facoltativi (il gruppo serve per l'indizio sulle distanze massime). Le voci con `"esempio": true` sono le scene sintetiche: quando avrai abbastanza foto vere, cancellale dal JSON (e i relativi `.svg`). Le foto non vengono pre-scaricate dalla PWA: entrano in cache man mano che si giocano.

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
