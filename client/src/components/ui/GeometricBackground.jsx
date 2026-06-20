import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const SHAPES_COUNT = 60
const COLORS = [0x3D7FFF, 0x5C6678, 0xC23B3B, 0xD4A53D]

function createGeometry() {
  const types = [
    () => new THREE.OctahedronGeometry(0.3, 0),
    () => new THREE.BoxGeometry(0.3, 0.3, 0.3),
    () => new THREE.TetrahedronGeometry(0.3, 0),
    () => new THREE.IcosahedronGeometry(0.25, 0),
  ]
  return types[Math.floor(Math.random() * types.length)]()
}

export default function GeometricBackground() {
  const containerRef = useRef(null)
  const rendererRef = useRef(null)
  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const meshesRef = useRef([])
  const rafRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const width = container.clientWidth
    const height = container.clientHeight

    const scene = new THREE.Scene()
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100)
    camera.position.z = 5
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(5, 10, 7.5)
    scene.add(directionalLight)

    const meshes = []
    for (let i = 0; i < SHAPES_COUNT; i++) {
      const geometry = createGeometry()
      const material = new THREE.MeshStandardMaterial({
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        roughness: 0.7,
        metalness: 0.3,
        transparent: true,
        opacity: 0.15 + Math.random() * 0.2,
      })
      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.set(
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6
      )
      mesh.userData = {
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.005,
          y: (Math.random() - 0.5) * 0.005,
          z: (Math.random() - 0.5) * 0.002,
        },
        driftSpeed: {
          x: (Math.random() - 0.5) * 0.001,
          y: (Math.random() - 0.5) * 0.001,
        },
      }
      scene.add(mesh)
      meshes.push(mesh)
    }
    meshesRef.current = meshes

    const clock = new THREE.Clock()
    function animate() {
      rafRef.current = requestAnimationFrame(animate)
      const delta = clock.getDelta()

      meshes.forEach((mesh) => {
        mesh.rotation.x += mesh.userData.rotationSpeed.x
        mesh.rotation.y += mesh.userData.rotationSpeed.y
        mesh.rotation.z += mesh.userData.rotationSpeed.z
        mesh.position.x += mesh.userData.driftSpeed.x
        mesh.position.y += mesh.userData.driftSpeed.y

        if (mesh.position.x > 7) mesh.position.x = -7
        if (mesh.position.x < -7) mesh.position.x = 7
        if (mesh.position.y > 5) mesh.position.y = -5
        if (mesh.position.y < -5) mesh.position.y = 5
      })

      renderer.render(scene, camera)
    }
    animate()

    function handleResize() {
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(rafRef.current)
      renderer.dispose()
      meshes.forEach((mesh) => {
        mesh.geometry.dispose()
        mesh.material.dispose()
      })
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}
