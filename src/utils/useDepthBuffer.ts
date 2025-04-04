import type { Object3D, Texture } from 'three'
import { useFBO } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useMemo } from 'react'
import { Color, DepthFormat, DepthTexture, DoubleSide, FloatType, MeshDepthMaterial, NearestFilter, RGBADepthPacking, UnsignedInt248Type, UnsignedIntType, UnsignedShortType } from 'three'

function useDepthBuffer(width: number, height: number, ignoreList: Object3D[] = []) {
  const camera = useThree(state => state.camera)

  const gl = useThree(state => state.gl)

  const dpr = gl.getPixelRatio()

  const depthTexture = useMemo(() => {
    const depthTexture = new DepthTexture(width * dpr, height * dpr)
    depthTexture.format = DepthFormat
    depthTexture.type = UnsignedInt248Type
    return depthTexture
  }, [width, height])

  const depthBuffer = useFBO(width * dpr, height * dpr, {
    generateMipmaps: false,
    depthTexture,
  })

  const material = useMemo(() => new MeshDepthMaterial({}), [])
  const bgColor = new Color(0x000000)

  useFrame((state, _) => {
    const { gl, scene } = state

    const dpr = gl.getPixelRatio()

    const originalBg = scene.background
    scene.background ??= bgColor
    scene.overrideMaterial = material

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
