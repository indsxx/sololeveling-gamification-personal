import { useMemo } from 'react'
import * as THREE from 'three'

export default function Chain({
  position = [0, 0, 0],
  segments = 5,
  radius = 0.05,
  color = '#3A3A3A',
}) {
  const torusGeometry = useMemo(
    () => new THREE.TorusGeometry(radius * 3, radius, 8, 16),
    [radius]
  )

  return (
    <group position={position}>
      {Array.from({ length: segments }).map((_, i) => (
        <mesh
          key={i}
          geometry={torusGeometry}
          position={[0, -i * radius * 6, 0]}
          rotation={[Math.PI / 2, i % 2 === 0 ? 0 : Math.PI / 2, 0]}
        >
          <meshStandardMaterial color={color} roughness={0.6} metalness={0.8} />
        </mesh>
      ))}
    </group>
  )
}
