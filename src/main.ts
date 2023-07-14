import { createApp } from 'vue'
import './style.scss'
import App from './App.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { createAuth0 } from '@auth0/auth0-vue'
console.log(window.location.origin);

createApp(App)
  .component('Icon', FontAwesomeIcon)
  .use(
    createAuth0({
      domain: 'https://dev-j4c8wk5j6kzjf3bv.us.auth0.com',
      clientId: __CLIENT_ID__,
      authorizationParams: {
        redirect_uri: window.location.origin,
      },
    })
  )
  .mount('#app')
