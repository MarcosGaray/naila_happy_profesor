import { useEffect, useState, memo } from 'react'
import { motion } from 'framer-motion'

interface Particle {
  id: number
  x: number
  color: string
  size: number
  duration: number
  delay: number
  drift: number
}

const COLORS = ['#FF69B4', '#33CC99', '#66CCFF', '#FFCC00', '#FF9966', '#CC99FF']

/**
 * Lightweight confetti system built entirely with Framer Motion.
 * No extra canvas libraries needed — keeps the bundle lean for mobile.
 * Particles are generated once on mount and loop infinitely.
 */
const Confetti = memo(function Confetti() {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    const generated: Particle[] = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: Math.random() * 8 + 6, // 6–14px
      duration: Math.random() * 2 + 2.5, // 2.5–4.5s
      delay: Math.random() * 3,
      drift: Math.random() * 20 - 10, // -10 to +10 horizontal drift
    }))
    setParticles(generated)
  }, [])

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 60 }}
      aria-hidden="true"
    >
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-sm"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            left: `${p.x}%`,
            top: '-5%',
          }}
          animate={{
            top: ['−5%', '105%'],
            left: [`${p.x}%`, `${p.x + p.drift}%`],
            rotate: [0, Math.random() * 360 + 180],
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: p.duration,
            ease: 'linear',
            repeat: Infinity,
            delay: p.delay,
          }}
        />
      ))}
    </div>
  )
})

export default Confetti
