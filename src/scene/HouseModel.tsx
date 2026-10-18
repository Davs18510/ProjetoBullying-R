import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

interface HouseModelProps {
  active: boolean
}

export function HouseModel({ active }: HouseModelProps) {
  const groupRef = useRef<THREE.Group>(null)
  const revealRef = useRef(0)
  const baseScale = 0.85

  // Fade + grow in when the conclusion section becomes active, and gently float.
  useFrame(({ clock }, delta) => {
    const group = groupRef.current
    if (!group) return

    const t = clock.getElapsedTime()
    revealRef.current = THREE.MathUtils.lerp(
      revealRef.current,
      active ? 1 : 0,
      Math.min(delta * 2.4, 1)
    )
    const reveal = revealRef.current
    const eased = reveal * reveal * (3 - 2 * reveal)

    group.rotation.y = Math.sin(t * 0.4) * 0.25 + 0.1
    group.position.y = -0.3 + (1 - eased) * 0.5 + Math.sin(t * 1.2) * 0.05
    group.scale.setScalar(baseScale * eased)
    group.visible = reveal > 0.01

    group.traverse((obj) => {
      const mesh = obj as THREE.Mesh
      const material = mesh.material as THREE.Material | THREE.Material[] | undefined
      if (!material) return
      const list = Array.isArray(material) ? material : [material]
      list.forEach((m) => {
        m.transparent = true
        m.opacity = eased
      })
    })
  })

  return (
    <group ref={groupRef} position={[1.15, -0.3, 0]} scale={baseScale}>
      {/* ── Foundation / Porch Base ── */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <cylinderGeometry args={[1.6, 1.7, 0.15, 32]} />
        <meshPhysicalMaterial
          color="#d5eddb"
          roughness={0.4}
          metalness={0.1}
          clearcoat={0.3}
        />
      </mesh>

      {/* ── Main House Body (Clean Frutiger Aero Ceramic Glass) ── */}
      <RoundedBox args={[1.8, 1.3, 1.5]} radius={0.12} smoothness={6} position={[0, 0.65, 0]}>
        <meshPhysicalMaterial
          color="#fdfdfd"
          roughness={0.1}
          metalness={0.05}
          transmission={0.15}
          thickness={0.8}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
        />
      </RoundedBox>

      {/* ── Roof (Glossy Aqua / Sky Frutiger Aero Roof) ── */}
      <group position={[0, 1.6, 0]}>
        {/* Sloped Roof Prism */}
        <mesh rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[1.55, 0.85, 4]} />
          <meshPhysicalMaterial
            color="#22d3ee"
            roughness={0.15}
            metalness={0.2}
            clearcoat={1}
            clearcoatRoughness={0.1}
            envMapIntensity={2.0}
          />
        </mesh>
        {/* Roof Overhang Trim */}
        <mesh position={[0, -0.4, 0]} rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[1.65, 0.08, 4]} />
          <meshStandardMaterial color="#0891b2" roughness={0.3} />
        </mesh>
      </group>

      {/* ── Front Door (Warm welcoming door) ── */}
      <group position={[0, 0.45, 0.77]}>
        <mesh>
          <planeGeometry args={[0.42, 0.72]} />
          <meshPhysicalMaterial color="#0284c7" roughness={0.2} metalness={0.1} />
        </mesh>
        {/* Door Knob */}
        <mesh position={[0.14, 0, 0.02]}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* ── Glowing Windows (Warm, cozy interior light) ── */}
      {/* Front Left Window */}
      <group position={[-0.52, 0.72, 0.77]}>
        <mesh>
          <planeGeometry args={[0.38, 0.45]} />
          <meshBasicMaterial color="#fef08a" />
        </mesh>
        {/* Window Frame */}
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[0.42, 0.49]} />
          <meshBasicMaterial color="#0284c7" wireframe />
        </mesh>
      </group>

      {/* Front Right Window */}
      <group position={[0.52, 0.72, 0.77]}>
        <mesh>
          <planeGeometry args={[0.38, 0.45]} />
          <meshBasicMaterial color="#fef08a" />
        </mesh>
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[0.42, 0.49]} />
          <meshBasicMaterial color="#0284c7" wireframe />
        </mesh>
      </group>

      {/* Attic Round Window */}
      <mesh position={[0, 1.45, 0.65]}>
        <circleGeometry args={[0.16, 24]} />
        <meshBasicMaterial color="#fed7aa" />
      </mesh>

      {/* ── Chimney with Floating Puff Bubbles ── */}
      <group position={[0.55, 1.85, -0.3]}>
        <RoundedBox args={[0.26, 0.65, 0.26]} radius={0.08} smoothness={4}>
          <meshStandardMaterial color="#f87171" roughness={0.5} />
        </RoundedBox>
        {/* Smoke puff 1 */}
        <mesh position={[0, 0.45, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transmission={0.8}
            roughness={0.1}
            transparent
            opacity={0.7}
          />
        </mesh>
        {/* Smoke puff 2 */}
        <mesh position={[0.04, 0.65, 0.02]}>
          <sphereGeometry args={[0.11, 16, 16]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transmission={0.85}
            roughness={0.1}
            transparent
            opacity={0.55}
          />
        </mesh>
        {/* Smoke puff 3 */}
        <mesh position={[0.08, 0.9, 0.05]}>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transmission={0.9}
            roughness={0.1}
            transparent
            opacity={0.4}
          />
        </mesh>
      </group>
    </group>
  )
}
