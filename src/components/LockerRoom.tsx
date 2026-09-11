import { motion, AnimatePresence } from 'framer-motion'
import { ITEMS } from '../config/items'
import type { PlacedItems, ItemId } from '../types'
import ThreeCanvas from './ThreeCanvas'

interface LockerRoomProps {
  placedItems: PlacedItems
  placedCount: number
  totalCount: number
  onDragEnd: (id: ItemId, offsetY: number) => void
  onTap: (id: ItemId) => void
  onReset: () => void
}

/**
 * LockerRoom: Presents the full-screen 3D interactive locker room
 * tailored for iPhone 13 & mobile screens with Three.js WebGL rendering,
 * realistic locker, outdoor fields, and a floating modern glassmorphic dock.
 */
export default function LockerRoom({
  placedItems,
  placedCount,
  totalCount,
  onTap,
  onReset,
}: LockerRoomProps) {
  const allPlaced = placedCount === totalCount
  const noneYetPlaced = placedCount === 0

  return (
    <div className="relative flex-1 w-full h-full overflow-hidden flex flex-col justify-between select-none">
      {/* ─── 1. FULL-SCREEN THREE.JS 3D CANVAS ─── */}
      <ThreeCanvas
        placedItems={placedItems}
        onItemPlaced={(id) => onTap(id)}
        onAllPlaced={() => {}}
      />

      {/* ─── 2. FLOATING HUD OVERLAY (TOP - CLEAN FOR IPHONE 13) ─── */}
      <div className="relative z-20 pt-8 sm:pt-10 pb-2 px-4 flex items-center justify-between pointer-events-none max-w-lg mx-auto w-full">
        {/* Status Pill */}
        <motion.div
          key={placedCount}
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`pointer-events-auto flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black border transition-all duration-500 backdrop-blur-md shadow-sm ${
            allPlaced
              ? 'bg-pink-500 text-white border-pink-400 shadow-pink-500/20'
              : 'bg-white/90 border-slate-200/90 text-slate-700'
          }`}
        >
          {allPlaced ? (
            <span>¡Vestuario completo! 🎉</span>
          ) : (
            <span>{placedCount}/{totalCount} elementos colocados</span>
          )}
        </motion.div>

        {/* Quick Reset Button (Visible whenever an item is placed) */}
        {placedCount > 0 && (
          <motion.button
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            whileTap={{ scale: 0.92 }}
            onClick={onReset}
            className="pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 hover:bg-white text-slate-700 text-xs font-bold border border-slate-200/90 shadow-sm backdrop-blur-md transition-colors"
            title="Reiniciar vestuario"
          >
            <span className="text-sm leading-none">🔄</span>
            <span className="hidden sm:inline">Reiniciar</span>
          </motion.button>
        )}
      </div>

      {/* ─── 3. INTERACTIVE CONTROLS TRAY (BOTTOM DOCK) ─── */}
      <div className="relative z-20 pb-6 sm:pb-8 px-3 flex flex-col items-center pointer-events-auto w-full max-w-md mx-auto">
        {/* Helper guide */}
        <AnimatePresence>
          {noneYetPlaced && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.8 }}
              className="mb-2.5 px-4 py-1.5 rounded-full bg-slate-900/85 backdrop-blur-md text-white text-[11px] sm:text-xs font-semibold shadow-lg flex items-center gap-1.5 text-center"
            >
              <span>👆 Tocá tu equipo para acomodarlo en el casillero</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dock tray */}
        <div className="w-full flex justify-center gap-2.5 sm:gap-4 p-2 sm:p-3 bg-white/80 backdrop-blur-xl rounded-[2rem] sm:rounded-[2.2rem] shadow-[0_12px_36px_rgba(0,0,0,0.14)] border border-white/90">
          {ITEMS.map((item) => {
            const isPlaced = placedItems[item.id]
            return (
              <motion.button
                key={item.id}
                whileHover={!isPlaced ? { scale: 1.05, y: -2 } : {}}
                whileTap={!isPlaced ? { scale: 0.93 } : {}}
                onClick={() => !isPlaced && onTap(item.id)}
                disabled={isPlaced}
                className={`relative flex-1 max-w-[105px] h-24 sm:h-28 rounded-2xl flex flex-col items-center justify-center p-2 transition-all duration-300 ${
                  isPlaced
                    ? 'bg-slate-100/60 border border-dashed border-slate-300 opacity-60 cursor-default'
                    : 'bg-gradient-to-b from-white to-slate-50 border border-white shadow-md hover:shadow-lg cursor-pointer'
                }`}
                aria-label={`Ubicar ${item.label}`}
              >
                {/* Status indicator dot */}
                <div
                  className={`absolute top-2 right-2 w-2 h-2 rounded-full ${
                    isPlaced ? 'bg-emerald-500' : 'bg-amber-400 animate-pulse'
                  }`}
                />

                {/* Visual Icon / Emoji */}
                <span
                  className={`text-3xl sm:text-4xl mb-1 select-none transition-transform ${
                    isPlaced ? 'scale-75 grayscale' : ''
                  }`}
                >
                  {item.emoji}
                </span>

                {/* Item label */}
                <span className="text-[10px] sm:text-xs font-black text-slate-700 tracking-tight text-center leading-tight">
                  {item.label}
                </span>

                {/* Subtitle / Quality badge */}
                <span
                  className={`text-[9px] font-bold mt-1 px-1.5 py-0.5 rounded-full ${
                    isPlaced ? 'bg-slate-200 text-slate-500' : 'bg-slate-900 text-white'
                  }`}
                >
                  {isPlaced ? '✓ Listo' : item.word}
                </span>
              </motion.button>
            )
          })}
        </div>

        {/* Finished State Action or Exploration hint */}
        {allPlaced && (
          <motion.button
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.94 }}
            onClick={onReset}
            className="mt-2.5 px-5 py-2 rounded-full bg-slate-900 text-white text-xs font-bold shadow-lg flex items-center gap-2 hover:bg-slate-800 transition-colors"
          >
            <span>🔄</span>
            <span>Reiniciar vestuario</span>
          </motion.button>
        )}
      </div>
    </div>
  )
}
