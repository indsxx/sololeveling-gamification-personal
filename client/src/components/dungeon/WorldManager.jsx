import { createContext, useContext, useState, useCallback } from 'react'

const WorldContext = createContext(null)

// eslint-disable-next-line react-refresh/only-export-components
export const QUALITY_LEVELS = {
  ULTRA: 'ultra',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
}

// eslint-disable-next-line react-refresh/only-export-components
export function useWorld() {
  const context = useContext(WorldContext)
  if (!context) {
    throw new Error('useWorld must be used within WorldManager')
  }
  return context
}

export default function WorldManager({ children }) {
  const [qualityLevel, setQualityLevel] = useState(() => {
    const cores = navigator.hardwareConcurrency || 4
    if (cores >= 8) return QUALITY_LEVELS.ULTRA
    if (cores >= 6) return QUALITY_LEVELS.HIGH
    if (cores >= 4) return QUALITY_LEVELS.MEDIUM
    return QUALITY_LEVELS.LOW
  })

  const [isDoFActive, setIsDoFActive] = useState(false)

  const triggerDoF = useCallback(() => {
    setIsDoFActive(true)
    setTimeout(() => setIsDoFActive(false), 500)
  }, [])

  const value = {
    qualityLevel,
    setQualityLevel,
    isDoFActive,
    triggerDoF,
    isUltra: qualityLevel === QUALITY_LEVELS.ULTRA,
    isHigh: qualityLevel === QUALITY_LEVELS.HIGH || qualityLevel === QUALITY_LEVELS.ULTRA,
    isMedium: qualityLevel !== QUALITY_LEVELS.LOW,
    isLow: qualityLevel === QUALITY_LEVELS.LOW,
  }

  return <WorldContext.Provider value={value}>{children}</WorldContext.Provider>
}
