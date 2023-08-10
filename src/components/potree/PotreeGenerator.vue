<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { Viewer } from '@function/three/viewer'

const threeCanva = ref<HTMLElement>()
const canvaWrapper = ref<HTMLElement>()
const canvaHeader = ref<HTMLElement>()
const viewer = new Viewer()
const deleteModal = ref(false)
const ifCanMove = ref(false)
const point = ref({ x: 0, y: 0 })

const replaceMove = (event: MouseEvent) => {
  if (ifCanMove.value && canvaWrapper.value) {
    const { offsetLeft, offsetTop, offsetWidth, offsetHeight } =
      canvaWrapper.value
    const vectorX = point.value.x - event.clientX
    const vectorY = point.value.y - event.clientY
    if (
      (vectorX > 0 && offsetLeft > 0) ||
      (vectorX < 0 && offsetLeft + offsetWidth < window.innerWidth)
    ) {
      canvaWrapper.value.style.left = `${
        canvaWrapper.value.offsetLeft - (point.value.x - event.clientX)
      }px`
    }

    if (
      (vectorY > 0 && offsetTop > 0) ||
      (vectorY < 0 && offsetTop + offsetHeight < window.innerHeight)
    ) {
      canvaWrapper.value.style.top = `${
        canvaWrapper.value.offsetTop - (point.value.y - event.clientY)
      }px`
    }
  }
  point.value = {
    x: event.clientX,
    y: event.clientY,
  }
}

const clearReplace = () => {
  ifCanMove.value = false
}

const replaceClick = (event: MouseEvent) => {
  ifCanMove.value = true
  point.value = {
    x: event.clientX,
    y: event.clientY,
  }
}

onMounted(() => {
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
  document.addEventListener('mouseup', clearReplace)
  document.addEventListener('blur', clearReplace)
  canvaHeader.value?.addEventListener('mousedown', replaceClick)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', replaceMove)
  document.removeEventListener('click', replaceClick)
  document.removeEventListener('mouseup', clearReplace)
  document.removeEventListener('blur', clearReplace)
})

const exit = () => {
  deleteModal.value = true
  viewer.destroy()
}
</script>

<template>
  <div ref="canvaWrapper" class="canva--wrapper" v-if="!deleteModal">
    <div ref="canvaHeader" class="canva--header">
      <Icon icon="xmark" @click="exit" />
    </div>
    <div ref="threeCanva" class="canva--body" />
  </div>
</template>

<style scoped lang="scss">
.canva {
  &--wrapper {
    position: absolute;
    display: block;
    left: 200px;
    top: 100px;
    z-index: 10;
    border: 1px solid $primary-color;
    border-radius: 0.6rem;
    width: 50vw;
    height: 50vh;
  }

  &--header {
    background: $primary-color;
    width: 100%;
    height: 5%;
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
    display: flex;
    justify-content: end;
    align-items: center;
    color: $sidebar-color;
    cursor: grab;

    & svg {
      cursor: pointer;
      padding: 0.1rem 0.6rem;
      height: 100%;
    }
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
