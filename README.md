# 🃏 Poker Texas Hold'em Simulator

Simulatore di mani Texas Hold'em con calcolo delle probabilità di vittoria tramite Monte Carlo simulation .

## 🎮 Prova online

👉 **[Apri il simulatore](https://Halfred19.github.io/Poker-Simulator/)**

Nessuna installazione richiesta: si apre direttamente nel browser.

## Funzionalità

- **2–6 giocatori** configurabili
- Carte assegnabili **manualmente** (selettore) o **casualmente** per ogni giocatore e per il board
- Carte del board (**Flop / Turn / River**) impostabili singolarmente o randomizzabili
- Probabilità di vittoria e **equity** calcolate con 10 000 simulazioni Monte Carlo
- Visualizzazione della **mano esatta** quando tutte le 7 carte sono note

## Sviluppo locale

Solo se vuoi modificare il codice (richiede [Node.js](https://nodejs.org/) installato):

```bash
npm install
npm run dev
```

Apri [http://localhost:5173](http://localhost:5173).

Ad ogni push su `main`, GitHub Actions ribuilda e ripubblica automaticamente il sito.

## Stack

- [React 18](https://react.dev/) + [Vite 5](https://vitejs.dev/)
- Logica di gioco pura in JavaScript (nessuna libreria esterna)
- [Tabler Icons](https://tabler.io/icons) per l'UI

