import { Cartesian3, Rectangle } from 'cesium'

export interface ILayer {
  alias: string
  url: string
  layers: string
  flyTo?: Cartesian3 | Rectangle
}