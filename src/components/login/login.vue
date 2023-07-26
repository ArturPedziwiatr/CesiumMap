<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue'
import { computed } from 'vue';
const { logout, loginWithPopup, isAuthenticated } = useAuth0()
const logStrategy = computed(() => (isAuthenticated ? logout({ logoutParams: { returnTo: window.location.origin } }) : loginWithPopup()))
</script>

<template>
  <div class="logger--wrapper">
    <button @click:native="logStrategy">{{ isAuthenticated ? 'Log In' : 'Log Out' }}</button> 
  </div>
</template>

<style scoped lang="scss">
.logger--wrapper {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;

  & button {
    position: absolute;
    top: 2rem;
    right: 2rem;
    background: $sidebar-color;
    color: $text-color;
    border: none;
    opacity: 0.9;
    border-radius: 4px;
    padding: 0.3rem 3rem;

    &:hover {
      background: $primary-color;
      color: $primary-light-color;
    }
  }

  & section {
    background-color: aquamarine;
    width: 500px;
    height: 500px;
    overflow: scroll;
    & iframe {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
