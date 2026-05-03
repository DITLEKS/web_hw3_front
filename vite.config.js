import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/catalog': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/catalog/, ''),
      },
      '/orders': {
        target: 'http://localhost:8001',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/orders/, ''),
      },
    },
  },
})
