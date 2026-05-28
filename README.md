# 🃏 Poker Texas Hold'em Simulator

Texas Hold'em hand simulator that computes win probabilities via Monte Carlo simulation.

## 🎮 Try it online

👉 **[Open the simulator](https://Halfred19.github.io/Poker-Simulator/)**

No installation required: it runs directly in your browser.

## Features

- **2–6 players** configurable
- Cards can be assigned **manually** (picker) or **randomly** for each player and the board
- Board cards (**Flop / Turn / River**) can be set individually or randomized
- Win probability and **equity** calculated with 10,000 Monte Carlo simulations
- Display of the **exact hand** when all 7 cards are known

## Local development

Only if you want to modify the code (requires [Node.js](https://nodejs.org/) installed):

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

On every push to `main`, GitHub Actions automatically rebuilds and redeploys the site.

## Stack

- [React 18](https://react.dev/) + [Vite 5](https://vitejs.dev/)
- Pure JavaScript game logic (no external libraries)
- [Tabler Icons](https://tabler.io/icons) for the UI
