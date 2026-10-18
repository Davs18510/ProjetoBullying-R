import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

// Warm, nostalgic palette for an afternoon in front of the school.
const WALL = '#fdf1dd'
const WALL_SOFT = '#fff7ea'
const ROOF = '#e08a72'
const ROOF_DARK = '#c9705b'
const GLASS = '#ffd79a'

// Shared ground levels so every piece sits exactly on the yard (no gaps).
const YARD_Y = -0.5 // top surface of the schoolyard terrace / path
const GRASS_Y = -0.92 // top surface of the surrounding grass
const KID_Y = -0.468 // seated so the children's shoes rest on the yard

// ─────────────────────────────────────────────────────────────────────────────
// A rounded, soft-focus tree with layered glossy canopies, rooted on the grass.
// ─────────────────────────────────────────────────────────────────────────────
interface TreeProps {
  position: [number, number, number]
  scale?: number
  tone?: string
}

function RoundedTree({ position, scale = 1, tone = '#5fbf3d' }: TreeProps) {
  return (
    <group position={position} scale={scale}>
      {/* Trunk rooted slightly below the grass so no gap shows */}
      <mesh position={[0, 0.34, 0]}>
        <capsuleGeometry args={[0.1, 0.82, 10, 20]} />
        <meshStandardMaterial color="#8a5a3b" roughness={0.85} />
      </mesh>
      {/* Rounded canopy: overlapping squashed spheres */}
      <mesh position={[0, 1.15, 0]} scale={[1, 0.92, 1]}>
        <sphereGeometry args={[0.72, 36, 36]} />
        <meshPhysicalMaterial color={tone} roughness={0.6} clearcoat={0.25} />
      </mesh>
      <mesh position={[-0.42, 0.95, 0.12]} scale={[0.9, 0.85, 0.9]}>
        <sphereGeometry args={[0.46, 32, 32]} />
        <meshPhysicalMaterial color={tone} roughness={0.6} clearcoat={0.25} />
      </mesh>
      <mesh position={[0.44, 0.98, -0.1]} scale={[0.95, 0.88, 0.95]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshPhysicalMaterial color={tone} roughness={0.6} clearcoat={0.25} />
      </mesh>
      {/* Soft highlight cap */}
      <mesh position={[0.06, 1.4, 0.34]} scale={[0.7, 0.5, 0.6]}>
        <sphereGeometry args={[0.32, 24, 24]} />
        <meshStandardMaterial color="#8fe06a" roughness={0.5} />
      </mesh>
    </group>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// A tiny rounded schoolkid with soft idle motion: gentle bob, body sway, an
// optional wave and an optional slow shuffle across the yard.
// ─────────────────────────────────────────────────────────────────────────────
interface KidProps {
  position: [number, number, number]
  rotation?: number
  shirt: string
  hair?: string
  skin?: string
  scale?: number
  wave?: boolean
  shuffle?: boolean
  phase?: number
}

function SimpleKid({
  position,
  rotation = 0,
  shirt,
  hair = '#4a3328',
  skin = '#ffd9b3',
  scale = 0.5,
  wave = false,
  shuffle = false,
  phase = 0,
}: KidProps) {
  const groupRef = useRef<THREE.Group>(null)
  const waveArmRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    const group = groupRef.current
    if (!group) return
    const t = clock.getElapsedTime()

    group.position.y = position[1] + Math.sin(t * 1.5 + phase) * 0.022
    group.position.x = shuffle ? position[0] + Math.sin(t * 0.4 + phase) * 0.3 : position[0]
    group.rotation.z = Math.sin(t * 1.15 + phase) * 0.035
    group.rotation.y =
      rotation + (shuffle ? Math.sin(t * 0.4 + phase) * 0.6 : Math.sin(t * 0.7 + phase) * 0.1)

    if (waveArmRef.current) {
      waveArmRef.current.rotation.z = wave
        ? -1.15 + Math.sin(t * 5.5 + phase) * 0.42
        : 0.32 + Math.sin(t * 1.5 + phase) * 0.05
    }
  })

  return (
    <group ref={groupRef} position={position} rotation={[0, rotation, 0]} scale={scale}>
      {/* Legs + rounded shoes */}
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh position={[side * 0.1, 0.1, 0]}>
            <capsuleGeometry args={[0.075, 0.14, 8, 16]} />
            <meshStandardMaterial color="#5b6b7c" roughness={0.7} />
          </mesh>
          <mesh position={[side * 0.1, -0.012, 0.03]} scale={[1, 0.72, 1.5]}>
            <sphereGeometry args={[0.075, 20, 20]} />
            <meshStandardMaterial color="#455264" roughness={0.65} />
          </mesh>
        </group>
      ))}
      {/* Body */}
      <mesh position={[0, 0.42, 0]}>
        <capsuleGeometry args={[0.23, 0.36, 12, 24]} />
        <meshPhysicalMaterial color={shirt} roughness={0.5} clearcoat={0.35} />
      </mesh>
      {/* Waving arm */}
      <mesh ref={waveArmRef} position={[0.27, 0.46, 0]} rotation={[0, 0, wave ? -1.1 : 0.35]}>
        <capsuleGeometry args={[0.062, 0.24, 8, 16]} />
        <meshPhysicalMaterial color={shirt} roughness={0.5} clearcoat={0.35} />
      </mesh>
      {/* Resting arm */}
      <mesh position={[-0.27, 0.44, 0]} rotation={[0, 0, -0.35]}>
        <capsuleGeometry args={[0.062, 0.24, 8, 16]} />
        <meshPhysicalMaterial color={shirt} roughness={0.5} clearcoat={0.35} />
      </mesh>
      {/* Hands */}
      <mesh position={[0.42, 0.62, 0]}>
        <sphereGeometry args={[0.07, 20, 20]} />
        <meshStandardMaterial color={skin} roughness={0.65} />
      </mesh>
      <mesh position={[-0.36, 0.3, 0]}>
        <sphereGeometry args={[0.07, 20, 20]} />
        <meshStandardMaterial color={skin} roughness={0.65} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.92, 0]}>
        <sphereGeometry args={[0.26, 36, 36]} />
        <meshPhysicalMaterial color={skin} roughness={0.62} clearcoat={0.2} />
      </mesh>
      {/* Hair cap */}
      <mesh position={[0, 0.98, -0.02]} scale={[1.02, 0.78, 1.02]}>
        <sphereGeometry args={[0.27, 36, 36]} />
        <meshStandardMaterial color={hair} roughness={0.75} />
      </mesh>
    </group>
  )
}

