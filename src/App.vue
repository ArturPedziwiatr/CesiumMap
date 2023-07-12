<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Ion, Cartesian3 } from 'cesium'
import { InversifyEnums } from '@Enum/inversify'
import { container } from '@Script/event/Inversify'
import { bootstap } from '@Script/bootstrap/bootstrap'
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import Sidebar from '@/toolbar/Sidebar.vue'

library.add(fas);
Ion.defaultAccessToken = __CESIUM_TOKEN__
const coords = ref({ lon: 0, lat: 0 })

onMounted(() => {
  bootstap()
  navigator.geolocation.getCurrentPosition(
    (position: GeolocationPosition) => {
      coords.value.lon = position.coords.longitude
      coords.value.lat = position.coords.latitude
      cesium()
    },
    () => alert('Cannot find your location'),
    {
      enableHighAccuracy: true,
    }
  )
})

function cesium() {
  container.get(InversifyEnums.Cesium.Viewer).scene.camera.setView({
    destination: Cartesian3.fromDegrees(
      coords.value.lon,
      coords.value.lat,
      600
    ),
  })
  container.get(InversifyEnums.Cesium.CesiumLayers)
  // container.get(InversifyEnums.Cesium.CesiumMenu)
}
</script>

<template>
  <div class="container">
    <div id="cesiumMap" class="container--map"></div>
    <Sidebar />
  </div>
</template>

<style scoped lang="scss">
.container {
  &--map{
    position: fixed;
    right: 0;
    width: calc(100% - $sidebar-width-collapsed);
    height: 100vh;
    background: $body-color;
  }
}
</style>
