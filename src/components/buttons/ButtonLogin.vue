<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue'
import { computed } from 'vue'
const { logout, isAuthenticated, loginWithPopup } = useAuth0()

const sigin = () => loginWithPopup()
const signout = () => logout({ logoutParams: { returnTo: window.location.origin } })
const strategy = computed(() => (isAuthenticated.value ? signout : sigin))

</script>

<template>
  <div class="logger--wrapper">
    <button @click="strategy()">{{ isAuthenticated ? 'Log Out' : 'Log In' }}</button> 
  </div>
</template>

<style scoped lang="scss">
.logger--wrapper {
  & button {
    background: $sidebar-color;
    color: $text-header-color;
    border: none;
    opacity: 0.9;
    border-radius: 4px;
    padding: 0.3rem 3rem;
    width: 100%;
    font-size: $sidebar-btn-menu-font;

    &:hover {
      background: $primary-color;
      color: $btn-login-hover-color;
    }
  }
}
</style>
