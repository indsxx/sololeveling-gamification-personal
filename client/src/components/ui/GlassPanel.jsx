import { motion } from 'motion/react'

export default function GlassPanel({
  children,
  className = '',
  hover = false,
  active = false,
  style: outerStyle = {},
}) {
  return (
    <motion.div
      className={className}
      style={{
        background: 'rgba(10, 12, 16, 0.6)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: active
          ? '1px solid rgba(61, 127, 255, 0.4)'
          : '1px solid rgba(61, 127, 255, 0.15)',
        borderRadius: 12,
        boxShadow: active
          ? '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 0 20px rgba(61, 127, 255, 0.2)'
          : '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        position: 'relative',
        overflow: 'hidden',
        ...outerStyle,
      }}
      whileHover={
        hover
          ? {
              scale: 1.02,
              y: -2,
              boxShadow:
                '0 12px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 0 30px rgba(61, 127, 255, 0.3)',
            }
          : undefined
      }
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {active && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background:
              'linear-gradient(90deg, transparent, rgba(61, 127, 255, 0.5), transparent)',
          }}
        />
      )}
      {children}
    </motion.div>
  )
}
