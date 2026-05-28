import { HAND_NAMES, bestHand } from '../logic/evaluator.js'
import {
  PLAYER_COLORS,
  SUIT_SYMBOL,
  SUIT_IS_RED,
  rankDisplay,
} from '../logic/deck.js'

/**
 * Results — mostra le probabilità di vittoria per ogni giocatore.
 *
 * Props:
 *   results       {{ wins, ties, total }}
 *   numPlayers    {number}
 *   playerCards   {Array<[card|null, card|null]>}
 *   boardCards    {Array<card|null>}
 */
export default function Results({ results, numPlayers, playerCards, boardCards }) {
  if (!results) return null

  const { wins, ties, total } = results
  const boardFull = boardCards.every((c) => c)

  return (
    <div>
      <p className="section-label mb-8">
        Probabilità — {total.toLocaleString('it-IT')} simulazioni Monte Carlo
      </p>

      {Array.from({ length: numPlayers }, (_, pi) => {
        const col = PLAYER_COLORS[pi]
        const winPct = (wins[pi] / total) * 100
        const tiePct = (ties[pi] / total) * 100
        const equity = winPct + tiePct / 2

        // Mano esatta solo quando tutte e 7 le carte sono note
        const hole = playerCards[pi]
        const showHand = boardFull && hole.every((c) => c)
        const hand = showHand ? bestHand(hole, boardCards) : null

        return (
          <div key={pi} className="result-row">
            {/* Header riga */}
            <div className="result-header">
              <div className="flex-row gap-8">
                {/* Badge giocatore */}
                <div
                  className="player-badge"
                  style={{ background: col.border, color: 'white' }}
                >
                  G{pi + 1}
                </div>

                <div>
                  {/* Mini-carte */}
                  <div className="result-cards">
                    {hole.map((c, ci) => (
                      <span
                        key={ci}
                        className="mini-card text-sans"
                        style={{
                          color: c
                            ? SUIT_IS_RED[c.suit]
                              ? '#c0392b'
                              : '#1a1a2e'
                            : '#999',
                        }}
                      >
                        {c
                          ? `${rankDisplay(c.rank)}${SUIT_SYMBOL[c.suit]}`
                          : '?'}
                      </span>
                    ))}
                  </div>

                  {/* Nome mano (solo se tutto noto) */}
                  {hand && (
                    <span
                      className="text-sans text-xs"
                      style={{ color: col.text, fontWeight: 500 }}
                    >
                      {HAND_NAMES[hand.hr]}
                    </span>
                  )}
                </div>
              </div>

              {/* Percentuali */}
              <div style={{ textAlign: 'right' }}>
                <div
                  className="result-pct"
                  style={{ color: col.bar }}
                >
                  {winPct.toFixed(1)}%
                </div>
                <div className="result-label">vittoria</div>
                {tiePct > 0.4 && (
                  <div className="result-label">
                    parità {tiePct.toFixed(1)}%
                  </div>
                )}
              </div>
            </div>

            {/* Barra progresso */}
            <div className="win-bar-track">
              <div
                className="win-bar-fill"
                style={{
                  width: `${Math.max(winPct, 0.3)}%`,
                  background: col.bar,
                }}
              />
            </div>

            {/* Equity (mostrata solo se ci sono pareggi significativi) */}
            {tiePct > 0.4 && (
              <p className="text-muted text-xs mt-4">
                Equity totale: {equity.toFixed(1)}%
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}
