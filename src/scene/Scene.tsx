import { Suspense, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'
import { useStory } from '../state/useStory'
import { CentralModel } from './CentralModel'
import { HouseModel } from './HouseModel'
import { Bubbles } from './Bubbles'
import { Island } from './Island'
import { SchoolBackground } from './SchoolBackground'
import { SectionProps } from './SectionProps'

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
  // Persistent look-at target. Keeping it in a ref (instead of deriving it from
  // the camera direction every frame) avoids the feedback loop that made the
  // camera swing toward the sky/ground on first paint.
  const targetRef = useRef(
    new THREE.Vector3().copy(SECTION_CAMERA_POSES[0].target)
  )

  useFrame((_, delta) => {
    const pose = SECTION_CAMERA_POSES[activeSection] || SECTION_CAMERA_POSES[0]
    camera.position.lerp(pose.pos, Math.min(delta * LERP_SPEED, 1))
    targetRef.current.lerp(pose.target, Math.min(delta * LERP_SPEED, 1))
    camera.lookAt(targetRef.current)
  })

  return null
}

function SceneContent() {
  const activeSection = useStory((s) => s.activeSection)
  const isConclusion = activeSection === 5

  return (
    <>
      <CameraRig />

      {/* Soft, warm atmospheric haze: only the distant background (school,
          trees, horizon) gets veiled, so small imperfections fade away while
          the centre models stay crisp. */}
      <fog attach="fog" args={['#f7dcc0', 8, 22]} />

      {/* Golden-hour comfort lighting: warm low sun + soft violet sky bounce */}
      <ambientLight intensity={0.6} color="#ffe6cf" />
      <hemisphereLight args={['#ffcfa8', '#8fc85a', 0.8]} />
      <directionalLight
        position={[6, 4.5, 5]}
        intensity={1.7}
        color="#ffd9a0"
        castShadow={false}
      />
      <directionalLight position={[-5, 4, -3]} intensity={0.35} color="#c9c4f0" />
      <pointLight position={[0, 3, 2]} intensity={0.45} color="#fff1dc" distance={11} />

      {/* Procedural environment (no HDR download) so soap bubbles reflect the
          warm afternoon sky and a soft sun like real soap films. */}
      <Environment resolution={128} frames={1}>
        <color attach="background" args={['#fbe6cf']} />
        <Lightformer intensity={2.2} color="#ffd9a8" position={[5, 3, 4]} scale={[8, 6, 1]} />
        <Lightformer intensity={1.4} color="#ffffff" position={[0, 7, -6]} scale={[12, 5, 1]} />
        <Lightformer intensity={1.1} color="#d9cdf0" position={[-6, 3, -2]} scale={[7, 6, 1]} />
      </Environment>

      {/* Clean modern school in the background */}
      <SchoolBackground />

      {/* Lush green grass field */}
      <Island />

      {/* Central 3D Models: Character during topics 0-4, House model on conclusion (5) */}
      <CentralModel />
      <HouseModel active={isConclusion} />

      {/* Themed rounded 3D emblem floating over each topic's message */}
      <SectionProps />

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
