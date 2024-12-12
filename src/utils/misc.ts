/* eslint-disable no-console */
import type { ObjectMap } from '@react-three/fiber'
import type { Mesh, Object3D } from 'three'
import type { GLTF } from 'three-stdlib'

// 打印扁平模型的所有部分
function printModel(modelParts: Object3D[], modelName = 'modelParts') {
  const strArray = modelParts.map((obj, i) => {
    const row = `const ${obj.name} = ${modelName}[${i}]-${obj.type};`
    return row
  })
  const str = strArray.join('\n')
  console.log(str)
  return str
}

// 扁平化模型
function flatModel(gltf: GLTF & ObjectMap) {
  const modelArr: Mesh[] = []
  gltf.scene.traverse((child) => {
    modelArr.push(child as Mesh)
  })
  return modelArr
}

// 生成二维高斯卷积核
function generateGaussianKernel2D(size: number, sigma: number = 0.84089642) {
  const kernel: Array<Array<number>> = []
  const mean = Math.floor(size / 2) // 中心点
  let sum = 0

  for (let x = 0; x < size; x++) {
    kernel[x] = []
    for (let y = 0; y < size; y++) {
      const dx = x - mean
      const dy = y - mean
      // 使用高斯函数计算权重
      const weight = Math.exp(-(dx * dx + dy * dy) / (2 * sigma * sigma)) / (2 * Math.PI * sigma * sigma)
      kernel[x][y] = weight
      sum += weight
    }
  }

  // 归一化处理，使得卷积核的总和为1
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      kernel[x][y] /= sum
    }
  }

  return kernel
}

function calculateGaussianKernel(size: number, sigma: number = 0.84089642) {
  const kernel = []
  const center = Math.floor(size / 2)
  let sum = 0

  // 计算每个位置的高斯权重
  for (let i = 0; i < size; i++) {
    const x = i - center
    const weight = Math.exp(-(x * x) / (2 * sigma * sigma)) / (Math.sqrt(2 * Math.PI) * sigma)
    kernel.push(weight)
    sum += weight
  }

  // 归一化
  for (let i = 0; i < size; i++) {
    kernel[i] /= sum
  }

  return kernel
}

function getGaussianKernelWeights(size: number, sigma: number = 0.84089642) {
  const kernelSize = size * 2 - 1
  const center = Math.floor(kernelSize / 2)
  const kernel = calculateGaussianKernel(kernelSize, sigma)
  const weightArr = kernel.slice(center)
  return weightArr
}

export {

  calculateGaussianKernel,
  flatModel,
  generateGaussianKernel2D,
  getGaussianKernelWeights,
  printModel,
}
