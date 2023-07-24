<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue'

const { isAuthenticated } = useAuth0()

</script>

<template>
  <div
    class="authorization-wrapper"
    v-if="isAuthenticated"
    :key="`${isAuthenticated}`"
  >
    <slot />
  </div>
</template>