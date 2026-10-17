import { Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { useStory } from '../state/useStory'
import { CentralModel } from './CentralModel'
import { Bubbles } from './Bubbles'
import { Island } from './Island'
import { OrbitTabs } from './OrbitTabs'
import { SchoolBackground } from './SchoolBackground'

// Camera poses
const HUB_POS = new THREE.Vector3(0, 1.15, 7.2)
const HUB_TARGET = new THREE.Vector3(0, 0, 0)
const TOPIC_POS = new THREE.Vector3(-1.8, 1.3, 5.5)
const TOPIC_TARGET = new THREE.Vector3(0, 0.2, 0)

const LERP_SPEED = 2.5

function CameraRig() {
  const { camera } = useThree()
  const view = useStory((s) => s.view)
  const isPanelOpen = view !== 'hub'

  useFrame((_, delta) => {
    const targetPos = isPanelOpen ? TOPIC_POS : HUB_POS
    const targetLook = isPanelOpen ? TOPIC_TARGET : HUB_TARGET
    camera.position.lerp(targetPos, delta * LERP_SPEED)

    // Lerp lookAt via a dummy target
    const currentTarget = new THREE.Vector3()
    camera.getWorldDirection(currentTarget)
    currentTarget.multiplyScalar(10).add(camera.position)
    currentTarget.lerp(targetLook, delta * LERP_SPEED)
    camera.lookAt(currentTarget)
  })

  return null
}

function SceneContent() {
  const view = useStory((s) => s.view)
  const isPanelOpen = view !== 'hub'

  return (
    <>
      <CameraRig />

      {/* Atmospheric sunset fog blending the distant school with the golden horizon */}
      <fog attach="fog" args={['#d67b5e', 9, 26]} />

      {/* Lights - Nostalgic Golden Sunset Lighting */}
      <ambientLight intensity={0.45} color="#fff1de" />
      <hemisphereLight args={['#ffbe69', '#4d3846', 0.85]} />
      <directionalLight
        position={[6, 5, 4]}
        intensity={1.75}
        color="#ffc87a"
        castShadow={false}
      />
      <directionalLight position={[-4, 3, -4]} intensity={0.45} color="#9d7bb0" />
      <pointLight position={[0, 2.5, 3]} intensity={0.55} color="#ffe2b0" distance={10} />

      {/* Nostalgic school campus in the background */}
      <SchoolBackground />

      <Island />
      <CentralModel />
      <Bubbles />
      <OrbitTabs />

      <OrbitControls
        enabled={!isPanelOpen}
        enablePan={false}
        minDistance={4.5}
        maxDistance={9.5}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.15}
        makeDefault
      />
    </>
  )
}

export function Scene() {
  const view = useStory((s) => s.view)
  const isPanelOpen = view !== 'hub'

  return (
    <Canvas
      dpr={isPanelOpen ? 1 : [1, 1.5]}
      camera={{ position: [0, 1.15, 7.2], fov: 40 }}
      gl={{ antialias: true }}
      frameloop="always"
      style={{ width: '100%', height: '100%' }}
    >
      <Suspense fallback={null}>
        <SceneContent />
      </Suspense>
    </Canvas>
  )
}
