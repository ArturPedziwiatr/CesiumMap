import {
  Cartesian2,
  Cartographic,
  Entity,
  ScreenSpaceEventType,
  Terrain,
  Viewer,
  defaultValue,
  Math,
} from 'cesium'
import { Ref, onMounted, ref } from 'vue'
import { PotreeViewer } from './PotreeViewer'

const cesiumViewer = ref<Viewer>()
const potreeViewer = ref<PotreeViewer>()

export default function useViewer() {
  onMounted(() => {
    if (!cesiumViewer.value) {
      cesiumViewer.value = new Viewer('cesiumMap', {
        homeButton: false,
        baseLayerPicker: false,
        infoBox: true,
        fullscreenButton: false,
        geocoder: false,
        useBrowserRecommendedResolution: false,
        skyAtmosphere: false,
        terrain: Terrain.fromWorldTerrain({
          requestWaterMask: true,
          requestVertexNormals: true,
        }),
      })
    }

    if (!potreeViewer.value) {
      potreeViewer.value = new PotreeViewer()
      potreeViewer.value.synchroCamera(cesiumViewer.value.camera)
    }

    cesiumViewer.value.screenSpaceEventHandler.setInputAction((click: any) => {
      const position = cesiumViewer.value?.scene.pickPosition(click.position)
      if (position) {
        var cartographic = Cartographic.fromCartesian(position)
        console.log(`lon: ${Math.toDegrees(cartographic.longitude)}, lat: ${Math.toDegrees(cartographic.latitude)}`)
      }

      const entity = entityPicker(click.position)
      if (entity instanceof Entity && entity.properties) {
        if (entity.properties.hasProperty('onClick'))
          entity.properties.onClick._value()
      }
    }, ScreenSpaceEventType.LEFT_CLICK)

    // cesiumViewer.value.screenSpaceEventHandler.setInputAction((click: any) => {
    //   var element = document.getElementById('cesiumMap')
    //   if (element) {
    //     const entity = entityPicker(click.endPosition)
    //     if (entity instanceof Entity && entity.properties) {
    //       if (entity.properties.hasProperty('onClick')) {
    //         element.style.cursor = 'pointer'
    //       } else element.style.cursor = 'default'
    //     } else element.style.cursor = 'default'
    //   }
    // }, ScreenSpaceEventType.MOUSE_MOVE)
  })

  const entityPicker = (position: Cartesian2): Entity | null => {
    const entity = cesiumViewer.value?.scene.pick(position)
    if (!entity || !entity.id || !entity.primitive.id) return null
    return defaultValue(entity.id, entity.primitive.id)
  }

  //TODO: Add loader las/laz/drc file to potree
  const addDraco = async () => {
    // const pointCloud = await load(
    //   'http://localhost:5000/32-1-512-134-74.laz',
    //   LASLoader
    // )
    // const tileset = new Cesium3DTileset(pointCloud)
    // const tileset = await Cesium3DTileset.fromUrl('http://localhost:5000/32-1-512-134-74.laz')
    // cesiumViewer.value?.scene.primitives.add(tileset)
    // const destination = tileset.boundingSphere.center
    // cesiumViewer.value?.camera.flyTo({ destination })
    //   var tilesets = cesiumViewer.value?.scene.primitives.add(new Cesium3DTileset({
    //     url : '<URL to tileset.json>'
    // }));
  }

  const getCesium = (): Viewer | undefined => cesiumViewer.value
  const getPotree = (): Ref<PotreeViewer | undefined> => potreeViewer

  return {
    getCesium,
    getPotree,
    addDraco,
  }
}
