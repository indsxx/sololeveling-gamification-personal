import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useWorld } from '../WorldManager'

const DUST_COUNT = 200
const EMBER_COUNT = 30

export default function ParticleEngine() {
  const { isLow, isMedium } = useWorld()
  const dustRef = useRef()
  const emberRef = useRef()

  const dustGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const positions = new Float32Array(DUST_COUNT * 3)
    const velocities = new Float32Array(DUST_COUNT * 3)

    for (let i = 0; i < DUST_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] = Math.random() * 10
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20
      velocities[i * 3] = (Math.random() - 0.5) * 0.002
      velocities[i * 3 + 1] = Math.random() * 0.001 + 0.0005
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.002
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.userData = { velocities }
    return geo
  }, [])

  const emberGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const positions = new Float32Array(EMBER_COUNT * 3)
    const velocities = new Float32Array(EMBER_COUNT * 3)

    for (let i = 0; i < EMBER_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 15
      positions[i * 3 + 1] = Math.random() * 8
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15
      velocities[i * 3] = (Math.random() - 0.5) * 0.003
      velocities[i * 3 + 1] = Math.random() * 0.002 + 0.001
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.003
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.userData = { velocities }
    return geo
  }, [])

  useFrame(() => {
    if (isLow) return

    if (dustRef.current) {
      const positions = dustRef.current.geometry.attributes.position.array
      const velocities = dustRef.current.geometry.userData.velocities
      for (let i = 0; i < DUST_COUNT; i++) {
        positions[i * 3] += velocities[i * 3]
        positions[i * 3 + 1] += velocities[i * 3 + 1]
        positions[i * 3 + 2] += velocities[i * 3 + 2]

        if (positions[i * 3 + 1] > 10) {
          positions[i * 3 + 1] = 0
          positions[i * 3] = (Math.random() - 0.5) * 20
          positions[i * 3 + 2] = (Math.random() - 0.5) * 20
        }
      }
      dustRef.current.geometry.attributes.position.needsUpdate = true
    }

    if (emberRef.current && !isMedium) {
      const positions = emberRef.current.geometry.attributes.position.array
      const velocities = emberRef.current.geometry.userData.velocities
      for (let i = 0; i < EMBER_COUNT; i++) {
        positions[i * 3] += velocities[i * 3]
        positions[i * 3 + 1] += velocities[i * 3 + 1]
        positions[i * 3 + 2] += velocities[i * 3 + 2]

        if (positions[i * 3 + 1] > 8) {
          positions[i * 3 + 1] = 0
          positions[i * 3] = (Math.random() - 0.5) * 15
          positions[i * 3 + 2] = (Math.random() - 0.5) * 15
        }
      }
      emberRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <group>
      <points ref={dustRef} geometry={dustGeometry}>
        <pointsMaterial
          color="#8B95A5"
          size={0.03}
          transparent
          opacity={0.4}
          sizeAttenuation
        />
      </points>

      {!isMedium && (
        <points ref={emberRef} geometry={emberGeometry}>
          <pointsMaterial
            color="#D4A53D"
            size={0.05}
            transparent
            opacity={0.6}
            sizeAttenuation
          />
        </points>
      )}
    </group>
  )
}