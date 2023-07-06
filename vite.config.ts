import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import alias from '@rollup/plugin-alias';

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, '')
  
  if (mode === 'development') {
    return {
      mode,
      plugins: [
        vue(),
      ],
      server: {
        port: 3030,
        cors: false,
        watch: {
          ignored: ['!**/node_modules/your-package-name/**'],
        },
      },
    }
  }
  
  return {
    plugins: [vue()],
  }
})
