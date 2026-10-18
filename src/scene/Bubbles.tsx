import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const BUBBLE_COUNT = 24

interface BubbleData {
  base: [number, number, number]
  scale: number
  drift: [number, number, number]
  freq: [number, number, number]
  phase: number
  spin: number
  tint: string
}

// Soft pastel tints so each bubble catches the light differently, like real
// soap films.
const TINTS = ['#dff4ff', '#e9e3ff', '#e3fff2', '#fff0e6', '#e6f7ff', '#f3e8ff', '#eafcff']

// Deterministic pseudo-random generator so the scene is stable across renders.
const hash = (n: number) => {
  const x = Math.sin(n * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

function Bubble({ data }: { data: BubbleData }) {
  const ref = useRef<THREE.Mesh>(null)
  const spinX = useMemo(() => data.spin * 0.6, [data.spin])

  useFrame(({ clock }) => {
    const mesh = ref.current
    if (!mesh) return
    const t = clock.getElapsedTime()
    const [bx, by, bz] = data.base
    // Layered sines at different frequencies + phases give an organic,
    // non-repeating drift rather than a mechanical bob.
    mesh.position.x = bx + Math.sin(t * data.freq[0] + data.phase) * data.drift[0]
    mesh.position.y =
      by +
      Math.sin(t * data.freq[1] + data.phase * 1.7) * data.drift[1] +
      Math.sin(t * data.freq[1] * 0.47 + data.phase) * data.drift[1] * 0.4
    mesh.position.z = bz + Math.cos(t * data.freq[2] + data.phase) * data.drift[2]
    mesh.rotation.y += data.spin
    mesh.rotation.x += spinX
  })

  return (
    <mesh ref={ref} position={data.base} scale={data.scale}>
      <sphereGeometry args={[1, 32, 32]} />
      {/* Thin soap-film: iridescence + transmission, subtle refraction */}
      <meshPhysicalMaterial
        color={data.tint}
        transparent
        opacity={0.3}
        transmission={0.95}
        thickness={0.35}
        roughness={0.03}
        metalness={0}
        ior={1.33}
        reflectivity={0.9}
        iridescence={1}
        iridescenceIOR={1.32}
        iridescenceThicknessRange={[100, 700]}
        clearcoat={1}
        clearcoatRoughness={0.04}
        envMapIntensity={2.2}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  )
}

export function Bubbles() {
  const bubbles = useMemo<BubbleData[]>(() => {
    const rng = (seed: number, min: number, max: number) => min + hash(seed) * (max - min)
    return Array.from({ length: BUBBLE_COUNT }, (_, i) => {
      const s = i + 1
      // Broaden the size range and bias toward smaller bubbles, like real foam.
      const sizeBase = rng(s * 4, 0.08, 0.7)
      const scale = hash(s * 41) > 0.62 ? sizeBase : 0.08 + (sizeBase - 0.08) * 0.55
      return {
        base: [rng(s, -5.5, 5.5), rng(s * 2, -1.2, 4.2), rng(s * 3, -4.5, 1)] as [number, number, number],
        scale,
        drift: [
          rng(s * 8, 0.35, 0.9),
          rng(s * 9, 0.45, 1.1),
          rng(s * 10, 0.25, 0.6),
        ] as [number, number, number],
        freq: [
          rng(s * 11, 0.15, 0.45),
          rng(s * 12, 0.2, 0.55),
          rng(s * 13, 0.12, 0.4),
        ] as [number, number, number],
        phase: rng(s * 14, 0, Math.PI * 2),
        spin: rng(s * 15, -0.004, 0.004),
        tint: TINTS[Math.floor(rng(s * 7, 0, TINTS.length)) % TINTS.length],
      }
    })
  }, [])

  return (
    <>
      {bubbles.map((b, i) => (
        <Bubble key={i} data={b} />
      ))}
    </>
  )
}
