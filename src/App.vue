<script setup lang="ts">
import { onMounted, provide, ref } from 'vue'
import { Ion, Cartesian3, Viewer, Terrain, GeoJsonDataSource, Color, Material, MaterialProperty } from 'cesium'
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
  // viewer.value.scene.primitives.add(new Cesium3DTileset({ 
  //   url: "http://server/3dtiles3/tileset.json" 
  // }))
  setTimeout(async () => {
    const GeoJSON = './src/data/poland.geojson'
    const loadData = async () => {
        try {
            const dataSource = await GeoJsonDataSource.load(GeoJSON);
            
            console.log(Array.from(dataSource.entities.values).map(x => x?.));
            viewer.value.dataSources.add(dataSource);
            const entities = dataSource.entities.values;
            for (var i = 0; i < entities.length; i++) {
              const entity = entities[i];
                
                entity.polygon!.outlineColor = Color.BLACK
                entity.polygon!.outlineWidth = 6000000.0
                entity.polygon!.height = 50
                
                entity.polygon!.extrudedHeight = entity.properties!.parent_id;
                if (entity?.properties?.code._value === '16') {   
                  entity.polygon.material  = Color.fromCssColorString('#695CFE')
                } else {
                  entity.polygon.material  = Color.fromCssColorString('#707070')
                }
            }
            viewer.value.zoomTo(dataSource);
        }
        catch (err) {
            console.log("Error: ", err);
        }
    }
    loadData()
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
    <!-- <PotreeGenerator /> -->
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
