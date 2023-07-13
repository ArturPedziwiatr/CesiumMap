import { CesiumActions } from '../cesium/cesiumActions'
import { CreateModel } from '../cesium/createModel'
import { container } from '../event/Inversify'
import { Viewer, Terrain } from 'cesium'
import { InversifyEnums } from '../../enums/inversify'
import { CesiumLayers } from '../cesium/cesiumLayers'
import { CesiumMenu } from '../cesium/cesiumMenu'

export function bootstap(cesiumMap) {
  container.value.bind(InversifyEnums.Cesium.CesiumActions).to(CesiumActions)
  container.value.bind(InversifyEnums.Cesium.CreateModel).to(CreateModel)
  container.value.bind(InversifyEnums.Cesium.CesiumLayers).to(CesiumLayers)
  container.value.bind(InversifyEnums.Cesium.CesiumMenu).to(CesiumMenu)
  container.value.bind(InversifyEnums.Cesium.Viewer).toValue(
    new Viewer(cesiumMap.value, {
      terrain: Terrain.fromWorldTerrain(),
    })
  )
}
