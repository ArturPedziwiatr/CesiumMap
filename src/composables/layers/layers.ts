import { MapsType } from '@enum/MapType'
import { ImageryLayer, Viewer, WebMapServiceImageryProvider } from 'cesium'
import { inject, ref } from 'vue'
import { ElNotification } from 'element-plus'
import { WmsEndpoint, WmsLayerSummary } from '@camptocamp/ogc-client'
import { ILayerSet } from '@interface/layers/ILayerSet'
import { uniqueId } from 'lodash'
import { NorwayWMS } from '@/data/WMSList'

const layersBox = ref(new Map<string, ImageryLayer>())

export default function useDynamicLayers() {
  const viewer = inject<Viewer>(MapsType.Viewer)!,
    loading = ref(false),
    layers = ref<ILayerSet[]>([]),
    size = ref(layersBox.value.size),
    url = ref('https://wms.geonorge.no/skwms1/wms.adm_enheter_historisk?'),
    refresToken = ref(''),
    error = ref('')

  const addWMSServer = async (input: string) => {
    try {
      url.value = input.split('?')[0]
      error.value = ''
      layers.value.length = 0
      loading.value = true
      const endpoint = await new WmsEndpoint(input).isReady()
      reduceLayers(endpoint.getLayers())
      console.log(endpoint.getServiceInfo())

      loading.value = false
      refresToken.value = uniqueId()
    } catch {
      loading.value = false
      error.value = 'Cannot connect to the WMS Server'
    }
  }

  const addLayer = async (input: string, aliasWMS: string) => {
    try {
      console.log(input)

      if (!layersBox.value.has(aliasWMS)) {
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
        layersBox.value.set(aliasWMS, layer)
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

  const getWMSGeonorge = () => NorwayWMS.categories

  const getAllLayers = () => Array.from(layersBox.value.keys())
  const getWMSLayers = () => layers.value
  const ifLayerIsActive = (alias: string) => layersBox.value.get(alias)?.show

  const reduceLayers = (wmsLayer: WmsLayerSummary[]) => {
    wmsLayer.forEach(elem => {
      if (elem.name)
        layers.value.push({
          name: elem.name,
          title: elem.title,
        })
      if (elem.children) reduceLayers(elem.children)
    })
  }

  const visibleLayres = (key: string) => {
    if (layersBox.value.has(key)) {
      const layer = layersBox.value.get(key)!
      layer.show = !layer.show
    }
  }

  const addLayerStrategy = (lay: string[], group: boolean, alias?: string) => {
    const layer = lay.length > 1 ? lay.join(', ') : lay[0]
    if (group) {
      addLayer(layer, alias || `[${layer}]`)
    } else {
      lay.forEach(elem => {
        addLayer(elem, alias ? `${alias} [${elem}]` : elem)
      })
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
    getWMSLayers,
    ifLayerIsActive,
    getWMSGeonorge,
    refresToken,
    error,
  }
}
