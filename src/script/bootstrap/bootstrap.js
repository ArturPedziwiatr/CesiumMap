import { CesiumActions } from '../cesium/cesiumActions'
import { CreateModel } from '../cesium/createModel'
import { container } from '../event/Inversify'
import { Viewer,Terrain } from 'cesium'
import { InversifyEnums } from '../../enums/inversify'
import { CesiumLayers } from '../cesium/cesiumLayers'
import { CesiumMenu } from '../cesium/cesiumMenu'

export function bootstap() {
  container.bind(InversifyEnums.Cesium.CesiumActions).to(CesiumActions)
  container.bind(InversifyEnums.Cesium.CreateModel).to(CreateModel)
  container.bind(InversifyEnums.Cesium.CesiumLayers).to(CesiumLayers)
  container.bind(InversifyEnums.Cesium.CesiumMenu).to(CesiumMenu)
  container.bind(InversifyEnums.Cesium.Viewer).toValue(
    new Viewer('cesiumMap', {
      terrain: Terrain.fromWorldTerrain(),
    })
  )
}
