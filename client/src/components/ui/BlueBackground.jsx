export default function BlueBackground() {

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        background: 'linear-gradient(135deg, #000000 0%, #0A0A1A 50%, #000000 100%)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 400,
          height: '100%',
          background: 'radial-gradient(ellipse at 50% 0%, rgba(0, 102, 255, 0.08) 0%, transparent 60%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '30%',
          width: 200,
          height: '100%',
          background: 'linear-gradient(180deg, rgba(0, 102, 255, 0.03) 0%, transparent 50%)',
          pointerEvents: 'none',
          animation: 'lightRayPulse 8s ease-in-out infinite',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '70%',
          width: 150,
          height: '100%',
          background: 'linear-gradient(180deg, rgba(0, 102, 255, 0.02) 0%, transparent 40%)',
          pointerEvents: 'none',
          animation: 'lightRayPulse 10s ease-in-out infinite 2s',
        }}
      />
      <style>{`
        @keyframes lightRayPulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}