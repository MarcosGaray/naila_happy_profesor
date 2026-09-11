import type { ItemConfig } from '../types'

/**
 * The three items Naila must place on the hangers.
 * Emojis are stored as strings so they render as valid JSX
 * via <span>{item.emoji}</span> rather than raw JSX emoji literals.
 */
export const ITEMS: ItemConfig[] = [
  {
    id: 'football',
    label: 'Fútbol',
    emoji: '⚽',
    badgeColor: 'bg-blue-100 border-blue-300 text-blue-700',
    word: 'DIVERSIÓN',
    wordEmoji: '✨',
  },
  {
    id: 'sneaker',
    label: 'Unas Nike',
    emoji: '👟',
    badgeColor: 'bg-emerald-100 border-emerald-300 text-emerald-700',
    word: 'ENERGÍA',
    wordEmoji: '⚡',
  },
  {
    id: 'whistle',
    label: 'Silbato',
    emoji: '💖',
    badgeColor: 'bg-pink-100 border-pink-300 text-pink-700',
    word: 'AMOR',
    wordEmoji: '💗',
  },
]
