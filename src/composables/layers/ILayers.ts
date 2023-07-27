import { Cartesian3, Credit, ImageryLayer, Rectangle, TimeIntervalCollection } from 'cesium'

export interface ILayerCreate {
  alias: string
  url: string
  layers: string
  flyTo?: Cartesian3 | Rectangle
}

export interface ILayerProviderCreate {
  alias: string
  url: string
  layer: string
  times?: TimeIntervalCollection | undefined
  credit: Credit | string | undefined
  flyTo?: Cartesian3 | Rectangle
}

export interface ILayer {
  layer: ImageryLayer,
  flyTo?: Cartesian3 | Rectangle
}