import CardSlot from './CardSlot.jsx'
import { HAND_NAMES } from '../logic/evaluator.js'
import { PLAYER_COLORS } from '../logic/deck.js'

/**
 * PlayerRow — riga di un singolo giocatore con 2 slot carta.
 *
 * Props:
 *   playerIndex   {number}             - indice 0-based del giocatore
 *   cards         {[card|null, card|null]} - carte correnti del giocatore
 *   activeCardIdx {number|null}         - 0 o 1 se uno slot è attivo, null altrimenti
 *   hand          {object|null}         - risultato bestHand (per mostrare il nome)
 *   onSlotClick   {function(ci)}        - click su uno dei due slot
 *   onRandomize   {function}            - click su "Casuale"
 */
export default function PlayerRow({
  playerIndex,
  cards,
  activeCardIdx,
  hand,
  onSlotClick,
  onRandomize,
}) {
  const col = PLAYER_COLORS[playerIndex]

  return (
    <div className="player-row">
      {/* Badge giocatore */}
      <div
        className="player-badge"
        style={{ background: col.border }}
      >
        G{playerIndex + 1}
      </div>

      {/* Slot carte */}
      <div className="flex-row gap-4">
        {[0, 1].map((ci) => (
          <CardSlot
            key={ci}
            card={cards[ci]}
            isActive={activeCardIdx === ci}
            activeColor={col.border}
            onClick={() => onSlotClick(ci)}
          />
        ))}
      </div>

      {/* Badge mano (visibile solo se tutte le 7 carte sono note) */}
      {hand && (
        <span
          className="hand-name-badge text-sans"
          style={{
            color: col.text,
            background: col.light,
            borderColor: col.border,
          }}
        >
          {HAND_NAMES[hand.hr]}
        </span>
      )}

      {/* Pulsante casuale */}
      <button
        className="icon-btn"
        onClick={onRandomize}
        style={{ marginLeft: 'auto', flexShrink: 0 }}
      >
        <i className="ti ti-dice" aria-hidden="true" />
        Casuale
      </button>
    </div>
  )
}
