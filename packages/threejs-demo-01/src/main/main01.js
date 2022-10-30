import * as THREE from 'three'

// console.log(THREE)

// 了解 three.js 基本使用
// 1.创建场景
const scene = new THREE.Scene()

// 2.创建相机
// 2.1 透视相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

// 2.2 相机位置,并添加到场景中
camera.position.set(0, 0, 10)
scene.add(camera)

// 3. 添加物体
// 3.1 创建几何体
const cubeGeometry = new THREE.BoxGeometry()
// 3.2 材质
const cubeMaterial = new THREE.MeshBasicMaterial({
  color: 0xffff00
})
// 3.3 创建物体
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
// 3.3 将物体添加到场景中
scene.add(cube)

// 4. 初始化渲染器
const renderer = new THREE.WebGLRenderer()
// 4.1 设置渲染尺寸和大小
renderer.setSize(window.innerWidth, window.innerHeight)
// console.log(renderer); // 包含一个 canvas
// 4.2 将 webgl 渲染的 canvas 添加到 body 中
document.body.appendChild(renderer.domElement)
// 4.3 使用渲染器，通过相机将场景渲染进来
renderer.render(scene, camera)