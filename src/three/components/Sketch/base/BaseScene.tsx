import type { Group } from 'three'
import { useFrame } from '@react-three/fiber'
import { useLoadedStore } from '@utils/Store'
import { useEffect, useRef } from 'react'

function BaseScene() {
  const groupRef = useRef<Group>(null)

  useEffect(() => {
    useLoadedStore.setState({ ready: true })
  }, [])

  useFrame((state, delta) => {
    delta %= 1
    groupRef.current!.rotation.y += delta * 0.5
  })

  return (
  
      <group ref={groupRef}>
        <mesh position={[-1, 0, 0]}>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshBasicMaterial color="#ebcc4b" />
        </mesh>

        <mesh position={[1, 0, 0]}>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshBasicMaterial color="#61ee61" />
        </mesh>
        <mesh position={[0, -0.4, 0]} rotation-x={-Math.PI / 2}>
          <planeGeometry args={[4, 4]} />
          <meshBasicMaterial color="orange" />
        </mesh>
      </group>
    
  )
}

export { BaseScene }
