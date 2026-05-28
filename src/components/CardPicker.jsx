import { SUITS, RANKS, SUIT_SYMBOL, SUIT_IS_RED, rankDisplay } from '../logic/deck.js'

/**
 * CardPicker — griglia di selezione delle 52 carte.
 *
 * Props:
 *   label         {string}   - titolo dello slot attivo (es. "Giocatore 1 — carta 1")
 *   usedKeys      {Set}      - carte già assegnate (disabilitate nella griglia)
 *   selectedKey   {string}   - chiave della carta correntemente in questo slot
 *   onSelect      {function} - chiamata con { rank, suit } o null (rimozione)
 *   onClose       {function} - chiude il picker senza modifiche
 */
export default function CardPicker({
  label,
  usedKeys,
  selectedKey,
  onSelect,
  onRandomize,
  onClose,
}) {
  return (
    <div className="picker-panel">
      {/* Header */}
      <div className="picker-header">
        <span className="picker-title">{label}</span>
        <div className="flex-row gap-8">
          <button
            onClick={onRandomize}
            className="icon-btn"
          >
            <i className="ti ti-dice" aria-hidden="true" />
            Casuale
          </button>
          {selectedKey && (
            <button
              onClick={() => onSelect(null)}
              className="icon-btn icon-btn--danger"
            >
              <i className="ti ti-trash" aria-hidden="true" />
              Rimuovi
            </button>
          )}
          <button
            onClick={onClose}
            style={{
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: '#9eb39a',
              fontSize: 20,
              lineHeight: 1,
              padding: 0,
            }}
            aria-label="Chiudi picker"
          >
            <i className="ti ti-x" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Una riga per seme */}
      {SUITS.map((suit) => (
        <div key={suit} className="picker-suit-row">
          {RANKS.map((rank) => {
            const key = `${rank}${suit}`
            const isUsed = usedKeys.has(key)
            const isSelected = key === selectedKey
            const isRed = SUIT_IS_RED[suit]

            return (
              <button
                key={key}
                className={[
                  'picker-card',
                  isUsed ? 'picker-card--used' : '',
                  isSelected ? 'picker-card--selected' : '',
                ].join(' ')}
                disabled={isUsed}
                onClick={() => !isUsed && onSelect({ rank, suit })}
                style={{ color: isRed ? '#c0392b' : '#1a1a2e' }}
                title={`${rankDisplay(rank)}${SUIT_SYMBOL[suit]}`}
              >
                <span>{rankDisplay(rank)}</span>
                <span style={{ fontSize: 10 }}>{SUIT_SYMBOL[suit]}</span>
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}
