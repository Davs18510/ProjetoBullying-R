import { useRef, useEffect, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { useStory } from '../state/useStory'
import { CentralModel } from './CentralModel'
import { Bubbles } from './Bubbles'
import { Island } from './Island'
import { OrbitTabs } from './OrbitTabs'

// Camera poses
const HUB_POS = new THREE.Vector3(0, 1.2, 7)
const HUB_TARGET = new THREE.Vector3(0, 0, 0)
const TOPIC_POS = new THREE.Vector3(-1.8, 1.4, 5.5)
const TOPIC_TARGET = new THREE.Vector3(0, 0.3, 0)

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

      {/* Lights - Pure offline Frutiger Aero luminous lighting */}
      <ambientLight intensity={0.65} color="#d4f0ff" />
      <hemisphereLight args={['#a8e4ff', '#7ed957', 0.65]} />
      <directionalLight
        position={[4, 6, 3]}
        intensity={1.3}
        color="#ffffff"
        castShadow={false}
      />
      <directionalLight position={[-3, 2, -4]} intensity={0.4} color="#a8e4ff" />
      <pointLight position={[0, 3, 2]} intensity={0.5} color="#ffffff" distance={10} />

      <Island />
      <CentralModel />
      <Bubbles />
      <OrbitTabs />

      <OrbitControls
        enabled={!isPanelOpen}
        enablePan={false}
        minDistance={4}
        maxDistance={9}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.2}
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
      camera={{ position: [0, 1.2, 7], fov: 40 }}
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
