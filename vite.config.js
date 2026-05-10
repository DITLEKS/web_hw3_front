import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const catalogUrl = env.VITE_CATALOG_API_URL || 'http://localhost:3001'
  const ordersUrl  = env.VITE_ORDERS_API_URL  || 'http://localhost:3002'

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/catalog': {
          target: catalogUrl,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/catalog/, ''),
        },
        '/orders': {
          target: ordersUrl,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/orders/, ''),
        },
      },
    },
  }
})
