import * as THREE from "three";
// 导入轨道控制器
import {
  OrbitControls
} from "three/examples/jsm/controls/OrbitControls";
// 导入动画库
import gsap from "gsap";


// 目标：置换贴图、顶点细分设置、金属度、金属贴图、法线贴图、加载管理器

// 1、创建场景
const scene = new THREE.Scene();

// 2、创建相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// 设置相机位置
camera.position.set(0, 0, 10);
scene.add(camera);

// 加载管理器
let event = {}
event.onLoad = function () {
  console.log("加载完成");
}
const div = document.querySelector('div')
event.onProgress = function (url, num, total) {
  console.log("图片加载完成:", url);
  console.log("图片加载进度:", num);
  console.log("图片总数:", total);
  let value = ((num / total) * 100).toFixed(2) + "%";
  console.log("加载进度的百分比：", value);
  div.innerHTML = value;
}
event.onError = function (e) {
  console.log("图片加载出现错误");
  console.log(e);
}
// 使用全局加载管理器
const loadingManager = new THREE.LoadingManager(
  event.onLoad,
  event.onProgress,
  event.onError
)

// 导入纹理
const textureLoader = new THREE.TextureLoader(loadingManager);
//  单张纹理图的加载进度
const doorColorTexture = textureLoader.load("./textures/door/color.jpg", () => {
  console.log('图片加载完成')
}, (e) => {
  console.log(e)
});
const doorAplhaTexture = textureLoader.load("./textures/door/alpha.jpg");
const doorAoTexture = textureLoader.load(
  "./textures/door/ambientOcclusion.jpg"
);
// 导入置换贴图
const doorHeightTexture = textureLoader.load("./textures/door/height.jpg")
// 粗糙度贴图
const roughnessTexture = textureLoader.load("./textures/door/roughness.jpg")
// 导入金属贴图
const metalnessTexture = textureLoader.load('./textures/door/metalness.jpg')
// 导入法线贴图
const normalTexture = textureLoader.load('./textures/door/normal.jpg')
// 添加物体
const cubeGeometry = new THREE.BoxBufferGeometry(1, 1, 1, 100, 100, 100);
console.log(cubeGeometry);
// 材质
const material = new THREE.MeshStandardMaterial({
  color: "#ffff00",
  map: doorColorTexture,
  alphaMap: doorAplhaTexture,
  transparent: true,
  // 环境遮挡
  aoMap: doorAoTexture,
  // 遮挡强度
  aoMapIntensity: 0.5,
  //   opacity: 0.3,
  //   side: THREE.DoubleSide,
  // 置换属性
  displacementMap: doorHeightTexture,
  // 置换影响程度
  displacementScale: 0.1,
  // 设置粗糙度
  roughness: 0,
  // 粗糙度贴图
  roughnessMap: roughnessTexture,
  // 金属度 
  metalness: 1,
  // 金属贴图
  metalnessMap: metalnessTexture,
  // 法线贴图
  normalMap: normalTexture
});
material.side = THREE.DoubleSide;
const cube = new THREE.Mesh(cubeGeometry, material);
scene.add(cube);
// 给cube添加第二组uv
cubeGeometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(cubeGeometry.attributes.uv.array, 2)
);

// 添加平面
const planeGeometry = new THREE.PlaneBufferGeometry(1, 1, 200, 200);
const plane = new THREE.Mesh(planeGeometry, material);
plane.position.set(2, 0, 0);

scene.add(plane);
// console.log(plane);
// 给平面设置第二组uv
planeGeometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(planeGeometry.attributes.uv.array, 2)
);

// 灯光
// 环境光 颜色/光强
const light = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(light)
// 直线光源
const directionaLight = new THREE.DirectionalLight(0xffffff, 0.5)
directionaLight.position.set(5, 5, 0)
scene.add(directionaLight)

// 初始化渲染器
const renderer = new THREE.WebGLRenderer();
// 设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);
// console.log(renderer);
// 将webgl渲染的canvas内容添加到body
document.body.appendChild(renderer.domElement);

// // 使用渲染器，通过相机将场景渲染进来
// renderer.render(scene, camera);

// 创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
// 设置控制器阻尼，让控制器更有真实效果,必须在动画循环里调用.update()。
controls.enableDamping = true;

// 添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
// 设置时钟
const clock = new THREE.Clock();

function render() {
  controls.update();
  renderer.render(scene, camera);
  //   渲染下一帧的时候就会调用render函数
  requestAnimationFrame(render);
}

render();

// 监听画面变化，更新渲染画面
window.addEventListener("resize", () => {
  //   console.log("画面变化了");
  // 更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight;
  //   更新摄像机的投影矩阵
  camera.updateProjectionMatrix();

  //   更新渲染器
  renderer.setSize(window.innerWidth, window.innerHeight);
  //   设置渲染器的像素比
  renderer.setPixelRatio(window.devicePixelRatio);
});