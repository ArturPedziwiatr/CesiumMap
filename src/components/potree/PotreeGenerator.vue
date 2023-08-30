<script setup lang="ts">
import { onMounted, ref } from 'vue'
import useViewer from '@/composables/viewer/viewer'

const threeCanva = ref<HTMLElement>()
const viewer = useViewer().getPotree()

onMounted(async () => {
  useViewer().addDraco()
  if (threeCanva.value && viewer.value) {
    viewer.value.initialize(threeCanva.value)
    viewer.value.loadBetter();
    // viewer.value
    //   .load('cloud.js', 'http://localhost:5000/las1/')
    //   .then(pco => {
    //     console.log(pco)
    //   })
    //   .catch(err => {
    //     console.log(err)
    //   })
  }
})
</script>

<template>
  <div ref="threeCanva" class="canva--body" />
</template>

<style scoped lang="scss">
.canva {
  &--body {
    height: 100%;
    width: 100%;
  }

  :deep(canva) {
    width: 100%;
  }
}
</style>
