<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue'
import axios from 'axios';

const { isAuthenticated } = useAuth0()

// console.log(await getAccessTokenWithPopup())
// console.log(idTokenClaims);

// const ini = async() => {
//   console.log(await getAccessTokenWithPopup())
// console.log(idTokenClaims);
//   const rules = await axios.get(`https://dev-j4c8wk5j6kzjf3bv.us.auth0.com/api/v2/users/google-oauth2|117790623762416542834/roles`,
//   {
//     headers: { authorization: `Bearer eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIiwiaXNzIjoiaHR0cHM6Ly9kZXYtajRjOHdrNWo2a3pqZjNidi51cy5hdXRoMC5jb20vIn0..KONL5w4QqQvjAK_7.famRpFZ2-_zHE_g45BPEooSToUYvoJN4zpKcvrYTJ-ZC0XtMCVj7KzMNbXoRfMe3fnbE-UtQPUqQ4lqB7048I2rZ0AKASHv2Ztvz9Hv97bE3GvHgS9oNqn5HusBBW8lgR_bIo6DO1Dlj6eOTvecnw7-8BwoY1ftzPulYdSz_GY385sWJmINmolPwHDFmyD43_w8aGAgEG1U6HqOC_JdLloGDeiCr2qO8KjZqKdFed-2TapdFev7JRixYNTsFQuJIOq46LOsi8jw5UqCIU5ORAA5WWa3Rq1lJ5nGSqxopJMn1jMbglCH91EHQl6XwMOcRN-2AtiJa_63y824fNGnuyU9dSYwzADM.YVUIehE4CIpuwHY1QbQeeA` }
//   }).catch((err) => console.log(err));
//   console.log(rules);
// }
//setTimeout(() => ini(), 3000)
</script>

<template>
  <div class="authorization-wrapper" v-if="isAuthenticated">
    <slot />
  </div>
</template>