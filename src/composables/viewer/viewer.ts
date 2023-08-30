import { Cesium3DTileset, Terrain, Viewer } from 'cesium'
import { Ref, onMounted, ref } from 'vue'
import { PotreeViewer } from './PotreeViewer'
import { LASLoader } from '@loaders.gl/las'
import { load } from '@loaders.gl/core'

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

      addDraco()
    }

    if (!potreeViewer.value) {
      potreeViewer.value = new PotreeViewer()
      potreeViewer.value.synchroCamera(cesiumViewer.value.camera)
    }
  })

  //TODO: Add loader las/laz/drc file to potree
  const addDraco = async () => {
    console.log('-------------------------------------')
    // const pointCloud = await load(
    //   'http://localhost:5000/32-1-512-134-74.laz',
    //   LASLoader
    // )
    // const tileset = new Cesium3DTileset(pointCloud)
    // const tileset = await Cesium3DTileset.fromUrl('http://localhost:5000/32-1-512-134-74.laz')
    // console.log('--12341234123412341234--')
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
