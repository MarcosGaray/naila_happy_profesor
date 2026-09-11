import { motion } from 'framer-motion'
import type { ItemConfig } from '../types'

interface DraggableItemProps {
  item: ItemConfig
  onDragEnd: (offsetY: number) => void
  onTap: () => void
}

/**
 * A single draggable item card sitting in the inventory tray.
 *
 * Interaction model:
 * - Drag upward past -80px → item snaps to its hanger (handled by parent)
 * - Tap → same effect (accessibility fallback for non-drag users)
 *
 * Uses Framer Motion's layoutId so it seamlessly "flies" from the tray
 * to the hanger slot via shared-layout animation.
 */
export default function DraggableItem({ item, onDragEnd, onTap }: DraggableItemProps) {
  return (
    <motion.div
      layoutId={`item-${item.id}`}
      drag
      dragSnapToOrigin
      dragElastic={0.6}
      whileDrag={{ scale: 1.25, rotate: [-4, 4, -4], cursor: 'grabbing', zIndex: 50 }}
      whileTap={{ scale: 0.95 }}
      whileHover={{ y: -4, scale: 1.05 }}
      onDragEnd={(_, info) => onDragEnd(info.offset.y)}
      onTap={onTap}
      className="w-full h-full bg-white rounded-2xl shadow-lg border-2 border-slate-100
                 flex flex-col items-center justify-center gap-1
                 cursor-grab active:cursor-grabbing
                 hover:shadow-xl hover:border-slate-200 transition-shadow no-select"
      aria-label={`Arrastrá ${item.label} hacia arriba`}
      role="button"
    >
      <span className="text-4xl leading-none select-none" aria-hidden="true">
        {item.emoji}
      </span>
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
        {item.label}
      </span>
    </motion.div>
  )
}
