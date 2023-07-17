<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue'

const { isAuthenticated } = useAuth0()

// const ini = async() => {
//   const rules = await axios.get(`https://dev-j4c8wk5j6kzjf3bv.us.auth0.com/api/v2/users/google-oauth2|117790623762416542834/roles`,
//   {
//     headers: { authorization: `Bearer ${await getAccessTokenSilently()}` }
//   }).catch((err) => console.log(err));
//   console.log(rules);
// }
// setTimeout(() => ini(), 3000)
</script>

<template>
  <div class="authorization-wrapper" v-if="isAuthenticated">
    <slot />
  </div>
</template>