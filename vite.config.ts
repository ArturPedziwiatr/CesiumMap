import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import cesium from 'vite-plugin-cesium'
import { fileURLToPath, URL } from "url"

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '')

  return {
    mode,
    plugins: [vue(), cesium()],
    define: {
      __CESIUM_TOKEN__: JSON.stringify(env.VITE_CESIUM_TOKEN),
      __GOOGLE_TOKEN__: JSON.stringify(env.VITE_GOOGLE_MAPS_TOKEN),
      __MAPBOX_TOKEN__: JSON.stringify(env.VITE_MAPBOX_TOKEN),
      __CLIENT_ID__: JSON.stringify(env.VITE_AUTH_CLIENT_ID),
      __DOMAIN__: JSON.stringify(env.VITE_AUTH_DOMEN),
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "./src/assets/variables.scss";',
        },
      },
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src/components', import.meta.url)),
        '@Script': fileURLToPath(new URL('./src/script', import.meta.url)),
        '@Enum': fileURLToPath(new URL('./src/enums', import.meta.url)),
        '@Icon': fileURLToPath(new URL('./src/assets/icon', import.meta.url)),
        '@Func': fileURLToPath(new URL('./src/composables', import.meta.url)),
        '@Global': fileURLToPath(new URL('./src/global', import.meta.url)),
        '@Interface': fileURLToPath(new URL('./src/interface', import.meta.url)),
      },
    },
    server: {
      port: 3000,
      cors: false,
    },
  }
})
