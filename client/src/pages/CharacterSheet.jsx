import { useEffect, useRef } from 'react'
import { drawSprite, HUNTER_E_SPRITE, HUNTER_PALETTE } from '../utils/pixelSprite'
import BlueBackground from '../components/ui/BlueBackground'
import GlassCard from '../components/ui/GlassCard'

export default function CharacterSheet() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawSprite(canvas, HUNTER_E_SPRITE, HUNTER_PALETTE, 4)
  }, [])

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <BlueBackground />

      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
        <div
          style={{
            marginBottom: 24,
            filter: 'drop-shadow(0 0 30px rgba(0, 102, 255, 0.3))',
          }}
        >
          <canvas
            ref={canvasRef}
            style={{ imageRendering: 'pixelated' }}
          />
        </div>

        <GlassCard style={{ width: 300 }}>
          <div
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 11,
              color: '#5C6678',
              letterSpacing: '0.15em',
              marginBottom: 8,
              fontWeight: 500,
            }}
          >
            HUNTER RANK
          </div>
          <div
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 24,
              color: '#0066FF',
              fontWeight: 700,
            }}
          >
            E
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