// Twelve children scattered in the yard, in small groups.
const KIDS: KidProps[] = [
  { position: [-1.7, KID_Y, 1.6], rotation: 0.5, shirt: '#f4a26b', hair: '#3f2d22', wave: true, phase: 0.4 },
  { position: [-0.7, KID_Y, 2.0], rotation: -0.3, shirt: '#6fb8e0', hair: '#5a3a24', scale: 0.46, phase: 1.9 },
  { position: [0.8, KID_Y, 1.9], rotation: 0.2, shirt: '#8fd07a', hair: '#2f2118', scale: 0.48, phase: 3.1 },
  { position: [1.9, KID_Y, 1.3], rotation: -0.6, shirt: '#e884a8', hair: '#4a3328', wave: true, phase: 4.4 },
  { position: [-2.9, KID_Y, 0.6], rotation: 0.9, shirt: '#c9a2e0', hair: '#3a2a20', scale: 0.44, phase: 5.6 },
  { position: [3.0, KID_Y, 0.5], rotation: -0.9, shirt: '#ffd873', hair: '#513622', scale: 0.45, phase: 6.8 },
  { position: [-1.2, KID_Y, -0.4], rotation: 0.1, shirt: '#63cfc0', hair: '#33241b', scale: 0.47, shuffle: true, phase: 2.3 },
  { position: [1.1, KID_Y, -0.5], rotation: -0.2, shirt: '#ff9f7a', hair: '#4a3328', scale: 0.49, phase: 7.7 },
  { position: [-3.6, KID_Y, 1.5], rotation: 1.1, shirt: '#9fe0c0', hair: '#2f2118', scale: 0.43, phase: 8.5 },
  { position: [3.6, KID_Y, 1.4], rotation: -1.0, shirt: '#b9a7ef', hair: '#3f2d22', scale: 0.46, wave: true, phase: 9.2 },
  { position: [0.1, KID_Y, 2.5], rotation: 0.05, shirt: '#8fc4ff', hair: '#5a3a24', scale: 0.45, shuffle: true, phase: 10.1 },
  { position: [-2.0, KID_Y, 2.4], rotation: 0.7, shirt: '#ffc3a0', hair: '#33241b', scale: 0.42, phase: 11.4 },
]

