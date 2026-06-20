import { useEffect, useRef } from 'react'
import { SegmentMeter } from '../components/ui'
import { drawSprite, BOSS_PROCRASTINATION, BOSS_PALETTE } from '../utils/pixelSprite'
import BlueBackground from '../components/ui/BlueBackground'
import GlassCard from '../components/ui/GlassCard'

const REQUIREMENTS = [
  { text: '90% diet adherence (18/30 days)', done: false },
  { text: '20 workouts completed', done: true },
  { text: 'No skipped weeks', done: false },
  { text: 'Maintain discipline streak', done: false },
]

export default function BossPage() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawSprite(canvas, BOSS_PROCRASTINATION, BOSS_PALETTE, 5)
  }, [])

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '24px',
        position: 'relative',
      }}
    >
      <BlueBackground />

      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 800 }}>
        <div
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 11,
            color: '#5C6678',
            letterSpacing: '0.15em',
            textAlign: 'center',
            marginBottom: 32,
            fontWeight: 500,
          }}
        >
          MONTHLY BOSS BATTLE
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 32,
            marginBottom: 32,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <canvas
              ref={canvasRef}
              id="boss-canvas"
              width={80}
              height={80}
              style={{
                imageRendering: 'pixelated',
                animation: 'bossPulse 0.8s ease-in-out infinite',
                marginBottom: 16,
                filter: 'drop-shadow(0 0 20px rgba(194, 59, 59, 0.5))',
              }}
            />
            <style>{`
              @keyframes bossPulse {
                0%, 100% { transform: scale(1.0); }
                50% { transform: scale(1.04); }
              }
            `}</style>

            <div
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 20,
                color: '#C23B3B',
                letterSpacing: '0.05em',
                marginBottom: 6,
                fontWeight: 700,
              }}
            >
              PROCRASTINATION
            </div>
            <div
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 13,
                color: '#8B95A5',
              }}
            >
              Chapter 1 Boss
            </div>
          </div>

          <div>
            <div
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 11,
                color: '#5C6678',
                letterSpacing: '0.15em',
                marginBottom: 16,
                fontWeight: 500,
              }}
            >
              REQUIREMENTS
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              {REQUIREMENTS.map((req, i) => (
                <div
                  key={i}
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 13,
                    color: req.done ? '#5C6678' : '#E7ECF5',
                    textDecoration: req.done ? 'line-through' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <span
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 4,
                      background: req.done ? 'rgba(0, 102, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {req.done && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0066FF" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </span>
                  <span>{req.text}</span>
                </div>
              ))}
            </div>

            <SegmentMeter label="BOSS HP" value={6} total={8} color="#C23B3B" />
          </div>
        </div>

        <GlassCard
          active
          style={{
            border: '1px solid rgba(212, 165, 61, 0.3)',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.3), 0 0 20px rgba(212, 165, 61, 0.1)',
          }}
        >
          <div
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 11,
              color: '#D4A53D',
              letterSpacing: '0.15em',
              marginBottom: 10,
              fontWeight: 500,
            }}
          >
            DEFEAT REWARD
          </div>
          <div
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 18,
              color: '#D4A53D',
              marginBottom: 6,
              fontWeight: 700,
            }}
          >
            RANK PROMOTION → D
          </div>
          <div
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 16,
              color: '#D4A53D',
              marginBottom: 10,
            }}
          >
            2500 XP
          </div>
          <div
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 13,
              color: '#8B95A5',
            }}
          >
            Achievement Unlocked: First Boss
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
