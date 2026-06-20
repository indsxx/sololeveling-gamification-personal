import { useMemo } from 'react'
import * as THREE from 'three'

export default function RockFormation({
  position = [0, 0, 0],
  scale = 1,
  color = '#1A1F2E',
}) {
  const geometry = useMemo(() => {
    const geo = new THREE.DodecahedronGeometry(0.5, 0)
    const positions = geo.attributes.position.array
    for (let i = 0; i < positions.length; i += 3) {
      positions[i] += (Math.random() - 0.5) * 0.1
      positions[i + 1] += (Math.random() - 0.5) * 0.1
      positions[i + 2] += (Math.random() - 0.5) * 0.1
    }
    geo.computeVertexNormals()
    return geo
  }, [])

  return (
    <mesh position={position} scale={scale} geometry={geometry}>
      <meshStandardMaterial color={color} roughness={0.95} metalness={0.05} />
    </mesh>
  )
}
