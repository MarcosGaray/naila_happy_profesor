import { AnimatePresence, motion } from 'framer-motion'
import type { ItemConfig } from '../types'

interface HangerSlotProps {
  item: ItemConfig
  isPlaced: boolean
}

/**
 * A single hanger slot in the locker panel.
 *
 * When empty: shows a subtle dashed border with a dotted placeholder indicator.
 * When filled: the DraggableItem "flies" in via Framer Motion's shared layoutId,
 *             then the quality badge animates in below the slot.
 */
export default function HangerSlot({ item, isPlaced }: HangerSlotProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      {/* The hanger drop zone */}
      <div
        className={`w-full aspect-[4/5] rounded-2xl border-2 flex items-center justify-center relative shadow-inner transition-colors duration-500
          ${isPlaced
            ? 'border-solid border-slate-200 bg-white'
            : 'border-dashed border-slate-200 bg-slate-50'
          }`}
      >
        {/* Placed item arrives here via Framer Motion layoutId magic */}
        {isPlaced && (
          <motion.div
            layoutId={`item-${item.id}`}
            className="absolute inset-0 flex flex-col items-center justify-center gap-1 z-20"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', bounce: 0.55, duration: 0.5 }}
          >
            <span className="text-4xl leading-none select-none" aria-hidden="true">
              {item.emoji}
            </span>
          </motion.div>
        )}

        {/* Empty slot indicator */}
        {!isPlaced && (
          <div className="flex flex-col items-center gap-1">
            <div className="w-5 h-5 rounded-full bg-slate-200 shadow-inner" />
          </div>
        )}
      </div>

      {/* Quality badge — animates in when item is placed */}
      <div className="h-7 flex items-center justify-center">
        <AnimatePresence>
          {isPlaced && (
            <motion.div
              key={`badge-${item.id}`}
              initial={{ opacity: 0, y: 8, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: 0.3, type: 'spring', bounce: 0.4 }}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold shadow-sm border ${item.badgeColor}`}
            >
              <span aria-hidden="true">{item.wordEmoji}</span>
              <span>{item.word}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
