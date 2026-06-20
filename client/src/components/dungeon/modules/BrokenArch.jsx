import { useMemo } from 'react'
import * as THREE from 'three'

export default function BrokenArch({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  width = 2,
  height = 3,
  color = '#1A1F2E',
}) {
  const geometry = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(-width / 2, 0)
    shape.lineTo(-width / 2, height * 0.7)
    shape.quadraticCurveTo(-width / 2, height, 0, height)
    shape.quadraticCurveTo(width / 2, height, width / 2, height * 0.7)
    shape.lineTo(width / 2, 0)
    shape.lineTo(width / 2 - 0.2, 0)
    shape.lineTo(width / 2 - 0.2, height * 0.65)
    shape.quadraticCurveTo(width / 2 - 0.2, height - 0.2, 0, height - 0.2)
    shape.quadraticCurveTo(-width / 2 + 0.2, height - 0.2, -width / 2 + 0.2, height * 0.65)
    shape.lineTo(-width / 2 + 0.2, 0)
    shape.lineTo(-width / 2, 0)

    const extrudeSettings = { depth: 0.3, bevelEnabled: false }
    return new THREE.ExtrudeGeometry(shape, extrudeSettings)
  }, [width, height])

  return (
    <mesh position={position} rotation={rotation} geometry={geometry}>
      <meshStandardMaterial color={color} roughness={0.9} metalness={0.1} />
    </mesh>
  )
}
