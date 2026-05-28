import CardSlot from './CardSlot.jsx'
import { BOARD_LABELS } from '../logic/deck.js'

/**
 * BoardSection — 5 slot del board (Flop 1-2-3, Turn, River).
 *
 * Props:
 *   cards         {Array<card|null>}  - 5 slot del board
 *   activeBoardIdx{number|null}       - indice dello slot attivo (0–4) o null
 *   onSlotClick   {function(bi)}      - click su uno slot
 *   onRandomize   {function}          - click su "Casuale board"
 */
export default function BoardSection({
  cards,
  activeBoardIdx,
  onSlotClick,
  onRandomize,
}) {
  return (
    <div className="panel mb-16">
      <div className="flex-between mb-8">
        <p className="section-label">Board</p>
        <button className="icon-btn" onClick={onRandomize}>
          <i className="ti ti-dice" aria-hidden="true" />
          Casuale
        </button>
      </div>

      <div className="board-grid">
        {cards.map((card, bi) => (
          <div key={bi} style={{ display: 'contents' }}>
            {/* Separatore visivo tra Flop e Turn */}
            {bi === 3 && (
              <div className="board-separator" />
            )}
            <div className="board-slot-wrapper">
              <span className="board-slot-label">{BOARD_LABELS[bi]}</span>
              <CardSlot
                card={card}
                isActive={activeBoardIdx === bi}
                activeColor="#c8a84b"
                onClick={() => onSlotClick(bi)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
