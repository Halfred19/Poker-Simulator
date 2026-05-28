// ── Costanti mazzo ──────────────────────────────────────────────
export const SUITS = ['s', 'h', 'd', 'c']

export const SUIT_SYMBOL = { s: '♠', h: '♥', d: '♦', c: '♣' }

export const SUIT_IS_RED = { s: false, h: true, d: true, c: false }

// Rank nell'ordine dal più basso al più alto
export const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A']

// Display: T → 10, resto invariato
export const RANK_DISPLAY = { T: '10' }
export const rankDisplay = (r) => RANK_DISPLAY[r] ?? r

// Valore numerico per il comparatore
export const RANK_VALUE = {
  '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7,
  '8': 8, '9': 9, T: 10, J: 11, Q: 12, K: 13, A: 14,
}

// Mazzo completo di 52 carte
export const FULL_DECK = SUITS.flatMap((suit) =>
  RANKS.map((rank) => ({ suit, rank }))
)

// Chiave univoca di una carta, es. "As" "Th" "2d"
export const cardKey = (card) => (card ? `${card.rank}${card.suit}` : null)

// Fisher-Yates shuffle (non muta l'originale)
export const shuffle = (arr) => {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Colori per ogni giocatore (massimo 6)
export const PLAYER_COLORS = [
  { border: '#43a047', text: '#2e7d32', bar: '#66bb6a', light: '#e8f5e9' },
  { border: '#1e88e5', text: '#1565c0', bar: '#64b5f6', light: '#e3f2fd' },
  { border: '#fb8c00', text: '#e65100', bar: '#ffa726', light: '#fff3e0' },
  { border: '#d81b60', text: '#880e4f', bar: '#f06292', light: '#fce4ec' },
  { border: '#8e24aa', text: '#4a148c', bar: '#ba68c8', light: '#f3e5f5' },
  { border: '#00897b', text: '#004d40', bar: '#4db6ac', light: '#e0f2f1' },
]

export const BOARD_LABELS = ['Flop 1', 'Flop 2', 'Flop 3', 'Turn', 'River']
