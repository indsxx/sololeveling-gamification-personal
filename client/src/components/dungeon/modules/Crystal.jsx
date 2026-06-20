import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import crystalVertexShader from '../shaders/crystalVertex.glsl?raw'
import crystalFragmentShader from '../shaders/crystalFragment.glsl?raw'

export default function Crystal({
  position = [0, 0, 0],
  scale = 1,
  color = '#3D7FFF',
  rotationSpeed = 0.001,
}) {
  const meshRef = useRef()
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
    if (meshRef.current) {
      meshRef.current.rotation.y += rotationSpeed
    }
  })

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <icosahedronGeometry args={[0.5, 0]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={crystalVertexShader}
        fragmentShader={crystalFragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}
