import { useMemo } from 'react'
import * as THREE from 'three'

export function SchoolBackground() {
  // Trees with lush clean green canopies matching the grass field
  const trees = useMemo(
    () => [
      { pos: [-9, -0.6, -8], scale: 1.1, color: '#4ade80' },
      { pos: [-6.8, -0.6, -7.5], scale: 0.9, color: '#22c55e' },
      { pos: [-4.6, -0.6, -7], scale: 0.8, color: '#16a34a' },
      { pos: [4.6, -0.6, -7], scale: 0.85, color: '#22c55e' },
      { pos: [6.8, -0.6, -7.5], scale: 0.95, color: '#4ade80' },
      { pos: [9, -0.6, -8], scale: 1.15, color: '#16a34a' },
      { pos: [-11, -0.6, -9], scale: 1.3, color: '#86efac' },
      { pos: [11, -0.6, -9], scale: 1.3, color: '#86efac' },
    ],
    []
  )

  return (
    <group position={[0, 0, -8.5]}>
      {/* ── Soft Rolling Green Hills in the Horizon ── */}
      <mesh position={[0, -1.2, -2.5]} scale={[32, 2.8, 1]}>
        <cylinderGeometry args={[1, 1, 1, 32]} />
        <meshStandardMaterial color="#86efac" roughness={0.9} />
      </mesh>

      {/* ── Clean Courtyard Terrace ── */}
      <mesh position={[0, -0.7, 0]} receiveShadow>
        <boxGeometry args={[19, 0.25, 4]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.5} />
      </mesh>

      {/* ── Central School Pavilion (Clean, Modern & Minimalist) ── */}
      <group position={[0, 0.45, 0]}>
        {/* Main Facade */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[4.2, 2.1, 1.4]} />
          <meshPhysicalMaterial
            color="#ffffff"
            roughness={0.2}
            metalness={0.05}
            clearcoat={0.6}
          />
        </mesh>

        {/* Crisp Modern Eaves / Roof Trim */}
        <mesh position={[0, 1.12, 0]}>
          <boxGeometry args={[4.5, 0.16, 1.6]} />
          <meshStandardMaterial color="#0284c7" roughness={0.2} />
        </mesh>

        {/* Clean Sloped Roof */}
        <mesh position={[0, 1.42, 0.4]}>
          <coneGeometry args={[1.35, 0.65, 4]} />
          <meshPhysicalMaterial
            color="#38bdf8"
            roughness={0.2}
            clearcoat={0.8}
            metalness={0.1}
          />
        </mesh>

        {/* Clock Tower */}
        <mesh position={[0, 1.65, 0]}>
          <boxGeometry args={[1.1, 0.9, 0.9]} />
          <meshPhysicalMaterial color="#f8fafc" roughness={0.2} />
        </mesh>

        {/* Round Pastel Clock Face */}
        <mesh position={[0, 1.65, 0.47]}>
          <circleGeometry args={[0.26, 24]} />
          <meshBasicMaterial color="#e0f2fe" />
        </mesh>

        {/* Tower Spire */}
        <mesh position={[0, 2.3, 0]}>
          <coneGeometry args={[0.45, 0.85, 8]} />
          <meshPhysicalMaterial color="#0284c7" roughness={0.2} metalness={0.3} />
        </mesh>

        {/* Minimalist Entrance Columns */}
        {[-0.6, -0.2, 0.2, 0.6].map((x, i) => (
          <mesh key={i} position={[x, -0.4, 0.75]}>
            <cylinderGeometry args={[0.06, 0.07, 1.05, 16]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.2} />
          </mesh>
        ))}

        {/* Glass Entrance */}
        <mesh position={[0, -0.42, 0.73]}>
          <planeGeometry args={[0.65, 0.85]} />
          <meshPhysicalMaterial
            color="#38bdf8"
            transmission={0.5}
            roughness={0.1}
            transparent
            opacity={0.85}
          />
        </mesh>

        {/* Soft Glass Windows */}
        {[-1.35, -0.65, 0.65, 1.35].map((x, i) => (
          <mesh key={i} position={[x, 0.45, 0.72]}>
            <planeGeometry args={[0.44, 0.6]} />
            <meshPhysicalMaterial
              color="#bae6fd"
              transmission={0.4}
              roughness={0.1}
              transparent
              opacity={0.9}
            />
          </mesh>
        ))}
      </group>

      {/* ── West Wing (Left Classroom Building) ── */}
      <group position={[-4.5, 0.28, -0.2]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[5.0, 1.75, 1.2]} />
          <meshPhysicalMaterial color="#f8fafc" roughness={0.25} />
        </mesh>
        <mesh position={[0, 0.94, 0]}>
          <boxGeometry args={[5.2, 0.14, 1.4]} />
          <meshStandardMaterial color="#0284c7" roughness={0.2} />
        </mesh>
        {/* Soft cyan glass windows */}
        {[-1.8, -1.0, -0.2, 0.6, 1.4].map((x, i) => (
          <group key={i}>
            <mesh position={[x, 0.38, 0.62]}>
              <planeGeometry args={[0.5, 0.48]} />
              <meshPhysicalMaterial
                color="#bae6fd"
                transmission={0.4}
                roughness={0.1}
                transparent
                opacity={0.9}
              />
            </mesh>
            <mesh position={[x, -0.32, 0.62]}>
              <planeGeometry args={[0.5, 0.48]} />
              <meshPhysicalMaterial
                color="#bae6fd"
                transmission={0.4}
                roughness={0.1}
                transparent
                opacity={0.9}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* ── East Wing (Right Classroom Building) ── */}
      <group position={[4.5, 0.28, -0.2]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[5.0, 1.75, 1.2]} />
          <meshPhysicalMaterial color="#f8fafc" roughness={0.25} />
        </mesh>
        <mesh position={[0, 0.94, 0]}>
          <boxGeometry args={[5.2, 0.14, 1.4]} />
          <meshStandardMaterial color="#0284c7" roughness={0.2} />
        </mesh>
        {/* Soft cyan glass windows */}
        {[-1.4, -0.6, 0.2, 1.0, 1.8].map((x, i) => (
          <group key={i}>
            <mesh position={[x, 0.38, 0.62]}>
              <planeGeometry args={[0.5, 0.48]} />
              <meshPhysicalMaterial
                color="#bae6fd"
                transmission={0.4}
                roughness={0.1}
                transparent
                opacity={0.9}
              />
            </mesh>
            <mesh position={[x, -0.32, 0.62]}>
              <planeGeometry args={[0.5, 0.48]} />
              <meshPhysicalMaterial
                color="#bae6fd"
                transmission={0.4}
                roughness={0.1}
                transparent
                opacity={0.9}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* ── Minimalist Flagpole ── */}
      <group position={[-2.4, 0.25, 1.2]}>
        <mesh position={[0, 0.8, 0]}>
          <cylinderGeometry args={[0.02, 0.03, 1.9, 12]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Sky-blue clean flag */}
        <mesh position={[0.22, 1.55, 0]}>
          <planeGeometry args={[0.42, 0.24]} />
          <meshStandardMaterial color="#0284c7" side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* ── Stylized Spherical Lush Trees ── */}
      {trees.map((t, idx) => (
        <group key={idx} position={t.pos as [number, number, number]} scale={t.scale}>
          <mesh position={[0, 0.4, 0]}>
            <cylinderGeometry args={[0.07, 0.1, 0.8, 8]} />
            <meshStandardMaterial color="#5c3d2e" roughness={0.8} />
          </mesh>
          <mesh position={[0, 1.1, 0]}>
            <sphereGeometry args={[0.65, 16, 16]} />
            <meshStandardMaterial color={t.color} roughness={0.6} />
          </mesh>
        </group>
      ))}
    </group>
  )
}
