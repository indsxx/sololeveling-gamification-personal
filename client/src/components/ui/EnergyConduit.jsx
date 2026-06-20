import { useState } from 'react'
import { motion } from 'motion/react'

function ConduitParticle({ delay, duration }) {
  return (
    <motion.div
      style={{
        position: 'absolute',
        left: -1,
        width: 3,
        height: 3,
        borderRadius: '50%',
        backgroundColor: '#3D7FFF',
        boxShadow: '0 0 6px #3D7FFF',
      }}
      initial={{ bottom: 0, opacity: 0 }}
      animate={{
        bottom: '100%',
        opacity: [0, 0.6, 0.6, 0],
      }}
      transition={{
        duration: duration,
        delay: delay,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  )
}

function Node({ status, isLast }) {
  const isActive = status === 'in_progress'
  const isLocked = status === 'locked'
  const isComplete = status === 'complete'

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        marginBottom: isLast ? 0 : 40,
      }}
    >
      <motion.div
        style={{
          width: 12,
          height: 12,
          borderRadius: '50%',
          backgroundColor: isLocked ? '#2A3140' : isActive ? '#3D7FFF' : '#D4A53D',
          border: `2px solid ${isLocked ? '#2A3140' : isActive ? '#3D7FFF' : '#D4A53D'}`,
          boxShadow: isActive
            ? '0 0 12px rgba(61, 127, 255, 0.6)'
            : isComplete
            ? '0 0 12px rgba(212, 165, 61, 0.6)'
            : 'none',
          zIndex: 2,
        }}
        animate={
          isActive
            ? {
                boxShadow: [
                  '0 0 8px rgba(61, 127, 255, 0.4)',
                  '0 0 16px rgba(61, 127, 255, 0.8)',
                  '0 0 8px rgba(61, 127, 255, 0.4)',
                ],
              }
            : undefined
        }
        transition={isActive ? { duration: 2, repeat: Infinity } : undefined}
      />
    </div>
  )
}

export default function EnergyConduit({ chapters }) {
  const [particles] = useState(() =>
    Array.from({ length: 4 }, (_, i) => ({
      id: i,
      delay: i * 0.8,
      duration: 1.5 + Math.random() * 0.5,
    }))
  )

  return (
    <div
      style={{
        position: 'absolute',
        left: 8,
        top: 8,
        bottom: 8,
        width: 3,
        background: 'linear-gradient(to top, #2A3140, #3D7FFF, #2A3140)',
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      {particles.map((p) => (
        <ConduitParticle key={p.id} delay={p.delay} duration={p.duration} />
      ))}

      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '4px 0',
        }}
      >
        {chapters.map((ch, i) => (
          <Node key={ch.id} status={ch.status} isLast={i === chapters.length - 1} />
        ))}
      </div>
    </div>
  )
}