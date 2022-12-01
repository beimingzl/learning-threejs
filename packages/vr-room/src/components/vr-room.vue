<!--
 * @Descripttion: 
 * @version: 
 * @Author: 北冥有你 2509777182@qq.com
 * @Date: 2022-11-29 12:56:57
 * @LastEditors: 北冥有你 2509777182@qq.com
 * @LastEditTime: 2022-12-01 16:14:05
-->
<template>
  <div class="container" ref="container"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Material } from 'three/src/materials/Material'

export default defineComponent({
  name: 'vr-room',
  setup() {
    // 创建场景
    const scene = new THREE.Scene()

    // 创建相机 透视相机
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    // 设置相机位置
    camera.position.z = 0.1
    scene.add(camera)

    // 初始化渲染器
    const renderer = new THREE.WebGLRenderer()
    // 设置渲染器大小
    renderer.setSize(window.innerWidth, window.innerHeight)

    // 渲染
    const render = () => {
      renderer.render(scene, camera)
      // 请求动画帧，下一帧调用函数
      requestAnimationFrame(render)
    }

    // 添加物体
    const geometry = new THREE.BoxGeometry(500, 500, 500)
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    // 加载纹理
    var arr = ['4_l', '4_r', '4_u', '4_d', '4_b', '4_f']
    var boxMaterials: Material[] = []

    arr.forEach(item => {
      // 纹理加载./imgs/living/${item}.jpg
      let texture = new THREE.TextureLoader().load(require(`../assets/imgs/living/${item}.jpg`))
      // 创建材质
      if (item === '4_u' || item === '4_d') {
        texture.rotation = Math.PI
        texture.center = new THREE.Vector2(0.5, 0.5)
        boxMaterials.push(new THREE.MeshBasicMaterial({ map: texture }))
      } else {
        boxMaterials.push(new THREE.MeshBasicMaterial({ map: texture }))
      }
    })
    console.log('boxMaterials=>', boxMaterials)
    // 纹理加载方法

    const cube = new THREE.Mesh(geometry, boxMaterials)
    cube.rotation.set(0, Math.PI, 0)
    cube.geometry.scale(1, 1, -1)
    scene.add(cube)

    // 挂载
    const container = ref()
    onMounted(() => {
      // 添加控制器
      const controls = new OrbitControls(camera, container?.value)
      controls.enableDamping = true
      // 挂载完成后，获取dom,将 webgl 渲染到的 canvas 添加其中
      container.value?.appendChild(renderer.domElement)
      render()

      // 鼠标交互功能
      // 射线获取鼠标位置
      const raycaster = new THREE.Raycaster()
      const mouse = new THREE.Vector2()
      // 鼠标按下事件
      const mouseDown = (e: PointerEvent) => {
        e.preventDefault()
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1
        mouse.y = (e.clientY / window.innerHeight) * 2 - 1
        raycaster.setFromCamera(mouse, camera)
        // 在场景中相交的位置
        const intersects = raycaster.intersectObjects(scene.children)
        if (intersects.length > 0) {
          // 打印点击位置
          console.log('intersects :>> ', intersects)
        }
      }
      // 监听场景点击
      container.value?.addEventListener('mousedown', mouseDown)
      // 创建精灵贴图
      const spriteMap = new THREE.TextureLoader().load(require('../assets/imgs/arrow.png'))
      const spriteMaterial = new THREE.SpriteMaterial({
        map: spriteMap,
        color: 0xffffff,
        rotation: Math.PI,
        // transparent: true,
        sizeAttenuation: false,
        blending: THREE.AdditiveBlending
      })
      const sprite = new THREE.Sprite(spriteMaterial)
      sprite.scale.set(0.08, 0.08, 0.08)
      sprite.position.set(-200, -20, 120)
      scene.add(sprite)
    })

    // 进入全屏，退出全屏
    window.addEventListener('dblclick', () => {
      // 进入全屏
      if (!document.fullscreenElement) {
        renderer.domElement.requestFullscreen()
      } else {
        document.exitFullscreen()
      }
    })

    // 监听窗口变化，更新渲染画面
    window.addEventListener('resize', () => {
      // 更新摄像头
      camera.aspect = window.innerWidth / window.innerHeight
      // 更新摄像机的投影矩阵
      camera.updateProjectionMatrix()
      // 更新渲染器
      renderer.setSize(window.innerWidth, window.innerHeight)
      // 设置渲染器的像素比
      renderer.setPixelRatio(window.devicePixelRatio)
    })

    // 添加坐标辅助器
    const axesHelper = new THREE.AxesHelper(5)
    // scene.add(axesHelper)
    return {
      container
    }
  }
})
</script>

<style scoped lange="less">
.container {
  height: 100vh;
  width: 100vw;
  background-color: #f0f0f0;
}
</style>
