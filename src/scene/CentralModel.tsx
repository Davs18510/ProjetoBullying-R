import { useRef, Suspense, useEffect, Component, type ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { useStory } from '../state/useStory'

const MODEL_PATH = '/model/frutiger_aero_character_v2.glb'
const TARGET_HEIGHT = 2.0

function ModelMesh() {
  const { scene } = useGLTF(MODEL_PATH)
  const groupRef = useRef<THREE.Group>(null)
  const activeSection = useStory((s) => s.activeSection)
  const scaledRef = useRef(false)
  const targetFactor = useRef(1)

  // Auto-scale once after mount
  useEffect(() => {
    if (scaledRef.current || !groupRef.current) return
    const box = new THREE.Box3().setFromObject(groupRef.current)
    const size = new THREE.Vector3()
    box.getSize(size)
    if (size.y > 0) {
      const factor = TARGET_HEIGHT / size.y
      targetFactor.current = factor
      groupRef.current.scale.setScalar(factor)
      const scaledBox = new THREE.Box3().setFromObject(groupRef.current)
      const center = new THREE.Vector3()
      scaledBox.getCenter(center)
      groupRef.current.position.set(-center.x, -center.y + TARGET_HEIGHT / 2 - 0.9, -center.z)
      scaledRef.current = true
    }
  }, [])

  // Rotate constantly and smoothly scale down in the conclusion section
  useFrame((_, delta) => {
    if (!groupRef.current) return
    // Constant rotation as requested
    groupRef.current.rotation.y += delta * 0.45

    // Smooth crossfade: the character stays in the intro (section 0) and in
    // the mapping topic (section 1). From topic 03 onward a themed emblem
    // takes over the center stage.
    const keepCharacter = activeSection <= 1
    const targetScale = keepCharacter ? targetFactor.current : 0.0001
    const currentScale = groupRef.current.scale.x
    const newScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.1)
    groupRef.current.scale.setScalar(newScale)
  })

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  )
}

function FallbackSphere() {
  const ref = useRef<THREE.Mesh>(null)
  const activeSection = useStory((s) => s.activeSection)

  useFrame((_, delta) => {
    if (!ref.current) return
    ref.current.rotation.y += delta * 0.45
    const keepCharacter = activeSection <= 1
    const targetScale = keepCharacter ? 1.0 : 0.0001
    ref.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
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

interface ModelEBState {
  hasError: boolean
}
class ModelErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  ModelEBState
> {
  state: ModelEBState = { hasError: false }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  render() {
    if (this.state.hasError) return this.props.fallback
    return this.props.children
  }
}

export function CentralModel() {
  return (
    <ModelErrorBoundary fallback={<FallbackSphere />}>
      <Suspense fallback={<FallbackSphere />}>
        <ModelMesh />
      </Suspense>
    </ModelErrorBoundary>
  )
}

useGLTF.preload(MODEL_PATH)
