import { MapsType } from '@Enum/MapType'
import { Cartesian3, ImageryLayer, Rectangle, Viewer, WebMapServiceImageryProvider } from 'cesium'
import { inject } from 'vue'
import { ILayer } from './ILayers'

const layersBox = new Map<string, {
  layer: ImageryLayer,
  flyTo?: Cartesian3 | Rectangle
}>()

export default function useLayers() {
  const viewer = inject<Viewer>(MapsType.Viewer)!

  const addLayer = async ({
    url, layers, alias, flyTo
  }: ILayer) => {
    try {
      if (!layersBox.has(layers)) {
        const layer = new ImageryLayer(
          new WebMapServiceImageryProvider({
            url,
            layers,
            parameters: {
              transparent: true,
              format: 'image/png',
            },
          }),
          {}
        )
        layer.show = false
        viewer.imageryLayers.add(layer)
        layersBox.set(alias, { layer, flyTo })
      }
    } catch (err) {
      console.error(err)
    }
  }

  const getLayers = () => Array.from(layersBox.keys())

  const visibleLayres = (key: string) => {
    if (layersBox.has(key)) {
      const {layer, flyTo} = layersBox.get(key)!
      layer.show = !layer.show

      if (layer.show && flyTo) {
        viewer.camera.flyTo({
          destination: flyTo,
        })
      }
    }
  }

  if (!layersBox.size) {
    addLayer({
      alias: 'Hydrography bores',
      url: 'https://nationalmap.gov.au/proxy/http://geoserver.nationalmap.nicta.com.au/geotopo_250k/ows',
      layers: 'Hydrography:bores',
      flyTo: Rectangle.fromDegrees(114.591, -45.837, 148.97, -5.73),
    })
    addLayer({
      alias: 'Counties of Norway',
      url: 'https://wms.geonorge.no/skwms1/wms.adm_enheter_historisk?',
      layers: 'fylker_2017',
      flyTo: Cartesian3.fromDegrees(14.602143, 65.051215, 990000)
    })
  }

  return {
    getLayers,
    visibleLayres,
  }
}
