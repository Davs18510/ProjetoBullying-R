import { useRef, Suspense } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { useStory } from '../state/useStory'

const MODEL_PATH = '/model/frutiger_aero_character_v2.glb'
const TARGET_HEIGHT = 2.0

function ModelMesh() {
  const { scene } = useGLTF(MODEL_PATH)
  const ref = useRef<THREE.Group>(null)
  const view = useStory((s) => s.view)

  // Auto-scale to target height
  const scaled = useRef(false)
  if (!scaled.current && ref.current) {
    const box = new THREE.Box3().setFromObject(ref.current)
    const size = new THREE.Vector3()
    box.getSize(size)
    if (size.y > 0) {
      const factor = TARGET_HEIGHT / size.y
      ref.current.scale.setScalar(factor)
      // Center at origin
      box.setFromObject(ref.current)
      const center = new THREE.Vector3()
      box.getCenter(center)
      ref.current.position.sub(center)
      ref.current.position.y += TARGET_HEIGHT / 2 - 0.9
      scaled.current = true
    }
  }

  useFrame((_, delta) => {
    if (!ref.current) return
    if (view === 'hub') {
      ref.current.rotation.y += delta * 0.4
    }
  })

  return (
    <group ref={ref}>
      <primitive object={scene} />
    </group>
  )
}

function FallbackSphere() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.4
  })
  return (
    <mesh ref={ref} position={[0, 0, 0]}>
      <icosahedronGeometry args={[1, 3]} />
      <meshPhysicalMaterial
        color="#19c6d6"
        roughness={0.05}
        metalness={0.2}
        transmission={0.3}
        thickness={1}
        envMapIntensity={2}
      />
    </mesh>
  )
}

export function CentralModel() {
  return (
    <Suspense fallback={<FallbackSphere />}>
      <ModelMesh />
    </Suspense>
  )
}

useGLTF.preload(MODEL_PATH)
