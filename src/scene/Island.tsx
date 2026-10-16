import { ContactShadows } from '@react-three/drei'

export function Island() {
  return (
    <group>
      {/* Green grass disc */}
      <mesh position={[0, -1.08, 0]} receiveShadow>
        <cylinderGeometry args={[2.2, 2.0, 0.18, 64]} />
        <meshPhysicalMaterial
          color="#7ed957"
          roughness={0.55}
          metalness={0.05}
          envMapIntensity={0.5}
        />
      </mesh>

      {/* Subtle inner ring */}
      <mesh position={[0, -0.98, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.6, 0.04, 16, 64]} />
        <meshPhysicalMaterial
          color="#19c6d6"
          roughness={0.1}
          metalness={0.6}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Outer aqua ring */}
      <mesh position={[0, -0.9, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.6, 0.035, 16, 80]} />
        <meshPhysicalMaterial
          color="#0a8fb0"
          roughness={0.08}
          metalness={0.7}
          envMapIntensity={2}
        />
      </mesh>

      {/* Far decorative ring, tilted */}
      <mesh position={[0, 0.4, 0]} rotation={[Math.PI / 2.5, 0.3, 0]}>
        <torusGeometry args={[3.5, 0.025, 12, 80]} />
        <meshPhysicalMaterial
          color="#19c6d6"
          roughness={0.1}
          metalness={0.5}
          transparent
          opacity={0.6}
          envMapIntensity={1.5}
        />
      </mesh>

      <ContactShadows
        position={[0, -0.97, 0]}
        scale={5}
        blur={2.5}
        opacity={0.3}
        resolution={512}
        far={2}
      />
    </group>
  )
}
