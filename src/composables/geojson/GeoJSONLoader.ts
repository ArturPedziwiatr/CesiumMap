import { MapsType } from '@enum/MapType'
import { Color, Viewer } from 'cesium'
import { inject } from 'vue'
import { GeoJsonDataSource } from 'cesium'

export interface ISource {
  alias: string
  url: string
  options?: GeoJsonDataSource.LoadOptions
  dynamic?: (dataSource: GeoJsonDataSource) => void
}

const sources = new Map<string, GeoJsonDataSource>()

export default function useGeoJSONLoader() {
  const viewer = inject<Viewer>(MapsType.Viewer)!

  const load = async ({
    alias,
    url,
    options,
    dynamic = () => { }
  }: ISource) => {
    try {
      const dataSource = await GeoJsonDataSource.load(url, options)
      dataSource.show = false

      if (dynamic) {
        try {
          dynamic(dataSource)
        } catch (err) {
          console.error(err)
        }
      }

      viewer.dataSources.add(dataSource)
      sources.set(alias, dataSource)
    } catch (err) {
      console.error(err)
    }
  }

  const getSources = () => Array.from(sources.keys())
  const size = (): number => sources.size

  const visibleSource = (alias: string) => {
    if (sources.has(alias)) {
      const source = sources.get(alias)!
      source.show = !source.show
    }
  }

  const init = async () => {
    await load({
      alias: 'Poland province',
      url: './src/data/poland.geojson',
      dynamic: (dataSource: GeoJsonDataSource) => {
        dataSource.entities.values.map(entity => {
          if (!entity.polygon) return
          //@ts-ignore
          // entity.polygon.height! = 2200
          const code = parseInt(entity?.properties?.code._value)
          if (code < 5) {
            //@ts-ignore
            entity.polygon.material = new Color(code * 10, 0.3, 0.3, 0.4)
          }
          if (code < 10 && code > 5) {
            //@ts-ignore
            entity.polygon.material = new Color(1, 0.3, code * 10, 0.4)
          }
          if (code < 20 && code > 10) {
            //@ts-ignore
            entity.polygon.material = new Color(1, code * 10, 0.3, 0.4)
          }
        })
        viewer.zoomTo(dataSource)
      },
    })
  }

  init()

  return {
    getSources,
    visibleSource,
    size,
    load,
  }
}
