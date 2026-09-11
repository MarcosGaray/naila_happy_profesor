import { AnimatePresence } from 'framer-motion'
import { useGameState } from './hooks/useGameState'
import LockerRoom from './components/LockerRoom'
import ClimaxModal from './components/ClimaxModal'

/**
 * Root application component.
 *
 * Renders the 3D Locker Room experience:
 *  1. 3D WebGL Canvas with physical locker and sports outdoor environment
 *  2. Interactive floating controls and progress indicators
 *  3. Climax celebration modal with polaroids, confeti, and "Te amo ❤️"
 */
export default function App() {
  const { placedItems, showClimax, placedCount, totalCount, handleDragEnd, handleTap, reset } =
    useGameState()

  return (
    <main className="relative w-screen h-[100dvh] flex flex-col bg-slate-100 overflow-hidden select-none">
      {/* ─── 3D GAME AREA & HUD ─── */}
      <LockerRoom
        placedItems={placedItems}
        placedCount={placedCount}
        totalCount={totalCount}
        onDragEnd={handleDragEnd}
        onTap={handleTap}
        onReset={reset}
      />

      {/* ─── CLIMAX CELEBRATION MODAL ─── */}
      <AnimatePresence>
        {showClimax && <ClimaxModal onReset={reset} />}
      </AnimatePresence>
    </main>
  )
}
