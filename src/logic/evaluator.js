import { RANK_VALUE } from './deck.js'

// ── Nomi delle mani in ordine crescente (indice = rank) ──────────
export const HAND_NAMES = [
  'Alta carta',    // 0
  'Coppia',        // 1
  'Doppia coppia', // 2
  'Tris',          // 3
  'Scala',         // 4
  'Colore',        // 5
  'Full house',    // 6
  'Poker',         // 7
  'Scala colore',  // 8
  'Scala reale',   // 9
]

/**
 * Valuta esattamente 5 carte e restituisce { hr, tb }
 *   hr  = hand rank  (0–9)
 *   tb  = tiebreakers (array di valori numerici, confrontati in ordine)
 *
 * @param {Array<{rank:string, suit:string}>} cards - esattamente 5 carte
 * @returns {{ hr: number, tb: number[] }}
 */
export function evaluate5(cards) {
  // Valori numerici ordinati dal più alto al più basso
  const rv = cards.map((c) => RANK_VALUE[c.rank]).sort((a, b) => b - a)

  // Colore
  const isFlush = cards.every((c) => c.suit === cards[0].suit)

  // Scala standard: 5 valori distinti, differenza max-min = 4
  const uniq = [...new Set(rv)]
  const isStraight5 = uniq.length === 5 && rv[0] - rv[4] === 4
  // Ruota A-2-3-4-5 (asso basso)
  const isWheel =
    rv[0] === 14 && rv[1] === 5 && rv[2] === 4 && rv[3] === 3 && rv[4] === 2
  const isStraight = isStraight5 || isWheel
  // L'asso nella ruota vale 1 in cima alla scala
  const straightHigh = isWheel ? 5 : rv[0]

  // Conteggio dei duplicati
  const cnt = {}
  for (const r of rv) cnt[r] = (cnt[r] ?? 0) + 1
  // Gruppo: [rank, count], ordinato per count desc poi rank desc
  const groups = Object.entries(cnt)
    .map(([r, c]) => [+r, c])
    .sort((a, b) => b[1] - a[1] || b[0] - a[0])

  // Scala reale o scala colore
  if (isFlush && isStraight)
    return { hr: straightHigh === 14 ? 9 : 8, tb: [straightHigh] }

  // Poker (four of a kind)
  if (groups[0][1] === 4)
    return { hr: 7, tb: [groups[0][0], groups[1][0]] }

  // Full house
  if (groups[0][1] === 3 && groups[1][1] === 2)
    return { hr: 6, tb: [groups[0][0], groups[1][0]] }

  // Colore
  if (isFlush) return { hr: 5, tb: rv }

  // Scala
  if (isStraight) return { hr: 4, tb: [straightHigh] }

  // Tris
  if (groups[0][1] === 3)
    return { hr: 3, tb: groups.map((g) => g[0]) }

  // Doppia coppia
  if (groups[0][1] === 2 && groups[1][1] === 2) {
    const p1 = Math.max(groups[0][0], groups[1][0])
    const p2 = Math.min(groups[0][0], groups[1][0])
    return { hr: 2, tb: [p1, p2, groups[2][0]] }
  }

  // Coppia
  if (groups[0][1] === 2)
    return { hr: 1, tb: groups.map((g) => g[0]) }

  // Alta carta
  return { hr: 0, tb: rv }
}

/**
 * Confronta due valutazioni di mano.
 * Ritorna > 0 se a > b, < 0 se a < b, 0 se parità.
 */
export function compareHands(a, b) {
  if (!a || !b) return 0
  if (a.hr !== b.hr) return a.hr - b.hr
  for (let i = 0; i < Math.max(a.tb.length, b.tb.length); i++) {
    const diff = (a.tb[i] ?? 0) - (b.tb[i] ?? 0)
    if (diff) return diff
  }
  return 0
}

/**
 * Trova la miglior mano possibile dando N carte (5–7).
 * Usa combinazioni C(N,5).
 *
 * @param {Array} holeCards - 0–2 carte in mano al giocatore
 * @param {Array} boardCards - 0–5 carte sul board
 * @returns {{ hr: number, tb: number[] } | null}
 */
export function bestHand(holeCards, boardCards) {
  const all = [...holeCards, ...boardCards]
  if (all.length < 5) return null

  let best = null
  const n = all.length
  for (let a = 0; a < n - 4; a++)
    for (let b = a + 1; b < n - 3; b++)
      for (let c = b + 1; c < n - 2; c++)
        for (let d = c + 1; d < n - 1; d++)
          for (let e = d + 1; e < n; e++) {
            const ev = evaluate5([all[a], all[b], all[c], all[d], all[e]])
            if (!best || compareHands(ev, best) > 0) best = ev
          }
  return best
}
