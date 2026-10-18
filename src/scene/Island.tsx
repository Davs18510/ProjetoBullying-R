import { ContactShadows } from '@react-three/drei'

export function Island() {
  return (
    <group position={[0, -0.92, 0]}>
      {/* ── Expansive Lush Green Grass Field (chão repleto por grama) ── */}
      <mesh receiveShadow position={[0, -0.25, 0]}>
        <cylinderGeometry args={[11, 12, 0.5, 64]} />
        <meshStandardMaterial
          color="#5fbe32"
          roughness={0.7}
          metalness={0.05}
        />
      </mesh>

      {/* ── Inner Rolling Grass Mound for Central Centerpiece ── */}
      <mesh receiveShadow position={[0, -0.04, 0]}>
        <cylinderGeometry args={[3.2, 3.6, 0.18, 48]} />
        <meshStandardMaterial
          color="#6fce3c"
          roughness={0.65}
          metalness={0.04}
        />
      </mesh>

      {/* ── Subtle Polished Frutiger Aero Ring Accents ── */}
      <mesh position={[0, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.8, 0.025, 16, 64]} />
        <meshPhysicalMaterial
          color="#22d3ee"
          roughness={0.1}
          metalness={0.5}
          clearcoat={1}
          transmission={0.4}
        />
      </mesh>

      <mesh position={[0, 0.03, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[4.2, 0.02, 16, 80]} />
        <meshPhysicalMaterial
          color="#38bdf8"
          roughness={0.15}
          metalness={0.4}
          clearcoat={0.8}
          transmission={0.5}
        />
      </mesh>

      {/* ── Soft Natural Contact Shadows ── */}
      <ContactShadows
        position={[0, 0.06, 0]}
        scale={6.5}
        blur={2.4}
        opacity={0.32}
        color="#1b4312"
        resolution={1024}
        far={2}
      />
    </group>
  )
}
