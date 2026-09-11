import { useState, useEffect } from 'react'
import type { ItemId, PlacedItems } from '../types'
import { ITEMS } from '../config/items'

/** Builds the initial "all false" placed-items state from the ITEMS config */
const buildInitialState = (): PlacedItems =>
  Object.fromEntries(ITEMS.map((item) => [item.id, false])) as PlacedItems

interface UseGameStateReturn {
  placedItems: PlacedItems
  showClimax: boolean
  placedCount: number
  totalCount: number
  handleDragEnd: (id: ItemId, offsetY: number) => void
  handleTap: (id: ItemId) => void
  reset: () => void
}

/**
 * Encapsulates all game state logic:
 * - Tracks which items are placed
 * - Triggers the climax after all 3 are placed
 * - Exposes handlers for drag-end and tap interactions
 */
export function useGameState(): UseGameStateReturn {
  const [placedItems, setPlacedItems] = useState<PlacedItems>(buildInitialState)
  const [showClimax, setShowClimax] = useState(false)

  const placedCount = Object.values(placedItems).filter(Boolean).length
  const totalCount = ITEMS.length

  useEffect(() => {
    if (placedCount === totalCount && !showClimax) {
      const timer = setTimeout(() => setShowClimax(true), 800)
      return () => clearTimeout(timer)
    }
  }, [placedCount, totalCount, showClimax])

  /**
   * Called when a drag gesture ends.
   * Places the item if the user dragged upward beyond the threshold (-80px).
   */
  const handleDragEnd = (id: ItemId, offsetY: number) => {
    if (offsetY < -80) {
      setPlacedItems((prev) => ({ ...prev, [id]: true }))
    }
  }

  /**
   * Alternative to drag: a simple tap also places the item.
   * This makes it accessible for users who don't discover the drag mechanic.
   */
  const handleTap = (id: ItemId) => {
    if (!placedItems[id]) {
      setPlacedItems((prev) => ({ ...prev, [id]: true }))
    }
  }

  const reset = () => {
    setPlacedItems(buildInitialState())
    setShowClimax(false)
  }

  return { placedItems, showClimax, placedCount, totalCount, handleDragEnd, handleTap, reset }
}
