export default function Monolith({
  position = [0, 0, 0],
  height = 5,
  width = 1,
  depth = 0.5,
  color = '#1A1F2E',
}) {
  return (
    <mesh position={position}>
      <boxGeometry args={[width, height, depth]} />
      <meshStandardMaterial color={color} roughness={0.9} metalness={0.1} />
    </mesh>
  )
}
