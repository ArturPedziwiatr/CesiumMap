<script setup lang="ts">
import { onMounted, provide, ref } from 'vue'
import { Ion, Cartesian3, Viewer, Terrain } from 'cesium'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import Sidebar from '@component/toolbar/Sidebar.vue'
import { MapsType } from '@enum/MapType.ts'
import global from '@global/global'
import LayersSidebar from '@component/toolbar/LayersSidebar.vue'

library.add(fas)
Ion.defaultAccessToken = __CESIUM_TOKEN__
const viewerConstruct = ref(false)
const viewer = ref()
const layersActive = ref(false)

onMounted(() => {
  viewer.value = new Viewer('cesiumMap', {
    homeButton: false,
    baseLayerPicker: false,
    infoBox: true,
    fullscreenButton: false,
    geocoder: false,
    useBrowserRecommendedResolution: false,
    skyAtmosphere: false,
    terrain: Terrain.fromWorldTerrain({
      requestWaterMask: true,
      requestVertexNormals: true,
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

const close = () => (layersActive.value = false)
const setActive = (value: boolean) => (layersActive.value = value)
</script>

<template>
  <div class="container">
    <div id="cesiumMap" class="container--map"></div>
    <Sidebar v-if="viewerConstruct" />
    <button class="layers--button" @click="layersActive = !layersActive">
      <p>Display</p>
      <Icon :icon="['fas', 'layer-group']" />
    </button>
    <Transition>
      <LayersSidebar
        v-if="layersActive"
        @close="setActive"
        v-clickOutside="close"
      />
    </Transition>
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

  .layers--button {
    position: absolute;
    right: 15px;
    top: 15px;
    width: fit-content;
    padding: 0.5rem 2rem;
    gap: 0.5rem;
    display: flex;
    align-items: center;
    border-radius: 0.5rem;
    border: none;
    background-color: $sidebar-color;
    transition: $tran-04;

    &:hover {
      background-color: $btn-hover-color;

      svg,
      p {
        color: $sidebar-color;
      }
    }

    svg,
    p {
      color: $text-color;
      font-weight: 550;
    }
  }
}

.v-enter-active {
  animation: enter 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
}
.v-leave-active {
  animation: leave 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
}
</style>
