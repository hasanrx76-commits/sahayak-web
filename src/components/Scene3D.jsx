import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, Sparkles, Float } from '@react-three/drei'
import * as THREE from 'three'

function Globe() {
  const mesh = useRef(null)
  const wire = useRef(null)

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    if (mesh.current) {
      mesh.current.rotation.y += delta * 0.15
      mesh.current.position.y = Math.sin(t * 0.6) * 0.25
    }
    if (wire.current) {
      wire.current.rotation.y -= delta * 0.08
      wire.current.rotation.x = Math.sin(t * 0.2) * 0.1
    }
  })

  return (
    <group>
      <mesh ref={mesh}>
        <icosahedronGeometry args={[1.6, 1]} />
        <meshStandardMaterial color="#7c6cff" wireframe transparent opacity={0.28} />
      </mesh>
      <mesh ref={wire} scale={1.9}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color="#3ee6ff" wireframe transparent opacity={0.14} />
      </mesh>
      <mesh scale={1.1}>
        <sphereGeometry args={[1.55, 48, 48]} />
        <meshBasicMaterial color="#5a24ff" transparent opacity={0.06} />
      </mesh>
    </group>
  )
}

function Particles() {
  const count = 500
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count * 3; i += 3) {
      const r = 2.4 + Math.random() * 2.2
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      arr[i] = r * Math.sin(phi) * Math.cos(theta)
      arr[i + 1] = r * Math.sin(phi) * Math.sin(theta)
      arr[i + 2] = r * Math.cos(phi)
    }
    return arr
  }, [])

  const ref = useRef(null)
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.05
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#3ee6ff" transparent opacity={0.8} sizeAttenuation />
    </points>
  )
}

function FloatingShape({ position, color, geometry, speed = 1 }) {
  const ref = useRef(null)
  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.x += 0.004 * speed
    ref.current.rotation.y += 0.006 * speed
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.7 * speed) * 0.35
  })
  return (
    <mesh ref={ref} position={position}>
      {geometry}
      <meshStandardMaterial color={color} roughness={0.25} metalness={0.6} transparent opacity={0.9} />
    </mesh>
  )
}

function Rig() {
  useFrame((state) => {
    const { camera, pointer } = state
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 1.2, 0.04)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, pointer.y * 0.8, 0.04)
    camera.lookAt(0, 0, 0)
  })
  return null
}

export default function Scene3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 55 }}
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[6, 6, 6]} intensity={60} color="#7c6cff" />
      <pointLight position={[-6, -4, -4]} intensity={40} color="#ff6ecd" />
      <pointLight position={[0, -6, 2]} intensity={30} color="#3ee6ff" />
      <Rig />
      <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.6}>
        <Globe />
      </Float>
      <Particles />
      <Stars radius={30} depth={30} count={1800} factor={3} saturation={0.6} fade speed={1} />
      <Sparkles count={80} scale={6} size={2.4} speed={0.5} color="#ff6ecd" />
      <FloatingShape
        position={[-3.1, 1.4, -1]}
        color="#ff6ecd"
        geometry={<torusGeometry args={[0.5, 0.16, 16, 40]} />}
        speed={1.3}
      />
      <FloatingShape
        position={[3.2, -1.2, -0.8]}
        color="#3ee6ff"
        geometry={<octahedronGeometry args={[0.55]} />}
        speed={0.9}
      />
      <FloatingShape
        position={[2.9, 1.8, -2]}
        color="#fbbf24"
        geometry={<torusKnotGeometry args={[0.32, 0.1, 80, 12]} />}
        speed={1.1}
      />
    </Canvas>
  )
}
