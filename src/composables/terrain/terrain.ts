import { MapsType } from '@enum/MapType'
import { ImageryLayer, MapboxStyleImageryProvider, Viewer } from 'cesium'
import { inject } from 'vue'
import { ITerrain } from '@function/terrain/ITerrain'

const mapBox = new Map<string, ImageryLayer>()

export default function useTerrains() {
  const viewer = inject<Viewer>(MapsType.Viewer)!
  const addMapBox = async ({ alias, styleId, url }: ITerrain) => {
    try {
      if (!mapBox.has(alias)) {
        const map = new ImageryLayer(
          new MapboxStyleImageryProvider({
            styleId,
            url,
            accessToken: __MAPBOX_TOKEN__,
          }),
          {}
        )
        
        map.show = false
        viewer.imageryLayers.add(map)
        mapBox.set(alias, map)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const getTerrains = () => Array.from(mapBox.keys())
  const size = () => mapBox.size

  const visibleTerrain = (alias: string) =>
    mapBox.forEach((val, key) => {
      if (key === alias) val.show = !val.show
      else val.show = false
    })

  const init = async () => {
    addMapBox({ alias: 'MapBox Dark', styleId: 'dark-v11' })
  }

  if (false) init()

  return {
    size,
    getTerrains,
    visibleTerrain,
  }
}
