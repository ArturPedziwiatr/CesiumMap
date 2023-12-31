import { createApp } from 'vue'
import '@/style.scss'
import App from '@/App.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { createAuth0 } from '@auth0/auth0-vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'
import clickOutside from '@/directives/clickOutside'

createApp(App)
  .component('Icon', FontAwesomeIcon)
  .use(
    createAuth0({
      domain: __DOMAIN__,
      clientId: __CLIENT_ID__,
      authorizationParams: {
        redirect_uri: window.location.origin,
      },
    })
  )
  .use(ElementPlus)
  .use(createPinia())
  .directive('clickOutside', clickOutside)
  .mount('#app')