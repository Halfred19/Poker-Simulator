import { FULL_DECK, cardKey, shuffle } from './deck.js'
import { bestHand, compareHands } from './evaluator.js'

/**
 * Esegue una simulazione Monte Carlo per calcolare le probabilità di vittoria.
 *
 * @param {Array<[card|null, card|null]>} playerCards
 *   Carte di ogni giocatore. null = carta ancora da estrarre (random).
 *
 * @param {Array<card|null>} boardCards
 *   5 slot del board. null = carta ancora da girare.
 *
 * @param {number} [iterations=10000]
 *   Numero di simulazioni. Aumentare per più precisione, diminuire per velocità.
 *
 * @returns {{ wins: number[], ties: number[], total: number } | null}
 *   null se non ci sono abbastanza carte nel mazzo.
 */
export function monteCarlo(playerCards, boardCards, iterations = 10000) {
  // Raccoglie le carte già note per escluderle dal mazzo disponibile
  const usedKeys = new Set()
  playerCards.flat().forEach((c) => c && usedKeys.add(cardKey(c)))
  boardCards.forEach((c) => c && usedKeys.add(cardKey(c)))

  const remainingDeck = FULL_DECK.filter((c) => !usedKeys.has(cardKey(c)))

  const numPlayers = playerCards.length
  const wins = new Array(numPlayers).fill(0)
  const ties = new Array(numPlayers).fill(0)

  // Numero di carte ancora da estrarre casualmente
  const needed =
    playerCards.flat().filter((c) => !c).length +
    boardCards.filter((c) => !c).length

  if (remainingDeck.length < needed) return null

  for (let i = 0; i < iterations; i++) {
    const deck = shuffle(remainingDeck)
    let deckIdx = 0

    // Completa le carte mancanti dei giocatori
    const filledPlayerCards = playerCards.map((hole) =>
      hole.map((c) => c ?? deck[deckIdx++])
    )

    // Completa le carte mancanti del board
    const filledBoard = boardCards.map((c) => c ?? deck[deckIdx++])

    // Valuta la miglior mano per ogni giocatore
    const hands = filledPlayerCards.map((hole) =>
      bestHand(hole, filledBoard)
    )

    // Trova il/i vincitore/i
    let winners = [0]
    for (let p = 1; p < numPlayers; p++) {
      const cmp = compareHands(hands[p], hands[winners[0]])
      if (cmp > 0) winners = [p]
      else if (cmp === 0) winners.push(p)
    }

    if (winners.length === 1) {
      wins[winners[0]]++
    } else {
      for (const w of winners) ties[w]++
    }
  }

  return { wins, ties, total: iterations }
}
