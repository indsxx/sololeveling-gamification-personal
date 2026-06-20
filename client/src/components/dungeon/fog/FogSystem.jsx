import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useWorld } from '../WorldManager'

export default function FogSystem() {
  const { isLow, isMedium } = useWorld()
  const fogRef = useRef()

  useFrame((state) => {
    if (fogRef.current && !isLow) {
      const t = state.clock.elapsedTime
      fogRef.current.material.opacity = 0.15 + Math.sin(t * 0.5) * 0.05
    }
  })

  if (isLow) return null

  return (
    <group>
      <fog attach="fog" args={['#0A0C10', 5, 25]} />

      <mesh ref={fogRef} position={[0, 1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshBasicMaterial
          color="#1A2030"
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {!isMedium && (
        <>
          <mesh position={[5, 0.5, -3]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[10, 10]} />
            <meshBasicMaterial
              color="#1A2030"
              transparent
              opacity={0.1}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
          <mesh position={[-4, 0.8, 2]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[8, 8]} />
            <meshBasicMaterial
              color="#1A2030"
              transparent
              opacity={0.12}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        </>
      )}
    </group>
  )
}
