import { Terrain, Viewer } from 'cesium'
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
  })

  const getCesium = (): Viewer | undefined => cesiumViewer.value
  const getPotree = (): Ref<PotreeViewer | undefined> => potreeViewer

  return {
    getCesium,
    getPotree,
  }
}
