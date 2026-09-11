import { useEffect, useRef } from 'react'
import { LockerScene } from '../three/LockerScene'
import type { ItemId, PlacedItems } from '../types'

interface ThreeCanvasProps {
  placedItems: PlacedItems
  onItemPlaced: (id: ItemId) => void
  onAllPlaced: () => void
}

export default function ThreeCanvas({ placedItems, onItemPlaced, onAllPlaced }: ThreeCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<LockerScene | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const scene = new LockerScene(containerRef.current, {
      onItemPlaced: (id) => {
        onItemPlaced(id as ItemId)
      },
      onAllPlaced: () => {
        onAllPlaced()
      },
    })
    sceneRef.current = scene

    return () => {
      scene.dispose()
      sceneRef.current = null
    }
  }, []) // Mount once

  // Sync React state changes to 3D scene
  useEffect(() => {
    if (!sceneRef.current) return

    const anyPlaced = Object.values(placedItems).some(Boolean)
    if (!anyPlaced) {
      sceneRef.current.reset()
      return
    }

    ;(Object.keys(placedItems) as ItemId[]).forEach((id) => {
      if (placedItems[id]) {
        sceneRef.current?.placeItem(id)
      }
    })
  }, [placedItems])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing select-none"
      style={{ touchAction: 'none' }}
    />
  )
}
