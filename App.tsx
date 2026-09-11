import { motion, AnimatePresence } from 'framer-motion'
import { useGameState } from './hooks/useGameState'
import LockerRoom from './components/LockerRoom'
import ClimaxModal from './components/ClimaxModal'

/**
 * Root application component.
 *
 * Renders the full-screen locker room experience:
 *  1. Animated header
 *  2. The main game area (LockerRoom)
 *  3. The climax reveal modal (ClimaxModal) — triggered when all items are placed
 *
 * Uses min-h-[100dvh] (dynamic viewport height) to avoid iOS Safari
 * bottom-bar clipping issues.
 */
export default function App() {
  const { placedItems, showClimax, placedCount, totalCount, handleDragEnd, handleTap, reset } =
    useGameState()

  return (
    <div className="relative min-h-[100dvh] flex flex-col bg-[#f8f5f0] overflow-hidden">
      {/* Dotted background texture */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: 'radial-gradient(#94a3b8 1.5px, transparent 1.5px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* ─── HEADER ─── */}
      <header className="pt-10 pb-4 px-6 relative z-10 text-center">
        <motion.div
          initial={{ y: -24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 20 }}
        >
          <h1 className="text-3xl font-black tracking-tight text-slate-900 leading-tight">
            Tu Vestuario ✨
          </h1>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-[0.2em] mt-1">
            Edición Profe Weke · 11 Sep 2025
          </p>
        </motion.div>
      </header>

      {/* ─── GAME AREA ─── */}
      <LockerRoom
        placedItems={placedItems}
        placedCount={placedCount}
        totalCount={totalCount}
        onDragEnd={handleDragEnd}
        onTap={handleTap}
      />

      {/* ─── CLIMAX MODAL ─── */}
      <AnimatePresence>{showClimax && <ClimaxModal onReset={reset} />}</AnimatePresence>
    </div>
  )
}