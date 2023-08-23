import { PerspectiveCamera, Scene, Vector3, WebGLRenderer } from 'three'
import { PointCloudOctree, Potree,  } from '@pnext/three-loader'
import { OrbitControls } from '@three-ts/orbit-controls'
import { Camera } from 'cesium'

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
    this.camera.position.set(0.5, -10.5, 5)
    this.cameraControls = new OrbitControls(
      this.camera,
      this.renderer.domElement
    )
    this.cameraControls.target.set(-0.5, -0.5, 5)

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
        console.log(pco);
        
        this.scene.add(pco)
        this.pointClouds.push(pco)

        return pco
      })
  }

  async loadCompressed(fileName: string, baseUrl: string): Promise<PointCloudOctree> {
    return this.potree
      .loadPointCloud(fileName, url => `${baseUrl}${url}`)
      .then((pco: PointCloudOctree) => {
        console.log(pco);
        
        this.scene.add(pco)
        this.pointClouds.push(pco)

        return pco
      })
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
