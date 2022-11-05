import * as THREE from 'three'
// 导入轨道控制器
import {
  OrbitControls
} from 'three/examples/jsm/controls/OrbitControls'
// 导入 dat.gui
import * as dat from 'dat.gui'

const gui = new dat.GUI()

// console.log(THREE)

// 聚光灯的属性与设置

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

const planeGeometry = new THREE.PlaneBufferGeometry(50, 50)
const plane = new THREE.Mesh(planeGeometry, material)
plane.position.set(0, -1, 0)
plane.rotation.x = -Math.PI / 2
plane.receiveShadow = true
scene.add(plane)


// 灯光
// 环境光
const light = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(light)
// 聚光灯
const spotLight = new THREE.SpotLight(0xffffff, 0.5);
spotLight.position.set(5, 5, 5);
spotLight.castShadow = true;
// 设置阴影贴图模糊度
spotLight.shadow.radius = 20
// 设置阴影贴图分辨率
spotLight.shadow.mapSize.set(2048, 2048)
spotLight.intensity = 3
console.log(spotLight.shadow);
// 聚光灯目标物体
spotLight.target = sphere




// 设置平行光投射相机的属性 ==> 超过一定距离不再渲染阴影
// spotLight.shadow.camera.near = 0.5
// spotLight.shadow.camera.far = 500
// spotLight.shadow.camera.top = 5
// spotLight.shadow.camera.bottom = -5
// spotLight.shadow.camera.left = -5
// spotLight.shadow.camera.right = 5

scene.add(spotLight);

// 通过改变球的位置，使聚光灯跟随球移动
gui.add(sphere.position, "x").min(-5).max(10).step(0.1).name("物体位置x")
// 聚光灯范围，角度；最大不可超过 90度
gui.add(spotLight, "angle").min(0).max(Math.PI / 2).step(0.01).name("聚光灯范围")
// 聚光灯照射距离
gui.add(spotLight, "distance").min(0).max(50).name("聚光灯照射距离")
// 聚光灯衰减 ==> 中间向旁边衰减
gui.add(spotLight, "penumbra").min(0).max(1).name("聚光灯衰减")
// 聚光灯距离衰减 ==> 随着距离进行衰减  ==> 需要在物理模式下 physicallyCorrectights
gui.add(spotLight, "decay").min(0).max(5).name("聚光灯距离衰减")



// 4. 初始化渲染器
const renderer = new THREE.WebGLRenderer()
// 4.1 设置渲染尺寸和大小
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
renderer.physicallyCorrectLights = true
// console.log(renderer); // 包含一个 canvas
// 4.2 将 webgl 渲染的 canvas 添加到 body 中
document.body.appendChild(renderer.domElement)
// 4.3 使用渲染器，通过相机将场景渲染进来
renderer.render(scene, camera)



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