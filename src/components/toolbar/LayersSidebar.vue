<script setup lang="ts">
import ButtonList from '@/buttons/ButtonList.vue'
import useLayers from '@Func/cesium/layers'
import AuthSection from '@/auth/AuthSection.vue'
import useGeoJSONLoader from '@Func/geojson/GeoJSONLoader'
import ButtonCustom from '@/buttons/ButtonCustom.vue'
import InputCustom from '@/buttons/InputCustom.vue'
import useDynamicLayers from '@Func/layers/layers'
import LoadSection from '@/animation/LoadSection.vue'
import { ref } from 'vue'

const
  temp = useLayers(),
  sources = useGeoJSONLoader(),
  dynamicLayres = useDynamicLayers(),
  layers = ref<string[]>([]),
  group = ref(false)

const addOrRemoveLayer = (lay: string) => {
  if (layers.value.includes(lay)) 
    layers.value = layers.value.filter(x => x != lay)
  else layers.value.push(lay)
}
</script>

<template>
  <AuthSection class="mt-4">
    <ButtonList icon="layer-group" text="Layers" :checked="true">
      <ButtonCustom v-for="layer of temp.getLayers()" @on-click="temp.visibleLayres(layer)">
        {{ layer }}
      </ButtonCustom>
      <ButtonCustom v-for="source of sources.getSources()" :key="source" @on-click="sources.visibleSource(source)">
        {{ source }}
      </ButtonCustom>
    </ButtonList>
    <ButtonList icon="plus" text="Add WMS layer">
      <InputCustom @on-click="dynamicLayres.addWMSServer($event)" />
      <LoadSection :loading="dynamicLayres.loading.value" class="box">
        <ButtonCustom v-for="layer of dynamicLayres.getAll()" :key="layer.title" @click="addOrRemoveLayer(layer.name)">
          {{ layer.title }}
        </ButtonCustom>
      </LoadSection>
      <InputCustom @model-value="dynamicLayres.setAlias($event)" />
      <ButtonCustom @click="group = !group">
        Add to group
      </ButtonCustom>
      <ButtonCustom type="off" @click="dynamicLayres.addLayerStrategy(layers,group)">
        Add Layer
      </ButtonCustom>
    </ButtonList>
  </AuthSection>
</template>

<style scoped lang="scss">
.box {
  height: 200px;
  width: auto;
  overflow-x: auto;
  border-top: 1px solid $primary-color;
  border-bottom: 1px solid $primary-color;
  padding: 0.4rem 0;
  margin: 1rem 0;
}
</style>
