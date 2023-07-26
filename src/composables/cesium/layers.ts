import { MapsType } from '@Enum/MapType'
import {
  Cartesian3,
  ImageryLayer,
  JulianDate,
  Rectangle,
  TimeIntervalCollection,
  Viewer,
  WebMapServiceImageryProvider,
  WebMapTileServiceImageryProvider,
} from 'cesium'
import { inject } from 'vue'
import { ILayerCreate, ILayer, ILayerProviderCreate } from './ILayers'

const layersBox = new Map<string, ILayer>()

export default function useLayers() {
  const viewer = inject<Viewer>(MapsType.Viewer)!

  const addLayer = async (input: ILayerCreate) => {
    try {
      const { url, layers, alias, flyTo } = input
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

  const addLayerProvider = async (input: ILayerProviderCreate) => {
    try {
      const { url, layer, alias, flyTo, times, credit } = input
      if (!layersBox.has(alias)) {
        const provider = new ImageryLayer(
          new WebMapTileServiceImageryProvider({
            url,
            layer,
            style: 'default',
            tileMatrixSetID: '250m',
            maximumLevel: 5,
            format: 'image/jpeg',
            clock: viewer.clock,
            times,
            credit,
          }),
          {}
        )
        provider.show = false
        viewer.imageryLayers.add(provider)
        layersBox.set(alias, { layer: provider, flyTo })
      }
    } catch (err) {
      console.error(err)
    }
  }

  const getLayers = () => Array.from(layersBox.keys())
  const size = () => layersBox.size

  const visibleLayres = (key: string) => {
    if (layersBox.has(key)) {
      const { layer, flyTo } = layersBox.get(key)!
      layer.show = !layer.show

      if (layer.show && flyTo) {
        viewer.camera.flyTo({
          destination: flyTo,
        })
      }
    }
  }

  const dataCallback = (interval: any, index: number) => {
    let time
    if (index === 0) {
      time = JulianDate.toIso8601(interval.stop)
    } else {
      time = JulianDate.toIso8601(interval.start)
    }

    return {
      Time: time,
    }
  }
  const init = async () => {
    if (!layersBox.size) {
      const times = TimeIntervalCollection.fromIso8601({
        iso8601: '2015-07-30/2017-06-16/P1D',
        leadingInterval: true,
        trailingInterval: true,
        isStopIncluded: false,
        dataCallback: dataCallback,
      })
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
        flyTo: Cartesian3.fromDegrees(14.602143, 65.051215, 990000),
      })
      // addLayer({
      //   alias: 'Anadrome',
      //   url: 'https://wfs.nibio.no/cgi-bin/ar50_2?Service=WFS&Request=GetCapabilities',
      //   layers: 'anadrome_forvaltningsregioner',
      //   flyTo: Cartesian3.fromDegrees(14.602143, 65.051215, 990000),
      // })
      addLayerProvider({
        alias: 'Corrected Reflectance',
        url: 'https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/{Time}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.jpg',
        layer: 'MODIS_Terra_CorrectedReflectance_TrueColor',
        times,
        credit: 'NASA Global Imagery Browse Services for EOSDIS',
        flyTo: Cartesian3.fromDegrees(10.7522, 59.9139, 20009999),
      })
    }
  }

  init()

  return {
    size,
    getLayers,
    visibleLayres,
  }
}
