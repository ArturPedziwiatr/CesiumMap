<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { Viewer } from '@Func/three/viewer'

const threeCanva = ref<HTMLElement>()
const canvaWrapper = ref<HTMLElement>()

onMounted(() => {
  const viewer = new Viewer()
  if (threeCanva.value) {
    viewer.initialize(threeCanva.value)

    viewer
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
  document.addEventListener('mousemove', replaceMove)
  document.addEventListener('click', replaceClick)
  document.addEventListener('mouseup', clearReplace)
  document.addEventListener('blur', clearReplace)
})

const ifCanMove = ref(false)
const point = ref({ x: 0, y: 0 })
const replaceClick = (event: MouseEvent) => {
  point.value = {
    x: event.clientX,
    y: event.clientY,
  }
}
const replaceMove = (event: MouseEvent) => {
  if (ifCanMove.value && canvaWrapper.value) {
    
    canvaWrapper.value.style.left =
      `${canvaWrapper.value.offsetLeft - (event.clientX - event.clientX)}px`
    canvaWrapper.value.style.top =
      `${canvaWrapper.value.offsetTop - (event.clientY - event.clientY)}px`
  }
  point.value = {
    x: event.clientX,
    y: event.clientY,
  }
}
const clearReplace = () => {
  ifCanMove.value = false
}
onUnmounted(() => {
  document.removeEventListener('mousemove', replaceMove)
  document.removeEventListener('click', replaceClick)
  document.removeEventListener('mouseup', clearReplace)
  document.removeEventListener('blur', clearReplace)
})
</script>

<template>
  <div
    ref="canvaWrapper"
    class="canva--wrapper"
  >
    <div
      ref="canvaHeader"
      class="canva--header"
      @click="ifCanMove = true"
    >{{ ifCanMove }}</div>
    <div ref="threeCanva" class="canva--body" />
  </div>
</template>

<style scoped lang="scss">
.canva {
  &--wrapper {
    position: absolute;
    left: 200px;
    top: 100px;
    z-index: 10;
    width: 50vw;
    height: 50vh;
  }

  &--header {
    background: $primary-color;
    width: 100%;
    height: 5%;
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
  }

  &--body {
    height: 95%;
    width: 100%;
    &:deep(canvas) {
      border-bottom-left-radius: 0.5rem;
      border-bottom-right-radius: 0.5rem;
    }
  }
}
</style>
