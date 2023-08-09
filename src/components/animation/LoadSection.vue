<script setup lang="ts">
defineProps({
  loading: {
    type: Boolean,
    required: true
  }
})
</script>

<template>
  <div>
    <div v-if="loading" v-loading="loading" class="box"></div>
    <div v-else>
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.box {
  height: 50px;
}

</style>