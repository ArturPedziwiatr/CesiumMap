<script setup lang="ts">
import LoadSection from '@/animation/LoadSection.vue'
import ButtonCheckbox from '@/buttons/ButtonCheckbox.vue'
import { computed, ref } from 'vue'
import { NorwayWMS } from '../../data/WMSList'
import { WmsEndpoint, WmsLayerSummary } from '@camptocamp/ogc-client'

const props = defineProps({
  category: {
    type: String,
    required: true,
  },
})

const active = ref(false)
const layers = ref<string[]>([])

computed(async () => {
  console.log(NorwayWMS.servers[props.category])
  if (NorwayWMS.servers[props.category]) {
    try {
      await Promise.all(
        NorwayWMS.servers[props.category].map(async elem => {
          console.log(elem)
          const endpoint = await new WmsEndpoint(elem).isReady()
          const getLayers = endpoint.getLayers()
          layers.value.concat(getLayers.flatMap(x => (x.name ? [x.name] : [])))
        })
      )
    } catch (er) {
      console.log(er)
    } finally {
      active.value = true
    }
  }
})
</script>

<template>
  <LoadSection :loading="!active" class="box">
    asdfjaskjdfbhksdabfghjkavbsfhvbadhffkhkbvfdsajhblsdf
  </LoadSection>
</template>
