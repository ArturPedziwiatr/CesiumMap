<script setup lang="ts">

</script>

<template>
  <div class="wrapper">
    <Icon :icon="['fas', 'magnifying-glass']" />
    <input type="search" placeholder="Search...">
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  background: $primary-light-color;
  display: flex;
  padding: 0.7rem 0.5rem;
  border-radius: 6px;

  & input {
    height: 100%;
    width: 100%;
    outline: none;
    border: none;
    margin-left: 8px;
    background: $primary-light-color
  }
}
</style>