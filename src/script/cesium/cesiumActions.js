import { container } from '../event/Inversify'
import flightData from '../../data/flying-data.json'
import { InversifyEnums } from '../../enums/inversify'
import { Color, Cartesian3, SampledPositionProperty, JulianDate, ClassificationType } from 'cesium'

export class CesiumActions {
  googleTileset
  constructor(
    viewer = container.get(InversifyEnums.Cesium.Viewer),
    createModel = container.get(InversifyEnums.Cesium.CreateModel),
    layers = container.get(InversifyEnums.Cesium.CesiumLayers)
  ) {
    this.height = 1e2
    this.viewer = viewer
    this.createModel = createModel
    this.layers = layers
    this.primitives = viewer.scene.primitives
  }

  importFlyingData() {
    let fly
    flightData.forEach((dataPoint) => (fly = this.addPoint({ dataPoint })))
    this.viewer.flyTo(fly)
  }

  addPoint({ dataPoint, color = Color.RED }) {
    return this.viewer.entities.add({
      description: `Location: (${dataPoint.longitude}, ${dataPoint.latitude}, ${dataPoint.height})`,
      position: Cartesian3.fromDegrees(
        dataPoint.longitude,
        dataPoint.latitude,
        dataPoint.height
      ),
      point: {
        pixelSize: 8,
        maximumScale: 3,
        color: color,
      },
    })
  }

  patchPositions({ start, timeStepInSeconds }) {
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
      this.addPoint({ dataPoint })
    })

    return positionProperty
  }

  async createAnimate() {
    const timeStepInSeconds = 30
    const totalSeconds = timeStepInSeconds * (flightData.length - 1)
    const start = JulianDate.fromIso8601('2020-03-09T23:10:00Z')
    const stop = JulianDate.addSeconds(
      start,
      totalSeconds,
      new JulianDate()
    )
    this.viewer.clock.startTime = start.clone()
    this.viewer.clock.stopTime = stop.clone()
    this.viewer.clock.currentTime = start.clone()
    this.viewer.timeline.zoomTo(start, stop)
    this.viewer.clock.multiplier = 50
    this.viewer.clock.shouldAnimate = true
    const positionProperty = this.patchPositions({ start, timeStepInSeconds })
    const airplane = await this.createModel.airplane({
      start,
      stop,
      positionProperty,
    })
    const airplaneEntity = this.viewer.entities.add(airplane)
    this.viewer.trackedEntity = airplaneEntity
  }

  async createBuild() {
    const { area, build } = await this.createModel.building()
    if (area && build) {
      const dataSource = await this.viewer.dataSources.add(area)
      dataSource.entities.values.forEach(
        (entity) =>
          (entity.polygon.classificationType =
            ClassificationType.TERRAIN)
      )
      const building = this.viewer.scene.primitives.add(build)
      this.viewer.flyTo(building)
    }
  }

  bumpToSweden() {
    this.viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(14.602143, 65.051215, 990000),
    })
  }
}
