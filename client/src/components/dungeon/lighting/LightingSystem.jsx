import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useWorld } from '../WorldManager'

export default function LightingSystem() {
  const { isLow } = useWorld()
  const crystalLight1Ref = useRef()
  const crystalLight2Ref = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (crystalLight1Ref.current) {
      crystalLight1Ref.current.intensity = 0.8 + Math.sin(t * 2) * 0.2
    }
    if (crystalLight2Ref.current) {
      crystalLight2Ref.current.intensity = 0.8 + Math.cos(t * 2.5) * 0.2
    }
  })

  return (
    <>
      <ambientLight color="#0D1117" intensity={0.1} />

      <directionalLight
        color="#B8C4E0"
        intensity={0.6}
        position={[5, 10, 5]}
        castShadow={!isLow}
        shadow-mapSize-width={isLow ? 512 : 2048}
        shadow-mapSize-height={isLow ? 512 : 2048}
        shadow-bias={-0.0005}
        shadow-normal-bias={0.02}
        shadow-radius={4}
      />

      {!isLow && (
        <>
          <pointLight
            ref={crystalLight1Ref}
            color="#3D7FFF"
            intensity={0.8}
            position={[3, 2, -2]}
            distance={5}
          />
          <pointLight
            ref={crystalLight2Ref}
            color="#3D7FFF"
            intensity={0.8}
            position={[-4, 3, 1]}
            distance={5}
          />
        </>
      )}

      <directionalLight
        color="#5C6678"
        intensity={0.3}
        position={[-5, 5, -5]}
      />
      <directionalLight
        color="#5C6678"
        intensity={0.3}
        position={[5, 5, -5]}
      />

      <hemisphereLight
        color="#1A2030"
        groundColor="#0A0C10"
        intensity={0.15}
      />
    </>
  )
}
