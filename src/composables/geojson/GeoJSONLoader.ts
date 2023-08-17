import { MapsType } from '@enum/MapType'
import { DataSource, GeoJsonDataSource, Viewer } from 'cesium'
import { inject, ref } from 'vue'
export interface ISource {
  alias: string
  url: string
  options?: GeoJsonDataSource.LoadOptions
  dynamic?: (dataSource: GeoJsonDataSource) => void
}

type SourceEntry = [string, DataSource];

const sources = ref<SourceEntry[]>([])

const isInArray = (index: number) => index > -1;
const findSourceIndex = (alias: string) => sources.value.findIndex((el) => el[0] === alias)

const addSource = (alias: string, dataSource: GeoJsonDataSource) => {
  if (getSource(alias)) {
    throw new Error('alias already in use')
  }
  sources.value.push([alias, dataSource])
}

const getSource = (alias: string) => {
  const index = findSourceIndex(alias)

  return isInArray(index) ? sources.value.at(index)![1] : null
}

export default function useGeoJSONLoader() {
  const viewer = inject<Viewer>(MapsType.Viewer)!

  const getSources = () => sources.value
  const getSize = (): number => sources.value.length

  const toggleSourceVisibility = (alias: string) => {
    const source = getSource(alias)
    if (source)
      source.show = !source.show
  }

  const deleteSource = (alias: string) => {
    const index = findSourceIndex(alias);
    if (isInArray(index))
      sources.value.splice(index, 1)
  }

  const load = async ({
    alias,
    url,
    options,
    dynamic = () => { }
  }: ISource) => {
    const dataSource = await GeoJsonDataSource.load(url, options)
    dataSource.show = false

    if (dynamic) {
      dynamic(dataSource)
    }
    await viewer.dataSources.add(dataSource)
    addSource(alias, dataSource)
  }

  return {
    getSources,
    getSize,
    toggleSourceVisibility,
    deleteSource,
    load,
  }
}
