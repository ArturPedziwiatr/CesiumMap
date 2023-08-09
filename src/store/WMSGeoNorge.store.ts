import { defineStore } from 'pinia'
import { WmsEndpoint, WmsLayerSummary } from '@camptocamp/ogc-client'
import { NorwayWMS } from '../data/WMSList'
import { ImageryLayer, Viewer, WebMapServiceImageryProvider } from 'cesium'
import { inject } from 'vue'
import { MapsType } from '@Enum/MapType'

interface IWMS {
  readonly url: string
  readonly layer: string
}

export const useWMSGeoNorgeStore = defineStore({
  id: 'WMSGeoNorge',
  state: () => ({
    viewer: inject<Viewer>(MapsType.Viewer)!,
    layers: new Map<string, IWMS[]>(),
    imageryProviders: new Map<string, ImageryLayer>(),
    loading: false,
  }),
  getters: {
    getLayers: state => (category: string) => state.layers.get(category),
    getLoading: state => state.loading,
  },
  actions: {
    async fetchWMSLayers(category: string) {
      if (this.layers.has(category)) return

      this.loading = true
      try {
        var categoryLayers: IWMS[] = []
        const geonorge = NorwayWMS.servers[category]
        if (!geonorge) throw new Error('Empty servers')
        
        for await (const url of geonorge) {
          const endpoint = await new WmsEndpoint(url).isReady()
          const result = this.getFromWmsLayersSummer(endpoint.getLayers(), url, [])
          categoryLayers = [...categoryLayers, ...result]
        }
        this.layers.set(category, categoryLayers)
      } catch (err) {
        console.error(err)
      } finally {
        this.loading = false
      }
    },

    addOrRemoveLayer({ url, layer }: IWMS, category: string, state: boolean) {
      const key = `${category}${layer}`

      if (!this.imageryProviders.has(key)) {
        const provider = new ImageryLayer(
          new WebMapServiceImageryProvider({
            url,
            layers: layer,
            parameters: {
              transparent: true,
              format: 'image/png',
            },
          }),
          {}
        )
        this.viewer.imageryLayers.add(provider)
        this.imageryProviders.set(key, provider)
      }

      const imagery = this.imageryProviders.get(key)
      if (imagery) imagery.show = state
    },

    getFromWmsLayersSummer(input: WmsLayerSummary[], url: string, result: IWMS[]): IWMS[] {
      input.forEach(elem => {
        if (elem.children)
          this.getFromWmsLayersSummer(elem.children, url,result)
        else if(elem.name)
          result.push({ url, layer: elem.name})
      })

      return result
    },
  },
})
