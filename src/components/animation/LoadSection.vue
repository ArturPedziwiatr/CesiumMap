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
    <div v-if="loading" v-loading="loading"></div>
    <div v-else>
      <slot />
    </div>
  </div>
</template>