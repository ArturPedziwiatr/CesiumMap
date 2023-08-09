<script setup lang="ts">
import LoadSection from '@/animation/LoadSection.vue'
import ButtonCheckbox from '@/buttons/ButtonCheckbox.vue'
import { useWMSGeoNorgeStore } from '../../store/WMSGeoNorge.store'

const props = defineProps({
  category: {
    type: String,
    required: true,
  },
})

const WMSGeoNorge = useWMSGeoNorgeStore()
WMSGeoNorge.fetchWMSLayers(props.category)
</script>

<template>
  <LoadSection :loading="WMSGeoNorge.getLoading" class="wms--box">
    <ButtonCheckbox
      v-for="wms of WMSGeoNorge.getLayers(category)"
      :key="wms.layer"
      :text="wms.layer"
      class="asd"
      @update="WMSGeoNorge.addOrRemoveLayer(wms, category, $event)"
    >
      <p>{{ wms.layer }}</p>
    </ButtonCheckbox>
  </LoadSection>
</template>

<style scoped lang="scss">
.wms--box {
  max-height: 400px;
  overflow-y: auto;
  overflow-x: hidden;

  p {
    width: 83%;
    margin-left: 1rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .line {
    width: 100%;
  }
}
</style>
