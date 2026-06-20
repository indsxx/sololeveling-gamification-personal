import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom, N8AO, Vignette } from '@react-three/postprocessing'
import { useWorld } from './WorldManager'
import CameraController from './camera/CameraController'
import LightingSystem from './lighting/LightingSystem'
import ParticleEngine from './particles/ParticleEngine'
import FogSystem from './fog/FogSystem'
import StonePillar from './modules/StonePillar'
import BrokenArch from './modules/BrokenArch'
import FloatingPlatform from './modules/FloatingPlatform'
import Monolith from './modules/Monolith'
import Crystal from './modules/Crystal'
import Rune from './modules/Rune'
import Chain from './modules/Chain'
import Staircase from './modules/Staircase'
import RockFormation from './modules/RockFormation'

function DungeonGeometry() {
  const { isLow } = useWorld()

  return (
    <group>
      <StonePillar position={[-4, 2, -3]} height={5} radius={0.4} />
      <StonePillar position={[4, 2, -4]} height={6} radius={0.35} />
      <StonePillar position={[-3, 2, 3]} height={4} radius={0.3} />
      <StonePillar position={[5, 2, 2]} height={5.5} radius={0.45} />

      <BrokenArch position={[0, 0, -6]} width={4} height={4} />
      <BrokenArch position={[-6, 0, 0]} rotation={[0, Math.PI / 2, 0]} width={3} height={3.5} />

      <FloatingPlatform position={[2, 3, -2]} width={2.5} depth={1.5} />
      <FloatingPlatform position={[-3, 4, -1]} width={1.5} depth={1.5} floatSpeed={0.8} />
      <FloatingPlatform position={[0, 2.5, 2]} width={2} depth={2} floatSpeed={1.2} />

      <Monolith position={[-6, 3, -5]} height={6} width={1.2} depth={0.6} />
      <Monolith position={[6, 2.5, -4]} height={5} width={1} depth={0.5} />

      {!isLow && (
        <>
          <Crystal position={[3, 2.5, -1]} scale={0.8} color="#3D7FFF" />
          <Crystal position={[-2, 3.5, -2]} scale={0.6} color="#3D7FFF" />
          <Crystal position={[1, 4, -3]} scale={0.5} color="#5C8AFF" />
        </>
      )}

      {!isLow && (
        <>
          <Rune position={[0, 3, -5.8]} rotation={[0, 0, 0]} scale={1.5} />
          <Rune position={[-5.8, 2, 0]} rotation={[0, Math.PI / 2, 0]} scale={1.2} />
        </>
      )}

      <Chain position={[-2, 5, -3]} segments={4} />
      <Chain position={[3, 6, -2]} segments={3} />

      <Staircase position={[-5, 0, 2]} rotation={[0, Math.PI / 4, 0]} steps={6} />
      <Staircase position={[4, 0, 3]} rotation={[0, -Math.PI / 3, 0]} steps={4} />

      <RockFormation position={[-7, 0.3, -2]} scale={1.5} />
      <RockFormation position={[7, 0.2, 1]} scale={1.2} />
      <RockFormation position={[0, 0.25, -8]} scale={2} />
    </group>
  )
}

function PostProcessing() {
  const { isUltra, isHigh, isMedium, isDoFActive } = useWorld()

  return (
    <EffectComposer>
      <Bloom
        intensity={isUltra ? 0.8 : isHigh ? 0.6 : isMedium ? 0.4 : 0}
        luminanceThreshold={0.85}
        luminanceSmoothing={0.4}
      />
      {isHigh && <N8AO aoRadius={0.5} intensity={0.3} />}
      {isDoFActive && (
        <depthOfField
          focusDistance={8}
          focalLength={0.0001}
          bokehScale={0.008}
        />
      )}
      <Vignette offset={0.3} darkness={0.3} />
    </EffectComposer>
  )
}

export default function DungeonScene() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      <Canvas
        shadows
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [12, 3, 0], fov: 60, near: 0.1, far: 100 }}
        dpr={[1, 2]}
      >
        <CameraController />
        <LightingSystem />
        <DungeonGeometry />
        <ParticleEngine />
        <FogSystem />
        <PostProcessing />
      </Canvas>
    </div>
  )
}