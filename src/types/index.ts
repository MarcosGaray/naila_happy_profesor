/** Identifiers for each draggable item */
export type ItemId = 'football' | 'sneaker' | 'whistle'

/** State tracking which items have been placed on hangers */
export type PlacedItems = Record<ItemId, boolean>

/** Full configuration for a single draggable item */
export interface ItemConfig {
  id: ItemId
  /** Display label shown below the item */
  label: string
  /** Large emoji character rendered as the item visual */
  emoji: string
  /** Tailwind color classes for the quality badge */
  badgeColor: string
  /** Quality word revealed when placed */
  word: string
  /** Emoji icon shown next to the quality word */
  wordEmoji: string
}
