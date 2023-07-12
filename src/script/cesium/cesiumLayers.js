import { container } from '../event/Inversify.js'
import { InversifyEnums } from '../../enums/inversify'
import {
  createOsmBuildingsAsync,
  Cesium3DTileStyle,
  Cesium3DTileset,
  ImageryLayer,
  WebMapServiceImageryProvider,
  WebMapTileServiceImageryProvider,
  Rectangle,
  Cartesian3,
  TimeIntervalCollection,
  JulianDate,
  Clock,
  ClockRange,
  ClockStep,
  Credit,
} from 'cesium'

export class CesiumLayers {
  google3DTileset
  osmBuildings
  hydrographyLayers
  weatherLayers
  administrativeUnitsLayers
  eiker1965
  constructor(viewer = container.get(InversifyEnums.Cesium.Viewer)) {
    this.viewer = viewer
    this.layers = viewer.imageryLayers
    this.primitives = viewer.scene.primitives
    this.googleVisibility = true
  }

  async hydrographyBores(show = true) {
    try {
      this.viewer.scene.globe.show = true
      if (!this.hydrographyLayers) {
        this.hydrographyLayers = new ImageryLayer(
          new WebMapServiceImageryProvider({
            url: 'https://nationalmap.gov.au/proxy/http://geoserver.nationalmap.nicta.com.au/geotopo_250k/ows',
            layers: 'Hydrography:bores',
            parameters: {
              transparent: true,
              format: 'image/png',
            },
          })
        )
        this.layers.add(this.hydrographyLayers)
      }
      this.hydrographyLayers.show = show
      this.viewer.camera.flyTo({
        destination: Rectangle.fromDegrees(114.591, -45.837, 148.97, -5.73),
      })
    } catch (err) {
      console.error(err)
    }
  }

  async weather(show = true) {
    try {
      this.viewer.scene.globe.show = true
      if (!this.weatherLayers) {
        const clock = new Clock({
          startTime: JulianDate.fromIso8601('2013-12-25'),
          currentTime: JulianDate.fromIso8601('2013-12-25'),
          stopTime: JulianDate.fromIso8601('2013-12-26'),
          clockRange: ClockRange.LOOP_STOP,
          clockStep: ClockStep.SYSTEM_CLOCK_MULTIPLIER,
        })
        const times = TimeIntervalCollection.fromIso8601({
          iso8601: '2015-07-30/2017-06-16/P1D',
          dataCallback: function dataCallback(interval, index) {
            return {
              Time: JulianDate.toIso8601(interval.start),
            }
          },
        })
        this.weatherLayers = new ImageryLayer(
          new WebMapTileServiceImageryProvider({
            url: 'https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/AMSR2_Snow_Water_Equivalent/default/{Time}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png',
            layer: 'AMSR2_Snow_Water_Equivalent',
            style: 'default',
            tileMatrixSetID: '2km',
            maximumLevel: 5,
            format: 'image/png',
            clock: clock,
            times,
            credit: new Credit(
              'NASA Global Imagery Browse Services for EOSDIS'
            ),
          })
        )
        this.layers.add(this.weatherLayers)
      }
      this.weatherLayers.show = show
    } catch (err) {
      console.error(err)
    }
  }

  async administrativeUnits(show = true) {
    try {
      this.viewer.scene.globe.show = true
      if (!this.administrativeUnitsLayers) {
        this.administrativeUnitsLayers = new ImageryLayer(
          new WebMapServiceImageryProvider({
            url: 'https://wms.geonorge.no/skwms1/wms.adm_enheter_historisk?',
            layers: 'fylker_2017',
            parameters: {
              transparent: true,
              format: 'image/png',
            },
          })
        )
        this.layers.add(this.administrativeUnitsLayers)
      }
      this.administrativeUnitsLayers.show = show
      this.viewer.camera.flyTo({
        destination: Cartesian3.fromDegrees(14.602143, 65.051215, 990000),
      })
    } catch (err) {
      console.error(err)
    }
  }

  async openCache(show = true) {
    try {
      this.viewer.scene.globe.show = true
      if (!this.administrativeUnitsLayers) {
        this.administrativeUnitsLayers = new ImageryLayer(
          new WebMapServiceImageryProvider({
            url: 'http://opencache.statkart.no/gatekeeper/gk/gk.open_nib_web_mercator_wmts_v2?',
            layers: 'Nibcache_web_mercator_v2',
            parameters: {
              transparent: true,
              format: 'image/png',
            },
          })
        )
        this.layers.add(this.administrativeUnitsLayers)
      }
      this.administrativeUnitsLayers.show = show
      this.viewer.camera.flyTo({
        destination: Cartesian3.fromDegrees(14.602143, 65.051215, 990000),
      })
    } catch (err) {
      console.error(err)
    }
  }

