<script setup lang="ts">
import { ref } from 'vue'

defineProps({
  split: {
    type: Boolean,
    required: true,
  },
})
const firstView = ref<HTMLElement>()
const secondView = ref<HTMLElement>()
</script>

<template>
  <div class="wrapper">
    <div ref="firstView" :class="['first--view', { 'split': split }]">
      <slot name="front" />
    </div>
    <div ref="secondView" :class="['second--view', { 'split': split }]">
      <slot name="back" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  height: 100vh;
  width: calc(100vw - $sidebar-width-collapsed);
  position: fixed;
  right: 0;
  display: flex;

  .first--view {
    height: 100%;
    width: 100%;
    transition: width 4s ease;
    
    &.split {
      width: 55%;
    }
  }

  .second--view {
    height: 100%;
    width: 0;
    transition: width 3s ease;

    &.split {
      width: 45%;
    }
  }

}
</style>
