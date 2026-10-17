import { Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useStory } from '../state/useStory'
import { CentralModel } from './CentralModel'
import { HouseModel } from './HouseModel'
import { Bubbles } from './Bubbles'
import { Island } from './Island'
import { SchoolBackground } from './SchoolBackground'

// Dynamic camera poses per section for smooth storytelling zooms
const SECTION_CAMERA_POSES: { pos: THREE.Vector3; target: THREE.Vector3 }[] = [
  // 0: Intro (wide panoramic view)
  {
    pos: new THREE.Vector3(0, 1.2, 6.8),
    target: new THREE.Vector3(0, 0.05, 0),
  },
  // 1: Mapeamento (smooth zoom into the rotating 3D character)
  {
    pos: new THREE.Vector3(0, 0.85, 4.6),
    target: new THREE.Vector3(0, 0.15, 0),
  },
  // 2: A Prática (dynamic perspective zoom)
  {
    pos: new THREE.Vector3(0, 0.9, 4.4),
    target: new THREE.Vector3(0, 0.2, 0),
  },
  // 3: Denúncias (focused central zoom)
  {
    pos: new THREE.Vector3(0, 0.85, 4.6),
    target: new THREE.Vector3(0, 0.15, 0),
  },
  // 4: Saúde Mental (closer, intimate focal zoom)
  {
    pos: new THREE.Vector3(0, 0.8, 4.3),
    target: new THREE.Vector3(0, 0.2, 0),
  },
  // 5: Conclusão / Soluções (zoomed on the 3D House sanctuary model)
  {
    pos: new THREE.Vector3(0, 0.75, 4.4),
    target: new THREE.Vector3(0, 0.25, 0),
  },
]

const LERP_SPEED = 2.6

function CameraRig() {
  const { camera } = useThree()
  const activeSection = useStory((s) => s.activeSection)

  useFrame((_, delta) => {
    const pose = SECTION_CAMERA_POSES[activeSection] || SECTION_CAMERA_POSES[0]
    camera.position.lerp(pose.pos, delta * LERP_SPEED)

    const currentTarget = new THREE.Vector3()
    camera.getWorldDirection(currentTarget)
    currentTarget.multiplyScalar(10).add(camera.position)
    currentTarget.lerp(pose.target, delta * LERP_SPEED)
    camera.lookAt(currentTarget)
  })

  return null
}

function SceneContent() {
  const activeSection = useStory((s) => s.activeSection)
  const isConclusion = activeSection === 5

  return (
    <>
      <CameraRig />

      {/* Soft atmospheric daylight sky fog */}
      <fog attach="fog" args={['#eaf8ff', 12, 30]} />

      {/* Fresh Daylight Frutiger Aero Lighting */}
      <ambientLight intensity={0.65} color="#d4f0ff" />
      <hemisphereLight args={['#a8e4ff', '#7ed957', 0.75]} />
      <directionalLight
        position={[5, 8, 4]}
        intensity={1.35}
        color="#ffffff"
        castShadow={false}
      />
      <directionalLight position={[-4, 3, -4]} intensity={0.35} color="#a8eeff" />
      <pointLight position={[0, 3, 2]} intensity={0.4} color="#ffffff" distance={10} />

      {/* Clean modern school in the background */}
      <SchoolBackground />

      {/* Lush green grass field */}
      <Island />

      {/* Central 3D Models: Character during topics 0-4, House model on conclusion (5) */}
      <CentralModel />
      {isConclusion && <HouseModel />}

      {/* Floating crystalline bubbles */}
      <Bubbles />
    </>
  )
}

export function Scene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 1.2, 6.8], fov: 40 }}
      gl={{ antialias: true }}
      frameloop="always"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      <Suspense fallback={null}>
        <SceneContent />
      </Suspense>
    </Canvas>
  )
}