  async eikerOld(show = true) {
    try {
      if (!this.eiker1965) {
        this.eiker1965 = new ImageryLayer(
          new WebMapTileServiceImageryProvider({
            url: 'https://gatekeeper1.geonorge.no/BaatGatekeeper/gk/gk.cache_wmts?token=7zCCosEZct9tIR7jCZhDNeMaRZqT4IvVLA3y-jAPCbox-1Kq8zse2TgsZtYbdoUANcyt89XXeCWY-n8zH-TncQ..',
            layer: 'europa_forenklet',
            style: 'default',
            tileMatrixSetID: '250m',
            format: 'image/png',
          })
        )
        this.layers.add(this.eiker1965)
      }
      // this.eiker1965.show = show
      if (show)
        this.viewer.camera.flyTo({
          destination: Cartesian3.fromDegrees(10.7522, 59.9139, 5000),
        })
    } catch (err) {
      console.error(err)
    }
  }

  async tryThis(show = true) {
    try {
      function dataCallback(interval, index) {
        let time;
        if (index === 0) {
          time = JulianDate.toIso8601(interval.stop);
        } else {
          time = JulianDate.toIso8601(interval.start);
        }
      
        return {
          Time: time,
        };
      }
      
      const times = TimeIntervalCollection.fromIso8601({
        iso8601: "2015-07-30/2017-06-16/P1D",
        leadingInterval: true,
        trailingInterval: true,
        isStopIncluded: false, // We want stop time to be part of the trailing interval
        dataCallback: dataCallback,
      });
      
      const provider = new WebMapTileServiceImageryProvider({
        url:
          "https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/{Time}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.jpg",
        layer: "MODIS_Terra_CorrectedReflectance_TrueColor",
        style: "default",
        tileMatrixSetID: "250m",
        maximumLevel: 5,
        format: "image/jpeg",
        clock: this.viewer.clock,
        times: times,
        credit: "NASA Global Imagery Browse Services for EOSDIS",
      });

      this.viewer.imageryLayers.addImageryProvider(provider);
      this.viewer.camera.flyTo({
        destination: Cartesian3.fromDegrees(10.7522, 59.9139, 20009999),
      })
    } catch (err) {
      console.error(err)
    }
  }

  async googleInit() {
    try {
      if (!this.google3DTileset) {
        this.viewer.scene.globe.show = false
        this.google3DTileset = new Cesium3DTileset({
          url: `https://tile.googleapis.com/v1/3dtiles/root.json?key=(v${__GOOGLE_TOKEN__})`,
          showCreditsOnScreen: true,
        })
        this.primitives.add(this.google3DTileset)
      }
      this.google3DTileset.show = true
    } catch (err) {
      console.error(err.code)
    }
  }

  async osmInit() {
    try {
      if (!this.osmBuildings) {
        this.osmBuildings = await createOsmBuildingsAsync()
        this.osmBuildings.style = new Cesium3DTileStyle({
          defines: {
            material: "${feature['building:material']}",
          },
          color: {
            conditions: [
              ['${material} === null', "color('white')"],
              ["${material} === 'glass'", "color('skyblue', 0.5)"],
              ["${material} === 'concrete'", "color('grey')"],
              ["${material} === 'brick'", "color('indianred')"],
              ["${material} === 'stone'", "color('lightslategrey')"],
              ["${material} === 'metal'", "color('lightgrey')"],
              ["${material} === 'steel'", "color('lightsteelblue')"],
              ['true', "color('white')"],
            ],
          },
        })
        this.primitives.add(this.osmBuildings)
      }
      this.osmBuildings.show = true
    } catch (err) {
      console.error(err)
    }
  }

  async changeGoogleVisibility(show) {
    switch (show) {
      case 'google3d':
        this.googleInit()
        if (this.osmBuildings) this.osmBuildings.show = false
        break
      case 'osm':
        await this.osmInit()
        if (this.google3DTileset) this.google3DTileset.show = false
        break
      default:
        if (this.google3DTileset) this.google3DTileset.show = false
        if (this.osmBuildings) this.osmBuildings.show = false
        break
    }
  }
}
