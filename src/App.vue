<script setup lang="ts">
import { onMounted, provide, ref } from 'vue'
import {
  Ion,
  Cartesian3,
  Viewer,
  Terrain
} from 'cesium'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import Sidebar from '@/toolbar/Sidebar.vue'
import { MapsType } from '@Enum/MapType.ts'
import global from '@Global/global'
import AuthSection from '@/auth/AuthSection.vue'
import { WfsEndpoint } from '@camptocamp/ogc-client'
import axios from 'axios'
import useParser from '@Func/parser/parser.ts'
// import { getGeoJson } from 'parser-gml'
// import PotreeGenerator from '@/potree/PotreeGenerator.vue'

library.add(fas)
Ion.defaultAccessToken = __CESIUM_TOKEN__
const viewerConstruct = ref(false)
const viewer = ref()
const parser = useParser()

onMounted(() => {
  viewer.value =
    new Viewer('cesiumMap', {
      homeButton: false,
      baseLayerPicker: false,
      infoBox: true,
      fullscreenButton: false,
      geocoder: false,
      useBrowserRecommendedResolution: false,
      skyAtmosphere: false,
      terrain: Terrain.fromWorldTerrain({
        requestWaterMask: true,
        requestVertexNormals: true
      }),
    })


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
})
const inita = async () => {
  try {

    const endpoint = await new WfsEndpoint('https://wfs.geonorge.no/skwms1/wfs.akvakulturlokaliteter?service=wfs&request=getcapabilities').isReady();
    const info = endpoint.getFeatureTypes()
    const url = endpoint.getFeatureUrl('app:AkvakulturFlate', {})
    const asd = await axios
      .get(url)
      .then(x => x.data)
  setTimeout(() => {
    parser.xmlToJson(asd)
  }, 3000);    
   //const qwerr = parseString(asd, enti.value)
   console.log(info);
    // var wfs = new WebFeatureServiceImageryProvider({
    //   url : "http://localhost:8080/geoserver/xxxxxx",
    //   layers : "xxxxxx",
    //   viewer : viewer.value
    //   });

  } catch (err) { console.error(err) }
}
inita()
</script>

<template>
  <div class="container">
    <div id="cesiumMap" class="container--map"></div>
    <Sidebar v-if="viewerConstruct" />
    <AuthSection>
      <!-- <PotreeGenerator /> -->
    </AuthSection>
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
