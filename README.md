# Archery Games

App PWA (React + Vite) con quattro giochi a tema arcieristico, in italiano, pensata per smartphone, tablet e desktop.

| Gioco | Stato | Descrizione |
|---|---|---|
| **Il giudice** | giocabile | Situazioni di gara da decidere secondo il Regolamento CSAIn. Tre livelli (Punteggi, Procedure di tiro, Sanzioni e giudice) più allenamento misto. Spiegazione e riferimento normativo dopo ogni risposta. |
| Lettura del bersaglio | in arrivo | Diagnosi dell'errore tecnico da una rosata di 12 frecce. |
| **Il tuner** | giocabile | Rompicapo a stati nascosti: arco olimpico con 1–3 parametri fuori posto (spine, punta, brace, bottone, nocking point). Tre test (carta, freccia nuda, rosata), regolazioni limitate. Modello semplificato in `src/games/tuner/modello.js`. |
| **Controllo piazzola** | giocabile | Il sopralluogo del giudice: scena dal picchetto con tabella (gara, gruppo, picchetto, distanza misurata). La piazzola è regolare? Tre livelli: distanze; visibilità e ostacoli; sicurezza (sentieri, dossi, crinali), anche con più difetti insieme. Regole e fonti in `src/games/piazzola/regole.js`. |

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
  games/tuner/
    modello.js            parametri, pesi, test e livelli (tutte le regole del gioco)
    Tuner.jsx             menu, partita, esito, spiegazione dei test
    Diagrammi.jsx         SVG di carta, freccia nuda e rosata
  games/piazzola/
    regole.js             tabelle delle distanze per gara, catalogo delle irregolarità con fonti, generazione dei casi
    Scena.jsx             scena SVG della piazzola con i difetti disegnati
    Piazzola.jsx          menu, controllo, riepilogo
```

## Controllo piazzola: come si generano i casi

Ogni caso pesca gara (44 Fusion, 60 Track, 40 Round, 60 Target, 40 Free-Shot), gruppo, specie e colore del picchetto; la distanza viene tirata sopra o sotto il limite della tabella (RGO). Dal livello 2 possono comparire: picchetto arretrato con tolleranza 5% (RS Cap. V Par. I comma f), spot coperto (irregolare) o sagoma parzialmente nascosta con spot libero (regolare), ramo sulla traiettoria (irregolare) o ramo alto (regolare), ostacolo vicino al picchetto (irregolare) o vicino al bersaglio (regolare, RA Cap. II Par. IV comma 3). Al livello 3: sentiero dietro la sagoma (irregolare se non protetto), terrapieno (regolare), dosso senza/con battifreccia, tiro dall'alto con crinale a meno/più di 5 m. Pesi, testi e fonti sono tutti in `regole.js`.

## Modello de "Il tuner"

Arciere destrimano, arco olimpico. Ogni parametro è a scatti interi rispetto al valore corretto. Asse orizzontale (rigidità dinamica): spine +1 = +1; punta più pesante = −½; bottone più duro = +½; brace più alta = +½. Asse verticale: nocking point. Brace fuori intervallo = arco rumoroso e rosata larga, senza direzione. Carta: strappo a sinistra = rigida, a destra = debole, in alto = nocking alto. Nuda: a sinistra = rigida, bassa = nocking alto. Si vince quando i tre test tornano puliti (le compensazioni sono ammesse). Per cambiare pesi, soglie o testi si modifica solo `modello.js`.

## Fonti normative

- CSAIn – Regolamento Sportivo Tiro con l'arco 3D, rev. 6.6 (01/07/2026) → `RS`
- CSAIn – Regolamento Gare Outdoor 2026 → `RGO`

Le citazioni seguono lo schema Capitolo / Paragrafo / comma. In caso di dubbio fa fede il testo ufficiale.
