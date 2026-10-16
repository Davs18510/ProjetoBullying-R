import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, Text, Billboard } from '@react-three/drei'
import * as THREE from 'three'
import { useStory, TopicId } from '../state/useStory'

interface TabDef {
  id: TopicId
  number: string
  label: string
}

const TABS: TabDef[] = [
  { id: 'intro',      number: '01', label: 'Introdução' },
  { id: 'mapeamento', number: '02', label: 'Mapeamento' },
  { id: 'pratica',    number: '03', label: 'A Prática' },
  { id: 'denuncias',  number: '04', label: 'Denúncias' },
  { id: 'saude',      number: '05', label: 'Saúde Mental' },
  { id: 'solucoes',   number: '06', label: 'Soluções' },
]

const ORBIT_RADIUS = 3.4
const ORBIT_SPEED = 0.25

function OrbitTab({
  tab,
  angle,
  hoveredId,
  setHoveredId,
}: {
  tab: TabDef
  angle: number
  hoveredId: TopicId | null
  setHoveredId: (id: TopicId | null) => void
}) {
  const openTopic = useStory((s) => s.openTopic)
  const meshRef = useRef<THREE.Mesh>(null)
  const isHovered = hoveredId === tab.id

  const targetScale = isHovered ? 1.1 : 1.0
  useFrame(() => {
    if (!meshRef.current) return
    meshRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.12
    )
  })

  const x = Math.cos(angle) * ORBIT_RADIUS
  const z = Math.sin(angle) * ORBIT_RADIUS

  return (
    <Billboard position={[x, 0.2, z]} follow lockX={false} lockY={false} lockZ={false}>
      <RoundedBox
        ref={meshRef}
        args={[1.5, 0.75, 0.12]}
        radius={0.12}
        smoothness={4}
        onClick={() => openTopic(tab.id)}
        onPointerOver={() => {
          setHoveredId(tab.id)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHoveredId(null)
          document.body.style.cursor = 'default'
        }}
      >
        <meshPhysicalMaterial
          color={isHovered ? '#19c6d6' : '#b8f0ff'}
          transmission={0.6}
          thickness={0.5}
          roughness={0.08}
          metalness={0.1}
          envMapIntensity={isHovered ? 2.5 : 1.5}
          transparent
          opacity={isHovered ? 0.92 : 0.78}
        />
      </RoundedBox>

      <Text
        position={[0, 0.13, 0.08]}
        fontSize={0.22}
        color={isHovered ? '#0a3a52' : '#0a8fb0'}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0}
      >
        {tab.number}
      </Text>

      <Text
        position={[0, -0.1, 0.08]}
        fontSize={0.13}
        color={isHovered ? '#0b3a52' : '#3d6a82'}
        anchorX="center"
        anchorY="middle"
        maxWidth={1.3}
        textAlign="center"
      >
        {tab.label}
      </Text>
    </Billboard>
  )
}

export function OrbitTabs() {
  const view = useStory((s) => s.view)
  const [hoveredId, setHoveredId] = useState<TopicId | null>(null)
  const groupRef = useRef<THREE.Group>(null)
  const orbitAngle = useRef(0)

  const isPanelOpen = view !== 'hub'
  const isHovering = hoveredId !== null

  useFrame((_, delta) => {
    if (!groupRef.current) return
    if (isPanelOpen) return
    // Slow down on hover
    const speed = isHovering ? ORBIT_SPEED * 0.25 : ORBIT_SPEED
    orbitAngle.current += delta * speed
    groupRef.current.rotation.y = orbitAngle.current
  })

  if (isPanelOpen) return null

  return (
    <group ref={groupRef}>
      {TABS.map((tab, i) => {
        const baseAngle = (i / TABS.length) * Math.PI * 2
        return (
          <OrbitTab
            key={tab.id}
            tab={tab}
            angle={baseAngle}
            hoveredId={hoveredId}
            setHoveredId={setHoveredId}
          />
        )
      })}
    </group>
  )
}
