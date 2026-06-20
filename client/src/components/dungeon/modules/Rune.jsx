import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import runeVertexShader from '../shaders/runeVertex.glsl?raw'
import runeFragmentShader from '../shaders/runeFragment.glsl?raw'

export default function Rune({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  color = '#3D7FFF',
}) {
  const materialRef = useRef()

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
    }),
    [color]
  )

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
    }
  })

  return (
    <mesh position={position} rotation={rotation} scale={scale}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={runeVertexShader}
        fragmentShader={runeFragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}