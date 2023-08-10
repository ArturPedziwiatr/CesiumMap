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
  <LoadSection :loading="WMSGeoNorge.getLoading(category)" class="wms--box">
    <ButtonCheckbox
      v-for="wms of WMSGeoNorge.getLayers(category)"
      :key="wms.layer"
      :text="wms.layer"
      @update="WMSGeoNorge.addOrRemoveLayer(wms, category, $event)"
    >
      <p class="wms-text">{{ wms.layer }}</p>
    </ButtonCheckbox>
  </LoadSection>
</template>

<style scoped lang="scss">
.wms--box {
  max-height: 400px;
  overflow-y: auto;
  overflow-x: hidden;

  .line {
    width: 100%;
  }
}

.wms-text {
  width: 83%;
  margin-left: 1rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