export function SchoolBackground() {
  // Rounded, layered trees framing the whole schoolyard (rooted on the grass).
  const trees = useMemo<TreeProps[]>(
    () => [
      { position: [-11.5, GRASS_Y, -6], scale: 1.5, tone: '#4fae35' },
      { position: [-8.6, GRASS_Y, -5.4], scale: 1.1, tone: '#5fbf3d' },
      { position: [-6.2, GRASS_Y, -6.6], scale: 0.9, tone: '#72cf4a' },
      { position: [6.2, GRASS_Y, -6.6], scale: 0.95, tone: '#72cf4a' },
      { position: [8.6, GRASS_Y, -5.4], scale: 1.15, tone: '#5fbf3d' },
      { position: [11.5, GRASS_Y, -6], scale: 1.55, tone: '#4fae35' },
      { position: [-4.6, GRASS_Y, -4.4], scale: 1.05, tone: '#67c944' },
      { position: [4.8, GRASS_Y, -4.4], scale: 1.1, tone: '#67c944' },
    ],
    []
  )

  return (
    <group position={[0, 0, -8.5]}>
      {/* ── Soft rolling warm-green hills on the horizon ── */}
      <mesh position={[0, -1.25, -2.6]} scale={[34, 2.6, 1]}>
        <cylinderGeometry args={[1, 1, 1, 64]} />
        <meshStandardMaterial color="#8ccf6a" roughness={0.95} />
      </mesh>

      {/* ── Courtyard terrace: top at yard level, base buried in the grass ── */}
      <RoundedBox
        args={[20, 0.55, 6]}
        radius={0.16}
        smoothness={8}
        position={[0, YARD_Y - 0.275, -0.2]}
        receiveShadow
      >
        <meshStandardMaterial color="#f6ead6" roughness={0.6} />
      </RoundedBox>

      {/* ── Warm pathway (slightly lower so it never z-fights the terrace) ── */}
      <RoundedBox
        args={[2.4, 0.6, 8]}
        radius={0.14}
        smoothness={8}
        position={[0, YARD_Y - 0.32, 2.5]}
      >
        <meshStandardMaterial color="#f3dfc2" roughness={0.7} />
      </RoundedBox>

      {/* ═══ CENTRAL SCHOOL PAVILION ═══ */}
      <group position={[0, 0.5, 0]}>
        <RoundedBox args={[4.3, 2.1, 1.6]} radius={0.4} smoothness={10}>
          <meshPhysicalMaterial color={WALL} roughness={0.35} clearcoat={0.5} />
        </RoundedBox>

        {/* Closed rounded dome roof seated on the wall top (no open rim) */}
        <mesh position={[0, 1.05, 0]} scale={[2.35, 0.55, 0.85]}>
          <sphereGeometry args={[1, 48, 32]} />
          <meshPhysicalMaterial color={ROOF} roughness={0.3} clearcoat={0.7} />
        </mesh>

        {/* Clock tower */}
        <group position={[0, 1.5, 0]}>
          <RoundedBox args={[1.2, 0.95, 0.95]} radius={0.26} smoothness={10}>
            <meshPhysicalMaterial color={WALL_SOFT} roughness={0.3} clearcoat={0.5} />
          </RoundedBox>
          {/* Dome seated exactly on the tower top (was floating before) */}
          <mesh position={[0, 0.475, 0]} scale={[0.66, 0.52, 0.66]}>
            <sphereGeometry args={[1, 40, 28]} />
            <meshPhysicalMaterial color={ROOF_DARK} roughness={0.3} clearcoat={0.7} />
          </mesh>
          <mesh position={[0, 0.34, 0.5]}>
            <circleGeometry args={[0.24, 32]} />
            <meshBasicMaterial color="#fff3d6" />
          </mesh>
          <mesh position={[0, 0.34, 0.51]}>
            <circleGeometry args={[0.24, 32]} />
            <meshBasicMaterial color={ROOF_DARK} wireframe />
          </mesh>
        </group>

        {/* Entrance columns reaching the yard floor */}
        {[-0.6, -0.2, 0.2, 0.6].map((x, i) => (
          <mesh key={i} position={[x, -0.48, 0.86]}>
            <capsuleGeometry args={[0.07, 0.88, 10, 20]} />
            <meshStandardMaterial color="#f0e4cf" roughness={0.4} />
          </mesh>
        ))}

        {/* Warm glowing entrance (pushed just outside the wall face) */}
        <mesh position={[0, -0.45, 0.82]}>
          <planeGeometry args={[0.7, 0.95]} />
          <meshPhysicalMaterial
            color={GLASS}
            transmission={0.4}
            roughness={0.1}
            transparent
            opacity={0.9}
          />
        </mesh>

        {/* Rounded warm windows (outside the wall so they are actually visible) */}
        {[-1.4, -0.7, 0.7, 1.4].map((x, i) => (
          <mesh key={i} position={[x, 0.5, 0.82]}>
            <planeGeometry args={[0.46, 0.62]} />
            <meshPhysicalMaterial
              color={GLASS}
              transmission={0.35}
              roughness={0.1}
              transparent
              opacity={0.92}
            />
          </mesh>
        ))}
      </group>

      {/* ═══ RECESSED CONNECTORS (bridge pavilion ↔ wings, no visible seams) ═══ */}
      {[-2.2, 2.2].map((x, i) => (
        <RoundedBox key={i} args={[0.8, 1.6, 1.0]} radius={0.24} smoothness={8} position={[x, 0.28, -0.2]}>
          <meshPhysicalMaterial color={WALL} roughness={0.4} clearcoat={0.35} />
        </RoundedBox>
      ))}

      {/* ═══ WEST WING ═══ */}
      <group position={[-4.7, 0.35, -0.2]}>
        <RoundedBox args={[5.2, 1.8, 1.3]} radius={0.36} smoothness={10}>
          <meshPhysicalMaterial color={WALL_SOFT} roughness={0.35} clearcoat={0.45} />
        </RoundedBox>
        <mesh position={[0, 0.9, 0]} scale={[2.7, 0.5, 0.75]}>
          <sphereGeometry args={[1, 48, 32]} />
          <meshPhysicalMaterial color={ROOF} roughness={0.3} clearcoat={0.7} />
        </mesh>
        {[-1.8, -1.0, -0.2, 0.6, 1.4].map((x, i) => (
          <group key={i}>
            <mesh position={[x, 0.38, 0.68]}>
              <planeGeometry args={[0.52, 0.5]} />
              <meshPhysicalMaterial color={GLASS} transmission={0.35} roughness={0.1} transparent opacity={0.92} />
            </mesh>
            <mesh position={[x, -0.32, 0.68]}>
              <planeGeometry args={[0.52, 0.5]} />
              <meshPhysicalMaterial color={GLASS} transmission={0.35} roughness={0.1} transparent opacity={0.92} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ═══ EAST WING ═══ */}
      <group position={[4.7, 0.35, -0.2]}>
        <RoundedBox args={[5.2, 1.8, 1.3]} radius={0.36} smoothness={10}>
          <meshPhysicalMaterial color={WALL_SOFT} roughness={0.35} clearcoat={0.45} />
        </RoundedBox>
        <mesh position={[0, 0.9, 0]} scale={[2.7, 0.5, 0.75]}>
          <sphereGeometry args={[1, 48, 32]} />
          <meshPhysicalMaterial color={ROOF} roughness={0.3} clearcoat={0.7} />
        </mesh>
        {[-1.4, -0.6, 0.2, 1.0, 1.8].map((x, i) => (
          <group key={i}>
            <mesh position={[x, 0.38, 0.68]}>
              <planeGeometry args={[0.52, 0.5]} />
              <meshPhysicalMaterial color={GLASS} transmission={0.35} roughness={0.1} transparent opacity={0.92} />
            </mesh>
            <mesh position={[x, -0.32, 0.68]}>
              <planeGeometry args={[0.52, 0.5]} />
              <meshPhysicalMaterial color={GLASS} transmission={0.35} roughness={0.1} transparent opacity={0.92} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ── Rounded flagpole standing on the yard ── */}
      <group position={[-2.5, -0.52, 1.3]}>
        <mesh position={[0, 0.9, 0]}>
          <capsuleGeometry args={[0.03, 1.7, 8, 16]} />
          <meshStandardMaterial color="#e6dccb" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0.24, 1.55, 0]}>
          <planeGeometry args={[0.44, 0.26]} />
          <meshStandardMaterial color="#eaa06b" side={THREE.DoubleSide} roughness={0.6} />
        </mesh>
      </group>

      {/* ── Rounded trees ── */}
      {trees.map((t, idx) => (
        <RoundedTree key={idx} {...t} />
      ))}

      {/* ── Schoolchildren living in the yard ── */}
      {KIDS.map((kid, idx) => (
        <SimpleKid key={idx} {...kid} />
      ))}
    </group>
  )
}
