<script setup lang="ts">
defineProps({
  icon: String
})
</script>

<template>
  <font-awesome-icon :icon="['fas', icon]" />
</template>