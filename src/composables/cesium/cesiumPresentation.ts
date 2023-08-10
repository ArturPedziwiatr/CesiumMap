import flightData from '../../data/flying-data.json'
import {
  Color,
  Cartesian3,
  SampledPositionProperty,
  JulianDate,
  ClassificationType,
  Viewer,
} from 'cesium'
import useCreateModel from '@function/model/createModel'
import { ref, inject } from 'vue'
import { MapsType } from '@enum/MapType'
import { IDataPoint } from '@function/cesium/ICesiumPresentation'
import global from '@global/global'

const createModel = useCreateModel()
export default function useCesiumPresentation() {
  const viewer = inject<Viewer>(MapsType.Viewer)!
  const tracker = ref<Cartesian3>(
    Cartesian3.fromDegrees(12.64044, 55.60784, 40.93)
  )

  const importFlyingData = () => {
    clear()
    flightData.forEach(dataPoint => addPoint(dataPoint))
    viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(12.64044, 55.60784, 2000.93),
    })
  }

  const addPoint = (dataPoint: IDataPoint, color = Color.RED) => {
    tracker.value = Cartesian3.fromDegrees(
      dataPoint.longitude,
      dataPoint.latitude,
      dataPoint.height
    )
    viewer.entities.add({
      description: `Location: (${dataPoint.longitude}, ${dataPoint.latitude}, ${dataPoint.height})`,
      position: tracker.value,
      point: {
        pixelSize: 8,
        color: color,
      },
    })
  }

  const patchPositions = (start: JulianDate, timeStepInSeconds: number) => {
    const positionProperty = new SampledPositionProperty()
    flightData.forEach((dataPoint, index) => {
      const time = JulianDate.addSeconds(
        start,
        index * timeStepInSeconds,
        new JulianDate()
      )
      const position = Cartesian3.fromDegrees(
        dataPoint.longitude,
        dataPoint.latitude,
        dataPoint.height
      )
      positionProperty.addSample(time, position)
      addPoint(dataPoint)
    })

    return positionProperty
  }

  const createAnimate = async () => {
    clear()
    const timeStepInSeconds = 30
    const totalSeconds = timeStepInSeconds * (flightData.length - 1)
    const start = JulianDate.fromIso8601('2020-03-09T23:10:00Z')
    const stop = JulianDate.addSeconds(start, totalSeconds, new JulianDate())
    viewer.clock.startTime = start.clone()
    viewer.clock.stopTime = stop.clone()
    viewer.clock.currentTime = start.clone()
    viewer.timeline.zoomTo(start, stop)
    viewer.clock.multiplier = 50
    viewer.clock.shouldAnimate = true
    const position = patchPositions(start, timeStepInSeconds)
    const airplane = await createModel.airplane({
      start,
      stop,
      position,
    })
    const airplaneEntity = viewer.entities.add(airplane)
    viewer.trackedEntity = airplaneEntity
  }

  const createBuild = async () => {
    clear()
    const { area, build } = await createModel.building()
    if (area && build) {
      const dataSource = await viewer.dataSources.add(area)
      dataSource.entities.values.forEach(
        (entity: any) =>
          (entity.polygon.classificationType = ClassificationType.TERRAIN)
      )
      const building = viewer.scene.primitives.add(build)
      viewer.flyTo(building)
    }
  }

  const bumpToSweden = () => {
    clear()
    viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(14.602143, 65.051215, 990000),
    })
  }

  const bumpToHome = () => {
    clear()
    viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(
        global.value.coords.lon,
        global.value.coords.lat,
        2000
      ),
    })
  }

  const clear = () => {
    viewer.trackedEntity = undefined
  }

  return {
    importFlyingData,
    createAnimate,
    createBuild,
    bumpToSweden,
    bumpToHome,
  }
}
