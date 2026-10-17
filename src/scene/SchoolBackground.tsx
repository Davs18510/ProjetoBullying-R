import { useMemo } from 'react'
import * as THREE from 'three'

export function SchoolBackground() {
  // Generate tree positions along the school yard
  const trees = useMemo(() => [
    { pos: [-8, -0.6, -8], scale: 1.1, color: '#d97736' },
    { pos: [-6, -0.6, -7.5], scale: 0.9, color: '#b85d19' },
    { pos: [-4.2, -0.6, -7], scale: 0.8, color: '#688c3a' },
    { pos: [4.2, -0.6, -7], scale: 0.85, color: '#7a9638' },
    { pos: [6, -0.6, -7.5], scale: 0.95, color: '#d97736' },
    { pos: [8.2, -0.6, -8], scale: 1.15, color: '#c25e24' },
    { pos: [-10, -0.6, -9], scale: 1.3, color: '#8b6f38' },
    { pos: [10, -0.6, -9], scale: 1.3, color: '#9c5b2a' },
  ], [])

  return (
    <group position={[0, 0, -8.5]}>
      {/* ── Distant warm sunset hills ── */}
      <mesh position={[0, -1.2, -2]} scale={[28, 2.5, 1]}>
        <cylinderGeometry args={[1, 1, 1, 32]} />
        <meshStandardMaterial color="#4a4254" roughness={0.9} />
      </mesh>

      {/* ── School Ground Platform / Courtyard ── */}
      <mesh position={[0, -0.7, 0]} receiveShadow>
        <boxGeometry args={[18, 0.25, 4]} />
        <meshStandardMaterial color="#3d3545" roughness={0.8} />
      </mesh>

      {/* ── Central Main Building ── */}
      <group position={[0, 0.4, 0]}>
        {/* Main Body */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[4.2, 2.0, 1.4]} />
          <meshStandardMaterial color="#94483a" roughness={0.65} />
        </mesh>

        {/* Roof / Eaves */}
        <mesh position={[0, 1.08, 0]}>
          <boxGeometry args={[4.4, 0.16, 1.6]} />
          <meshStandardMaterial color="#e2c8b0" roughness={0.4} />
        </mesh>

        {/* Classical Pediment (Triangle gable) */}
        <mesh position={[0, 1.35, 0.6]}>
          <coneGeometry args={[1.3, 0.6, 4]} />
          <meshStandardMaterial color="#d9825b" roughness={0.5} />
        </mesh>

        {/* Clock Tower Base */}
        <mesh position={[0, 1.5, 0]}>
          <boxGeometry args={[1.2, 0.8, 1.0]} />
          <meshStandardMaterial color="#ecd6c0" roughness={0.4} />
        </mesh>

        {/* Glowing Clock Face */}
        <mesh position={[0, 1.5, 0.52]}>
          <circleGeometry args={[0.26, 24]} />
          <meshBasicMaterial color="#ffe899" />
        </mesh>

        {/* Tower Cupola / Spire */}
        <mesh position={[0, 2.15, 0]}>
          <coneGeometry args={[0.55, 0.9, 8]} />
          <meshStandardMaterial color="#406a6e" roughness={0.3} metalness={0.4} />
        </mesh>

        {/* Entrance Portico Columns */}
        {[-0.6, -0.2, 0.2, 0.6].map((x, i) => (
          <mesh key={i} position={[x, -0.4, 0.75]}>
            <cylinderGeometry args={[0.07, 0.08, 1.0, 12]} />
            <meshStandardMaterial color="#f0dfcd" roughness={0.3} />
          </mesh>
        ))}

        {/* Main Entrance Door */}
        <mesh position={[0, -0.45, 0.72]}>
          <planeGeometry args={[0.6, 0.8]} />
          <meshStandardMaterial color="#36221c" roughness={0.8} />
        </mesh>

        {/* Windows on Central Building (illuminated with warm golden classroom light) */}
        {[-1.4, -0.7, 0.7, 1.4].map((x, i) => (
          <group key={i} position={[x, 0.45, 0.72]}>
            <mesh>
              <planeGeometry args={[0.42, 0.55]} />
              <meshBasicMaterial color="#ffdc85" />
            </mesh>
          </group>
        ))}
      </group>

      {/* ── West Wing (Left Classroom Building) ── */}
      <group position={[-4.4, 0.25, -0.2]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[4.8, 1.7, 1.2]} />
          <meshStandardMaterial color="#884236" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.92, 0]}>
          <boxGeometry args={[5.0, 0.14, 1.4]} />
          <meshStandardMaterial color="#d8bfab" roughness={0.4} />
        </mesh>
        {/* 2 Rows of glowing classroom windows */}
        {[-1.8, -1.0, -0.2, 0.6, 1.4].map((x, i) => (
          <group key={i}>
            {/* Upper floor */}
            <mesh position={[x, 0.38, 0.62]}>
              <planeGeometry args={[0.48, 0.45]} />
              <meshBasicMaterial color="#ffe399" />
            </mesh>
            {/* Lower floor */}
            <mesh position={[x, -0.32, 0.62]}>
              <planeGeometry args={[0.48, 0.45]} />
              <meshBasicMaterial color="#ffc966" />
            </mesh>
          </group>
        ))}
      </group>

      {/* ── East Wing (Right Classroom Building) ── */}
      <group position={[4.4, 0.25, -0.2]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[4.8, 1.7, 1.2]} />
          <meshStandardMaterial color="#884236" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.92, 0]}>
          <boxGeometry args={[5.0, 0.14, 1.4]} />
          <meshStandardMaterial color="#d8bfab" roughness={0.4} />
        </mesh>
        {/* 2 Rows of glowing classroom windows */}
        {[-1.4, -0.6, 0.2, 1.0, 1.8].map((x, i) => (
          <group key={i}>
            {/* Upper floor */}
            <mesh position={[x, 0.38, 0.62]}>
              <planeGeometry args={[0.48, 0.45]} />
              <meshBasicMaterial color="#ffe399" />
            </mesh>
            {/* Lower floor */}
            <mesh position={[x, -0.32, 0.62]}>
              <planeGeometry args={[0.48, 0.45]} />
              <meshBasicMaterial color="#ffc966" />
            </mesh>
          </group>
        ))}
      </group>

      {/* ── School Yard Flagpole ── */}
      <group position={[-2.2, 0.2, 1.2]}>
        <mesh position={[0, 0.8, 0]}>
          <cylinderGeometry args={[0.025, 0.035, 1.9, 12]} />
          <meshStandardMaterial color="#e5e5e5" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Flag */}
        <mesh position={[0.22, 1.55, 0]}>
          <planeGeometry args={[0.42, 0.24]} />
          <meshStandardMaterial color="#22c55e" side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* ── Stylized School Yard Trees (Sunset foliage) ── */}
      {trees.map((t, idx) => (
        <group key={idx} position={t.pos as [number, number, number]} scale={t.scale}>
          {/* Trunk */}
          <mesh position={[0, 0.4, 0]}>
            <cylinderGeometry args={[0.08, 0.12, 0.8, 8]} />
            <meshStandardMaterial color="#422e1b" roughness={0.9} />
          </mesh>
          {/* Foliage */}
          <mesh position={[0, 1.1, 0]}>
            <dodecahedronGeometry args={[0.65, 0]} />
            <meshStandardMaterial color={t.color} roughness={0.7} />
          </mesh>
        </group>
      ))}
    </group>
  )
}
