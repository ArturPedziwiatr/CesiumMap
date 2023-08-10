import { MapsType } from '@enum/MapType'
import {
  Cesium3DTileStyle,
  GoogleMaps,
  Viewer,
  createGooglePhotorealistic3DTileset,
  createOsmBuildingsAsync,
} from 'cesium'
import { inject, ref } from 'vue'
import { I3DTileset } from './I3DTileset'

GoogleMaps.defaultApiKey = __GOOGLE_TOKEN__
const terrainBox = new Map<string, I3DTileset>()
const loaded = ref(false)

export default function use3DTileset() {
  const viewer = inject<Viewer>(MapsType.Viewer)!

  const googleInit = async (alias: string) => {
    try {
      if (!terrainBox.has(alias)) {
        const google3DTileset = await createGooglePhotorealistic3DTileset()
        google3DTileset.show = false
        viewer.scene.primitives.add(google3DTileset)
        terrainBox.set(alias, {
          terrain: google3DTileset,
          glob: false,
        })
      }
    } catch (err) {
      console.error(err)
    }
  }

  const osmInit = async (alias: string) => {
    try {
      if (!terrainBox.has(alias)) {
        const osmBuildings = await createOsmBuildingsAsync()
        osmBuildings.style = new Cesium3DTileStyle({
          defines: {
            material: "${feature['building:material']}",
          },
          color: 'hsl(${height}/350, 0.8, 0.6)',
        })
        osmBuildings.show = false
        viewer.scene.primitives.add(osmBuildings)
        terrainBox.set(alias, {
          terrain: osmBuildings,
          glob: true,
        })
      }
    } catch (err) {
      console.error(err)
    }
  }

  const getTileset = () => Array.from(terrainBox.keys())
  const getLoaded = () => loaded.value

  const visibleTileset = (alias: string) => {
    if (terrainBox.has(alias)) {
      const { terrain, glob } = terrainBox.get(alias)!
      terrain.show = !terrain.show
      viewer.scene.globe.show = glob
    }
  }

  const init = async () => {
    if (!terrainBox.size) {
      await googleInit('Google 3D')
      await osmInit('OSM Buidings')
    }
    loaded.value = true
  }

  init()

  return {
    getTileset,
    visibleTileset,
    getLoaded,
  }
}
