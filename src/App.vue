<script setup lang="ts">
import { onMounted, provide, ref } from 'vue'
import { Ion, Cartesian3, Viewer, Terrain } from 'cesium'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import Sidebar from '@/toolbar/Sidebar.vue'
import { MapsType } from '@Enum/MapType.ts'
import global from '@Global/global'
import PotreeGenerator from '@/potree/PotreeGenerator.vue'

library.add(fas)
Ion.defaultAccessToken = __CESIUM_TOKEN__
const viewerConstruct = ref(false)

onMounted(() => {
  const viewer = ref(new Viewer('cesiumMap', {
    terrain: Terrain.fromWorldTerrain({
      requestWaterMask : true,
      requestVertexNormals : true
    }),
  }))
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
  provide<Viewer>(
    MapsType.Viewer,
    viewer.value
  )
})
</script>

<template>
  <div class="container">
    <div id="cesiumMap" class="container--map"></div>
    <Sidebar v-if="viewerConstruct" />
    <PotreeGenerator />
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
