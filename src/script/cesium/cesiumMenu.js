import { container } from '../event/Inversify'
import { InversifyEnums } from '../../enums/inversify'

export class CesiumMenu {
  constructor(
    viewer = container.get(InversifyEnums.Cesium.Viewer),
    actions = container.get(InversifyEnums.Cesium.CesiumActions),
    layers = container.get(InversifyEnums.Cesium.CesiumLayers),
  ) {
    this.viewer = viewer
    this.actions = actions
    this.layers = layers
    this.hydrography = false
    this.generateMenu()
    this.tilesetToolbar = document.getElementById('tileset--toolbar')
    this.off = document.getElementById('off')
    this.google3d = document.getElementById('google3d')
    this.osm = document.getElementById('osm')
    this.addEvent()
  }

  generateMenu() {
    const toolbar = document.getElementsByClassName('cesium-viewer-toolbar')[0]
    const buttons = [].slice
      .call(toolbar.children)
      // .filter(
      //   (elem) =>
      //     elem.classList.value !==
      //       'cesium-sceneModePicker-wrapper cesium-toolbar-button' &&
      //     elem.classList.value !== 'cesium-button cesium-toolbar-button' &&
      //     elem.classList.value !== 'cesium-baseLayerPicker-dropDown'
      // )
    toolbar.innerHTML = ''
    buttons.forEach((elem) => toolbar.appendChild(elem))
    toolbar.appendChild(document.getElementById('cutom-cesium-menu'))
  }

  addEvent() {
    let administrativeUnits = false;
    let eiker1965 = false;
    document.getElementById('btn-pg').addEventListener('click', () => {
      this.viewer.trackedEntity = 'undifined'
      this.actions.importFlyingData()
    })
    document.getElementById('btn-ag').addEventListener('click', () => {
      this.viewer.trackedEntity = 'undifined'
      this.actions.createAnimate()
    })

    document.getElementById('btn-bg').addEventListener('click', () => {
      this.viewer.trackedEntity = 'undifined'
      this.actions.createBuild()
    })

    document.getElementById('btn-bts').addEventListener('click', () => {
      this.viewer.trackedEntity = 'undifined'
      this.actions.bumpToSweden()
    })

    document.getElementById('btn-hb').addEventListener('click', () => {
      this.viewer.trackedEntity = 'undifined'
      this.layers.hydrographyBores()
    })

    document.getElementById('btn-try').addEventListener('click', () => {
      this.viewer.trackedEntity = 'undifined'
      this.layers.tryThis()
    })

    document.getElementById('btn-eiker1965').addEventListener('click', (e) => {
      this.viewer.trackedEntity = 'undifined'
      eiker1965 = !eiker1965
      eiker1965
        ? e.target.setAttribute('active', true)
        : e.target.removeAttribute('active')
      this.layers.eikerOld(eiker1965)
    })

    document.getElementById('btn-xxq').addEventListener('click', (e) => {
      this.viewer.trackedEntity = 'undifined'
      administrativeUnits = !administrativeUnits
      administrativeUnits
        ? e.target.setAttribute('active', true)
        : e.target.removeAttribute('active')
      this.layers.administrativeUnits(administrativeUnits)
    })

    this.tilesetToolbar.addEventListener('click', this.changeState)
  }

  changeState = (e) => {
    const button = this.getType(e.target)
    if (this.btnGuard(button)) {
      this.clear()
      this[button].setAttribute('active', true)
      this.layers.changeGoogleVisibility(button)
    }
  }

  clear = () => {
    this.viewer.trackedEntity = 'undifined'
    this.off.removeAttribute('active')
    this.google3d.removeAttribute('active')
    this.osm.removeAttribute('active')
  }

  getType = (node) =>
    node && node.getAttribute('type')
      ? node.getAttribute('type')
      : node.parentElement
      ? this.getType(node.parentElement)
      : null

  btnGuard = (btn) =>
    btn &&
    btn.match(/^(off|google3d|osm)$/g) &&
    !this[btn].getAttribute('active')
}
