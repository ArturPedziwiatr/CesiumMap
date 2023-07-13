import { JulianDate, SampledPositionProperty } from 'cesium';

export interface IAirplane {
  start: JulianDate,
  stop: JulianDate,
  position: SampledPositionProperty
}