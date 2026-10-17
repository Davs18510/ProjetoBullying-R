import { ContactShadows } from '@react-three/drei'

export function Island() {
  return (
    <group>
      {/* Warm sunset-lit grass disc */}
      <mesh position={[0, -1.08, 0]} receiveShadow>
        <cylinderGeometry args={[2.2, 2.0, 0.18, 64]} />
        <meshPhysicalMaterial
          color="#5d8b3c"
          roughness={0.6}
          metalness={0.08}
          envMapIntensity={0.8}
        />
      </mesh>

      {/* Subtle inner brass/gold ring */}
      <mesh position={[0, -0.98, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.6, 0.04, 16, 64]} />
        <meshPhysicalMaterial
          color="#ffc87a"
          roughness={0.1}
          metalness={0.82}
          envMapIntensity={2.2}
        />
      </mesh>

      {/* Outer warm copper ring */}
      <mesh position={[0, -0.9, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.6, 0.035, 16, 80]} />
        <meshPhysicalMaterial
          color="#d97724"
          roughness={0.08}
          metalness={0.88}
          envMapIntensity={2.5}
        />
      </mesh>

      {/* Far decorative ring, tilted with amber sheen */}
      <mesh position={[0, 0.4, 0]} rotation={[Math.PI / 2.5, 0.3, 0]}>
        <torusGeometry args={[3.5, 0.025, 12, 80]} />
        <meshPhysicalMaterial
          color="#ffbe59"
          roughness={0.1}
          metalness={0.6}
          transparent
          opacity={0.65}
          envMapIntensity={2.0}
        />
      </mesh>

      {/* Polished warm contact shadows */}
      <ContactShadows
        position={[0, -0.97, 0]}
        scale={5.5}
        blur={2.0}
        opacity={0.42}
        color="#2d160b"
        resolution={1024}
        far={2.2}
      />
    </group>
  )
}
