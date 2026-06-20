import { motion } from 'motion/react'

export default function CornerFrame({
  children,
  active = false,
  activeColor = "#3D7FFF",
  className = "",
  glowing = false,
  hover = false,
  padding = "16px",
  style: outerStyle = {},
}) {
  const color = active ? activeColor : "#2A3140"

  const cornerStyle = {
    position: "absolute",
    width: "10px",
    height: "10px",
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
        whileHover: { scale: 1.02, y: -2 },
        transition: { type: 'spring', stiffness: 400, damping: 25 },
      }
    : {}

  return (
    <MotionComponent
      style={{
        position: "relative",
        display: "inline-block",
        background: "rgba(18, 22, 29, 0.8)",
        borderRadius: 12,
        boxShadow: glowing
          ? "0 0 20px rgba(61, 127, 255, 0.1)"
          : "none",
        border: active
          ? `1px solid ${activeColor}40`
          : "1px solid rgba(255, 255, 255, 0.05)",
        ...outerStyle,
      }}
      {...hoverProps}
    >
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
