import { useMemo, useRef, type ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { useStory } from '../state/useStory'

// ─────────────────────────────────────────────────────────────────────────────
// Soft glossy material presets shared by every emblem, so the whole set reads
// as one smooth, rounded family that matches the central character.
// ─────────────────────────────────────────────────────────────────────────────
const AQUA = '#3fc6dd'
const AQUA_DEEP = '#0a8fb0'

interface PropStageProps {
  show: boolean
  scale?: number
  children: ReactNode
}

// Each emblem takes over the CENTER stage (where the character stands) and
// crossfades in with a soft grow, exactly like the conclusion house.
function PropStage({ show, scale = 2, children }: PropStageProps) {
  const ref = useRef<THREE.Group>(null)
  const reveal = useRef(0)

  useFrame((state, delta) => {
    const group = ref.current
    if (!group) return

    reveal.current = THREE.MathUtils.lerp(reveal.current, show ? 1 : 0, Math.min(delta * 2.6, 1))
    const e = reveal.current
    const eased = e * e * (3 - 2 * e)

    group.visible = e > 0.01
    group.scale.setScalar(Math.max(scale * eased, 0.0001))
    // Centred on the camera's look-at height so every emblem sits dead-centre.
    group.position.y = 0.2 + Math.sin(state.clock.elapsedTime * 0.9) * 0.06
    group.rotation.y = Math.sin(state.clock.elapsedTime * 0.45) * 0.35

    group.traverse((obj) => {
      const material = (obj as THREE.Mesh).material
      if (!material) return
      const list = Array.isArray(material) ? material : [material]
      list.forEach((m) => {
        m.transparent = true
        m.opacity = eased
      })
    })
  })

  return (
    <group ref={ref} position={[0, 0.2, 0]}>
      {children}
    </group>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 03 · A Prática — two rounded speech bubbles (dialogue / harsh words)
// ─────────────────────────────────────────────────────────────────────────────
interface BubbleProps {
  color: string
  position: [number, number, number]
  rotation: [number, number, number]
  tail: number
}

function SpeechBubble({ color, position, rotation, tail }: BubbleProps) {
  return (
    <group position={position} rotation={rotation}>
      <RoundedBox args={[0.62, 0.44, 0.2]} radius={0.15} smoothness={8}>
        <meshPhysicalMaterial color={color} roughness={0.25} clearcoat={0.7} />
      </RoundedBox>
      <mesh position={[tail, -0.29, 0]} rotation={[0, 0, tail > 0 ? 0.6 : -0.6]}>
        <coneGeometry args={[0.11, 0.2, 4]} />
        <meshPhysicalMaterial color={color} roughness={0.25} clearcoat={0.7} />
      </mesh>
      {[-0.14, 0, 0.14].map((x, i) => (
        <mesh key={i} position={[x, 0, 0.11]}>
          <sphereGeometry args={[0.035, 20, 20]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      ))}
    </group>
  )
}

function SpeechProp() {
  return (
    <group>
      <SpeechBubble
        color="#7fd6d1"
        position={[-0.16, 0.14, 0.05]}
        rotation={[0, 0.28, 0.05]}
        tail={-0.16}
      />
      <SpeechBubble
        color="#ff9f7a"
        position={[0.17, -0.13, -0.02]}
        rotation={[0, -0.24, -0.05]}
        tail={0.14}
      />
    </group>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 04 · Denúncias — a rounded node network (support channels / trust links)
// ─────────────────────────────────────────────────────────────────────────────
function NetworkProp() {
  const nodes = useMemo(
    () => Array.from({ length: 6 }, (_, i) => (i / 6) * Math.PI * 2),
    []
  )
  return (
    <group>
      <mesh>
        <sphereGeometry args={[0.18, 32, 32]} />
        <meshPhysicalMaterial color={AQUA} roughness={0.12} metalness={0.15} clearcoat={1} />
      </mesh>
      {nodes.map((angle, i) => {
        const x = Math.cos(angle) * 0.44
        const y = Math.sin(angle) * 0.44
        return (
          <group key={i}>
            <mesh position={[x / 2, y / 2, 0]} rotation={[0, 0, angle - Math.PI / 2]}>
              <cylinderGeometry args={[0.022, 0.022, 0.44, 16]} />
              <meshPhysicalMaterial color={AQUA_DEEP} roughness={0.35} clearcoat={0.5} />
            </mesh>
            <mesh position={[x, y, 0]}>
              <sphereGeometry args={[0.12, 28, 28]} />
              <meshPhysicalMaterial
                color="#5fd8e6"
                roughness={0.12}
                metalness={0.15}
                clearcoat={1}
              />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 05 · Saúde Mental — a soft yellow blob with closed, sad eyes and a floating
// blue teardrop, matching the topic 05 reference image.
// ─────────────────────────────────────────────────────────────────────────────
function SadFaceProp() {
  // Smooth teardrop profile revolved with a lathe (round bottom, tapered tip).
  const dropGeometry = useMemo(() => {
    const profile = new THREE.SplineCurve([
      new THREE.Vector2(0.001, 0),
      new THREE.Vector2(0.1, 0.02),
      new THREE.Vector2(0.175, 0.1),
      new THREE.Vector2(0.2, 0.2),
      new THREE.Vector2(0.165, 0.31),
      new THREE.Vector2(0.1, 0.42),
      new THREE.Vector2(0.02, 0.53),
    ])
    return new THREE.LatheGeometry(profile.getPoints(40), 48)
  }, [])

  return (
    <group position={[0.08, -0.05, 0]}>
      {/* ── The sad yellow blob ── */}
      <mesh scale={[0.5, 0.525, 0.41]}>
        <sphereGeometry args={[1, 48, 48]} />
        <meshPhysicalMaterial
          color="#e6d07c"
          roughness={0.5}
          clearcoat={0.35}
          clearcoatRoughness={0.45}
        />
      </mesh>

      {/* ── Closed, sad eyes ── */}
      {[-1, 1].map((side) => (
        <group key={side}>
          {/* Dark closed-eye oval */}
          <mesh
            position={[side * 0.2, -0.09, 0.362]}
            rotation={[0, 0, side * 0.18]}
            scale={[0.62, 1.75, 0.5]}
          >
            <sphereGeometry args={[0.055, 20, 20]} />
            <meshStandardMaterial color="#3a352e" roughness={0.6} />
          </mesh>
          {/* Curved eyelid / brow line above the eye (tilted arc cap) */}
          <mesh position={[side * 0.2, 0.035, 0.385]} rotation={[0.25, 0, 0.6 - side * 0.12]}>
            <torusGeometry args={[0.095, 0.016, 10, 32, Math.PI * 0.62]} />
            <meshStandardMaterial color="#3a352e" roughness={0.6} />
          </mesh>
        </group>
      ))}

      {/* ── Floating blue teardrop ── */}
      <mesh position={[-0.45, 0.12, 0.12]} rotation={[0, 0, -0.06]} scale={0.82} geometry={dropGeometry}>
        <meshPhysicalMaterial
          color="#7397d9"
          roughness={0.3}
          clearcoat={0.8}
          clearcoatRoughness={0.25}
        />
      </mesh>
    </group>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Chooses the emblem for the active section. The intro (section 0) and the
// mapping topic (section 1) keep the character; the conclusion (section 5)
// is handled by the house model.
// ─────────────────────────────────────────────────────────────────────────────
export function SectionProps() {
  const activeSection = useStory((s) => s.activeSection)

  return (
    <>
      <PropStage show={activeSection === 2} scale={2.0}>
        <SpeechProp />
      </PropStage>
      <PropStage show={activeSection === 3} scale={2.0}>
        <NetworkProp />
      </PropStage>
      <PropStage show={activeSection === 4} scale={1.6}>
        <SadFaceProp />
      </PropStage>
    </>
  )
}
