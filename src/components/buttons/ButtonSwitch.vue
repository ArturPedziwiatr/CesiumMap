<script setup lang="ts">

</script>

<template>
  <div class="switch--wrapper">
    <div class="state--box">
      <Icon :icon="['fas', 'moon']" />
      <Icon :icon="['fas', 'sun-bright']" />
    </div>
    <span>{{  }}</span>
    <div class="toggle-switch">
      <span class="switch"></span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.switch-wrapper {
  background: $primary-light-color;
}
</style>