import { Model } from '@enum/model.ts'
import type { IAirplane } from './ICreateModel'
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

export default function useCreateModel() {
  const airplane = async ({ start, stop, position }: IAirplane) => {
    const time = new TimeInterval({ start, stop })
    const availability = new TimeIntervalCollection([time])
    const path = new PathGraphics({ width: 3 })
    try {
      const uri = await IonResource.fromAssetId(Model.AIRPLANE)
      return {
        availability,
        position,
        model: {
          uri,
          scale: 3,
        },
        minimumPixelSize: 1800,
        orientation: new VelocityOrientationProperty(position),
        path,
      }
    } catch (er) {
      console.error(er)
      return {
        availability,
        position,
        point: { pixelSize: 30, color: Color.GREEN },
        path,
      }
    }
  }

  const building = async () => {
    try {
      return {
        area: await GeoJsonDataSource.load(
          await IonResource.fromAssetId(Model.BUILDING_ZONE),
          { clampToGround: true }
        ),
        build: await Cesium3DTileset.fromUrl(
          await IonResource.fromAssetId(Model.BUILDING_BUILD)
        ),
      }
    } catch (er) {
      console.error(er)
      return {
        area: null,
        build: null,
      }
    }
  }

  return {
    airplane,
    building,
  }
}
