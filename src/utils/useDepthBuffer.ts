import type { Object3D } from 'three'
import { useFBO } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useMemo } from 'react'
import { Color, DepthFormat, DepthTexture, MeshDepthMaterial, NoBlending, UnsignedShortType } from 'three'

function useDepthBuffer(width: number, height: number, ignoreList: Object3D[] = []) {
  const camera = useThree(state => state.camera)

  const depthTexture = useMemo(() => {
    const depthTexture = new DepthTexture(width, height)
    depthTexture.format = DepthFormat
    depthTexture.type = UnsignedShortType
    return depthTexture
  }, [])

  const depthBuffer = useFBO(width, height, {
    generateMipmaps: false,
    depthTexture,
  })

  const material = useMemo(() => new MeshDepthMaterial({
    blending: NoBlending,
  }), [])
  const bgColor = new Color(0x000000)

  useFrame((state, _) => {
    const { gl, scene } = state
    const originalBg = scene.background
    scene.background ??= bgColor
    scene.overrideMaterial = material

    const dpr = gl.getPixelRatio()

    depthBuffer.setSize(width * dpr, height * dpr)

    ignoreList.forEach((obj) => {
      obj.visible = false
    })

    gl.setRenderTarget(depthBuffer)
    gl.render(scene, camera)
    gl.setRenderTarget(null)

    scene.overrideMaterial = null
    scene.background = originalBg

    ignoreList.forEach((obj) => {
      obj.visible = true
    })
  })

  return depthBuffer.depthTexture
}

export {
  useDepthBuffer,
}
