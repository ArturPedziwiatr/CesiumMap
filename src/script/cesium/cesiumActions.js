import { container } from '../event/Inversify'
import flightData from '../../data/flying-data.json'
import { InversifyEnums } from '../../enums/inversify'
import {
  Color,
  Cartesian3,
  SampledPositionProperty,
  JulianDate,
  ClassificationType,
} from 'cesium'

export class CesiumActions {
  googleTileset
  constructor() {
    inqwe()
  }

  inqwe() {
    const layers = [
      {
        id: 'floor',
        url: 'https://api.hkmapservice.gov.hk/ogc/wfs/indoor/floorpolygon',
      },
      {
        id: 'unit',
        url: 'https://api.hkmapservice.gov.hk/ogc/wfs/indoor/unitpolygon',
      },
    ]
    var apiKey = 'c84e886891014383bcf608423555b0ba'
    XMLHttpRequest.prototype.openRaw = XMLHttpRequest.prototype.open
    XMLHttpRequest.prototype.open = function (method, url, asyn, usr, pwd) {
      if (url.indexOf('api.hkmapservice.gov.hk') >= 0) {
        if (url.indexOf('?') >= 0) url += '&key=' + apiKey
        else url += '?key=' + apiKey
      }
      this.openRaw(method, url, asyn, usr, pwd)
    }
    //Cesium.Ion.defaultAccessToken = 'your_access_token';
    Cesium.Ion.defaultServer = '.'
    var longitude = 114.15769
    var latitude = 22.28552
    viewer = new Cesium.Viewer('cesiumContainer', {
      homeButton: false,
      infoBox: true,
      fullscreenButton: false,
      geocoder: false,
      scene3DOnly: true,
      useBrowserRecommendedResolution: false,
      skyAtmosphere: false,
      terrainProvider: new Cesium.CesiumTerrainProvider({
        url: 'https://api.hkmapservice.gov.hk/czm/qtmesh/hkterrain/WGS84',
      }),
      imageryProvider: new Cesium.UrlTemplateImageryProvider({
        url: 'https://api.hkmapservice.gov.hk/osm/xyz/basemap/WGS84/tile/{z}/{x}/{y}.png',
        credit: '© Map from Lands Department',
      }),
    })
    var ellipsoid = new Cesium.WebMercatorProjection().ellipsoid
    viewer.scene.canvas.addEventListener('mousemove', function (e) {
      var cartesian = viewer.camera.pickEllipsoid(
        new Cesium.Cartesian3(e.clientX, e.clientY),
        ellipsoid
      )
      if (cartesian) {
        var cartographic = ellipsoid.cartesianToCartographic(cartesian)
        var longitudeString = Cesium.Math.toDegrees(
          cartographic.longitude
        ).toFixed(10)
        var latitudeString = Cesium.Math.toDegrees(
          cartographic.latitude
        ).toFixed(10)
        var display = '(' + latitudeString + ',' + longitudeString + ')'
        document.getElementById('demo').innerHTML = display
      } else {
        //entity.label.show = false;
      }
    })
    viewer.scene.imageryLayers.addImageryProvider(
      new Cesium.UrlTemplateImageryProvider({
        url: 'https://api.hkmapservice.gov.hk/osm/xyz/label-tc/WGS84/tile/{z}/{x}/{y}.png',
      })
    )
    var scene = viewer.scene
    var canvas = viewer.canvas
    viewer.camera.setView({
      destination: {
        x: -2422287.7932741796,
        y: 5387208.816911148,
        z: 2405020.3187840143,
      },
      orientation: new Cesium.HeadingPitchRange(
        6.253463054897753,
        -0.7570635652561277,
        0
      ),
    })

    var clickedEntity = null

    var geoJSONDataSourceFloor = new Cesium.GeoJsonDataSource('floor')
    var geoJSONDataSourceUnit = new Cesium.GeoJsonDataSource('unit')
    var gJsonDataSource = [geoJSONDataSourceFloor, geoJSONDataSourceUnit]
    viewer.dataSources.add(geoJSONDataSourceFloor)
    viewer.dataSources.add(geoJSONDataSourceUnit)
    viewer.dataSources.remove(geoJSONDataSourceUnit)

    viewer.camera.moveEnd.addEventListener(function () {
      var rect = viewer.camera.computeViewRectangle(
        viewer.scene.globe.ellipsoid,
        new Cesium.Rectangle()
      )
      var east = Cesium.Math.toDegrees(rect.east)
      var west = Cesium.Math.toDegrees(rect.west)
      var north = Cesium.Math.toDegrees(rect.north)
      var south = Cesium.Math.toDegrees(rect.south)

      geoJSONDataSourceFloor
        .load(
          layers[0].url +
            '?service=WFS&version=1.1.0&request=GetFeature&outputFormat=application/json&srsname=EPSG:4326&bbox=' +
            west +
            ',' +
            south +
            ',' +
            east +
            ',' +
            north +
            ',EPSG:4326&maxFeatures=50000&key=' +
            apiKey,
          {
            stroke: Cesium.Color.CADETBLUE,
            fill: Cesium.Color.AQUA,
            strokeWidth: 3,
          }
        )
        .then(function (jsonData) {})

      geoJSONDataSourceUnit
        .load(
          layers[1].url +
            '?service=WFS&version=1.1.0&request=GetFeature&outputFormat=application/json&srsname=EPSG:4326&bbox=' +
            west +
            ',' +
            south +
            ',' +
            east +
            ',' +
            north +
            ',EPSG:4326&maxFeatures=50000&key=' +
            apiKey,
          {
            stroke: Cesium.Color.CADETBLUE,
            fill: Cesium.Color.AQUA,
            strokeWidth: 3,
          }
        )
        .then(function (jsonData) {})
    })

    const enableLayer = function (event) {
      viewer.dataSources.removeAll()
      for (var idx in layers) {
        let layerId = layers[idx].id
        if (layerId == event.target.id && event.target.checked) {
          viewer.dataSources.add(gJsonDataSource[idx])
        } else {
          document.getElementById(layerId).checked = false
        }
      }
    }
    for (var idx in layers) {
      let lblId = layers[idx].id
      document.getElementById(lblId).addEventListener('click', enableLayer)
    }

    viewer.screenSpaceEventHandler.setInputAction(function (event) {
      /*geoJSONDataSource.entities.values.forEach(function(entity){
        entity.polygon.material = Cesium.Color.AQUA
    })*/
      if (clickedEntity && clickedEntity.polygon) {
        clickedEntity.polygon.material = Cesium.Color.AQUA
        clickedEntity = null
      }
      var feature = scene.pick(event.position)
      var featurePos = scene.pickPosition(event.position)
      if (feature.id && feature.id.polygon) {
        feature.id.polygon.material = Cesium.Color.YELLOW
        viewer.selectedEntity = feature.id
        clickedEntity = feature.id
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
  }
}
