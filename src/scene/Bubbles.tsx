import { useMemo } from 'react'
import { Float } from '@react-three/drei'
import { useStory } from '../state/useStory'

const BUBBLE_COUNT = 14

interface BubbleData {
  position: [number, number, number]
  scale: number
  speed: number
  floatIntensity: number
}

export function Bubbles() {
  const view = useStory((s) => s.view)
  const paused = view !== 'hub'

  const bubbles = useMemo<BubbleData[]>(() => {
    const rng = (min: number, max: number) => min + Math.random() * (max - min)
    return Array.from({ length: BUBBLE_COUNT }, () => ({
      position: [rng(-5, 5), rng(-1, 4), rng(-4, 1)] as [number, number, number],
      scale: rng(0.15, 0.55),
      speed: rng(0.4, 1.0),
      floatIntensity: rng(0.4, 1.2),
    }))
  }, [])

  return (
    <>
      {bubbles.map((b, i) => (
        <Float
          key={i}
          speed={paused ? 0 : b.speed}
          floatIntensity={b.floatIntensity}
          rotationIntensity={0}
        >
          <mesh position={b.position} scale={b.scale}>
            <sphereGeometry args={[1, 24, 24]} />
            <meshPhysicalMaterial
              color="#ffe5c4"
              transmission={0.78}
              thickness={0.8}
              roughness={0.04}
              metalness={0.2}
              envMapIntensity={2.0}
              transparent
              opacity={0.65}
            />
          </mesh>
        </Float>
      ))}
    </>
  )
}
