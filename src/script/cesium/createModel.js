import { modelId } from '../../enums/model'
import {
  TimeIntervalCollection,
  TimeInterval,
  IonResource,
  VelocityOrientationProperty,
  PathGraphics,
  Color,
  GeoJsonDataSource,
  Cesium3DTileset,
} from 'cesium'

export class CreateModel {
  constructor() {}

  async airplane({ start, stop, positionProperty }) {
    const time = new TimeInterval({ start, stop })
    const availability = new TimeIntervalCollection([time])
    const path = new PathGraphics({ width: 3 })
    try {
      const uri = await IonResource.fromAssetId(modelId.AIRPLANE)
      return {
        availability,
        position: positionProperty,
        model: {
          uri,
          scale: 3,
        },
        minimumPixelSize: 1800,
        orientation: new VelocityOrientationProperty(positionProperty),
        path,
      }
    } catch (er) {
      console.error(er)
      return {
        availability,
        position: positionProperty,
        point: { pixelSize: 30, color: Color.GREEN },
        path,
      }
    }
  }

  async building() {
    try {
      return {
        area: await GeoJsonDataSource.load(
          await IonResource.fromAssetId(modelId.BUILDING.ZONE),
          { clampToGround: true }
        ),
        build: new Cesium3DTileset({
          url: IonResource.fromAssetId(modelId.BUILDING.BUILD),
        }),
      }
    } catch (er) {
      console.er(er)
      return {
        area: null,
        build: null,
      }
    }
  }
}
