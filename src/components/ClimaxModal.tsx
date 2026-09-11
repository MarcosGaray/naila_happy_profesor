import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Confetti from './Confetti'
import photoNaila1 from '../images/naila_1.jpg'
import photoNaila2 from '../images/naila_2.jpg'

interface ClimaxModalProps {
  onReset: () => void
}

/**
 * The final reveal card shown after all 3 items are placed.
 *
 * Features:
 * - Polaroid-style photo cards (replace with real photos in /public)
 * - Graceful fallback gradient if images fail to load
 * - "WEKE! ✨" easter egg sticker (as in the original spec)
 * - Confetti celebration overlay
 * - "Te amo ❤️" reset button
 */
export default function ClimaxModal({ onReset }: ClimaxModalProps) {
  const [photo1Error, setPhoto1Error] = useState(false)
  const [photo2Error, setPhoto2Error] = useState(false)

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
      >
        {/* Confetti sits above the backdrop, below the card */}
        <Confetti />

        {/* Card */}
        <motion.div
          initial={{ scale: 0.75, y: 60, rotate: -3, opacity: 0 }}
          animate={{ scale: 1, y: 0, rotate: 0, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', damping: 18, stiffness: 260, delay: 0.15 }}
          className="bg-white rounded-[2rem] p-6 w-full max-w-sm shadow-2xl relative overflow-visible"
          style={{ zIndex: 55 }}
        >
          {/* "WEKE! ✨" easter-egg sticker */}
          <motion.div
            initial={{ rotate: 6, scale: 0 }}
            animate={{ rotate: 12, scale: 1 }}
            transition={{ type: 'spring', bounce: 0.7, delay: 0.5 }}
            className="absolute -top-4 -right-4 bg-yellow-300 text-yellow-900 font-black text-xs px-4 py-2 rounded-full shadow-md border-2 border-white z-10"
          >
            WEKE! ✨
          </motion.div>

          {/* Polaroid photo pair */}
          <div className="flex justify-center gap-2 mb-6 mt-4">
            {/* Photo 1 */}
            <motion.div
              initial={{ rotate: -12, x: 30, opacity: 0 }}
              animate={{ rotate: -6, x: 0, opacity: 1 }}
              transition={{ type: 'spring', delay: 0.3 }}
              className="w-32 h-40 bg-white p-2 pb-6 rounded-lg shadow-lg border border-slate-100 relative z-10 flex-shrink-0"
            >
              {!photo1Error ? (
                <img
                  src={photoNaila1}
                  alt="Naila Sonriendo"
                  className="w-full h-full object-cover rounded"
                  onError={() => setPhoto1Error(true)}
                />
              ) : (
                <div className="w-full h-full rounded bg-gradient-to-br from-pink-200 via-rose-200 to-pink-300 flex items-center justify-center">
                  <span className="text-3xl">🎓</span>
                </div>
              )}
            </motion.div>

            {/* Photo 2 */}
            <motion.div
              initial={{ rotate: 12, x: -30, opacity: 0 }}
              animate={{ rotate: 8, x: 0, opacity: 1 }}
              transition={{ type: 'spring', delay: 0.4 }}
              className="w-32 h-40 bg-white p-2 pb-6 rounded-lg shadow-lg border border-slate-100 mt-4 relative z-0 flex-shrink-0"
            >
              {!photo2Error ? (
                <img
                  src={photoNaila2}
                  alt="Naila Deporte"
                  className="w-full h-full object-cover rounded"
                  onError={() => setPhoto2Error(true)}
                />
              ) : (
                <div className="w-full h-full rounded bg-gradient-to-br from-emerald-200 via-teal-200 to-cyan-300 flex items-center justify-center">
                  <span className="text-3xl">🏃‍♀️</span>
                </div>
              )}
            </motion.div>
          </div>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="text-center space-y-3 relative z-20"
          >
            <h2 className="text-2xl font-black text-slate-800 leading-tight">
              Estas tres cualidades te hacen la profe más{' '}
              <span className="text-pink-500">tremendaki</span>.
            </h2>
            <p className="text-slate-500 font-medium text-sm leading-relaxed">
              Feliz día del docente a mi persona favorita.{' '}
              Gracias por enseñarle al mundo (y a los gorditos) con tanta luz.{' '}
              Te admiro infinito. 🌟
            </p>

            <div className="space-y-2 mt-3">
              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.02 }}
                onClick={onReset}
                className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-2xl
                           shadow-lg shadow-slate-900/20 transition-colors
                           hover:bg-slate-800 active:bg-slate-950 flex items-center justify-center gap-2"
              >
                <span>Te amo ❤️</span>
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.02 }}
                onClick={onReset}
                className="w-full bg-slate-100 text-slate-600 font-bold py-2.5 rounded-xl
                           border border-slate-200 transition-colors
                           hover:bg-slate-200 active:bg-slate-300 flex items-center justify-center gap-1.5 text-xs"
              >
                <span>🔄</span>
                <span>Reiniciar vestuario</span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
