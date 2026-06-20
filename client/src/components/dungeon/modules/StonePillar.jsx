import { useMemo } from 'react'
import * as THREE from 'three'

export default function StonePillar({
  position = [0, 0, 0],
  height = 4,
  radius = 0.3,
  color = '#1A1F2E',
}) {
  const geometry = useMemo(() => {
    const geo = new THREE.CylinderGeometry(radius, radius * 1.1, height, 8)
    const positions = geo.attributes.position.array
    for (let i = 0; i < positions.length; i += 3) {
      const y = positions[i + 1]
      const noise = Math.sin(y * 2) * 0.02 + Math.cos(y * 3) * 0.01
      positions[i] += noise
      positions[i + 2] += noise
    }
    geo.computeVertexNormals()
    return geo
  }, [height, radius])

  return (
    <mesh position={position} geometry={geometry}>
      <meshStandardMaterial color={color} roughness={0.9} metalness={0.1} />
    </mesh>
  )
}