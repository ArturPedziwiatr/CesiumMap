import { MapsType } from '@Enum/MapType'
import {
  ImageryLayer,
  Viewer,
  WebMapServiceImageryProvider,
} from 'cesium'
import { inject, ref } from 'vue'
import { ElNotification } from 'element-plus'
import { WmsEndpoint, WmsLayerSummary } from '@camptocamp/ogc-client'
import { ILayer, ILayerCreate } from '@Func/layers/ILayers'

const layersBox = new Map<string, ILayer>()

export default function useDynamicLayers() {
  const viewer = inject<Viewer>(MapsType.Viewer)!
  const loading = ref<Boolean>(false)
  const layers = ref<WmsLayerSummary[]>()

  const addWMSServer = async (input: string) => {
    console.log(input)
    
    try {
      loading.value = true
      const endpoint = await new WmsEndpoint(input).isReady()
      layers.value = endpoint.getLayers()
      loading.value = false
    } catch (err) {
      console.error(err)
      ElNotification({
        title: 'Error',
        message: 'Cannot conected with WMS Server',
        type: 'error',
      })
    }
  }

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
      ElNotification({
        title: 'Error',
        message: 'Cannot conected with WMS Server',
        type: 'error',
      })
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

  return {
    size,
    getLayers,
    visibleLayres,
    addLayer,
    addWMSServer
  }
}
