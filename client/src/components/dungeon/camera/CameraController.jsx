import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useWorld } from '../WorldManager'

export default function CameraController({
  orbitRadius = 12,
  orbitSpeed = 0.0008,
  breathAmplitude = 0.1,
  breathPeriod = 8,
  zoomRange = 2,
  zoomPeriod = 12,
  rollAmplitude = 0.3,
  rollPeriod = 15,
}) {
  const { camera } = useThree()
  const { isLow } = useWorld()
  const timeRef = useRef(0)

  useFrame((state, delta) => {
    if (isLow) {
      camera.position.y = 3 + Math.sin(state.clock.elapsedTime / breathPeriod) * breathAmplitude
      camera.lookAt(0, 2, 0)
      return
    }

    timeRef.current += delta
    const t = timeRef.current

    const orbitAngle = t * orbitSpeed
    const x = Math.cos(orbitAngle) * orbitRadius
    const z = Math.sin(orbitAngle) * orbitRadius

    const breathOffset = Math.sin(t / breathPeriod * Math.PI * 2) * breathAmplitude

    const zoomOffset = Math.sin(t / zoomPeriod * Math.PI * 2) * zoomRange

    const rollAngle = Math.sin(t / rollPeriod * Math.PI * 2) * (rollAmplitude * Math.PI / 180)

    camera.position.set(x, 3 + breathOffset, z + zoomOffset)
    camera.lookAt(0, 2, 0)
    camera.rotation.z = rollAngle
  })

  return null
}
