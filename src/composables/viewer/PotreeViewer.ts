import { PerspectiveCamera, Scene, Vector3, WebGLRenderer } from 'three'
import { PointCloudOctree, Potree } from '@pnext/three-loader'
import { OrbitControls } from '@three-ts/orbit-controls'
import { Camera } from 'cesium'
import { LASLoader } from '@loaders.gl/las'
import { load } from '@loaders.gl/core'
import {
  BufferGeometry,
  BufferAttribute,
  PointsMaterial,
  Points,
} from 'three/src/Three.js'

export class PotreeViewer {
  private targetEl: HTMLElement | undefined
  private renderer = new WebGLRenderer()
  private scene = new Scene()
  private camera = new PerspectiveCamera(45, NaN, 0.1, 1000)
  private cameraControls: OrbitControls | undefined
  private potree = new Potree()
  private pointClouds: PointCloudOctree[] = []
  private prevTime: number | undefined
  private reqAnimationFrameHandle: number | undefined

  initialize(targetEl: HTMLElement): void {
    if (this.targetEl || !targetEl) {
      return
    }
    this.camera.up.set(0, 0, 1)
    // this.camera.position.set(582400.125, 6645601, 270.3599853515625)
    this.cameraControls = new OrbitControls(
      this.camera,
      this.renderer.domElement
    )
    this.cameraControls.rotateSpeed = 0.000005
    this.cameraControls.zoomSpeed = 0.00005
    // this.cameraControls.target.set(582784.8551816479, 6645899.943281263, 221.73972648757723)
    this.camera.position.z = 6
    this.targetEl = targetEl
    targetEl.appendChild(this.renderer.domElement)

    this.camera.layers.toggle(2)

    this.resize()
    this.cameraControls.update()

    window.addEventListener('resize', this.resize)

    requestAnimationFrame(this.loop)
  }

  destroy(): void {
    this.targetEl?.removeChild(this.renderer.domElement)
    this.targetEl = undefined
    window.removeEventListener('resize', this.resize)
    if (this.reqAnimationFrameHandle !== undefined) {
      cancelAnimationFrame(this.reqAnimationFrameHandle)
    }
  }

  async load(fileName: string, baseUrl: string): Promise<PointCloudOctree> {
    return this.potree
      .loadPointCloud(fileName, url => `${baseUrl}${url}`)
      .then((pco: PointCloudOctree) => {
        this.scene.add(pco)
        this.pointClouds.push(pco)

        return pco
      })
  }

  async loadBetter(): Promise<void> {
    try {
      const pointCloud = await load(
        'http://localhost:5000/32-1-512-134-74.laz',
        LASLoader
      )
      const geometry = new BufferGeometry()
      geometry.setAttribute(
        'position',
        new BufferAttribute(pointCloud.attributes.POSITION.value, 3)
      )
      geometry.setAttribute(
        'intensity',
        new BufferAttribute(pointCloud.attributes.intensity.value, 1)
      )

      const center = new Vector3()
      geometry.getAttribute('position').array.forEach((value, index) => {
        center.setComponent(index % 3, center.getComponent(index % 3) + value)
      })
      center.divideScalar(pointCloud.attributes.POSITION.value.length / 3)
      this.camera.position.copy(center)
      this.camera.lookAt(0, 0, 0)

      const material = new PointsMaterial({ color: 0xffffff, size: 0.1 })
      const points = new Points(geometry, material)
      this.scene.add(points)

    } catch (err) {
      console.error(err)
    }
  }

  update(_dt: number): void {
    this.potree.updatePointClouds(this.pointClouds, this.camera, this.renderer)
  }

  synchroCamera(cesiumCamera: Camera): void {
    cesiumCamera.changed.addEventListener(() => {
      this.camera.position.set(
        cesiumCamera.position.x,
        cesiumCamera.position.y,
        cesiumCamera.position.z
      )
      var lookAtPoint = new Vector3().addVectors(
        this.camera.position,
        new Vector3(
          cesiumCamera.direction.x,
          cesiumCamera.direction.y,
          cesiumCamera.direction.z
        )
      )
      this.camera.lookAt(lookAtPoint)
      this.camera.up.set(
        cesiumCamera.up.x,
        cesiumCamera.up.y,
        cesiumCamera.up.z
      )
    })
  }

  render(): void {
    this.renderer.clear()
    this.renderer.render(this.scene, this.camera)
  }

  loop = (time: number): void => {
    this.reqAnimationFrameHandle = requestAnimationFrame(this.loop)

    const prevTime = this.prevTime
    this.prevTime = time
    if (prevTime === undefined) {
      return
    }

    this.update(time - prevTime)
    this.render()
  }

  resize = () => {
    if (this.targetEl) {
      const { width, height } = this.targetEl.getBoundingClientRect()
      this.camera.aspect = width / height
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(width, height)
    }
  }
}
