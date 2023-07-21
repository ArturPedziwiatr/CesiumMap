<script setup lang="ts">
import { onMounted, provide, ref } from 'vue'
import {
  Ion,
  Cartesian3,
  Viewer,
  CesiumTerrainProvider,
Terrain
} from 'cesium'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import Sidebar from '@/toolbar/Sidebar.vue'
import { MapsType } from '@Enum/MapType.ts'
import global from '@Global/global'
// import PotreeGenerator from '@/potree/PotreeGenerator.vue'
import AuthSections from '@/auth/AuthSections.vue'

library.add(fas)
Ion.defaultAccessToken = __CESIUM_TOKEN__
const viewerConstruct = ref(false)

onMounted(() => {
  const viewer = ref(
    new Viewer('cesiumMap', {
      homeButton: false,
      baseLayerPicker: false,
      infoBox: true,
      fullscreenButton: false,
      geocoder: false,
      useBrowserRecommendedResolution: false,
      skyAtmosphere: false,
      terrain: Terrain.fromWorldTerrain({
        requestWaterMask : true,
        requestVertexNormals : true
      }),
    })
  )

  viewerConstruct.value = !viewerConstruct.value
  navigator.geolocation.getCurrentPosition(
    (position: GeolocationPosition) => {
      global.value.coords.lon = position.coords.longitude
      global.value.coords.lat = position.coords.latitude
      cesium()
    },
    () => cesium(),
    {
      enableHighAccuracy: true,
    }
  )

  function cesium() {
    viewer.value.scene.camera.setView({
      destination: Cartesian3.fromDegrees(
        global.value.coords.lon,
        global.value.coords.lat,
        600
      ),
    })
  }
  provide<Viewer>(MapsType.Viewer, viewer.value)

  // const lay = [{
  //   id: "floor",
  //   url: "https://api.hkmapservice.gov.hk/ogc/wfs/indoor/floorpolygon",
  // },
  // {
  //   id: "unit",
  //   url: "https://api.hkmapservice.gov.hk/ogc/wfs/indoor/unitpolygon",
  // }]
  // var apiKey = 'c84e886891014383bcf608423555b0ba';
  // var geoJSONDataSourceFloor = new GeoJsonDataSource("floor")
  // var geoJSONDataSourceUnit = new GeoJsonDataSource("unit")
  // viewer.value.dataSources.add(geoJSONDataSourceFloor);
  // viewer.value.dataSources.add(geoJSONDataSourceUnit);
  // viewer.value.camera.moveEnd.addEventListener(function() {
  // var rect = viewer.value.camera.computeViewRectangle(viewer.value.scene.globe.ellipsoid, new Rectangle())
  // var east = Math.toDegrees(rect!.east)
  // var west = Math.toDegrees(rect!.west)
  // var north = Math.toDegrees(rect!.north)
  // var south = Math.toDegrees(rect!.south)

  // geoJSONDataSourceFloor.load(lay[0].url + '?service=WFS&version=1.1.0&request=GetFeature&outputFormat=application/json&srsname=EPSG:4326&bbox=' + west + ',' + south + ',' + east + ',' + north + ',EPSG:4326&maxFeatures=50000&key=' + apiKey, {
  //   stroke: Color.CADETBLUE,
  //   fill: Color.AQUA,
  //   strokeWidth: 3
  // }).then(function() {})


  // geoJSONDataSourceUnit.load(lay[1].url + '?service=WFS&version=1.1.0&request=GetFeature&outputFormat=application/json&srsname=EPSG:4326&bbox=' + west + ',' + south + ',' + east + ',' + north + ',EPSG:4326&maxFeatures=50000&key=' + apiKey, {
  //   stroke: Color.CADETBLUE,
  //   fill: Color.AQUA,
  //   strokeWidth: 3
  // }).then(function() {})
  // });
})
</script>

<template>
  <div class="container">
    <div id="cesiumMap" class="container--map"></div>
    <Sidebar v-if="viewerConstruct" />
    <AuthSections>
      <!-- <PotreeGenerator /> -->
    </AuthSections>
  </div>
</template>

<style scoped lang="scss">
.container {
  &--map {
    position: fixed;
    right: 0;
    width: calc(100% - $sidebar-width-collapsed);
    height: 100vh;
    background: $body-color;
  }
}
</style>
