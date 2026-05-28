import { Fragment, useState, useMemo, useCallback } from 'react'

import PlayerRow from './components/PlayerRow.jsx'
import BoardSection from './components/BoardSection.jsx'
import CardPicker from './components/CardPicker.jsx'
import Results from './components/Results.jsx'

import { FULL_DECK, BOARD_LABELS, cardKey, shuffle } from './logic/deck.js'
import { bestHand } from './logic/evaluator.js'
import { monteCarlo } from './logic/monteCarlo.js'

// ── Numero di iterazioni Monte Carlo ────────────────────────────
// Aumenta per più precisione (lento), diminuisci per velocità
const SIMULATION_ITERATIONS = 10_000

// ── Stato iniziale del mazzo ─────────────────────────────────────
const initialPlayerCards = () => Array(6).fill(null).map(() => [null, null])
const initialBoardCards  = () => Array(5).fill(null)

export default function App() {
  // ── State ──────────────────────────────────────────────────────
  const [numPlayers,  setNumPlayers]  = useState(2)
  const [playerCards, setPlayerCards] = useState(initialPlayerCards)
  const [boardCards,  setBoardCards]  = useState(initialBoardCards)

  // activeSlot: null | { type:'player', pi, ci } | { type:'board', bi }
  const [activeSlot, setActiveSlot] = useState(null)
  const [results,    setResults]    = useState(null)
  const [running,    setRunning]    = useState(false)

  // ── Carte già utilizzate (per greyare nel picker) ──────────────
  const usedKeys = useMemo(() => {
    const keys = new Set()
    playerCards.slice(0, numPlayers).flat().forEach((c) => c && keys.add(cardKey(c)))
    boardCards.forEach((c) => c && keys.add(cardKey(c)))
    return keys
  }, [playerCards, boardCards, numPlayers])

  // La carta attualmente nello slot attivo (da escludere da usedKeys nel picker)
  const activeCardKey = useMemo(() => {
    if (!activeSlot) return null
    return activeSlot.type === 'player'
      ? cardKey(playerCards[activeSlot.pi][activeSlot.ci])
      : cardKey(boardCards[activeSlot.bi])
  }, [activeSlot, playerCards, boardCards])

  // usedKeys per il picker (esclude la carta dello slot attivo)
  const pickerUsedKeys = useMemo(() => {
    const keys = new Set(usedKeys)
    if (activeCardKey) keys.delete(activeCardKey)
    return keys
  }, [usedKeys, activeCardKey])

  // ── Handlers ───────────────────────────────────────────────────
  const handleSlotClick = useCallback((slot) => {
    setActiveSlot((prev) =>
      prev && JSON.stringify(prev) === JSON.stringify(slot) ? null : slot
    )
    setResults(null)
  }, [])

  const handlePickCard = useCallback((card) => {
    if (!activeSlot) return
    if (activeSlot.type === 'player') {
      setPlayerCards((prev) => {
        const next = prev.map((h) => [...h])
        next[activeSlot.pi][activeSlot.ci] = card
        return next
      })
    } else {
      setBoardCards((prev) => {
        const next = [...prev]
        next[activeSlot.bi] = card
        return next
      })
    }
    // Chiude il picker dopo la selezione (non alla rimozione)
    if (card) setActiveSlot(null)
    setResults(null)
  }, [activeSlot])

  const handleRandomizePlayer = useCallback((pi) => {
    // Esclude le carte degli altri giocatori e del board
    const skip = new Set()
    playerCards.slice(0, numPlayers).forEach((h, i) => {
      if (i !== pi) h.forEach((c) => c && skip.add(cardKey(c)))
    })
    boardCards.forEach((c) => c && skip.add(cardKey(c)))
    const avail = shuffle(FULL_DECK.filter((c) => !skip.has(cardKey(c))))

    setPlayerCards((prev) => {
      const next = prev.map((h) => [...h])
      next[pi] = [avail[0] ?? null, avail[1] ?? null]
      return next
    })
    setResults(null)
  }, [playerCards, boardCards, numPlayers])

  const handleRandomizeBoard = useCallback(() => {
    const skip = new Set()
    playerCards.slice(0, numPlayers).flat().forEach((c) => c && skip.add(cardKey(c)))
    const avail = shuffle(FULL_DECK.filter((c) => !skip.has(cardKey(c))))
    setBoardCards([avail[0], avail[1], avail[2], avail[3], avail[4]])
    setResults(null)
  }, [playerCards, numPlayers])

  const handleChangeNumPlayers = useCallback((n) => {
    setNumPlayers(n)
    setResults(null)
    setActiveSlot(null)
  }, [])

  const handleClearAll = useCallback(() => {
    setPlayerCards(initialPlayerCards())
    setBoardCards(initialBoardCards())
    setResults(null)
    setActiveSlot(null)
  }, [])

  const handleRun = useCallback(() => {
    if (running) return
    setRunning(true)
    setActiveSlot(null)
    // setTimeout lascia a React il tempo di aggiornare il tasto "in corso…"
    // prima che il calcolo sincrono blocchi il thread
    setTimeout(() => {
      const pCards = playerCards.slice(0, numPlayers)
      const res = monteCarlo(pCards, boardCards, SIMULATION_ITERATIONS)
      setResults(res)
      setRunning(false)
    }, 60)
  }, [playerCards, boardCards, numPlayers, running])

  // ── Mano esatta (solo se tutte le carte sono note) ─────────────
  const boardFull = boardCards.every((c) => c)

  const getExactHand = (pi) => {
    const hole = playerCards[pi]
    if (!boardFull || !hole.every((c) => c)) return null
    return bestHand(hole, boardCards)
  }

  // ── Label picker ───────────────────────────────────────────────
  const pickerLabel = activeSlot
    ? activeSlot.type === 'player'
      ? `Giocatore ${activeSlot.pi + 1} — carta ${activeSlot.ci + 1}`
      : BOARD_LABELS[activeSlot.bi]
    : ''

  // ── Render ─────────────────────────────────────────────────────
  return (
    <div className="app-container">
      {/* Intestazione */}
      <header className="app-header">
        <h1>Poker Simulator</h1>
        <p>Texas Hold'em — probabilità di vittoria via Monte Carlo</p>
      </header>

      {/* Numero giocatori */}
      <div className="panel mb-16">
        <div className="flex-between">
          <div>
            <p className="section-label mb-8">Numero di giocatori</p>
            <div className="np-buttons">
              {[2, 3, 4, 5, 6].map((n) => (
                <button
                  key={n}
                  className={`np-btn ${numPlayers === n ? 'np-btn--active' : 'np-btn--inactive'}`}
                  onClick={() => handleChangeNumPlayers(n)}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
          <button className="icon-btn" onClick={handleClearAll}>
            <i className="ti ti-refresh" aria-hidden="true" />
            Reset
          </button>
        </div>
      </div>

      {/* Giocatori */}
      <div className="panel mb-16">
        <p className="section-label mb-8">Carte dei giocatori</p>
        {Array.from({ length: numPlayers }, (_, pi) => (
          <Fragment key={pi}>
            <PlayerRow
              playerIndex={pi}
              cards={playerCards[pi]}
              activeCardIdx={
                activeSlot?.type === 'player' && activeSlot.pi === pi
                  ? activeSlot.ci
                  : null
              }
              hand={getExactHand(pi)}
              onSlotClick={(ci) => handleSlotClick({ type: 'player', pi, ci })}
              onRandomize={() => handleRandomizePlayer(pi)}
            />
            {activeSlot?.type === 'player' && activeSlot.pi === pi && (
              <CardPicker
                label={pickerLabel}
                usedKeys={pickerUsedKeys}
                selectedKey={activeCardKey}
                onSelect={handlePickCard}
                onClose={() => setActiveSlot(null)}
              />
            )}
          </Fragment>
        ))}
      </div>

      {/* Board */}
      <BoardSection
        cards={boardCards}
        activeBoardIdx={
          activeSlot?.type === 'board' ? activeSlot.bi : null
        }
        onSlotClick={(bi) => handleSlotClick({ type: 'board', bi })}
        onRandomize={handleRandomizeBoard}
      />
      {activeSlot?.type === 'board' && (
        <CardPicker
          label={pickerLabel}
          usedKeys={pickerUsedKeys}
          selectedKey={activeCardKey}
          onSelect={handlePickCard}
          onClose={() => setActiveSlot(null)}
        />
      )}

      {/* Bottone calcolo */}
      <button
        className="run-btn"
        onClick={handleRun}
        disabled={running}
      >
        {running ? 'Simulazione in corso…' : 'Calcola probabilità'}
      </button>

      {/* Risultati */}
      <Results
        results={results}
        numPlayers={numPlayers}
        playerCards={playerCards}
        boardCards={boardCards}
      />
    </div>
  )
}
