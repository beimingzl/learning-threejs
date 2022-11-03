import * as THREE from 'three'
// 导入轨道控制器
import {
  OrbitControls
} from 'three/examples/jsm/controls/OrbitControls'
// 导入 gsap 动画库,控制器阻尼
import gsap from 'gsap'

// console.log(THREE)

// 灯光与阴影
// a. 物体材质要满足对光照有反应 可以使用标准网格材质 MeshStandardMaterial
// b. 设置渲染器开启阴影计算 renderer.shadowMap.enabled = true
// c. 设置光照投射阴影 directionalLight.castShaow = true
// d. 设置物体投射阴影 sphere.castShadow = true
// c. 设置物体接收阴影 plane.receiveShadow = true
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
const sphereGeometry = new THREE.SphereBufferGeometry(1, 20, 20)
// 3.2 添加材质
const material = new THREE.MeshStandardMaterial({
  // color: "#ffffff",
})
material.side = THREE.DoubleSide
const sphere = new THREE.Mesh(sphereGeometry, material)
sphere.castShadow = true
scene.add(sphere)

const planeGeometry = new THREE.PlaneBufferGeometry(10, 10)
const plane = new THREE.Mesh(planeGeometry, material)
plane.position.set(0, -1, 0)
plane.rotation.x = -Math.PI / 2
plane.receiveShadow = true
scene.add(plane)






// 4. 初始化渲染器
const renderer = new THREE.WebGLRenderer()
// 4.1 设置渲染尺寸和大小
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
// console.log(renderer); // 包含一个 canvas
// 4.2 将 webgl 渲染的 canvas 添加到 body 中
document.body.appendChild(renderer.domElement)
// 4.3 使用渲染器，通过相机将场景渲染进来
renderer.render(scene, camera)


// 灯光
// 环境光
const light = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(light)
// 直线光源
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(10, 10, 10);
directionalLight.castShadow = true;
scene.add(directionalLight);

// 5. 创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement)
// 5.1 设置控制器阻尼;需要在动画循环里设置 .update()
controls.enableDamping = true

// 8. 设置时钟
const clock = new THREE.Clock()

// 6. 渲染函数，下一次动画帧渲染
function render() {

  controls.update()
  renderer.render(scene, camera)
  // 请求动画帧，下一帧调用函数
  requestAnimationFrame(render)
}
render()



window.addEventListener('dblclick', () => {

  // 全屏
  // document.fullscreenElement  ==>  全屏元素
  if (!document.fullscreenElement) {
    // 进入全屏
    renderer.domElement.requestFullscreen()
  } else {
    // 退出全屏
    document.exitFullscreen()
  }
})

// 10. 监听窗口变化，更新渲染画面
window.addEventListener('resize', () => {
  console.log('画面变化');
  // 更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight
  // 更新摄像机的投影矩阵
  camera.updateProjectionMatrix()
  // 更新渲染器
  renderer.setSize(window.innerWidth, window.innerHeight)
  // 设置渲染器的像素比
  renderer.setPixelRatio(window.devicePixelRatio)
})

// 7. 添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)