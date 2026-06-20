import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export default function FloatingPlatform({
  position = [0, 0, 0],
  width = 2,
  depth = 2,
  height = 0.2,
  color = '#1A1F2E',
  glowColor = '#3D7FFF',
  floatSpeed = 1,
  floatAmplitude = 0.1,
}) {
  const meshRef = useRef()
  const startY = position[1]

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y =
        startY + Math.sin(state.clock.elapsedTime * floatSpeed) * floatAmplitude
    }
  })

  return (
    <group ref={meshRef} position={position}>
      <mesh>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={color} roughness={0.8} metalness={0.2} />
      </mesh>
      <mesh position={[0, height / 2 + 0.01, 0]}>
        <boxGeometry args={[width - 0.1, 0.02, depth - 0.1]} />
        <meshStandardMaterial
          color={glowColor}
          emissive={glowColor}
          emissiveIntensity={0.5}
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  )
}
