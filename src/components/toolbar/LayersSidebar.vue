<script setup lang="ts">
import ButtonList from '@/buttons/ButtonList.vue'
import useLayers from '@Func/cesium/layers'
import AuthSection from '@/auth/AuthSection.vue'
import useGeoJSONLoader from '@Func/geojson/GeoJSONLoader'
import ButtonCustom from '@/buttons/ButtonCustom.vue'
import InputCustom from '@/buttons/InputCustom.vue'
import useDynamicLayers from '@Func/layers/layers'

const
  layers = useLayers(),
  sources = useGeoJSONLoader(),
  dynamicLayres = useDynamicLayers(),
</script>

<template>
  <AuthSection class="mt-4">
    <ButtonList icon="layer-group" text="Layers" :checked="true">
      <ButtonCustom
        v-for="layer of layers.getLayers()"
        @on-click="layers.visibleLayres(layer)"
      >
        {{ layer }}
      </ButtonCustom>
      <ButtonCustom
        v-for="source of sources.getSources()"
        :key="source"
        @on-click="sources.visibleSource(source)"
      >
        {{ source }}
      </ButtonCustom>
    </ButtonList>
    <ButtonList icon="plus" text="Add WMS layer">
      <InputCustom
        @on-click="dynamicLayres.addWMSServer($event)"
      />
    </ButtonList>
  </AuthSection>
</template>

<style scoped lang="scss">

</style>
