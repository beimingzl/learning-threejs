import * as THREE from 'three'
// 导入轨道控制器
import {
  OrbitControls
} from 'three/examples/jsm/controls/OrbitControls'

// console.log(THREE)

// Clock 对象跟踪时间
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
console.log(cube);
// 3.4 修改物体的位置
cube.position.set(3, 0, 0) //or cube.position.x = ?
// 3.5 物体缩放
cube.scale.set(3, 2, 1) // or cube.scale.x = ?
// 3.6 物体旋转
cube.rotation.set(Math.PI / 4, 0, 0, "YXZ")

// 4. 初始化渲染器
const renderer = new THREE.WebGLRenderer()
// 4.1 设置渲染尺寸和大小
renderer.setSize(window.innerWidth, window.innerHeight)
// console.log(renderer); // 包含一个 canvas
// 4.2 将 webgl 渲染的 canvas 添加到 body 中
document.body.appendChild(renderer.domElement)
// 4.3 使用渲染器，通过相机将场景渲染进来
renderer.render(scene, camera)

// 5. 创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement)

// 8. 设置时钟
const clock = new THREE.Clock()

// 6. 渲染函数，下一次动画帧渲染
function render() {
  // 匀速动画
  // let t = (time / 1000) % 5
  // 获取始终运行总时长
  // let time = clock.getElapsedTime()
  // console.log('获取运行总时长：', time);
  // 获取两次时间间隔
  // let deltaTime = clock.getDelta()
  // console.log('两次获取时间间隔', deltaTime);

  // cube.position.x = t * 1
  cube.rotation.x += 0.01
  // if (cube.position.x > 5) {
  //   cube.position.x = 0
  // }
  renderer.render(scene, camera)
  // 请求动画帧，下一帧调用函数
  requestAnimationFrame(render)
}
render()



// 7. 添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)