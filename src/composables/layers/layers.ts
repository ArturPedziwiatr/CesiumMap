import { MapsType } from '@Enum/MapType'
import {
  ImageryLayer,
  Viewer,
  WebMapServiceImageryProvider,
} from 'cesium'
import { inject, ref } from 'vue'
import { ElNotification } from 'element-plus'
import { WmsEndpoint, WmsLayerSummary } from '@camptocamp/ogc-client'
import { ILayerSet, ILayerCreate } from '@Interface/layers/ILayerSet'

const layersBox = new Map<string, ImageryLayer>()

export default function useDynamicLayers() {
  const viewer = inject<Viewer>(MapsType.Viewer)!
  const loading = ref(false)
  const layers = ref<ILayerSet[]>([])
  const size = ref(layersBox.size)
  const url = ref('')
  const alias = ref('')

  const addWMSServer = async (input: string) => {
    try {
      url.value = input
      layers.value.length = 0 
      loading.value = true
      const endpoint = await new WmsEndpoint(input).isReady() 
      reduceLayers(endpoint.getLayers())
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

  const addLayer = async (input: string) => {
    try {
      if (!layersBox.has(alias.value)) {
        const layer = new ImageryLayer(
          new WebMapServiceImageryProvider({
            url: url.value,
            layers: input,
            parameters: {
              transparent: true,
              format: 'image/png',
            },
          }),
          {}
        )
        viewer.imageryLayers.add(layer)
        layersBox.set(alias.value, layer)
      }
    } catch (err) {
      console.error(err)
      ElNotification({
        title: 'Error',
        message: 'Cannot add layers',
        type: 'error',
      })
    }
  }

  const getAllLayers = () => Array.from(layersBox.keys())
  const getAll = () => layers.value
  const setAlias = (al: string) => alias.value = al

  const reduceLayers = (wmsLayer: WmsLayerSummary[]) => {
    wmsLayer.forEach(elem => {
      if (elem.name) layers.value.push({
        name: elem.name,
        title: elem.title
      })
      else {
        alias.value = elem.title
      } 
      if (elem.children) reduceLayers(elem.children)
    })
  } 

  const visibleLayres = (key: string) => {
    if (layersBox.has(key)) {
      const layer = layersBox.get(key)!
      layer.show = !layer.show
    }
  }


  const addLayerStrategy = (lay: string[], group: boolean) => {
    if (group) {
      addLayer(lay.join(', '))
    } else {

    }
    layers.value.length = 0
  }

  return {
    size,
    getAllLayers,
    visibleLayres,
    addLayerStrategy,
    addWMSServer,
    loading,
    getAll,
    setAlias
  }
}
