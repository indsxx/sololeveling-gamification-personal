export default function Staircase({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  steps = 5,
  stepWidth = 1.5,
  stepHeight = 0.2,
  stepDepth = 0.4,
  color = '#1A1F2E',
}) {
  return (
    <group position={position} rotation={rotation}>
      {Array.from({ length: steps }).map((_, i) => (
        <mesh key={i} position={[0, i * stepHeight, -i * stepDepth]}>
          <boxGeometry args={[stepWidth, stepHeight, stepDepth]} />
          <meshStandardMaterial color={color} roughness={0.9} metalness={0.1} />
        </mesh>
      ))}
    </group>
  )
}
