import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, Text } from '@react-three/drei'
import * as THREE from 'three'
import { useStory, type TopicId } from '../state/useStory'

interface TabDef {
  id: TopicId
  number: string
  label: string
  presenter: string
}

const TABS: TabDef[] = [
  { id: 'intro',      number: '01', label: 'Introdução', presenter: 'Metodologia' },
  { id: 'mapeamento', number: '02', label: 'Mapeamento', presenter: 'Davi' },
  { id: 'pratica',    number: '03', label: 'A Prática', presenter: 'Danilo' },
  { id: 'denuncias',  number: '04', label: 'Denúncias', presenter: 'Davi & Danilo' },
  { id: 'saude',      number: '05', label: 'Saúde Mental', presenter: 'Davi' },
  { id: 'solucoes',   number: '06', label: 'Soluções', presenter: 'Danilo' },
]

const ARC_RADIUS = 3.8
const CARD_WIDTH = 1.15
const CARD_HEIGHT = 1.62
const CARD_DEPTH = 0.05
const BORDER_RADIUS = 0.16

function FloatingCard({
  tab,
  index,
  total,
  hoveredId,
  setHoveredId,
}: {
  tab: TabDef
  index: number
  total: number
  hoveredId: TopicId | null
  setHoveredId: (id: TopicId | null) => void
}) {
  const openTopic = useStory((s) => s.openTopic)
  const groupRef = useRef<THREE.Group>(null)
  const isHovered = hoveredId === tab.id

  // Calculate fixed arc position facing the camera in a wide frontal curve
  const normalizedIndex = total > 1 ? index / (total - 1) : 0.5
  // Span from -65 degrees to +65 degrees
  const angle = -1.14 + normalizedIndex * 2.28
  const baseX = Math.sin(angle) * ARC_RADIUS
  const baseZ = Math.cos(angle) * (ARC_RADIUS * 0.42) + 0.8
  const baseY = 0.25
  const baseRotY = -angle * 0.65

  // Lerp scale and hover elevation
  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const time = clock.getElapsedTime()
    // Smooth independent floating bobbing per card (no spinning)
    const floatY = Math.sin(time * 1.5 + index * 1.1) * 0.08
    const floatTilt = Math.sin(time * 1.2 + index * 0.9) * 0.02

    const targetZ = isHovered ? baseZ + 0.35 : baseZ
    const targetScale = isHovered ? 1.08 : 1.0

    groupRef.current.position.x = baseX
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      baseY + floatY,
      0.1
    )
    groupRef.current.position.z = THREE.MathUtils.lerp(
      groupRef.current.position.z,
      targetZ,
      0.12
    )

    groupRef.current.rotation.y = baseRotY
    groupRef.current.rotation.z = floatTilt

    const currentScale = groupRef.current.scale.x
    const newScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.12)
    groupRef.current.scale.setScalar(newScale)
  })

  return (
    <group
      ref={groupRef}
      position={[baseX, baseY, baseZ]}
      onClick={() => openTopic(tab.id)}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHoveredId(tab.id)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        setHoveredId(null)
        document.body.style.cursor = 'default'
      }}
    >
      {/* ── Outer Border (pmndrs rounded card contour with golden sheen) ── */}
      <RoundedBox
        args={[CARD_WIDTH + 0.04, CARD_HEIGHT + 0.04, CARD_DEPTH - 0.01]}
        radius={BORDER_RADIUS}
        smoothness={8}
      >
        <meshStandardMaterial
          color={isHovered ? '#ffbe59' : '#fedab2'}
          roughness={0.15}
          metalness={0.7}
          envMapIntensity={2.5}
        />
      </RoundedBox>

      {/* ── Inner Frosted Glass Body ── */}
      <RoundedBox
        args={[CARD_WIDTH, CARD_HEIGHT, CARD_DEPTH]}
        radius={BORDER_RADIUS - 0.02}
        smoothness={8}
      >
        <meshPhysicalMaterial
          color={isHovered ? '#fff8ec' : '#fffdfa'}
          transmission={0.65}
          thickness={0.5}
          roughness={0.08}
          metalness={0.15}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          transparent
          opacity={isHovered ? 0.95 : 0.88}
        />
      </RoundedBox>

      {/* ── Number Badge Pill (Warm golden sunset pill) ── */}
      <group position={[0, 0.52, CARD_DEPTH / 2 + 0.01]}>
        <RoundedBox args={[0.36, 0.18, 0.015]} radius={0.08} smoothness={4}>
          <meshStandardMaterial
            color={isHovered ? '#ffbe59' : '#d97724'}
            roughness={0.2}
            metalness={0.5}
          />
        </RoundedBox>
        <Text
          position={[0, 0, 0.02]}
          fontSize={0.1}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          fontWeight={700}
        >
          {tab.number}
        </Text>
      </group>

      {/* ── Topic Title ── */}
      <Text
        position={[0, 0.14, CARD_DEPTH / 2 + 0.02]}
        fontSize={0.125}
        color={isHovered ? '#1a2536' : '#2d3748'}
        anchorX="center"
        anchorY="middle"
        maxWidth={0.92}
        textAlign="center"
        lineHeight={1.25}
        fontWeight={700}
      >
        {tab.label}
      </Text>

      {/* ── Subtitle / Presenter Pill ── */}
      <group position={[0, -0.24, CARD_DEPTH / 2 + 0.01]}>
        <RoundedBox args={[0.72, 0.16, 0.01]} radius={0.08} smoothness={4}>
          <meshStandardMaterial
            color={isHovered ? '#ffeed4' : '#f5e8d8'}
            roughness={0.3}
          />
        </RoundedBox>
        <Text
          position={[0, 0, 0.015]}
          fontSize={0.075}
          color="#8c5826"
          anchorX="center"
          anchorY="middle"
          fontWeight={600}
        >
          {tab.presenter}
        </Text>
      </group>

      {/* ── Interactive R Indicator ── */}
      <Text
        position={[0, -0.52, CARD_DEPTH / 2 + 0.02]}
        fontSize={0.08}
        color={isHovered ? '#d97724' : '#a05c1c'}
        anchorX="center"
        anchorY="middle"
        fontWeight={700}
      >
        ⚡ IDE R
      </Text>
    </group>
  )
}

export function OrbitTabs() {
  const view = useStory((s) => s.view)
  const [hoveredId, setHoveredId] = useState<TopicId | null>(null)
  const isPanelOpen = view !== 'hub'

  if (isPanelOpen) return null

  return (
    <group position={[0, 0, 0]}>
      {TABS.map((tab, i) => (
        <FloatingCard
          key={tab.id}
          tab={tab}
          index={i}
          total={TABS.length}
          hoveredId={hoveredId}
          setHoveredId={setHoveredId}
        />
      ))}
    </group>
  )
}
