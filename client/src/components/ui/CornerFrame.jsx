import { motion } from 'motion/react'

export default function CornerFrame({
  children,
  active = false,
  activeColor = '#3D7FFF',
  className = '',
  glowing = false,
  hover = false,
  padding = '20px',
  style: outerStyle = {},
}) {
  const color = active ? activeColor : '#2A3140'

  const cornerStyle = {
    position: 'absolute',
    width: '10px',
    height: '10px',
  }

  const corners = {
    topLeft: {
      top: 0,
      left: 0,
      borderTop: `1.5px solid ${color}`,
      borderLeft: `1.5px solid ${color}`,
    },
    topRight: {
      top: 0,
      right: 0,
      borderTop: `1.5px solid ${color}`,
      borderRight: `1.5px solid ${color}`,
    },
    bottomLeft: {
      bottom: 0,
      left: 0,
      borderBottom: `1.5px solid ${color}`,
      borderLeft: `1.5px solid ${color}`,
    },
    bottomRight: {
      bottom: 0,
      right: 0,
      borderBottom: `1.5px solid ${color}`,
      borderRight: `1.5px solid ${color}`,
    },
  }

  const MotionComponent = hover ? motion.div : 'div'
  const hoverProps = hover
    ? {
        whileHover: {
          scale: 1.02,
          y: -2,
          boxShadow: glowing
            ? `0 12px 40px rgba(0, 0, 0, 0.5), 0 0 30px ${activeColor}40`
            : '0 12px 40px rgba(0, 0, 0, 0.5)',
        },
        transition: { type: 'spring', stiffness: 400, damping: 25 },
      }
    : {}

  return (
    <MotionComponent
      style={{
        position: 'relative',
        display: 'inline-block',
        background: 'rgba(10, 12, 16, 0.6)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderRadius: 12,
        boxShadow: glowing
          ? `0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 0 20px ${activeColor}30`
          : '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        border: active
          ? `1px solid ${activeColor}66`
          : '1px solid rgba(61, 127, 255, 0.15)',
        overflow: 'hidden',
        ...outerStyle,
      }}
      {...hoverProps}
    >
      {active && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: `linear-gradient(90deg, transparent, ${activeColor}80, transparent)`,
          }}
        />
      )}
      {Object.entries(corners).map(([key, style]) => (
        <div key={key} style={{ ...cornerStyle, ...style }} />
      ))}
      <div
        className={className}
        style={{
          padding,
        }}
      >
        {children}
      </div>
    </MotionComponent>
  )
}
