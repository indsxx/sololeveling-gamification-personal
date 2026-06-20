import { motion } from 'motion/react'

export default function GlassCard({
  children,
  active = false,
  hover = false,
  className = '',
  style: outerStyle = {},
}) {
  return (
    <motion.div
      className={className}
      style={{
        background: 'rgba(18, 22, 29, 0.6)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        border: active
          ? '1px solid rgba(0, 102, 255, 0.3)'
          : '1px solid rgba(0, 102, 255, 0.1)',
        borderRadius: 12,
        boxShadow: active
          ? '0 4px 24px rgba(0, 0, 0, 0.3), 0 0 20px rgba(0, 102, 255, 0.1)'
          : '0 4px 24px rgba(0, 0, 0, 0.3)',
        padding: 20,
        ...outerStyle,
      }}
      whileHover={
        hover
          ? {
              y: -2,
              borderColor: 'rgba(0, 102, 255, 0.2)',
            }
          : undefined
      }
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  )
}
