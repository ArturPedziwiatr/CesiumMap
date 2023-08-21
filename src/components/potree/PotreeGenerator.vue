<script setup lang="ts">
import { onMounted, ref } from 'vue'
import useViewer from '@/composables/viewer/viewer'

const threeCanva = ref<HTMLElement>()
const viewer = useViewer().getPotree()

onMounted(() => {
  if (threeCanva.value && viewer.value) {
    viewer.value.initialize(threeCanva.value)

    viewer.value
      .load(
        'cloud.js',
        'https://cdn.rawgit.com/potree/potree/develop/pointclouds/lion_takanawa/'
      )
      .then(pco => {
        const pcoOrig = pco

        if (pcoOrig.progress === 1) {
          pcoOrig.translateX(-1)
          pcoOrig.traverse(x => x.layers.set(2))
        }

        if (pco.progress === 1) pco.traverse((x: any) => x.layers.set(2))
      })
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
