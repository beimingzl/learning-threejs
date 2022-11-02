import * as THREE from 'three'
// 导入轨道控制器
import {
  OrbitControls
} from 'three/examples/jsm/controls/OrbitControls'
// 导入 gsap 动画库,控制器阻尼
import gsap from 'gsap'

// console.log(THREE)

// 初识材质与纹理
// 1.创建场景
const scene = new THREE.Scene()

// 2.创建相机
// 2.1 透视相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

// 2.2 相机位置,并添加到场景中
camera.position.set(0, 0, 10)
scene.add(camera)

// 导入纹理
const textureLoader = new THREE.TextureLoader()
const crate = textureLoader.load('./textrues/crate.gif')
// 3. 添加物体
// 3.1 创建几何体
const cubeGeometry = new THREE.BoxBufferGeometry(1, 1, 1)
const basicMaterial = new THREE.MeshBasicMaterial({
  color: "#ffff00",
  map: crate
})
const cube = new THREE.Mesh(cubeGeometry, basicMaterial)
scene.add(cube)




// console.log(cubeGeometry);
// 3.4 修改物体的位置
// cube.position.set(3, 0, 0) //or cube.position.x = ?
// 3.5 物体缩放
// cube.scale.set(3, 2, 1) // or cube.scale.x = ?
// 3.6 物体旋转
// cube.rotation.set(Math.PI / 4, 0, 0, "YXZ")

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
// 5.1 设置控制器阻尼;需要在动画循环里设置 .update()
controls.enableDamping = true

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
  // cube.rotation.x += 0.01
  // if (cube.position.x > 5) {
  //   cube.position.x = 0
  // }
  controls.update()
  renderer.render(scene, camera)
  // 请求动画帧，下一帧调用函数
  requestAnimationFrame(render)
}
render()

// 9.使用 gsap 设置动画  可以传入回调函数
// var animate1 = gsap.to(cube.position, {
//   x: 5,
//   duration: 5,
//   onComplete: () => {
//     console.log('动画完成');
//   },
//   onStart: () => {
//     console.log('动画开始');
//   },
//   // 设置重复次数，无限循环 -1
//   repeat: -1,
//   // 往返运动
//   yoyo: true,
//   // 延迟两秒
//   delay: 2
// })
// gsap.to(cube.rotation, {
//   x: 2 * Math.PI,
//   duration: 5,
//   repeat: -1,
//   yoyo: true
// })

window.addEventListener('dblclick', () => {
  // if (animate1.isActive()) {
  //   console.log('暂停移动');
  //   animate1.pause()
  // } else {
  //   console.log('恢复移动');
  //   animate1.resume()
  // }

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