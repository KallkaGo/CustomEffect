import { useFBO } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo } from 'react'
import { MeshNormalMaterial } from 'three'

function useNormalBuffer(width: number, height: number) {
  const normalBuffer = useFBO(width, height, {
    generateMipmaps: false,
    samples: 8,
  })

  const normalBufferMaterial = useMemo(() => new MeshNormalMaterial({}), [])

  useFrame((state, _) => {
    const { gl, camera, scene } = state
    gl.setRenderTarget(normalBuffer)
    scene.overrideMaterial = normalBufferMaterial
    gl.render(scene, camera)
    gl.setRenderTarget(null)
    scene.overrideMaterial = null
  })

  return normalBuffer.texture
}

export {
  useNormalBuffer,
}
