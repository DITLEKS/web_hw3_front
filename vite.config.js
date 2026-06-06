import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    server: {
      proxy: {
        '/catalog/api': {
          target: env.VITE_CATALOG_TARGET || 'http://localhost:3001',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/catalog/, ''),
        },
        '/orders/api': {
          target: env.VITE_ORDERS_TARGET || 'http://localhost:3002',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/orders/, ''),
        },
      },
    },
  }
})
