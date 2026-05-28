import { SUIT_SYMBOL, SUIT_IS_RED, rankDisplay } from '../logic/deck.js'

/**
 * CardSlot — singola carta (piena o vuota) cliccabile.
 *
 * Props:
 *   card        {object|null}  - la carta { rank, suit } o null = slot vuoto
 *   isActive    {boolean}      - true = slot selezionato (outline gold)
 *   activeColor {string}       - colore outline quando attivo
 *   onClick     {function}     - callback al click
 *   size        {'md'|'lg'}    - dimensione slot (default 'md')
 */
export default function CardSlot({
  card,
  isActive = false,
  activeColor = '#c8a84b',
  onClick,
  size = 'md',
}) {
  const dim = size === 'lg'
    ? { width: 58, height: 80, fontSize: 20, suitSize: 16 }
    : { width: 50, height: 68, fontSize: 17, suitSize: 14 }

  const baseStyle = {
    width: dim.width,
    height: dim.height,
    borderRadius: 6,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontWeight: 700,
    gap: 2,
    flexShrink: 0,
    transition: 'transform 0.12s, box-shadow 0.12s',
    userSelect: 'none',
    outline: isActive ? `2.5px solid ${activeColor}` : 'none',
    outlineOffset: isActive ? 2 : 0,
  }

  if (!card) {
    return (
      <div
        onClick={onClick}
        style={{
          ...baseStyle,
          border: '1.5px dashed rgba(200,168,75,0.35)',
          background: 'rgba(0,0,0,0.25)',
          color: 'rgba(200,168,75,0.4)',
          fontSize: 24,
          fontWeight: 300,
        }}
      >
        ?
      </div>
    )
  }

  const isRed = SUIT_IS_RED[card.suit]
  return (
    <div
      onClick={onClick}
      style={{
        ...baseStyle,
        background: 'white',
        boxShadow: '0 2px 8px rgba(0,0,0,0.35)',
        color: isRed ? '#c0392b' : '#1a1a2e',
        fontSize: dim.fontSize,
      }}
    >
      <span style={{ lineHeight: 1 }}>{rankDisplay(card.rank)}</span>
      <span style={{ fontSize: dim.suitSize, lineHeight: 1 }}>
        {SUIT_SYMBOL[card.suit]}
      </span>
    </div>
  )
}
